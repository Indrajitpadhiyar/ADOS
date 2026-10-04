import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { TokenUtil } from "../utils/token.util.js";
import { ResponseMessages } from "../constants/responseMessages.js";
import { SecurityLogger } from "../utils/securityLogger.util.js";
import { env } from "../config/env.js";
import { EmailService } from "./email.service.js";

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

    // Generate cryptographically secure email verification token & 6-digit code
    const { rawToken, hashedToken } = TokenUtil.generateCryptoToken();
    const { rawCode, hashedCode } = TokenUtil.generateVerificationCode();
    const expiresMs = env.EMAIL_VERIFICATION_EXPIRES_MINUTES * 60 * 1000;

    user.emailVerified = false;
    user.isVerified = false;
    user.emailVerificationTokenHash = hashedToken;
    user.emailVerificationCodeHash = hashedCode;
    user.emailVerificationExpires = new Date(Date.now() + expiresMs);
    user.refreshToken = TokenUtil.hashToken(refreshToken);

    await user.save({ validateBeforeSave: false });

    // Send verification email asynchronously
    const verificationUrl = `${env.APP_URL}/?verifyToken=${rawToken}`;
    EmailService.sendVerificationEmail({
      to: user.email,
      name: user.name,
      verificationUrl,
      verificationCode: rawCode,
    }).catch((err) => {
      console.error("❌ Failed to send initial verification email:", err.message);
    });

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
      requiresEmailVerification: true,
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

    // If account is unverified, automatically dispatch a 6-digit verification code to the login email
    if (!user.emailVerified && !user.isVerified) {
      const { rawToken, hashedToken } = TokenUtil.generateCryptoToken();
      const { rawCode, hashedCode } = TokenUtil.generateVerificationCode();
      const expiresMs = env.EMAIL_VERIFICATION_EXPIRES_MINUTES * 60 * 1000;

      user.emailVerificationTokenHash = hashedToken;
      user.emailVerificationCodeHash = hashedCode;
      user.emailVerificationExpires = new Date(Date.now() + expiresMs);
      await user.save({ validateBeforeSave: false });

      const verificationUrl = `${env.APP_URL}/?verifyToken=${rawToken}`;
      EmailService.sendVerificationEmail({
        to: user.email,
        name: user.name,
        verificationUrl,
        verificationCode: rawCode,
      }).catch((err) => {
        console.error("❌ Failed to send verification email on login:", err.message);
      });

      SecurityLogger.log("AUTH_LOGIN_REQUIRES_VERIFICATION", {
        req: context.req,
        userId: user._id,
        email: user.email,
        outcome: "PENDING_VERIFICATION",
      });

      return {
        user: user.toJSON(),
        requiresEmailVerification: true,
        message: `Verification code sent to ${user.email}. Please verify to complete sign in.`,
      };
    }

    // Generate JWTs for verified users
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

  /**
   * Verify email address using cryptographically secure single-use token or 6-digit code
   * @param {Object} params - { token, code, email }
   * @param {Object} [context] - { req }
   * @returns {Promise<{ message: string, user?: Object, alreadyVerified?: boolean }>}
   */
  async verifyEmail({ token, code, email } = {}, context = {}) {
    let user;

    if (code && email) {
      const normalizedEmail = email.toLowerCase().trim();
      const hashedCode = TokenUtil.hashToken(code.trim());

      user = await User.findOne({
        email: normalizedEmail,
        emailVerificationCodeHash: hashedCode,
      }).select("+emailVerificationTokenHash +emailVerificationCodeHash +emailVerificationExpires");
    } else if (token && typeof token === "string") {
      const hashedToken = TokenUtil.hashToken(token.trim());

      user = await User.findOne({
        emailVerificationTokenHash: hashedToken,
      }).select("+emailVerificationTokenHash +emailVerificationCodeHash +emailVerificationExpires");
    } else {
      throw ApiError.badRequest("Verification token or 6-digit code with email is required.");
    }

    if (!user) {
      SecurityLogger.log("AUTH_EMAIL_VERIFICATION_INVALID_CREDENTIALS", {
        req: context.req,
        outcome: "FAILURE",
      });
      throw ApiError.badRequest(ResponseMessages.VERIFICATION_TOKEN_INVALID_OR_EXPIRED);
    }

    // Verify expiration
    if (!user.emailVerificationExpires || user.emailVerificationExpires.getTime() < Date.now()) {
      SecurityLogger.log("AUTH_EMAIL_VERIFICATION_EXPIRED", {
        req: context.req,
        userId: user._id,
        outcome: "FAILURE",
      });
      throw ApiError.badRequest(ResponseMessages.VERIFICATION_TOKEN_INVALID_OR_EXPIRED);
    }

    // Check if account is already verified
    if (user.emailVerified && user.isVerified) {
      user.emailVerificationTokenHash = undefined;
      user.emailVerificationCodeHash = undefined;
      user.emailVerificationExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return {
        message: ResponseMessages.EMAIL_ALREADY_VERIFIED,
        alreadyVerified: true,
      };
    }

    // Mark verified and permanently invalidate single-use token and code
    user.emailVerified = true;
    user.isVerified = true;
    user.emailVerificationTokenHash = undefined;
    user.emailVerificationCodeHash = undefined;
    user.emailVerificationExpires = undefined;

    // Issue session tokens upon successful verification so user is authenticated
    const tokenPayload = { id: user._id.toString(), email: user.email, role: user.role };
    const accessToken = TokenUtil.generateAccessToken(tokenPayload);
    const refreshToken = TokenUtil.generateRefreshToken({ id: user._id.toString() });

    user.refreshToken = TokenUtil.hashToken(refreshToken);
    await user.save({ validateBeforeSave: false });

    SecurityLogger.log("AUTH_EMAIL_VERIFICATION_SUCCESS", {
      req: context.req,
      userId: user._id,
      email: user.email,
      outcome: "SUCCESS",
    });

    return {
      message: ResponseMessages.EMAIL_VERIFIED_SUCCESS,
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  },

  /**
   * Resend verification email with rate limiting and account enumeration protection
   * @param {string} email
   * @param {Object} [context] - { req }
   * @returns {Promise<{ message: string }>}
   */
  async resendVerification(email, context = {}) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+emailVerificationTokenHash +emailVerificationExpires"
    );

    // Enumeration protection: always return safe generic response
    if (!user) {
      SecurityLogger.log("AUTH_RESEND_VERIFICATION_NONEXISTENT", {
        req: context.req,
        email: normalizedEmail,
        outcome: "FAILURE",
      });
      return { message: ResponseMessages.RESEND_VERIFICATION_DISPATCHED };
    }

    // If already verified, return generic response to avoid leaking verification status
    if (user.emailVerified && user.isVerified) {
      SecurityLogger.log("AUTH_RESEND_VERIFICATION_ALREADY_VERIFIED", {
        req: context.req,
        userId: user._id,
        email: normalizedEmail,
        outcome: "FAILURE",
      });
      return { message: ResponseMessages.RESEND_VERIFICATION_DISPATCHED };
    }

    // Generate new secure verification token and 6-digit code
    const { rawToken, hashedToken } = TokenUtil.generateCryptoToken();
    const { rawCode, hashedCode } = TokenUtil.generateVerificationCode();
    const expiresMs = env.EMAIL_VERIFICATION_EXPIRES_MINUTES * 60 * 1000;

    user.emailVerificationTokenHash = hashedToken;
    user.emailVerificationCodeHash = hashedCode;
    user.emailVerificationExpires = new Date(Date.now() + expiresMs);
    await user.save({ validateBeforeSave: false });

    // Dispatch verification email
    const verificationUrl = `${env.APP_URL}/?verifyToken=${rawToken}`;
    EmailService.sendVerificationEmail({
      to: user.email,
      name: user.name,
      verificationUrl,
      verificationCode: rawCode,
    }).catch((err) => {
      console.error("❌ Failed to send verification email on resend:", err.message);
    });

    SecurityLogger.log("AUTH_RESEND_VERIFICATION_SUCCESS", {
      req: context.req,
      userId: user._id,
      email: user.email,
      outcome: "SUCCESS",
    });

    return { message: ResponseMessages.RESEND_VERIFICATION_DISPATCHED };
  },
};
