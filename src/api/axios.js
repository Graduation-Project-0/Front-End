import axios from "axios";
import { API_BASE_URL } from "../config/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  // Cross-origin + `true` requires `Access-Control-Allow-Credentials` and a non-* origin on the API.
  // This app sends the Bearer token in headers; cookies are not required for typical Laravel token APIs.
  withCredentials: false,
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  let token = localStorage.getItem("token");
  if (!token) {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      token = user?.token ?? null;
    } catch {
      token = null;
    }
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
