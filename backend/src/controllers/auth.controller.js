import { AuthService } from "../services/auth.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ResponseMessages } from "../constants/responseMessages.js";
import { env } from "../config/env.js";

/**
 * Cookie security options conforming to OWASP specifications
 */
const getCookieOptions = (maxAgeMs) => ({
  httpOnly: true, // Prevents client-side JavaScript access (mitigates XSS token theft)
  secure: env.NODE_ENV === "production", // Transmit only over HTTPS in production
  sameSite: env.NODE_ENV === "production" ? "strict" : "lax", // Protects against CSRF
  path: "/",
  maxAge: maxAgeMs,
});

const getClearCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
  path: "/",
});

const ACCESS_COOKIE_MAX_AGE = 15 * 60 * 1000; // 15 mins
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

export const AuthController = {
  /**
   * POST /api/v1/auth/register
   */
  register: asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const { user, accessToken, refreshToken } = await AuthService.register(
      { name, email, password },
      { req }
    );

    // Set secure HTTP-only cookies
    res.cookie("accessToken", accessToken, getCookieOptions(ACCESS_COOKIE_MAX_AGE));
    res.cookie("refreshToken", refreshToken, getCookieOptions(REFRESH_COOKIE_MAX_AGE));

    return ApiResponse.created(res, ResponseMessages.REGISTER_SUCCESS, {
      user,
      accessToken,
      refreshToken,
    });
  }),

  /**
   * POST /api/v1/auth/login
   */
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await AuthService.login(
      { email, password },
      { req }
    );

    res.cookie("accessToken", accessToken, getCookieOptions(ACCESS_COOKIE_MAX_AGE));
    res.cookie("refreshToken", refreshToken, getCookieOptions(REFRESH_COOKIE_MAX_AGE));

    return ApiResponse.success(res, ResponseMessages.LOGIN_SUCCESS, {
      user,
      accessToken,
      refreshToken,
    });
  }),

  /**
   * POST /api/v1/auth/refresh
   */
  refreshToken: asyncHandler(async (req, res) => {
    const incomingToken = req.cookies?.refreshToken || req.body?.refreshToken;
    const { user, accessToken, refreshToken } = await AuthService.refreshAccessToken(
      incomingToken,
      { req }
    );

    res.cookie("accessToken", accessToken, getCookieOptions(ACCESS_COOKIE_MAX_AGE));
    res.cookie("refreshToken", refreshToken, getCookieOptions(REFRESH_COOKIE_MAX_AGE));

    return ApiResponse.success(res, ResponseMessages.TOKEN_REFRESH_SUCCESS, {
      user,
      accessToken,
      refreshToken,
    });
  }),

  /**
   * POST /api/v1/auth/logout
   */
  logout: asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    await AuthService.logout(userId, { req });

    // Evict session cookies with identical security attributes
    const clearOpts = getClearCookieOptions();
    res.clearCookie("accessToken", clearOpts);
    res.clearCookie("refreshToken", clearOpts);

    return ApiResponse.success(res, ResponseMessages.LOGOUT_SUCCESS, null);
  }),

  /**
   * GET /api/v1/auth/me
   */
  getMe: asyncHandler(async (req, res) => {
    const user = await AuthService.getCurrentUser(req.user._id);
    return ApiResponse.success(res, "User profile fetched successfully.", { user });
  }),

  /**
   * POST /api/v1/auth/forgot-password
   */
  forgotPassword: asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await AuthService.forgotPassword(email, { req });
    return ApiResponse.success(res, result.message, null);
  }),

  /**
   * POST /api/v1/auth/reset-password
   */
  resetPassword: asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    const result = await AuthService.resetPassword({ token, password }, { req });
    return ApiResponse.success(res, result.message, null);
  }),
};
