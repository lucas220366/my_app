import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import adminAxiosInstance from "@/lib/adminAxios";

interface Admin {
  id: string;
  email: string;
}

interface AdminAuthState {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  getCsrfToken: () => Promise<string | null>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
  updateCredentials: (email?: string, password?: string) => Promise<void>;
  clearError: () => void;
  initializeResponseInterceptor: () => void;
}

const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      admin: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      getCsrfToken: async () => {
        try {
          const response = await adminAxiosInstance.get("/csrf-token", {
            withCredentials: true,
          });
          const csrfToken = response.data.csrfToken;
          adminAxiosInstance.defaults.headers.common["x-csrf-token"] =
            csrfToken;
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

          const response = await adminAxiosInstance.post("/admin/login", {
            email,
            password,
          });

          set({
            admin: { id: response.data.adminId, email },
            isAuthenticated: true,
            isLoading: false,
          });

          await get().getCsrfToken();
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Admin login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      updateCredentials: async (email?: string, password?: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await adminAxiosInstance.put("/admin/update", {
            email,
            password,
          });

          if (email) {
            set((state) => ({
              admin: state.admin ? { ...state.admin, email } : null,
              isLoading: false,
            }));
          } else {
            set({ isLoading: false });
          }
        } catch (error: any) {
          set({
            error:
              error.response?.data?.message || "Failed to update credentials",
            isLoading: false,
          });
          throw error;
        }
      },
      refreshAuth: async () => {
        try {
          await get().getCsrfToken();
          const response = await adminAxiosInstance.post("/admin/refresh");
          await get().getCsrfToken();
          return true;
        } catch (error) {
          return false;
        }
      },

      logout: async () => {
        try {
          await adminAxiosInstance.post("/admin/logout");

          // Clear all cookies
          document.cookie.split(";").forEach((cookie) => {
            const [name] = cookie.split("=");
            document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
          });

          // Clear session storage
          sessionStorage.clear();

          // Clear axios headers
          adminAxiosInstance.defaults.headers.common = {};

          set({
            admin: null,
            isAuthenticated: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Logout failed",
          });
          throw error;
        }
      },
      initializeResponseInterceptor: () => {
        adminAxiosInstance.interceptors.response.use(
          (response) => response,
          async (error) => {
            const originalRequest = error.config;
            if (error.response?.status === 401 && !originalRequest._retry) {
              originalRequest._retry = true;
              const refreshed = await get().refreshAuth();
              if (refreshed) {
                return adminAxiosInstance(originalRequest);
              }
            }
            return Promise.reject(error);
          }
        );
      },
      clearError: () => set({ error: null }),
    }),
    {
      name: "admin-auth-storage",
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") return null;
          return sessionStorage.getItem(name);
        },
        setItem: (name, value) => {
          if (typeof window === "undefined") return;
          sessionStorage.setItem(name, value);
        },
        removeItem: (name) => {
          if (typeof window === "undefined") return;
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);

export default useAdminAuthStore;

