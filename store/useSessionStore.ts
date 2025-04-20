import { create } from "zustand";
import axiosInstance from "@/lib/axios";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  messageId: string;
}

interface ChatSession {
  _id: string;
  project: string;
  threadId: string;
  assistantId: string;
  startedAt: Date;
  status: "active" | "completed" | "abandoned";
  messagesCount: number;
  messages: Message[];
}

interface SessionStats {
  totalSessions: number;
  averageDuration: number;
  totalMessages: number;
  completedSessions: number;
  abandonedSessions: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface SessionFilters {
  startDate?: string;
  endDate?: string;
  status?: string;
  page?: number;
  limit?: number;
}

interface SendMessageResponse {
  assistantResponse: {
    role: "assistant";
    content: string;
    timestamp: Date;
    messageId: string;
  };
}

interface SessionState {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  stats: SessionStats | null;
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSessions: (projectId: string, filters?: SessionFilters) => Promise<void>;
  fetchSessionDetails: (sessionId: string) => Promise<void>;
  fetchSessionStats: (
    projectId: string,
    dateRange?: { startDate?: string; endDate?: string }
  ) => Promise<void>;
  createSession: (projectId: string) => Promise<ChatSession>;
  sendMessage: (sessionId: string, message: string) => Promise<Message[]>;
  clearError: () => void;
}

const useSessionStore = create<SessionState>()((set, get) => ({
  sessions: [],
  currentSession: null,
  stats: null,
  pagination: null,
  isLoading: false,
  error: null,

  fetchSessions: async (projectId: string, filters?: SessionFilters) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(
        `/chat-sessions/project/${projectId}`,
        {
          params: filters,
        }
      );
      set({
        sessions: response.data.sessions,
        pagination: response.data.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch sessions",
        isLoading: false,
      });
    }
  },

  fetchSessionDetails: async (sessionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/chat-sessions/${sessionId}`);
      set({
        currentSession: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || "Failed to fetch session details",
        isLoading: false,
      });
    }
  },

  fetchSessionStats: async (projectId: string, dateRange?) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(
        `/chat-sessions/project/${projectId}/stats`,
        {
          params: dateRange,
        }
      );
      set({
        stats: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch session stats",
        isLoading: false,
      });
    }
  },

  createSession: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(
        `/chat-sessions/project/${projectId}`
      );
      const newSession = {
        ...response.data,
        messages: [], // Initialize with empty messages
      };
      set((state) => ({
        sessions: [newSession, ...state.sessions],
        currentSession: newSession,
        isLoading: false,
      }));
      return newSession;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to create session",
        isLoading: false,
      });
      throw error;
    }
  },

  sendMessage: async (sessionId: string, message: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post<SendMessageResponse>(
        `/chat-sessions/${sessionId}/messages`,
        { message }
      );

      set((state) => ({
        currentSession: state.currentSession
          ? {
              ...state.currentSession,
              messages: [
                ...state.currentSession.messages,
                response.data.assistantResponse,
              ],
              messagesCount: (state.currentSession.messagesCount || 0) + 1,
            }
          : null,
        isLoading: false,
      }));

      return [response.data.assistantResponse];
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to send message",
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

// Export the set function for direct state updates
export const { setState: setSessionState } = useSessionStore;
export default useSessionStore;

