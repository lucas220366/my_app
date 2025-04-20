"use client";

import type React from "react";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Info, MessageCircle, Bot, HelpCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProjectLayout from "@/components/layouts/ProjectLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import useSessionStore, { setSessionState } from "@/store/useSessionStore";
import useProjectStore from "@/store/useProjectStore";

enum LauncherIcon {
  CHAT = "CHAT",
  HELP = "HELP",
  MESSAGE = "MESSAGE",
}
const defaultLauncherIcons = [
  {
    id: LauncherIcon.CHAT,
    icon: <MessageCircle className="h-6 w-6" />,
  },
  {
    id: LauncherIcon.HELP,
    icon: <HelpCircle className="h-6 w-6" />,
  },
  {
    id: LauncherIcon.MESSAGE,
    icon: <MessageCircle className="h-6 w-6 fill-current" />,
  },
];
export default function TryChatbotPage() {
  const { selectedProject, getProjectById } = useProjectStore();
  const {
    currentSession,
    isLoading: isSessionLoading,
    error: sessionError,
    createSession,
    sendMessage,
    clearError,
  } = useSessionStore();
  const [inputMessage, setInputMessage] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Initialize session and show welcome message
  useEffect(() => {
    const initSession = async () => {
      if (!currentSession && selectedProject?._id) {
        await handleCreateSession();

        // Add welcome message if configured
        if (selectedProject?.configuration?.welcomeMessage) {
          setSessionState((state) => ({
            currentSession: state.currentSession
              ? {
                  ...state.currentSession,
                  messages: [
                    {
                      messageId: `welcome-${Date.now()}`,
                      content: selectedProject.configuration.welcomeMessage,
                      role: "assistant" as const,
                      timestamp: new Date(),
                    },
                  ],
                }
              : null,
          }));
        }
      }
    };
    getProjectById(selectedProject?._id);
    initSession();
  }, [selectedProject?._id, getProjectById]);

  const handleCreateSession = async () => {
    try {
      if (!selectedProject?.assistantId) {
        throw new Error("No assistant configured for this project");
      }
      await createSession(selectedProject._id);
    } catch (error: any) {
      setLocalError(error.message);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !currentSession?._id) return;

    const userMessage = {
      messageId: `temp-${Date.now()}`,
      content: inputMessage,
      role: "user" as const,
      timestamp: new Date(),
    };

    // Immediately update UI with user message
    setSessionState((state) => ({
      currentSession: state.currentSession
        ? {
            ...state.currentSession,
            messages: [...state.currentSession.messages, userMessage],
          }
        : null,
    }));

    setInputMessage("");

    try {
      // The loading indicator will show automatically due to isLoading state
      await sendMessage(currentSession._id, userMessage.content);
    } catch (error: any) {
      setLocalError(error.message);
      // Remove the temporary message if the request fails
      setSessionState((state) => ({
        currentSession: state.currentSession
          ? {
              ...state.currentSession,
              messages: state.currentSession.messages.filter(
                (msg) => msg.messageId !== userMessage.messageId
              ),
            }
          : null,
      }));
    }
  };

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages, scrollToBottom]);

  return (
    <ProjectLayout>
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Try out chatbot
          </h1>
          <p className="text-base text-gray-500">
            Chat with your chatbot and see how it responds. If you don't get the
            desired response, follow the instructions below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chat Widget Container */}
          <div className="relative h-[600px] bg-gray-100 rounded-lg overflow-hidden">
            {/* Error Message */}
            {(sessionError || localError) && (
              <div className="absolute top-4 left-4 right-4 bg-red-50 p-3 rounded-lg text-red-700">
                <div className="flex items-center justify-between">
                  <span>{sessionError || localError}</span>
                  <button
                    onClick={() => {
                      clearError();
                      setLocalError(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Launcher Button */}
            <AnimatePresence>
              {!isChatOpen && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsChatOpen(true)}
                  className="absolute bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center"
                >
                  {
                    defaultLauncherIcons.find(
                      (icon) =>
                        icon.id === selectedProject?.appearance.launcherIcon
                    )?.icon
                  }
                </motion.button>
              )}
            </AnimatePresence>

            {/* Chat Widget */}
            <AnimatePresence>
              {isChatOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="absolute bottom-6 right-6 w-[380px] bg-white rounded-2xl shadow-2xl overflow-hidden"
                >
                  {/* Avatar Header */}
                  <div className="relative h-48 bg-gray-900">
                    <button
                      onClick={() => setIsChatOpen(false)}
                      className="absolute right-4 top-4 z-10 h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <Image
                      src={
                        selectedProject?.avatar?.imageUrl ||
                        "https://res.cloudinary.com/doaxoti6i/image/upload/v1740362205/Screenshot_2025-02-24_095544_pl9gji.png"
                      }
                      alt="AI Assistant"
                      layout="fill"
                      objectFit="cover"
                      className="opacity-90"
                    />
                  </div>

                  {/* Chat Messages */}
                  <ScrollArea ref={scrollAreaRef} className="h-[300px] p-4">
                    <div className="space-y-4">
                      {currentSession?.messages.map((message) => (
                        <motion.div
                          key={message.messageId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${
                            message.role === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl p-3 ${
                              message.role === "user"
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            {message.content}
                          </div>
                        </motion.div>
                      ))}
                      {isSessionLoading && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex justify-start"
                        >
                          <div className="bg-gray-100 rounded-2xl p-4 flex space-x-2">
                            <motion.span
                              animate={{ y: [0, -5, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: 0,
                              }}
                              className="w-2 h-2 bg-gray-400 rounded-full"
                            />
                            <motion.span
                              animate={{ y: [0, -5, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: 0.2,
                              }}
                              className="w-2 h-2 bg-gray-400 rounded-full"
                            />
                            <motion.span
                              animate={{ y: [0, -5, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: 0.4,
                              }}
                              className="w-2 h-2 bg-gray-400 rounded-full"
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Input Area */}
                  <div className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 rounded-full border-gray-200 focus:border-primary focus:ring-primary"
                        disabled={!currentSession || isSessionLoading}
                      />
                      <AnimatePresence>
                        {inputMessage.trim() && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                          >
                            <Button
                              type="submit"
                              size="icon"
                              className="bg-primary hover:bg-primary/90 rounded-full w-10 h-10 shadow-lg"
                              disabled={isSessionLoading}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Not getting correct response?
                  </h3>
                  <p className="text-gray-600">
                    It is all about the training data. Here are some ways to
                    improve the accuracy of your chatbot.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <span className="text-gray-600 font-medium">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Add more training Data
                  </h3>
                  <p className="text-gray-600">
                    The more data you add, the better the chatbot response will
                    be. You can add custom data to train in the{" "}
                    <Link
                      href="/project/train"
                      className="text-blue-600 hover:underline"
                    >
                      Train custom data
                    </Link>{" "}
                    section
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <span className="text-gray-600 font-medium">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Train Chatbot with Previous Support Questions
                  </h3>
                  <p className="text-gray-600">
                    To reduce the number of repetitive emails and inquiries,
                    make sure to train your chatbot with past support questions
                    and answers.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <span className="text-gray-600 font-medium">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Add More Knowledge Files
                  </h3>
                  <p className="text-gray-600">
                    Enhance your chatbot's knowledge base by uploading
                    additional relevant documents, FAQs, or product information.
                    This will help the chatbot provide more accurate and
                    comprehensive responses.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ProjectLayout>
  );
}

