import adminAxiosInstance from "@/lib/adminAxios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AdminAvatar {
  _id: string;
  name: string;
  type: string;
  imageUrl: string;
  prompt: string;
  style: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AdminAvatarState {
  avatars: AdminAvatar[];
  isLoading: boolean;
  error: string | null;
  fetchAvatars: () => Promise<AdminAvatar[]>;
  generateAvatar: (data: {
    name: string;
    prompt: string;
    style?: string;
    referenceImage?: string | null;
  }) => Promise<AdminAvatar>;
  updateAvatar: (
    id: string,
    data: {
      name?: string;
      prompt?: string;
      style?: string;
      referenceImage?: string | null;
    }
  ) => Promise<AdminAvatar>;
  deleteAvatar: (id: string) => Promise<void>;
  clearError: () => void;
}

const useAdminAvatarStore = create<AdminAvatarState>()(
  persist(
    (set, get) => ({
      avatars: [],
      isLoading: false,
      error: null,

      fetchAvatars: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await adminAxiosInstance.get("/admin/avatars");
          set({
            avatars: response.data,
            isLoading: false,
          });
          return response.data;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to fetch avatars",
            isLoading: false,
          });
          throw error;
        }
      },

      generateAvatar: async (data: {
        name: string;
        prompt: string;
        style?: string;
        referenceImage?: string | null;
      }): Promise<AdminAvatar> => {
        set({ isLoading: true, error: null });
        try {
          const formData = new FormData();
          formData.append("name", data.name);
          formData.append("prompt", data.prompt);
          if (data.style) formData.append("style", data.style);
          if (data.referenceImage) {
            const imageData = data.referenceImage.startsWith("data:")
              ? data.referenceImage
              : await fetch(data.referenceImage).then((r) => r.blob());
            formData.append("image", imageData);
          }

          // Debug FormData contents properly
          const formDataObject: Record<string, any> = {};
          formData.forEach((value, key) => {
            formDataObject[key] = value;
          });
          console.log("FormData contents:", formDataObject);

          const response = await adminAxiosInstance.post(
            "/admin/avatars/generate",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          set((state) => ({
            avatars: [...state.avatars, response.data],
            isLoading: false,
          }));

          return response.data;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to generate avatar",
            isLoading: false,
          });
          throw error;
        }
      },

      updateAvatar: async (
        id: string,
        data: {
          name?: string;
          prompt?: string;
          style?: string;
          referenceImage?: string | null;
        }
      ) => {
        set({ isLoading: true, error: null });
        try {
          console.log("data", id, data);
          const formData = new FormData();
          if (data.name) formData.append("name", data.name);
          if (data.prompt) formData.append("prompt", data.prompt);
          if (data.style) formData.append("style", data.style);
          if (data.referenceImage) {
            const blob = await fetch(data.referenceImage).then((r) => r.blob());
            formData.append("image", blob);
          }

          const response = await adminAxiosInstance.put(
            `/admin/avatars/${id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          set((state) => ({
            avatars: state.avatars.map((avatar) =>
              avatar._id === id ? response.data : avatar
            ),
            isLoading: false,
          }));

          return response.data;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to update avatar",
            isLoading: false,
          });
          throw error;
        }
      },

      deleteAvatar: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await adminAxiosInstance.delete(`/admin/avatars/${id}`);
          set((state) => ({
            avatars: state.avatars.filter((avatar) => avatar._id !== id),
            isLoading: false,
          }));
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to delete avatar",
            isLoading: false,
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "admin-avatar-storage",
      storage: typeof window !== "undefined" ? sessionStorage : undefined,
      partialize: (state) => ({
        avatars: state.avatars,
      }),
    }
  )
);

export default useAdminAvatarStore;

