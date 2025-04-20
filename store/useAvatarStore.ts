import axiosInstance from "@/lib/axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Avatar {
  _id: string;
  name: string;
  type: string;
  imageUrl: string;
  owner?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AvatarState {
  avatars: Avatar[];
  //   selectedAvatar: Avatar | null;
  isLoading: boolean;
  error: string | null;
  fetchAvatars: () => Promise<void>;
  //   getAvatarById: (avatarId: string) => Promise<Avatar>;
  createAvatar: (data: {
    name: string;
    prompt: string;
    style?: string;
    referenceImage?: string | null;
  }) => Promise<Avatar>;
  //   updateAvatar: (avatarId: string, avatar: Avatar) => Promise<Avatar>;
  //   deleteAvatar: (avatarId: string) => Promise<void>;
  clearError: () => void;
}

const useAvatarStore = create<AvatarState>()(
  persist(
    (set, get) => ({
      avatars: [],

      isLoading: false,
      error: null,

      fetchAvatars: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.get("/avatars");
          set({
            avatars: response.data,
            isLoading: false,
          });
          console.log("response.data", response.data);
          return response.data;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to fetch avatars",
            isLoading: false,
          });
          throw error;
        }
      },
      createAvatar: async (data: {
        name: string;
        prompt: string;
        style?: string;
        referenceImage?: string | null;
      }) => {
        set({ isLoading: true, error: null });
        try {
          const formData = new FormData();
          formData.append("name", data.name);
          formData.append("prompt", data.prompt);
          if (data.style) formData.append("style", data.style);
          if (data.referenceImage) {
            // Convert base64 to blob
            const blob = await fetch(data.referenceImage).then((r) => r.blob());
            formData.append("image", blob);
          }

          const response = await axiosInstance.post(
            "/avatars/generate",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          set((state) => ({
            avatars: [response.data, ...state.avatars],
            isLoading: false,
          }));

          return response.data;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to create avatar",
            isLoading: false,
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "avatar-storage",
      storage: typeof window !== "undefined" ? sessionStorage : undefined,
      partialize: (state) => ({
        avatars: state.avatars,
      }),
    }
  )
);

export default useAvatarStore;

