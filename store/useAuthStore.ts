import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "@/lib/axios";
import axios from "axios";

interface User {
  id: string;
  email: string;
  fullName: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  getCsrfToken: () => Promise<string | null>;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
  initializeResponseInterceptor: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      getCsrfToken: async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/csrf-token`,
            { withCredentials: true }
          );
          const csrfToken = response.data.csrfToken;
          axiosInstance.defaults.headers.common["x-csrf-token"] = csrfToken;
          return csrfToken;
        } catch (error) {
          console.error("Failed to get CSRF token:", error);
          return null;
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          await get().getCsrfToken();
          const response = await axiosInstance.post("/auth/login", {
            email,
            password,
          });

          set({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (email: string, password: string, fullName: string) => {
        set({ isLoading: true, error: null });
        try {
          await get().getCsrfToken();
          const response = await axiosInstance.post("/auth/register", {
            email,
            password,
            fullName,
          });

          set({
            user: {
              id: response.data._id,
              email: response.data.email,
              fullName: response.data.fullName,
              role: response.data.role,
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Registration failed",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await get().getCsrfToken();
          await axiosInstance.post("/auth/logout");

          // Clear all auth-related cookies
          document.cookie.split(";").forEach((cookie) => {
            const [name] = cookie.split("=").map((c) => c.trim());
            document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
          });

          // Clear session storage
          sessionStorage.clear();

          // Clear axios headers
          axiosInstance.defaults.headers.common = {};

          // Reset store state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Logout failed",
            isLoading: false,
          });
        }
      },

      refreshAuth: async () => {
        try {
          const response = await axiosInstance.post(
            "/auth/refresh",
            {},
            { withCredentials: true }
          );
          if (response.data.user) {
            set({
              user: response.data.user,
              isAuthenticated: true,
            });
            await get().getCsrfToken();
            return true;
          }
          // If no user data, clear the auth state
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
          return false;
        } catch (error) {
          console.error("Failed to refresh authentication:", error);
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
          return false;
        }
      },

      initializeResponseInterceptor: () => {
        // Add request interceptor for CSRF tokens
        axiosInstance.interceptors.request.use(async (config) => {
          if (
            ["post", "put", "patch", "delete"].includes(
              config.method?.toLowerCase() ?? ""
            )
          ) {
            await get().getCsrfToken();
          }
          return config;
        });

        // Add response interceptor for auth refresh
        axiosInstance.interceptors.response.use(
          (response) => response,
          async (error) => {
            const originalRequest = error.config;
            if (error.response?.status === 401 && !originalRequest._retry) {
              originalRequest._retry = true;
              const refreshed = await get().refreshAuth();
              if (refreshed) {
                return axiosInstance(originalRequest);
              }
              // If refresh failed, clear auth state
              set({ isAuthenticated: false, user: null });
            }
            return Promise.reject(error);
          }
        );
      },

      fetchUserProfile: async () => {
        console.log("fetchUserProfile");
        // Don't attempt to fetch if we're not authenticated and already tried refreshing
        if (!get().isAuthenticated && !get().isLoading) {
          console.log("fetchUserProfile 1");
          return;
        }
        console.log("fetchUserProfile 2");
        set({ isLoading: true });
        try {
          await get().getCsrfToken();
          const response = await axiosInstance.get("/auth/profile");
          console.log("fetchUserProfile 3");
          set({
            user: response.data,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          console.log("fetchUserProfile 4", error);
          if (error.response?.status === 401) {
            // Try to refresh token only once
            const refreshed = await get().refreshAuth();
            if (!refreshed) {
              set({
                error: "Session expired",
                isLoading: false,
                isAuthenticated: false,
                user: null,
              });
              return;
            }
          } else {
            set({
              error: error.response?.data?.message || "Failed to fetch profile",
              isLoading: false,
              isAuthenticated: false,
              user: null,
            });
          }
        }
      },

      updateUserProfile: async (userData) => {
        set({ isLoading: true });
        try {
          await get().getCsrfToken();
          const response = await axiosInstance.put("/auth/profile", userData);
          set({
            user: {
              id: response.data._id,
              email: response.data.email,
              fullName: response.data.fullName,
              role: response.data.role,
            },
            isLoading: false,
          });
        } catch (error: any) {
          if (error.response?.status === 401) {
            // Try to refresh token
            const refreshed = await get().refreshAuth();
            if (refreshed) {
              // Retry updating profile
              await get().updateUserProfile(userData);
              return;
            }
          }

          set({
            error: error.response?.data?.message || "Failed to update profile",
            isLoading: false,
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") return null;
          const value = sessionStorage.getItem(name);
          // Also set as cookie for middleware access
          if (value) {
            document.cookie = `${name}=${value}; path=/; max-age=86400; SameSite=Lax`;
          }
          return value;
        },
        setItem: (name, value) => {
          if (typeof window === "undefined") return;
          sessionStorage.setItem(name, value);
          // Also set as cookie for middleware access
          document.cookie = `${name}=${value}; path=/; max-age=86400; SameSite=Lax`;
        },
        removeItem: (name) => {
          if (typeof window === "undefined") return;
          sessionStorage.removeItem(name);
          // Remove cookie as well
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        },
      },
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        error: state.error,
      }),
    }
  )
);

// Initialize the interceptor when the store is created
//useAuthStore.getState().initializeResponseInterceptor();

export default useAuthStore;

