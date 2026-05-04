import { API_BASE_URL } from "./api";

/**
 * Path segments relative to `API_BASE_URL` (axios `baseURL` / `VITE_API_BASE_URL`).
 * Use with the shared `api` axios instance (Bearer token via interceptor) or `apiUrl()` for `fetch`.
 */
export const ENDPOINTS = {
  LOGIN: "/login",
  REGISTER: "/register",
  LOGOUT: "/logout",
  /** Current user (requires Bearer token). */
  ME: "/me",
  HISTORY: "/history",
  FORGOT_PASSWORD: "/forgot-password",
  VERIFY_OTP: "/verify-otp",
  STANDARD_SCAN_FILE: "/standard/scan-file",
  ADVANCED_SCAN_FILE: "/advanced/scan-file",
  STANDARD_SCAN_URL: "/standard/scan-url",
  ADVANCED_SCAN_URL: "/advanced/scan-url",
  STANDARD_SCAN_EMAIL: "/standard/scan-email",
};

/**
 * Absolute URL under the API base (e.g. `fetch`, `window.location`, or FormData POSTs).
 */
export function apiUrl(path) {
  const segment = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${segment}`;
}

/** Laravel Socialite redirect start URL. */
export function authRedirectUrl(provider) {
  return apiUrl(`/auth/${provider}/redirect`);
}
