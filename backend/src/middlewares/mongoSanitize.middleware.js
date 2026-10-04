/**
 * NoSQL Injection Sanitization Middleware (Express 5 Compatible)
 * Recursively inspects and removes any object keys that begin with '$' or contain '.'
 * Modifies properties in-place to comply with Express 5 getter-only properties.
 */
function sanitizeInPlace(obj) {
  if (!obj || typeof obj !== "object") return;

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (typeof obj[i] === "object" && obj[i] !== null) {
        sanitizeInPlace(obj[i]);
      }
    }
    return;
  }

  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) {
      console.warn(`[SECURITY ALERT] Stripped illegal NoSQL injection key: "${key}"`);
      delete obj[key];
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      sanitizeInPlace(obj[key]);
    }
  }
}

export const mongoSanitize = (req, res, next) => {
  if (req.body) sanitizeInPlace(req.body);
  if (req.query) sanitizeInPlace(req.query);
  if (req.params) sanitizeInPlace(req.params);
  next();
};
