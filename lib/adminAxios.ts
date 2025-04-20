import useAdminAuthStore from "@/store/useAdminAuthStore";
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

if (!baseURL) {
  console.error("NEXT_PUBLIC_API_URL is not defined");
}

const adminAxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Enhanced request interceptor
adminAxiosInstance.interceptors.request.use(async (config) => {
  // Include credentials for all requests
  config.withCredentials = true;

  // For all non-GET requests, ensure CSRF token is present
  if (config.method?.toLowerCase() !== "get") {
    try {
      const response = await adminAxiosInstance.get("/csrf-token");
      config.headers["x-csrf-token"] = response.data.csrfToken;
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
      throw error;
    }
  }
  return config;
});

// Response interceptor
adminAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isUnauthorized = error.response?.status === 401;
    const hasNotRetried = !originalRequest._retry;
    const isRefreshEndpoint = originalRequest.url?.includes("/refresh");

    // Don't retry if it's already a refresh token request or has been retried
    if (isUnauthorized && hasNotRetried && !isRefreshEndpoint) {
      originalRequest._retry = true;

      try {
        const refreshed = await useAdminAuthStore.getState().refreshAuth();

        if (refreshed) {
          return adminAxiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Clear auth state and reject with original error
        useAdminAuthStore.getState().logout();
        useAdminAuthStore.setState({ isAuthenticated: false, admin: null });
      }
    }

    return Promise.reject(error);
  }
);

export default adminAxiosInstance;

