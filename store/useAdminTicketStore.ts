import adminAxiosInstance from "@/lib/adminAxios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Ticket {
  _id: string;
  user: {
    email: string;
    name: string;
  };
  subject: string;
  description: string;
  status: "open" | "resolved";
  supportResponse?: string;
  createdAt: string;
  updatedAt: string;
  attachments: string[];
}

interface AdminTicketState {
  tickets: Ticket[];
  isLoading: boolean;
  error: string | null;
  fetchTickets: (search?: string) => Promise<Ticket[]>;
  respondToTicket: (ticketId: string, response: string) => Promise<Ticket>;
  clearError: () => void;
}

const useAdminTicketStore = create<AdminTicketState>()(
  persist(
    (set) => ({
      tickets: [],
      isLoading: false,
      error: null,

      fetchTickets: async (search?: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await adminAxiosInstance.get("/tickets", {
            params: { search },
          });
          set({
            tickets: response.data,
            isLoading: false,
          });
          return response.data;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to fetch tickets",
            isLoading: false,
          });
          throw error;
        }
      },

      respondToTicket: async (ticketId: string, response: string) => {
        set({ isLoading: true, error: null });
        try {
          const result = await adminAxiosInstance.put(
            `/tickets/${ticketId}/respond`,
            { response }
          );
          set((state) => ({
            tickets: state.tickets.map((ticket) =>
              ticket._id === ticketId ? result.data : ticket
            ),
            isLoading: false,
          }));
          return result.data;
        } catch (error: any) {
          set({
            error:
              error.response?.data?.message || "Failed to respond to ticket",
            isLoading: false,
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "admin-ticket-storage",
      storage: typeof window !== "undefined" ? sessionStorage : undefined,
      partialize: (state) => ({
        tickets: state.tickets,
      }),
    }
  )
);

export default useAdminTicketStore;

