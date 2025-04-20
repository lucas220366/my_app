import { create } from "zustand";
import adminAxiosInstance from "@/lib/adminAxios";

interface SubscriptionOverview {
  overview: {
    totalRevenue: number;
    successfulTransactions: number;
    failedTransactions: number;
    activeSubscriptions: number;
  };
  subscriptionsByPlan: Array<{
    _id: string;
    count: number;
  }>;
  periodStart: string;
  periodEnd: string;
}

interface Transaction {
  fullName: string;
  email: string;
  planName: string;
  planPrice: number;
  transactionDate: string;
  status: string;
}

interface PaginationData {
  total: number;
  pages: number;
  currentPage: number;
  perPage: number;
}

interface TransactionState {
  overview: SubscriptionOverview | null;
  transactions: Transaction[];
  pagination: PaginationData | null;
  isLoading: boolean;
  error: string | null;
  fetchSubscriptionsOverview: () => Promise<void>;
  fetchTransactions: (params: {
    page?: number;
    limit?: number;
    search?: string;
  }) => Promise<void>;
  downloadTransactionsCSV: (search?: string) => Promise<void>;
  clearError: () => void;
}

const useTransactionStore = create<TransactionState>()((set) => ({
  overview: null,
  transactions: [],
  pagination: null,
  isLoading: false,
  error: null,

  fetchSubscriptionsOverview: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminAxiosInstance.get(
        "/admin/subscriptions-overview"
      );
      set({ overview: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to fetch subscriptions overview",
        isLoading: false,
      });
    }
  },

  fetchTransactions: async ({ page = 1, limit = 10, search }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminAxiosInstance.get(
        "/admin/users-transactions",
        {
          params: { page, limit, search },
        }
      );
      set({
        transactions: response.data.transactions,
        pagination: response.data.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch transactions",
        isLoading: false,
      });
    }
  },

  downloadTransactionsCSV: async (search?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminAxiosInstance.get(
        "/admin/transactions/download",
        {
          params: { search },
          responseType: "blob",
        }
      );

      // Create and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "transactions.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();

      set({ isLoading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || "Failed to download transactions",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useTransactionStore;

