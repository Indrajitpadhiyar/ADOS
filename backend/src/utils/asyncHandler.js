/**
 * Higher-order controller wrapper that forwards async errors to the global error middleware.
 * Prevents try/catch boilerplate across controllers.
 * 
 * @param {Function} fn - Async controller function
 * @returns {Function} Express middleware function
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
