/** Base URL for the backend API (includes `/api/v1`). Override via Vite env. */
const fromEnv = import.meta.env.VITE_API_BASE_URL;
const trimmed =
  typeof fromEnv === "string" && fromEnv.trim() !== ""
    ? fromEnv.trim().replace(/\/+$/, "")
    : null;

/**
 * In dev, default to a same-origin path so Vite can proxy to Laravel (see `vite.config.js`)
 * and the browser does not apply cross-origin CORS rules.
 * In production, set `VITE_API_BASE_URL` or this falls back to a local absolute URL.
 */
export const API_BASE_URL =
  trimmed ??
  (import.meta.env.DEV ? "/api/v1" : "http://127.0.0.1:8000/api/v1");
