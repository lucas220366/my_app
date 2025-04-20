import { create } from "zustand";
import axios from "@/lib/axios";

export interface Tutorial {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

interface TutorialStore {
  tutorials: Tutorial[];
  isLoading: boolean;
  error: string | null;
  fetchTutorials: () => Promise<void>;
}

const useTutorialStore = create<TutorialStore>((set) => ({
  tutorials: [],
  isLoading: false,
  error: null,
  fetchTutorials: async () => {
    try {
      console.log("Fetching tutorials");
      set({ isLoading: true, error: null });
      const response = await axios.get<Tutorial[]>("/tutorials");
      set({ tutorials: response.data, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch tutorials",
        isLoading: false,
      });
    }
  },
}));

export default useTutorialStore;

