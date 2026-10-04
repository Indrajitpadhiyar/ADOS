import rateLimit from "express-rate-limit";
import { HttpStatus } from "../constants/httpStatus.js";
import { ResponseMessages } from "../constants/responseMessages.js";

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true, // Return standard `RateLimit-*` headers
    legacyHeaders: false, // Disable non-standard `X-RateLimit-*`
    handler: (req, res) => {
      res.status(HttpStatus.TOO_MANY_REQUESTS).json({
        success: false,
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: message || ResponseMessages.TOO_MANY_REQUESTS,
      });
    },
  });

/**
 * Sensitive Authentication Endpoint Rate Limiter (Login, Register)
 * Guards against brute-force password cracking and credential stuffing.
 */
export const authLimiter = createLimiter(
  15 * 60 * 1000, // 15 minutes
  15, // 15 requests per 15-minute window
  "Too many authentication attempts. Please try again in 15 minutes."
);

/**
 * Strict Password Recovery Limiter
 * Mitigates email flooding and reset token enumeration
 */
export const passwordResetLimiter = createLimiter(
  15 * 60 * 1000,
  5, // 5 requests per 15 minutes
  "Too many password reset requests. Please wait 15 minutes before requesting again."
);

/**
 * Token Refresh Rate Limiter
 */
export const tokenRefreshLimiter = createLimiter(
  15 * 60 * 1000,
  30, // 30 refresh requests per 15 minutes
  "Too many token refresh attempts. Please re-authenticate."
);

/**
 * General API Rate Limiter
 */
export const apiLimiter = createLimiter(
  15 * 60 * 1000,
  300, // 300 requests per 15 minutes
  ResponseMessages.TOO_MANY_REQUESTS
);
