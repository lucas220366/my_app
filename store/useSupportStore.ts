import { create } from "zustand";
import axiosInstance from "@/lib/axios";
import { persist } from "zustand/middleware";

export interface Attachment {
  _id: string;
  filename: string;
  path: string;
  mimetype: string;
}

export interface Ticket {
  _id: string;
  subject: string;
  description: string;
  status: "in progress" | "resolved";
  createdAt: string;
  attachments: Attachment[];
  supportResponse?: string;
}

interface SupportState {
  tickets: Ticket[];
  isLoading: boolean;
  error: string | null;
  // Support actions
  fetchTickets: () => Promise<void>;
  createTicket: (data: FormData) => Promise<void>;
  clearError: () => void;
}

const useSupportStore = create<SupportState>()(
  persist(
    (set) => ({
      tickets: [],
      isLoading: false,
      error: null,

      fetchTickets: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await axiosInstance.get("/tickets/my-tickets");
          set({ tickets: response.data, isLoading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch tickets",
            isLoading: false,
          });
        }
      },

      createTicket: async (formData: FormData) => {
        try {
          set({ isLoading: true, error: null });
          const response = await axiosInstance.post("/tickets", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          set((state) => ({
            tickets: [...state.tickets, response.data],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to create ticket",
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "support-store",
      storage: typeof window !== "undefined" ? sessionStorage : undefined,
      partialize: (state) => ({
        tickets: state.tickets,
      }),
    }
  )
);

export default useSupportStore;

