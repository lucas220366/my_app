import adminAxiosInstance from "@/lib/adminAxios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Tutorial {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

interface AdminTutorialState {
  tutorials: Tutorial[];
  isLoading: boolean;
  error: string | null;
  fetchTutorials: () => Promise<Tutorial[]>;
  getTutorialById: (id: string) => Promise<Tutorial>;
  createTutorial: (data: {
    title: string;
    description: string;
    videoUrl: string;
    duration: number;
  }) => Promise<Tutorial>;
  updateTutorial: (
    id: string,
    data: {
      title?: string;
      description?: string;
      videoUrl?: string;
      duration?: number;
    }
  ) => Promise<Tutorial>;
  deleteTutorial: (id: string) => Promise<void>;
  clearError: () => void;
}

const useAdminTutorialStore = create<AdminTutorialState>()(
  persist(
    (set, get) => ({
      tutorials: [],
      isLoading: false,
      error: null,

      fetchTutorials: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await adminAxiosInstance.get("/tutorials");
          set({
            tutorials: response.data,
            isLoading: false,
          });
          return response.data;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to fetch tutorials",
            isLoading: false,
          });
          throw error;
        }
      },

      getTutorialById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await adminAxiosInstance.get(`/tutorials/${id}`);
          set({ isLoading: false });
          return response.data;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to fetch tutorial",
            isLoading: false,
          });
          throw error;
        }
      },

      createTutorial: async (data: {
        title: string;
        description: string;
        videoUrl: string;
        duration: number;
      }) => {
        set({ isLoading: true, error: null });
        try {
          const response = await adminAxiosInstance.post("/tutorials", data);
          set((state) => ({
            tutorials: [...state.tutorials, response.data],
            isLoading: false,
          }));
          return response.data;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to create tutorial",
            isLoading: false,
          });
          throw error;
        }
      },

      updateTutorial: async (
        id: string,
        data: {
          title?: string;
          description?: string;
          videoUrl?: string;
          duration?: number;
        }
      ) => {
        set({ isLoading: true, error: null });
        try {
          const response = await adminAxiosInstance.put(
            `/tutorials/${id}`,
            data
          );
          set((state) => ({
            tutorials: state.tutorials.map((tutorial) =>
              tutorial._id === id ? response.data : tutorial
            ),
            isLoading: false,
          }));
          return response.data;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to update tutorial",
            isLoading: false,
          });
          throw error;
        }
      },

      deleteTutorial: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await adminAxiosInstance.delete(`/tutorials/${id}`);
          set((state) => ({
            tutorials: state.tutorials.filter(
              (tutorial) => tutorial._id !== id
            ),
            isLoading: false,
          }));
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to delete tutorial",
            isLoading: false,
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "admin-tutorial-storage",
      storage: typeof window !== "undefined" ? sessionStorage : undefined,
      partialize: (state) => ({
        tutorials: state.tutorials,
      }),
    }
  )
);

export default useAdminTutorialStore;

