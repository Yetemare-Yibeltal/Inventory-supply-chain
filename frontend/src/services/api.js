import axios from "axios";

// Initialize an isolated, high-performance network orchestration cluster instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 15000, // Enforce a strict 15-second response deadline to protect client execution context
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Outbound Request Pipeline Interceptor: Inject latest structural security credentials
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Outbound packet tracking collision anomaly:", error);
    return Promise.reject(error);
  },
);

// Inbound Response Pipeline Interceptor: Centralized state evaluation & session boundary enforcement
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const responseStatus = error.response?.status;

    // Session Security Violation Boundary: Intercept unauthorized or expired operations
    if (responseStatus === 401) {
      console.warn(
        "Security validation mismatch state: Purging expired credential references.",
      );
      localStorage.removeItem("token");

      // Prevent browser layout context freezing by triggering an elegant app reload cycle
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    // Standard Network Diagnostics Isolation Logger
    const sanitizedErrorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unhandled network transport layer execution suspension occurred.";

    return Promise.reject(new Error(sanitizedErrorMessage));
  },
);

export default API;

