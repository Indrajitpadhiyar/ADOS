import { ApiError } from "../utils/ApiError.js";
import { HttpStatus } from "../constants/httpStatus.js";

/**
 * 404 Route Not Found Middleware
 */
export const notFoundHandler = (req, res, next) => {
  next(new ApiError(HttpStatus.NOT_FOUND, `Endpoint not found: [${req.method}] ${req.originalUrl}`));
};
