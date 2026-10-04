import { HttpStatus } from "../constants/httpStatus.js";

/**
 * Standard Operational Application Error
 * Encapsulates status code, operational flag, and optional field-level validation errors.
 */
export class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Human-readable error message
   * @param {Array|Object} [errors=[]] - Specific validation or field-level issues
   * @param {string} [stack=""] - Optional stack trace override
   */
  constructor(statusCode = HttpStatus.INTERNAL_SERVER_ERROR, message = "Internal Server Error", errors = [], stack = "") {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true; // Indicates expected domain errors vs uncaught runtime crashes

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message, errors = []) {
    return new ApiError(HttpStatus.BAD_REQUEST, message, errors);
  }

  static unauthorized(message = "Unauthorized access", errors = []) {
    return new ApiError(HttpStatus.UNAUTHORIZED, message, errors);
  }

  static forbidden(message = "Access forbidden", errors = []) {
    return new ApiError(HttpStatus.FORBIDDEN, message, errors);
  }

  static notFound(message = "Resource not found", errors = []) {
    return new ApiError(HttpStatus.NOT_FOUND, message, errors);
  }

  static conflict(message = "Resource conflict", errors = []) {
    return new ApiError(HttpStatus.CONFLICT, message, errors);
  }

  static unprocessable(message = "Unprocessable validation entity", errors = []) {
    return new ApiError(HttpStatus.UNPROCESSABLE_ENTITY, message, errors);
  }

  static tooManyRequests(message = "Rate limit exceeded", errors = []) {
    return new ApiError(HttpStatus.TOO_MANY_REQUESTS, message, errors);
  }

  static internal(message = "Internal Server Error") {
    return new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, message);
  }
}
