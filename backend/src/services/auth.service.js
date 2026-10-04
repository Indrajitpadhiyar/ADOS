import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { TokenUtil } from "../utils/token.util.js";
import { ResponseMessages } from "../constants/responseMessages.js";
import { SecurityLogger } from "../utils/securityLogger.util.js";

/**
 * Enterprise Authentication Business Logic Service
 */
export const AuthService = {
  /**
   * Register a new user
   * @param {Object} userData - { name, email, password }
   * @param {Object} [context] - { req }
   * @returns {Promise<{ user: Object, accessToken: string, refreshToken: string }>}
   */
  async register({ name, email, password }, context = {}) {
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      SecurityLogger.log("AUTH_REGISTER_ATTEMPT_DUPLICATE", {
        req: context.req,
        email: normalizedEmail,
        outcome: "FAILURE",
      });
      throw ApiError.conflict(ResponseMessages.EMAIL_ALREADY_EXISTS);
    }

    // Create user (password is automatically hashed via pre-save hook)
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    // Generate tokens
    const tokenPayload = { id: user._id.toString(), email: user.email, role: user.role };
    const accessToken = TokenUtil.generateAccessToken(tokenPayload);
    const refreshToken = TokenUtil.generateRefreshToken({ id: user._id.toString() });

    // Store refresh token hash in DB for revocation support
    user.refreshToken = TokenUtil.hashToken(refreshToken);
    await user.save({ validateBeforeSave: false });

    SecurityLogger.log("AUTH_REGISTER_SUCCESS", {
      req: context.req,
      userId: user._id,
      email: user.email,
      outcome: "SUCCESS",
    });

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  },

  /**
   * Authenticate an existing user with brute-force lockout safeguards
   * @param {Object} credentials - { email, password }
   * @param {Object} [context] - { req }
   * @returns {Promise<{ user: Object, accessToken: string, refreshToken: string }>}
   */
  async login({ email, password }, context = {}) {
    const normalizedEmail = email.toLowerCase().trim();

    // Explicitly query for +password, +loginAttempts, +lockUntil
    const user = await User.findOne({ email: normalizedEmail }).select("+password +loginAttempts +lockUntil");

    if (!user) {
      SecurityLogger.log("AUTH_LOGIN_FAILED_USER_NOT_FOUND", {
        req: context.req,
        email: normalizedEmail,
        outcome: "FAILURE",
      });
      // Intentionally generic message to mitigate account enumeration
      throw ApiError.unauthorized(ResponseMessages.INVALID_CREDENTIALS);
    }

    // Check if account is locked
    if (user.isLocked()) {
      const remainingMinutes = Math.ceil((user.lockUntil.getTime() - Date.now()) / (60 * 1000));
      SecurityLogger.log("AUTH_LOGIN_REJECTED_ACCOUNT_LOCKED", {
        req: context.req,
        userId: user._id,
        email: user.email,
        outcome: "FAILURE",
      });
      throw ApiError.forbidden(
        `Account is temporarily locked due to failed attempts. Please retry in ${remainingMinutes} minute(s).`
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      await user.handleFailedLogin();
      SecurityLogger.log("AUTH_LOGIN_FAILED_INCORRECT_PASSWORD", {
        req: context.req,
        userId: user._id,
        email: user.email,
        outcome: "FAILURE",
      });
      throw ApiError.unauthorized(ResponseMessages.INVALID_CREDENTIALS);
    }

    // Reset login attempts on success
    await user.handleSuccessfulLogin();

    // Generate JWTs
    const tokenPayload = { id: user._id.toString(), email: user.email, role: user.role };
    const accessToken = TokenUtil.generateAccessToken(tokenPayload);
    const refreshToken = TokenUtil.generateRefreshToken({ id: user._id.toString() });

    // Persist hashed refresh token for session tracking
    await User.updateOne({ _id: user._id }, { refreshToken: TokenUtil.hashToken(refreshToken) });

    SecurityLogger.log("AUTH_LOGIN_SUCCESS", {
      req: context.req,
      userId: user._id,
      email: user.email,
      outcome: "SUCCESS",
    });

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  },

  /**
   * Refresh expired access token using valid refresh token with token reuse detection
   * @param {string} incomingRefreshToken
   * @param {Object} [context] - { req }
   * @returns {Promise<{ accessToken: string, refreshToken: string, user: Object }>}
   */
  async refreshAccessToken(incomingRefreshToken, context = {}) {
    if (!incomingRefreshToken) {
      throw ApiError.unauthorized("Refresh token is required.");
    }

    // 1. Verify token signature
    let decoded;
    try {
      decoded = TokenUtil.verifyRefreshToken(incomingRefreshToken);
    } catch {
      SecurityLogger.log("AUTH_TOKEN_REFRESH_INVALID_SIGNATURE", {
        req: context.req,
        outcome: "FAILURE",
      });
      throw ApiError.unauthorized(ResponseMessages.TOKEN_EXPIRED);
    }

    // 2. Find user with stored hashed refresh token
    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || !user.refreshToken) {
      SecurityLogger.log("AUTH_TOKEN_REFRESH_USER_NOT_FOUND", {
        req: context.req,
        userId: decoded.id,
        outcome: "FAILURE",
      });
      throw ApiError.unauthorized("Invalid session token.");
    }

    // 3. Verify token hasn't been revoked/reused (Family token rotation)
    const hashedIncoming = TokenUtil.hashToken(incomingRefreshToken);
    if (hashedIncoming !== user.refreshToken) {
      // Possible token reuse attack detected: invalidate all sessions immediately
      await User.updateOne({ _id: user._id }, { $unset: { refreshToken: 1 } });
      SecurityLogger.log("AUTH_TOKEN_REUSE_ATTACK_DETECTED", {
        req: context.req,
        userId: user._id,
        email: user.email,
        outcome: "SUSPICIOUS",
      });
      throw ApiError.unauthorized("Compromised session detected. All sessions invalidated. Please log in again.");
    }

    // 4. Issue rotated tokens
    const tokenPayload = { id: user._id.toString(), email: user.email, role: user.role };
    const newAccessToken = TokenUtil.generateAccessToken(tokenPayload);
    const newRefreshToken = TokenUtil.generateRefreshToken({ id: user._id.toString() });

    await User.updateOne({ _id: user._id }, { refreshToken: TokenUtil.hashToken(newRefreshToken) });

    SecurityLogger.log("AUTH_TOKEN_REFRESH_SUCCESS", {
      req: context.req,
      userId: user._id,
      outcome: "SUCCESS",
    });

    return {
      user: user.toJSON(),
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  },

  /**
   * Terminate active user session & revoke refresh token
   * @param {string} userId
   * @param {Object} [context] - { req }
   */
  async logout(userId, context = {}) {
    if (!userId) return;
    await User.updateOne({ _id: userId }, { $unset: { refreshToken: 1 } });
    SecurityLogger.log("AUTH_LOGOUT_SUCCESS", {
      req: context.req,
      userId,
      outcome: "SUCCESS",
    });
  },

  /**
   * Generate password reset token (does NOT expose raw token in response or logs)
   * @param {string} email
   * @param {Object} [context] - { req }
   * @returns {Promise<{ message: string }>}
   */
  async forgotPassword(email, context = {}) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    // Always return safe success message to prevent user enumeration
    if (!user) {
      SecurityLogger.log("AUTH_PASSWORD_RESET_ATTEMPT_NONEXISTENT", {
        req: context.req,
        email: normalizedEmail,
        outcome: "FAILURE",
      });
      return { message: ResponseMessages.PASSWORD_RESET_LINK_SENT };
    }

    const { hashedToken } = TokenUtil.generateCryptoToken();
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry
    await user.save({ validateBeforeSave: false });

    // Log the event securely WITHOUT the token or credentials
    SecurityLogger.log("AUTH_PASSWORD_RESET_TOKEN_GENERATED", {
      req: context.req,
      userId: user._id,
      email: user.email,
      outcome: "SUCCESS",
    });

    return {
      message: ResponseMessages.PASSWORD_RESET_LINK_SENT,
    };
  },

  /**
   * Reset password with valid reset token
   * @param {Object} params - { token, password }
   * @param {Object} [context] - { req }
   */
  async resetPassword({ token, password }, context = {}) {
    const hashedToken = TokenUtil.hashToken(token);

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      SecurityLogger.log("AUTH_PASSWORD_RESET_INVALID_TOKEN", {
        req: context.req,
        outcome: "FAILURE",
      });
      throw ApiError.badRequest("Password reset token is invalid or has expired.");
    }

    // Set new password (pre-save hook will hash it and set passwordChangedAt)
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.refreshToken = undefined; // Revoke old sessions

    await user.save();

    SecurityLogger.log("AUTH_PASSWORD_RESET_SUCCESS", {
      req: context.req,
      userId: user._id,
      email: user.email,
      outcome: "SUCCESS",
    });

    return { message: ResponseMessages.PASSWORD_RESET_SUCCESS };
  },

  /**
   * Retrieve current user profile
   * @param {string} userId
   */
  async getCurrentUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound(ResponseMessages.USER_NOT_FOUND);
    }
    return user.toJSON();
  },
};
