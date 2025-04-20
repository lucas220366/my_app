import { create } from "zustand";
import adminAxiosInstance from "@/lib/adminAxios";

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

  // Admin Actions
  createBlog: (blogData: FormData) => Promise<void>;
  updateBlog: (id: string, blogData: BlogPost) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;

  // Public Actions
  fetchAllBlogs: () => Promise<void>;
  fetchBlogById: (id: string) => Promise<void>;

  // Utility Actions
  clearError: () => void;
}

const useAdminBlogStore = create<BlogState>()((set) => ({
  blogs: [],
  currentBlog: null,
  isLoading: false,
  error: null,

  createBlog: async (blogData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminAxiosInstance.post("/blogs", blogData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set((state) => ({
        blogs: [...state.blogs, response.data],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to create blog",
        isLoading: false,
      });
      throw error;
    }
  },

  updateBlog: async (id: string, blogData: BlogPost) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();

      // Add all text fields
      formData.append("title", blogData.title);
      formData.append("description", blogData.description);
      formData.append("content", blogData.content);
      formData.append("keywords", JSON.stringify(blogData.keywords));

      // Only append image if it's a File object (new image uploaded)
      if (blogData.imageUrl instanceof File) {
        formData.append("image", blogData.imageUrl);
      }

      const response = await adminAxiosInstance.put(`/blogs/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set((state) => ({
        blogs: state.blogs.map((blog) =>
          blog._id === id ? response.data : blog
        ),
        currentBlog: response.data,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to update blog",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteBlog: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await adminAxiosInstance.delete(`/blogs/${id}`);
      set((state) => ({
        blogs: state.blogs.filter((blog) => blog._id !== id),
        currentBlog: null,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to delete blog",
        isLoading: false,
      });
    }
  },

  fetchAllBlogs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminAxiosInstance.get("/blogs");
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
      const response = await adminAxiosInstance.get(`/blogs/${id}`);
      set({ currentBlog: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to fetch blog",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAdminBlogStore;

