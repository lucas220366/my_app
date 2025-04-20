import { create } from "zustand";
import axios from "axios";

interface Blog {
  _id: string;
  title: string;
  description: string;
  content: string;
  keywords: string[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogState {
  blogs: Blog[];
  currentBlog: Blog | null;
  isLoading: boolean;
  error: string | null;

  // Public Actions
  fetchAllBlogs: () => Promise<void>;
  selectedBlog: Blog | null;
  fetchBlogById: (id: string) => Promise<void>;
  setSelectedBlog: (blog: Blog) => void;
  // Utility Actions
  clearError: () => void;
}

const useBlogStore = create<BlogState>()((set) => ({
  blogs: [],
  currentBlog: null,
  isLoading: false,
  error: null,
  selectedBlog: null,

  fetchAllBlogs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/public-blogs`
      );
      set({ blogs: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to fetch blogs",
        isLoading: false,
      });
    }
  },

  fetchBlogById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/public-blogs/${id}`
      );
      set({ currentBlog: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to fetch blog",
        isLoading: false,
      });
    }
  },

  setSelectedBlog: (blog: Blog) => set({ selectedBlog: blog }),

  clearError: () => set({ error: null }),
}));

export default useBlogStore;

