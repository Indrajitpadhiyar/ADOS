import jwt from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env.js";

/**
 * Enterprise Token Utility
 */
export const TokenUtil = {
  /**
   * Signs a short-lived access JWT token
   * @param {Object} payload - { id, email, role }
   * @returns {string} Signed JWT
   */
  generateAccessToken(payload) {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
      issuer: "ados-auth-service",
      audience: "ados-web-client",
    });
  },

  /**
   * Signs a long-lived refresh JWT token
   * @param {Object} payload - { id }
   * @returns {string} Signed JWT
   */
  generateRefreshToken(payload) {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
      issuer: "ados-auth-service",
      audience: "ados-web-client",
    });
  },

  /**
   * Synchronously or asynchronously verifies an access token
   * @param {string} token
   * @returns {Object} Decoded payload
   */
  verifyAccessToken(token) {
    return jwt.verify(token, env.JWT_ACCESS_SECRET, {
      algorithms: ["HS256"],
      issuer: "ados-auth-service",
      audience: "ados-web-client",
    });
  },

  /**
   * Verifies a refresh token
   * @param {string} token
   * @returns {Object} Decoded payload
   */
  verifyRefreshToken(token) {
    return jwt.verify(token, env.JWT_REFRESH_SECRET, {
      algorithms: ["HS256"],
      issuer: "ados-auth-service",
      audience: "ados-web-client",
    });
  },

  /**
   * Generates a cryptographically strong random token (for password reset, email verification)
   * @returns {{ rawToken: string, hashedToken: string }}
   */
  generateCryptoToken() {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    return { rawToken, hashedToken };
  },

  /**
   * Hashes a raw token with SHA256
   * @param {string} rawToken
   * @returns {string}
   */
  hashToken(rawToken) {
    return crypto.createHash("sha256").update(rawToken).digest("hex");
  },
};
