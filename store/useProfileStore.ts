import { create } from "zustand";
import axiosInstance from "@/lib/axios";
import { persist } from "zustand/middleware";
interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
}

interface ProfileState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  // Profile actions
  fetchProfile: () => Promise<void>;
  updateProfile: (data: { fullName?: string; email?: string }) => Promise<void>;
  updatePassword: (data: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<void>;
  clearError: () => void;
}

const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      fetchProfile: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await axiosInstance.get("/auth/profile");
          set({ user: response.data, isLoading: false });
          console.log("response.data", response.data);

          return response.data;
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch profile",
            isLoading: false,
          });
        }
      },

      updateProfile: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axiosInstance.put("/auth/profile", data);
          set({ user: response.data, isLoading: false });
          console.log("response.data UPDATE PROFILE", response.data);
          return response.data;
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to update profile",
            isLoading: false,
          });
        }
      },

      updatePassword: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axiosInstance.put("/auth/password", data);
          set({ isLoading: false });
          return response.data;
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to update password",
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "profile-store",
      storage: typeof window !== "undefined" ? sessionStorage : undefined,
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);

export default useProfileStore;

