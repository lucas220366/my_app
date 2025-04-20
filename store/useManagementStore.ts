import { create } from "zustand";
import adminAxiosInstance from "@/lib/adminAxios";

interface User {
  _id: string;
  fullName: string;
  email: string;
  subscription?: {
    status: string;
    plan: string;
  };
  createdAt: string;
  projectCount: number;
}

interface Avatar {
  _id: string;
  url: string;
  // Add other avatar properties as needed
}

interface OverviewData {
  users: {
    total: number;
    growthRate: number;
  };
  revenue: {
    total: number;
    subscriptionGrowthRate: number;
  };
  projects: {
    total: number;
    growthRate: number;
  };
}

interface ManagementState {
  users: User[];
  avatars: Avatar[];
  overview: OverviewData | null;
  isLoading: boolean;
  error: string | null;
  fetchUsers: (search?: string) => Promise<void>;
  fetchOverview: () => Promise<void>;
  fetchAvatars: () => Promise<void>;
  clearError: () => void;
}

const useManagementStore = create<ManagementState>()((set) => ({
  users: [],
  avatars: [],
  overview: null,
  isLoading: false,
  error: null,

  fetchUsers: async (search?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminAxiosInstance.get("/admin/users", {
        params: { search },
      });
      set({ users: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch users",
        isLoading: false,
      });
    }
  },

  fetchOverview: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminAxiosInstance.get("/admin/overview");
      set({ overview: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch overview",
        isLoading: false,
      });
    }
  },

  fetchAvatars: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminAxiosInstance.get("/admin/avatars");
      set({ avatars: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch avatars",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useManagementStore;

