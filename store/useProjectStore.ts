import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "@/lib/axios";
import { Project, Configuration } from "@/types";

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  fetchProjects: () => Promise<void>;
  getProjectById: (id: string) => Promise<Project>;
  scrapeWebsite: (websiteUrl: string) => Promise<{
    scrapedPages: Array<{ url: string; selected: boolean; content?: string }>;
  }>;
  createProject: (projectData: {
    name: string;
    description?: string;
    websiteUrl?: string;
    scrapedPages?: Array<{
      url: string;
      selected: boolean;
      content?: string;
    }>;
    avatar: {
      type: "predefined" | "custom";
      id?: string; // For predefined avatars
      imageUrl?: string; // For custom avatars
      file?: File; // For custom avatars
    };
  }) => Promise<Project>;
  updateProject: (
    id: string,
    projectData: Partial<Project>
  ) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  updateSelectedPages: (
    id: string,
    selectedPages: string[]
  ) => Promise<Project>;
  getConfiguration: (projectId: string) => Promise<Configuration>;
  updateConfiguration: (
    projectId: string,
    configData: Partial<Configuration>
  ) => Promise<Configuration>;
  resetConfiguration: (projectId: string) => Promise<Configuration>;
  updateProjectAvatar: (
    projectId: string,
    avatarId: string
  ) => Promise<Project>;
  resetProjectAvatar: (projectId: string) => Promise<Project>;
  setSelectedProject: (project: Project | null) => void;
  clearError: () => void;
}

