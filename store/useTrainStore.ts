import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "@/lib/axios";

interface CustomFaq {
  id: string;
  question: string;
  answer: string;
}

interface KnowledgeFile {
  name: string;
  description: string;
  files: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface TrainingStatus {
  status: "idle" | "processing" | "completed" | "failed";
  lastTrainedAt?: Date;
  error?: string;
}

interface TrainingResponse {
  message: string;
  training: TrainingStatus;
}

interface TrainingStatusResponse {
  training: TrainingStatus;
  knowledgefiles: KnowledgeFile[];
  customFaqs: CustomFaq[];
}

interface TrainState {
  customFaqs: CustomFaq[];
  knowledgeFiles: KnowledgeFile[];
  trainingStatus: TrainingStatus;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTrainingStatus: (projectId: string) => Promise<void>;
  trainProjectAI: (
    projectId: string,
    files: File[],
    faqs: CustomFaq[]
  ) => Promise<void>;
  addCustomFaq: (faq: Omit<CustomFaq, "id">) => void;
  removeCustomFaq: (id: string) => void;
  clearError: () => void;
}

const useTrainStore = create<TrainState>()(
  persist(
    (set, get) => ({
      customFaqs: [],
      knowledgeFiles: [],
      trainingStatus: { status: "idle" },
      isLoading: false,
      error: null,

      fetchTrainingStatus: async (projectId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.get<TrainingStatusResponse>(
            `/training/${projectId}/status`
          );
          set({
            trainingStatus: response.data.training,
            knowledgeFiles: response.data.knowledgefiles,
            customFaqs: response.data.customFaqs,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error:
              error.response?.data?.message ||
              "Failed to fetch training status",
            isLoading: false,
          });
          throw error;
        }
      },

      trainProjectAI: async (
        projectId: string,
        files: File[],
        faqs: CustomFaq[]
      ) => {
        set({ isLoading: true, error: null });
        try {
          const formData = new FormData();

          // Append files with correct field name matching backend
          files.forEach((file) => {
            formData.append("files", file);
          });

          // Append FAQs matching backend expectation
          formData.append("customFaqs", JSON.stringify(faqs));
          console.log("formData", formData);

          const response = await axiosInstance.post<TrainingResponse>(
            `/training/${projectId}/train`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log("response", response);

          set((state) => ({
            trainingStatus: response.data.training,
            isLoading: false,
          }));
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to train AI",
            isLoading: false,
          });
          throw error;
        }
      },

      addCustomFaq: (faq) => {
        set((state) => ({
          customFaqs: [
            ...state.customFaqs,
            { ...faq, id: Date.now().toString() },
          ],
        }));
      },

      removeCustomFaq: (id) => {
        set((state) => ({
          customFaqs: state.customFaqs.filter((faq) => faq.id !== id),
        }));
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "train-storage",
      storage: typeof window !== "undefined" ? sessionStorage : undefined,
      partialize: (state) => ({
        customFaqs: state.customFaqs,
        knowledgeFiles: state.knowledgeFiles,
      }),
    }
  )
);

export default useTrainStore;

