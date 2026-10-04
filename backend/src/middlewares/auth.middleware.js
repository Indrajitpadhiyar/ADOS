import { TokenUtil } from "../utils/token.util.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { HttpStatus } from "../constants/httpStatus.js";
import { ResponseMessages } from "../constants/responseMessages.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { SecurityLogger } from "../utils/securityLogger.util.js";

/**
 * Authentication Middleware
 * Extracts JWT token from Authorization header (Bearer) or httpOnly secure cookie.
 * Verifies token signature, claims, user existence, account lockout, and password changes.
 */
export const authenticate = asyncHandler(async (req, res, next) => {
  let token = null;

  // 1. Extract from Authorization Header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.accessToken) {
    // 2. Fallback to HttpOnly cookie
    token = req.cookies.accessToken;
  }

  if (!token) {
    SecurityLogger.log("AUTH_ACCESS_DENIED_NO_TOKEN", {
      req,
      outcome: "FAILURE",
    });
    throw new ApiError(HttpStatus.UNAUTHORIZED, ResponseMessages.UNAUTHORIZED);
  }

  // 3. Verify JWT
  let decoded;
  try {
    decoded = TokenUtil.verifyAccessToken(token);
  } catch (error) {
    SecurityLogger.log("AUTH_ACCESS_DENIED_INVALID_TOKEN", {
      req,
      details: error.name,
      outcome: "FAILURE",
    });
    if (error.name === "TokenExpiredError") {
      throw new ApiError(HttpStatus.UNAUTHORIZED, ResponseMessages.TOKEN_EXPIRED);
    }
    throw new ApiError(HttpStatus.UNAUTHORIZED, ResponseMessages.TOKEN_INVALID);
  }

  // 4. Verify User exists & retrieve lockout and password timestamp fields
  const currentUser = await User.findById(decoded.id).select("+passwordChangedAt +lockUntil");
  if (!currentUser) {
    SecurityLogger.log("AUTH_ACCESS_DENIED_USER_DELETED", {
      req,
      userId: decoded.id,
      outcome: "FAILURE",
    });
    throw new ApiError(HttpStatus.UNAUTHORIZED, "The user belonging to this token no longer exists.");
  }

  // 5. Verify account is not currently locked out
  if (currentUser.isLocked()) {
    SecurityLogger.log("AUTH_ACCESS_DENIED_ACCOUNT_LOCKED", {
      req,
      userId: currentUser._id,
      email: currentUser.email,
      outcome: "FAILURE",
    });
    throw new ApiError(HttpStatus.FORBIDDEN, ResponseMessages.ACCOUNT_LOCKED);
  }

  // 6. Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    SecurityLogger.log("AUTH_ACCESS_DENIED_PASSWORD_REVOKED", {
      req,
      userId: currentUser._id,
      email: currentUser.email,
      outcome: "FAILURE",
    });
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Password was recently updated. Please log in again.");
  }

  // Attach user to request context
  req.user = currentUser;
  next();
});

/**
 * Role-Based Access Control (RBAC) Guard
 * Validates that the authenticated user possesses one of the required roles.
 * @param  {...string} roles - e.g. 'admin', 'superadmin'
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      SecurityLogger.log("AUTH_RBAC_FORBIDDEN", {
        req,
        userId: req.user?._id,
        details: `Required: [${roles.join(", ")}], Actual: ${req.user?.role}`,
        outcome: "FAILURE",
      });
      throw new ApiError(HttpStatus.FORBIDDEN, ResponseMessages.FORBIDDEN);
    }
    next();
  };
};

/**
 * Email Verification Guard
 * Enforces that the authenticated user has verified their email address before accessing sensitive operations.
 */
export const requireEmailVerified = (req, res, next) => {
  if (!req.user) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, ResponseMessages.UNAUTHORIZED);
  }

  if (!req.user.emailVerified && !req.user.isVerified) {
    SecurityLogger.log("AUTH_EMAIL_VERIFICATION_REQUIRED", {
      req,
      userId: req.user._id,
      email: req.user.email,
      outcome: "FAILURE",
    });
    throw new ApiError(
      HttpStatus.FORBIDDEN,
      "Email verification required. Please verify your email address to continue."
    );
  }

  next();
};