const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      selectedProject: null,
      isLoading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,

      fetchProjects: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.get("/projects");
          set({
            projects: response.data,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to fetch projects",
            isLoading: false,
          });
          throw error;
        }
      },

      getProjectById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.get(`/projects/${id}`);
          const project = response.data;
          set((state) => ({
            selectedProject: project,
            projects: state.projects.map((p) =>
              p._id === project._id ? project : p
            ),
            isLoading: false,
          }));
          return project;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to fetch project",
            isLoading: false,
          });
          throw error;
        }
      },

      scrapeWebsite: async (websiteUrl: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post(
            "/projects/scrape-website",
            {
              websiteUrl,
            }
          );
          set({ isLoading: false });
          return response.data;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to scrape website",
            isLoading: false,
          });
          throw error;
        }
      },

      createProject: async (projectData) => {
        set({ isLoading: true, error: null });
        try {
          const formData = new FormData();
          formData.append("name", projectData.name);
          if (projectData.description) {
            formData.append("description", projectData.description);
          }
          if (projectData.websiteUrl) {
            formData.append("websiteUrl", projectData.websiteUrl);
          }
          if (projectData.scrapedPages) {
            formData.append(
              "scrapedPages",
              JSON.stringify(projectData.scrapedPages)
            );
          }
          console.log("projectData.avatar", projectData.avatar);

          // Handle avatar data
          if (projectData.avatar.type === "custom" && projectData.avatar.file) {
            // For custom avatar, append the file
            formData.append("image", projectData.avatar.file);
            formData.append("avatar", JSON.stringify({ type: "custom" }));
          } else if (
            projectData.avatar.type === "predefined" &&
            projectData.avatar.id
          ) {
            // For predefined avatar
            formData.append(
              "avatar",
              JSON.stringify({
                type: "predefined",
                avatarId: projectData.avatar.id,
              })
            );
          }

          const response = await axiosInstance.post("/projects", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          const newProject = response.data;
          set((state) => ({
            projects: [...state.projects, newProject],
            isLoading: false,
          }));
          return newProject;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to create project",
            isLoading: false,
          });
          throw error;
        }
      },

      updateProject: async (id: string, projectData: Partial<Project>) => {
        set({ isLoading: true, error: null });
        try {
          const formData = new FormData();

          // Append basic fields if they exist
          if (projectData.name) formData.append("name", projectData.name);
          if (projectData.description)
            formData.append("description", projectData.description);
          if (projectData.websiteUrl)
            formData.append("websiteUrl", projectData.websiteUrl);
          if (projectData.scrapedPages) {
            formData.append(
              "scrapedPages",
              JSON.stringify(projectData.scrapedPages)
            );
          }

          // Handle avatar data if it exists
          if (projectData.avatar) {
            if (
              projectData.avatar.type === "custom" &&
              projectData.avatar.file
            ) {
              formData.append("image", projectData.avatar.file);
              formData.append("avatar", JSON.stringify({ type: "custom" }));
            } else if (
              projectData.avatar.type === "predefined" &&
              projectData.avatar.id
            ) {
              formData.append(
                "avatar",
                JSON.stringify({
                  type: "predefined",
                  avatarId: projectData.avatar.id,
                })
              );
            }
          }

          const response = await axiosInstance.put(
            `/projects/${id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          const updatedProject = response.data;
          set((state) => ({
            projects: state.projects.map((p) =>
              p._id === id ? updatedProject : p
            ),
            selectedProject:
              state.selectedProject?._id === id
                ? updatedProject
                : state.selectedProject,
            isLoading: false,
          }));
          return updatedProject;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to update project",
            isLoading: false,
          });
          throw error;
        }
      },

      deleteProject: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await axiosInstance.delete(`/projects/${id}`);
          set((state) => ({
            projects: state.projects.filter((p) => p._id !== id),
            selectedProject:
              state.selectedProject?._id === id ? null : state.selectedProject,
            isLoading: false,
          }));
        } catch (error: any) {
          set({
            error: error.response?.data?.message || "Failed to delete project",
            isLoading: false,
          });
          throw error;
        }
      },

      updateSelectedPages: async (id, selectedPages) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.put(`/projects/${id}/pages`, {
            selectedPages,
          });
          const updatedProject = response.data;
          set((state) => ({
            projects: state.projects.map((p) =>
              p._id === id ? updatedProject : p
            ),
            isLoading: false,
          }));
          return updatedProject;
        } catch (error: any) {
          set({
            error:
              error.response?.data?.message ||
              "Failed to update selected pages",
            isLoading: false,
          });
          throw error;
        }
      },

      getConfiguration: async (projectId) => {
        set({ isLoading: true, error: null });
        console.log("projectId", projectId);
        try {
          const response = await axiosInstance.get(
            `/projects/${projectId}/configuration`
          );
          set({ isLoading: false });
          return response.data;
        } catch (error: any) {
          set({
            error:
              error.response?.data?.message || "Failed to get configuration",
            isLoading: false,
          });
          throw error;
        }
      },

      updateConfiguration: async (projectId, configData) => {
        set({ isLoading: true, error: null });
        console.log("configData", configData);
        try {
          const response = await axiosInstance.put(
            `/projects/${projectId}/configuration`,
            configData
          );
          set((state) => ({
            projects: state.projects.map((p) =>
              p._id === projectId ? { ...p, configuration: response.data } : p
            ),
            isLoading: false,
          }));
          return response.data;
        } catch (error: any) {
          set({
            error:
              error.response?.data?.message || "Failed to update configuration",
            isLoading: false,
          });
          throw error;
        }
      },

      resetConfiguration: async (projectId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post(
            `/projects/${projectId}/configuration/reset`
          );
          set((state) => ({
            projects: state.projects.map((p) =>
              p._id === projectId ? { ...p, configuration: response.data } : p
            ),
            isLoading: false,
          }));
          return response.data;
        } catch (error: any) {
          set({
            error:
              error.response?.data?.message || "Failed to reset configuration",
            isLoading: false,
          });
          throw error;
        }
      },

      updateProjectAvatar: async (projectId, avatarId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.put(
            `/projects/${projectId}/avatar`,
            { avatarId }
          );
          const updatedProject = response.data;
          set((state) => ({
            projects: state.projects.map((p) =>
              p._id === projectId ? updatedProject : p
            ),
            isLoading: false,
          }));
          return updatedProject;
        } catch (error: any) {
          set({
            error:
              error.response?.data?.message ||
              "Failed to update project avatar",
            isLoading: false,
          });
          throw error;
        }
      },

      resetProjectAvatar: async (projectId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post(
            `/projects/${projectId}/avatar/reset`
          );
          const updatedProject = response.data;
          set((state) => ({
            projects: state.projects.map((p) =>
              p._id === projectId ? updatedProject : p
            ),
            isLoading: false,
          }));
          return updatedProject;
        } catch (error: any) {
          set({
            error:
              error.response?.data?.message || "Failed to reset project avatar",
            isLoading: false,
          });
          throw error;
        }
      },

      setSelectedProject: (project) => set({ selectedProject: project }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "project-storage",
      storage: typeof window !== "undefined" ? sessionStorage : undefined,
      partialize: (state) => ({
        projects: state.projects,
        selectedProject: state.selectedProject,
      }),
    }
  )
);

export default useProjectStore;

