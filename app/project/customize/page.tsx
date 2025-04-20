"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProjectLayout from "@/components/layouts/ProjectLayout";
import {
  MessageCircle,
  Upload,
  X,
  Send,
  Plus,
  Check,
  Trash2,
  Settings,
  Palette,
  User,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from "lucide-react";
import { HexColorPicker } from "react-colorful";
import useProjectStore from "@/store/useProjectStore";
import useAvatarStore from "@/store/useAvatarStore";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface SampleQuestion {
  id: string;
  label: string;
  question: string;
}

// Add enum to match backend
enum LauncherIcon {
  CHAT = "CHAT",
  HELP = "HELP",
  MESSAGE = "MESSAGE",
}

// Update interface to use enum
interface Appearance {
  mainColor: string;
  launcherIcon: LauncherIcon;
  customIconUrl?: string;
}

interface Configuration {
  welcomeMessage: string;
  sampleQuestions: string[];
  appearance: Appearance;
}

const tabs = [
  {
    id: "content",
    title: "Content",
    description: "Configure welcome message and sample questions",
    icon: Settings,
  },
  {
    id: "appearance",
    title: "Appearance",
    description: "Customize the look and feel of your chat widget",
    icon: Palette,
  },
  {
    id: "avatar",
    title: "Avatar",
    description: "Choose or upload your AI assistant's avatar",
    icon: User,
  },
];

// Update default launcher icons to use enum values
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

export default function CustomizePage() {
  const { toast } = useToast();
  const {
    selectedProject,
    getProjectById,
    getConfiguration,
    updateConfiguration,
    updateProjectAvatar,
  } = useProjectStore();
  const { avatars, fetchAvatars } = useAvatarStore();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Hello! How can I assist you today?"
  );
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [sampleQuestions, setSampleQuestions] = useState<string[]>([]);
  const [activeLabels, setActiveLabels] = useState<string[]>([]);
  const [selectedLauncherIcon, setSelectedLauncherIcon] = useState(
    defaultLauncherIcons[0]
  );
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [appearance, setAppearance] = useState<Appearance>({
    mainColor: "#3498db",
    launcherIcon: LauncherIcon.CHAT,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add a new state to track if the initial data has been loaded
  const [isInitialized, setIsInitialized] = useState(false);

  // Modify the initialization useEffect
  useEffect(() => {
    const initializeProject = async () => {
      if (!selectedProject?._id) return;

      try {
        // Get fresh project data and configuration
        await getProjectById(selectedProject._id);
        const config = await getConfiguration(selectedProject._id);

        // Update local state with configuration
        setWelcomeMessage(
          config.welcomeMessage || "Hello! How can I assist you today?"
        );
        setSampleQuestions(config.sampleQuestions || []);
        setAppearance({
          mainColor: config.appearance?.mainColor || "#3498db",
          launcherIcon: config.appearance?.launcherIcon || LauncherIcon.CHAT,
          customIconUrl: config.appearance?.customIconUrl,
        });
        if (config.avatar) {
          setSelectedAvatar(config.avatar);
        }

        // Mark as initialized after setting all states
        setIsInitialized(true);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load project configuration",
          variant: "destructive",
        });
      }
    };

    initializeProject();
  }, [selectedProject?._id, getProjectById, getConfiguration, toast]);

  useEffect(() => {
    fetchAvatars();
  }, []);

  // Update configuration handler to properly format data
  const handleConfigurationUpdate = async () => {
    if (!selectedProject?._id) return;

    try {
      // Ensure hex color is properly formatted
      const formattedColor = appearance.mainColor.toUpperCase();

      // Create appearance object with conditional customIconUrl
      const formattedAppearance: Appearance = {
        mainColor: formattedColor,
        launcherIcon: appearance.launcherIcon,
        ...(appearance.launcherIcon === LauncherIcon.CUSTOM &&
        appearance.customIconUrl
          ? { customIconUrl: appearance.customIconUrl }
          : {}),
      };

      await updateConfiguration(selectedProject._id, {
        welcomeMessage,
        sampleQuestions,
        appearance: formattedAppearance,
      });

      toast({
        title: "Success",
        description: "Configuration updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update configuration",
        variant: "destructive",
      });
    }
  };

  // Modify the debounced auto-save effect to only run after initialization
  // useEffect(() => {
  //   if (!selectedProject?._id || !isInitialized) return;

  //   const saveTimeout = setTimeout(() => {
  //     handleConfigurationUpdate();
  //   }, 1000);

  //   return () => clearTimeout(saveTimeout);
  // }, [welcomeMessage, sampleQuestions, appearance, isInitialized]);

  // Update color picker handler to ensure proper hex format
  const handleColorChange = (color: string) => {
    // Ensure color is a valid 6-digit hex
    const validHex = color.match(/^#[0-9A-Fa-f]{6}$/);
    if (validHex) {
      setAppearance((prev) => ({ ...prev, mainColor: color.toUpperCase() }));
    }
  };

  // Update launcher icon selection
  const handleLauncherIconSelect = (iconId: LauncherIcon) => {
    setAppearance((prev) => ({
      ...prev,
      launcherIcon: iconId,
      // Remove customIconUrl if not using custom icon
      customIconUrl:
        iconId === LauncherIcon.CUSTOM ? prev.customIconUrl : undefined,
    }));
  };

  // Add a check for selectedProject
  if (!selectedProject) {
    return (
      <ProjectLayout>
        <div className="h-[calc(100vh-2rem)] flex items-center justify-center">
          <p className="text-gray-500">No project selected</p>
        </div>
      </ProjectLayout>
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Thank you for your message! I'll help you with that.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleAddSampleQuestion = () => {
    setSampleQuestions([...sampleQuestions, ""]);
  };

  const handleRemoveSampleQuestion = (id: string) => {
    setSampleQuestions(sampleQuestions.filter((q) => q !== id));
    setActiveLabels(
      activeLabels.filter(
        (label) => !sampleQuestions.find((q) => q === label)?.includes(label)
      )
    );
  };

  const handleUpdateSampleQuestion = (
    id: string,
    field: "label" | "question",
    value: string
  ) => {
    setSampleQuestions(sampleQuestions.map((q) => (q === id ? value : q)));
  };

  const handleLabelClick = (question: string) => {
    setInputMessage(question);
    setActiveLabels([]);
  };

  const handleFileUpload = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click();
    ref.current?.addEventListener("change", (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setCustomAvatar(result);
          setSelectedAvatar(result);
          toast({
            title: "Avatar updated",
            description: "Your custom avatar has been successfully uploaded.",
          });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Add handler for avatar selection
  const handleAvatarSelect = async (avatar: any) => {
    if (!selectedProject?._id) return;

    try {
      setSelectedAvatar(avatar);
      await updateProjectAvatar(selectedProject._id, avatar._id);

      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update avatar",
        variant: "destructive",
      });
      // Revert selection on error
      setSelectedAvatar(selectedProject.avatar || avatars[0]);
    }
  };

  const renderTabContent = (tabId: string) => {
    switch (tabId) {
      case "content":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div>
              <Label>Welcome message</Label>
              <Input
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                placeholder="Enter welcome message"
              />
            </div>

            <div className="space-y-4">
              <Label>Sample Questions</Label>
              {sampleQuestions.map((q, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Question"
                        value={q}
                        onChange={(e) =>
                          handleUpdateSampleQuestion(
                            q,
                            "question",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSampleQuestion(q)}
                      className="shrink-0"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                onClick={handleAddSampleQuestion}
                variant="outline"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Sample Question
              </Button>
            </div>
          </motion.div>
        );
      case "appearance":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div>
              <Label>Main Color</Label>
              <div className="flex items-center gap-4 mt-2">
                <HexColorPicker
                  color={appearance.mainColor}
                  onChange={(color) => handleColorChange(color)}
                />
                <Input
                  value={appearance.mainColor.toUpperCase()}
                  onChange={(e) =>
                    setAppearance((prev) => ({
                      ...prev,
                      mainColor: e.target.value,
                    }))
                  }
                  className="w-32 uppercase"
                />
              </div>
            </div>

            <div>
              <Label>Launcher Icon</Label>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {defaultLauncherIcons.map((icon) => (
                  <div
                    key={icon.id}
                    className={`relative aspect-square rounded-lg border-2 cursor-pointer transition-all ${
                      appearance.launcherIcon === icon.id
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:border-primary/50"
                    }`}
                    onClick={() => handleLauncherIconSelect(icon.id)}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: appearance.mainColor }}
                      >
                        {icon.icon}
                      </div>
                    </div>
                    {appearance.launcherIcon === icon.id && (
                      <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );
      case "avatar":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Select your AI Avatar
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {[...avatars, customAvatar]
                .filter(Boolean)
                .map((avatar, index) => (
                  <div
                    key={avatar._id || index}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer ${
                      selectedAvatar?._id === avatar._id
                        ? "ring-2 ring-primary"
                        : ""
                    }`}
                    onClick={() => handleAvatarSelect(avatar)}
                  >
                    <Image
                      src={avatar.imageUrl || "/placeholder.svg"}
                      alt={`Avatar ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                    />
                    {selectedAvatar?._id === avatar._id && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <Check className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              <div
                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleFileUpload(fileInputRef)}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Handle custom avatar upload here
                      // You might need to implement a separate function for this
                      // as it requires different handling than predefined avatars
                    }
                  }}
                />
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <ProjectLayout>
      <div className="h-[calc(100vh-2rem)] flex gap-6 overflow-hidden">
        {/* Left Panel - Collapsible Tabs */}
        <div className="w-80 bg-white rounded-lg shadow-sm overflow-hidden flex-shrink-0">
          <div className="flex flex-col">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className="border-b border-gray-200 last:border-b-0"
              >
                <button
                  onClick={() =>
                    setActiveTab(activeTab === tab.id ? null : tab.id)
                  }
                  className="flex items-center justify-between w-full p-4 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <tab.icon
                      className={`h-5 w-5 ${
                        activeTab === tab.id ? "text-primary" : "text-gray-400"
                      }`}
                    />
                    <div>
                      <h3
                        className={`font-medium ${
                          activeTab === tab.id
                            ? "text-primary"
                            : "text-gray-900"
                        }`}
                      >
                        {tab.title}
                      </h3>
                      <p className="text-sm text-gray-500">{tab.description}</p>
                    </div>
                  </div>
                  {activeTab === tab.id ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
                <AnimatePresence>
                  {activeTab === tab.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 bg-gray-50">
                        {renderTabContent(tab.id)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Chat Preview */}
        <div className="flex-1 bg-gray-100 rounded-lg relative overflow-hidden flex items-center justify-center">
          <div className="w-[400px] h-[600px] bg-white rounded-lg shadow-xl relative overflow-hidden">
            {/* Chat Widget */}
            <AnimatePresence>
              {isChatOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute inset-0 flex flex-col"
                >
                  {/* Chat Header */}
                  <div className="relative h-48 bg-gray-900">
                    <button
                      onClick={() => setIsChatOpen(false)}
                      className="absolute right-4 top-4 z-10 h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <Image
                      src={selectedAvatar.imageUrl || "/placeholder.svg"}
                      alt="AI Assistant"
                      layout="fill"
                      objectFit="cover"
                      className="opacity-90"
                    />
                  </div>

                  {/* Chat Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                        {welcomeMessage}
                      </div>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${
                            message.sender === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`rounded-lg p-3 max-w-[80%] ${
                              message.sender === "user"
                                ? "text-white"
                                : "bg-gray-100"
                            }`}
                            style={
                              message.sender === "user"
                                ? { backgroundColor: appearance.mainColor }
                                : undefined
                            }
                          >
                            {message.content}
                          </div>
                        </motion.div>
                      ))}
                      {isTyping && (
                        <div className="flex gap-2 p-3 bg-gray-100 rounded-lg w-16">
                          <motion.div
                            animate={{ y: [0, -3, 0] }}
                            transition={{
                              repeat: Number.POSITIVE_INFINITY,
                              duration: 0.5,
                            }}
                            className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                          />
                          <motion.div
                            animate={{ y: [0, -3, 0] }}
                            transition={{
                              repeat: Number.POSITIVE_INFINITY,
                              duration: 0.5,
                              delay: 0.1,
                            }}
                            className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                          />
                          <motion.div
                            animate={{ y: [0, -3, 0] }}
                            transition={{
                              repeat: Number.POSITIVE_INFINITY,
                              duration: 0.5,
                              delay: 0.2,
                            }}
                            className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                          />
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Sample Question Labels */}
                  {sampleQuestions.length > 0 && (
                    <div className="px-4 py-2 border-t border-gray-100 flex gap-2 flex-wrap">
                      {sampleQuestions.map(
                        (q) =>
                          q && (
                            <Button
                              key={q}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => handleLabelClick(q)}
                            >
                              {q}
                            </Button>
                          )
                      )}
                    </div>
                  )}

                  {/* Chat Input */}
                  <div className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        style={{ backgroundColor: appearance.mainColor }}
                      >
                        <Send className="h-4 w-4 text-white" />
                      </Button>
                    </form>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute bottom-6 right-6"
                  style={{ zIndex: 50 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsChatOpen(true)}
                    className="h-14 w-14 rounded-full shadow-lg flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: appearance.mainColor }}
                  >
                    {selectedLauncherIcon.icon}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </ProjectLayout>
  );
}

