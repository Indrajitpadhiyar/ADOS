import { ApiError } from "../utils/ApiError.js";
import { HttpStatus } from "../constants/httpStatus.js";
import { env } from "../config/env.js";

/**
 * Centralized Global Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // 1. Convert native/external errors into ApiError instances
  if (!(error instanceof ApiError)) {
    // MongoDB Bad ObjectId (CastError)
    if (error.name === "CastError") {
      const message = `Invalid resource identifier: ${error.value}`;
      error = new ApiError(HttpStatus.BAD_REQUEST, message);
    }
    // MongoDB Duplicate Key (E11000)
    else if (error.code === 11000) {
      const fields = Object.keys(error.keyValue || {});
      const message = `Duplicate value entered for field: ${fields.join(", ")}. Please use another value.`;
      error = new ApiError(HttpStatus.CONFLICT, message);
    }
    // Mongoose Validation Error
    else if (error.name === "ValidationError") {
      const formattedErrors = Object.values(error.errors || {}).map((val) => ({
        field: val.path,
        message: val.message,
      }));
      error = new ApiError(HttpStatus.UNPROCESSABLE_ENTITY, "Database validation failure", formattedErrors);
    }
    // Malformed JSON payload
    else if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
      error = new ApiError(HttpStatus.BAD_REQUEST, "Malformed JSON payload in request body");
    }
    // Fallback to internal server error
    else {
      const statusCode = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.message || "An unexpected internal server error occurred.";
      error = new ApiError(statusCode, message, [], err.stack);
      error.isOperational = false;
    }
  }

  // 2. Security Logging (Logged server-side with full stack, NEVER sent to client)
  if (error.statusCode >= 500) {
    console.error("🔥 [INTERNAL CRITICAL ERROR]", {
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method,
      ip: req.ip,
      message: error.message,
      stack: error.stack,
    });
  }

  // 3. Response Construction (Defense against information leakage)
  const isProd = env.NODE_ENV === "production";
  const safeMessage =
    !isProd || error.isOperational
      ? error.message
      : "An internal server error occurred. Please contact support.";

  const responsePayload = {
    success: false,
    statusCode: error.statusCode,
    message: safeMessage,
    ...(error.errors && error.errors.length > 0 && { errors: error.errors }),
    ...(!isProd && { stack: error.stack }),
  };

  return res.status(error.statusCode).json(responsePayload);
};
