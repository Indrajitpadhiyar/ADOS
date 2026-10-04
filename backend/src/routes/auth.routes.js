import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  authLimiter,
  passwordResetLimiter,
  tokenRefreshLimiter,
} from "../middlewares/rateLimiter.middleware.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validations/auth.validation.js";

const router = Router();

/**
 * Public Authentication Routes
 */
router.post("/register", authLimiter, validate(registerSchema), AuthController.register);
router.post("/login", authLimiter, validate(loginSchema), AuthController.login);
router.post("/refresh", tokenRefreshLimiter, AuthController.refreshToken);
router.post("/forgot-password", passwordResetLimiter, validate(forgotPasswordSchema), AuthController.forgotPassword);
router.post("/reset-password", passwordResetLimiter, validate(resetPasswordSchema), AuthController.resetPassword);

/**
 * Protected Routes (Requires valid JWT access token)
 */
router.post("/logout", authenticate, AuthController.logout);
router.get("/me", authenticate, AuthController.getMe);

export default router;
