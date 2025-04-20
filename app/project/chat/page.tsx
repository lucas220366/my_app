"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  MessageCircle,
  Calendar,
  Clock,
  ChevronRight,
  Bot,
} from "lucide-react";
import ProjectLayout from "@/components/layouts/ProjectLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import useSessionStore from "@/store/useSessionStore";
import useProjectStore from "@/store/useProjectStore";
import { useParams } from "next/navigation";

export default function ChatSessionsPage() {
  const { selectedProject } = useProjectStore();
  const projectId = selectedProject?._id;

  const {
    sessions,
    currentSession,
    isLoading,
    fetchSessions,
    fetchSessionDetails,
  } = useSessionStore();

  useEffect(() => {
    fetchSessions(projectId);
  }, [projectId, fetchSessions]);

  const handleSessionSelect = async (sessionId: string) => {
    await fetchSessionDetails(sessionId);
  };

  if (isLoading) {
    return (
      <ProjectLayout>
        <div className="h-[calc(100vh-2rem)] flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
      </ProjectLayout>
    );
  }

  return (
    <ProjectLayout>
      <div className="h-[calc(100vh-2rem)] flex flex-col lg:flex-row gap-6">
        {/* Sessions List */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full lg:w-80 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col max-h-[300px] lg:max-h-none"
        >
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Chat Sessions</h2>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              <AnimatePresence>
                {sessions.map((session) => (
                  <motion.div
                    key={session._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      currentSession?._id === session._id
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-gray-50 border-transparent"
                    } border-2`}
                    onClick={() => handleSessionSelect(session._id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            Session #{session._id.slice(-6)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {format(new Date(session.startedAt), "MMM d, yyyy")}
                          </span>
                          <Clock className="h-3 w-3 ml-2" />
                          <span>
                            {format(new Date(session.startedAt), "HH:mm")}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </motion.div>

        {/* Chat View */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col min-h-0"
        >
          {currentSession ? (
            <>
              <div className="p-4 border-b">
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold">
                    Session Details
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500">
                    Started{" "}
                    {format(
                      new Date(currentSession.startedAt),
                      "MMMM d, yyyy 'at' HH:mm"
                    )}
                  </p>
                </div>
              </div>
              <ScrollArea className="flex-1 p-2 md:p-4">
                <div className="space-y-4">
                  {[...currentSession.messages]
                    .sort(
                      (a, b) =>
                        new Date(a.timestamp).getTime() -
                        new Date(b.timestamp).getTime()
                    )
                    .map((message, index) => (
                      <motion.div
                        key={message.messageId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex items-start gap-2 md:gap-3 max-w-[90%] md:max-w-[80%] ${
                            message.role === "user" ? "flex-row-reverse" : ""
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              message.role === "user"
                                ? "bg-primary"
                                : "bg-gray-100"
                            }`}
                          >
                            {message.role === "user" ? (
                              <MessageCircle className="h-4 w-4 text-white" />
                            ) : (
                              <Bot className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <div>
                            <div
                              className={`rounded-2xl p-3 md:p-4 ${
                                message.role === "user"
                                  ? "bg-primary text-white"
                                  : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              <p className="text-sm md:text-base">
                                {message.content}
                              </p>
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                              {format(new Date(message.timestamp), "HH:mm")}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="h-full flex items-center justify-center p-4">
              <div className="text-center">
                <MessageCircle className="h-8 w-8 md:h-12 md:w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-base md:text-lg font-medium text-gray-900">
                  No Session Selected
                </h3>
                <p className="text-sm md:text-base text-gray-500">
                  Select a session from the list to view the chat history
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </ProjectLayout>
  );
}

