/**
 * Security Audit Event Logger
 * Formats and records security-relevant lifecycle events without exposing passwords,
 * tokens, raw credentials, or session cookies.
 */
export const SecurityLogger = {
  log(event, { req = null, userId = null, email = null, details = null, outcome = "SUCCESS" } = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: "SECURITY_AUDIT",
      event,
      outcome,
      userId: userId ? String(userId) : undefined,
      email: email ? String(email).toLowerCase() : undefined,
      ip: req ? req.ip || req.headers["x-forwarded-for"] || req.socket?.remoteAddress : undefined,
      userAgent: req ? req.headers["user-agent"] : undefined,
      path: req ? req.originalUrl : undefined,
      method: req ? req.method : undefined,
      details: details || undefined,
    };

    // Filter out undefined properties
    const cleanEntry = Object.fromEntries(Object.entries(logEntry).filter(([_, v]) => v !== undefined));

    if (outcome === "FAILURE" || outcome === "SUSPICIOUS") {
      console.warn(`🔒 [SECURITY AUDIT WARN] ${JSON.stringify(cleanEntry)}`);
    } else {
      console.log(`🔒 [SECURITY AUDIT INFO] ${JSON.stringify(cleanEntry)}`);
    }
  },
};
