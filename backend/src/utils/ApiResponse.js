import { HttpStatus } from "../constants/httpStatus.js";

/**
 * Standardized API JSON Response Wrapper
 */
export class ApiResponse {
  /**
   * @param {number} statusCode
   * @param {string} message
   * @param {*} [data=null]
   * @param {Object} [meta=null]
   */
  constructor(statusCode = HttpStatus.OK, message = "Success", data = null, meta = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    if (meta) {
      this.meta = meta;
    }
  }

  static success(res, message = "Success", data = null, statusCode = HttpStatus.OK, meta = null) {
    return res.status(statusCode).json(new ApiResponse(statusCode, message, data, meta));
  }

  static created(res, message = "Resource created successfully", data = null) {
    return res.status(HttpStatus.CREATED).json(new ApiResponse(HttpStatus.CREATED, message, data));
  }

  static noContent(res) {
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
