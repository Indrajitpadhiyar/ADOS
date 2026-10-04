/**
 * Standardized Response Messages Dictionary
 */
export const ResponseMessages = Object.freeze({
  // Auth
  REGISTER_SUCCESS: "User registered successfully.",
  LOGIN_SUCCESS: "Authentication successful.",
  LOGOUT_SUCCESS: "Logged out successfully.",
  TOKEN_REFRESH_SUCCESS: "Access token refreshed successfully.",
  PASSWORD_RESET_LINK_SENT: "If that email exists in our system, a password reset link has been dispatched.",
  PASSWORD_RESET_SUCCESS: "Password has been successfully reset. Please log in with your new credentials.",
  
  // Validation / Auth Errors
  INVALID_CREDENTIALS: "Invalid email or password.",
  EMAIL_ALREADY_EXISTS: "An account with this email address already exists.",
  ACCOUNT_LOCKED: "Account temporarily locked due to consecutive failed login attempts. Please try again later.",
  UNAUTHORIZED: "Authentication required. Please provide a valid access token.",
  TOKEN_EXPIRED: "Session expired. Please log in again.",
  TOKEN_INVALID: "Invalid authentication token.",
  FORBIDDEN: "You do not have permission to perform this action.",
  USER_NOT_FOUND: "User account not found.",
  PASSWORDS_DO_NOT_MATCH: "Password confirmation does not match.",
  
  // System
  TOO_MANY_REQUESTS: "Too many requests from this IP address. Please slow down and try again later.",
  INTERNAL_ERROR: "An unexpected internal server error occurred. Our engineering team has been notified.",
  ROUTE_NOT_FOUND: "The requested API resource endpoint could not be found.",
});
