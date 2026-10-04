import { HttpStatus } from "../constants/httpStatus.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Higher-order middleware to validate incoming request data using Zod
 * @param {import("zod").ZodSchema} schema
 * @param {"body"|"query"|"params"} [source="body"]
 */
export const validate = (schema, source = "body") => (req, res, next) => {
  try {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const formattedErrors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      throw new ApiError(
        HttpStatus.UNPROCESSABLE_ENTITY,
        formattedErrors[0]?.message || "Validation failed",
        formattedErrors
      );
    }

    // Replace request data with parsed/sanitized data from Zod
    req[source] = result.data;
    next();
  } catch (err) {
    next(err);
  }
};
