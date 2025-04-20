import { create } from "zustand";
import axiosInstance from "@/lib/axios";
import axios from "axios";

interface ForgotState {
  loading: boolean;
  error: string | null;
  success: string | null;
  getCsrfToken: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  verifyResetCodeAndUpdatePassword: (
    email: string,
    resetCode: string,
    newPassword: string
  ) => Promise<void>;
  clearState: () => void;
}

const useForgotStore = create<ForgotState>((set) => ({
  loading: false,
  error: null,
  success: null,

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

  requestPasswordReset: async (email: string) => {
    try {
      set({ loading: true, error: null, success: null });

      const response = await axiosInstance.post("/forgot/request-reset", {
        email,
      });

      if (response.status !== 200) {
        throw new Error(response.data.message);
      }

      set({ success: response.data.message });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },

  verifyResetCodeAndUpdatePassword: async (
    email: string,
    resetCode: string,
    newPassword: string
  ) => {
    try {
      set({ loading: true, error: null, success: null });

      const response = await axiosInstance.post("/forgot/verify-reset", {
        email,
        resetCode,
        newPassword,
      });

      if (response.status !== 200) {
        throw new Error(response.data.message);
      }

      set({ success: response.data.message });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },

  clearState: () => {
    set({ error: null, success: null });
  },
}));

useForgotStore.getState().getCsrfToken();

export default useForgotStore;

