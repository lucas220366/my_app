"use client";

import type React from "react";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Download,
  Eye,
  SpadeIcon as Spa,
  X,
  Copy,
  Check,
  SmileIcon as Tooth,
  Wrench,
  ChefHat,
  Dumbbell,
  Home,
  Cake,
  TreesIcon as Tree,
  Car,
  Zap,
  Camera,
  GraduationCap,
  Wand2,
} from "lucide-react";
import Image from "next/image";
import UserLayout from "@/components/layouts/UserLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles } from "lucide-react";
import useAvatarStore, { Avatar as AvatarType } from "@/store/useAvatarStore";

const localExperts = [
  { name: "Dental Expert", icon: Tooth },
  { name: "Plumbing Expert", icon: Wrench },
  { name: "Spa Expert", icon: Spa },
  { name: "Chef", icon: ChefHat },
  { name: "Fitness Trainer", icon: Dumbbell },
  { name: "Real Estate Agent", icon: Home },
  { name: "Wedding Planner", icon: Cake },
  { name: "Landscaper", icon: Tree },
  { name: "Auto Mechanic", icon: Car },
  { name: "Electrician", icon: Zap },
  { name: "Photographer", icon: Camera },
  { name: "Tutor", icon: GraduationCap },
];

export default function AIAvatarsPage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [isCopying, setIsCopying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const {
    avatars,
    isLoading: avatarsLoading,
    fetchAvatars,
    createAvatar,
  } = useAvatarStore();

  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAvatars();
  }, [fetchAvatars]);

  const handleGenerateAvatar = useCallback(async () => {
    if (!prompt) return;

    setIsGenerating(true);
    try {
      const newAvatar = await createAvatar({
        name: prompt,
        prompt: prompt,
        referenceImage: referenceImage,
      });

      // Reset reference image and prompt
      setReferenceImage(null);
      setPrompt("");

      // Fetch updated avatars
      await fetchAvatars();
    } catch (error) {
      console.error("Error generating avatar:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, referenceImage, createAvatar, fetchAvatars]);

  const handleExpertSelect = useCallback((expertName: string) => {
    setPrompt(
      `Generate a professional avatar for a ${expertName.toLowerCase()} that conveys expertise and trustworthiness.`
    );
    setIsExpertModalOpen(false);
  }, []);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setReferenceImage(e.target?.result as string);
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const handleCopyPrompt = useCallback(() => {
    setIsCopying(true);
    navigator.clipboard.writeText(selectedPrompt).then(() => {
      setTimeout(() => {
        setIsCopying(false);
        setIsPromptModalOpen(false);
      }, 1500);
    });
  }, [selectedPrompt]);

  const handleUsePrompt = useCallback(() => {
    setPrompt(selectedPrompt);
    setIsPromptModalOpen(false);
  }, [selectedPrompt]);

  const handleDownload = useCallback((imageUrl: string) => {
    setIsDownloading(true);
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "avatar.png";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setTimeout(() => {
          setIsDownloading(false);
        }, 1500);
      });
  }, []);

  return (
    <UserLayout>
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text-primary">
            AI Avatar Generator
          </h1>
          <p className="text-base text-text-secondary">
            Create unique avatars for your project using AI or use one of the
            existing ones
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <div className="flex gap-8">
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="prompt"
                  className="text-lg font-medium text-text-primary"
                >
                  Describe your avatar
                </label>
                <Textarea
                  id="prompt"
                  placeholder="E.g., A professional dentist avatar with a warm smile"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[150px] text-lg rounded-xl border-gray-300 focus:border-primary focus:ring-primary"
                />
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setIsExpertModalOpen(true)}
                  className="bg-white text-primary hover:bg-primary/10 border border-primary rounded-full px-6 py-2 text-lg font-medium transition-all duration-300"
                >
                  <Wand2 className="mr-2 h-5 w-5" />
                  Select Prompt
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="rounded-full px-6 py-2 text-lg font-medium"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Reference Image
                </Button>
              </div>
            </div>
            {referenceImage && (
              <div className="relative w-64 h-64">
                <Image
                  src={referenceImage || "/placeholder.svg"}
                  alt="Reference"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-xl"
                />
                <button
                  onClick={() => setReferenceImage(null)}
                  className="absolute top-2 right-2 bg-white rounded-full p-1"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            )}
          </div>
          <Button
            onClick={handleGenerateAvatar}
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-full py-3 text-xl font-medium transition-all duration-300"
            disabled={isGenerating || !prompt}
          >
            {isGenerating ? "Generating Avatar..." : "Generate Avatar"}
          </Button>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-semibold text-text-primary">
            Your Avatars
          </h2>
          <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <AnimatePresence>
              {avatars.map((avatar, index) => (
                <motion.div
                  key={`${avatar._id} + ${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className="relative overflow-hidden rounded-xl shadow-lg"
                >
                  <div className="aspect-square relative w-full max-w-[200px] mx-auto">
                    {avatar.imageUrl ? (
                      <Image
                        src={avatar.imageUrl || "/placeholder.svg"}
                        alt={avatar.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                        <div className="w-16 h-16 relative">
                          <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
                          <div className="absolute inset-0 bg-primary rounded-full animate-pulse"></div>
                          <Sparkles className="absolute inset-0 m-auto text-white w-8 h-8" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center gap-4 p-4">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full bg-white text-primary hover:bg-white/90"
                      onClick={() => handleDownload(avatar.imageUrl)}
                      disabled={isDownloading}
                    >
                      {isDownloading ? (
                        <motion.div
                          initial={{ rotate: 0 }}
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full bg-white text-primary hover:bg-white/90"
                      onClick={() => {
                        setSelectedPrompt(avatar.name);
                        setIsPromptModalOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Dialog open={isExpertModalOpen} onOpenChange={setIsExpertModalOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Choose an Expert Prompt
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[500px] pr-4">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {localExperts.map((expert) => (
                <motion.button
                  key={expert.name}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-col items-center justify-center space-y-2 p-4 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={() => handleExpertSelect(expert.name)}
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <expert.icon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="text-lg font-medium text-center">
                    {expert.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={isPromptModalOpen} onOpenChange={setIsPromptModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Avatar Prompt
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-lg">{selectedPrompt}</p>
          </div>
          <DialogFooter className="flex justify-between mt-6">
            <Button
              onClick={handleCopyPrompt}
              className="rounded-full px-6 py-2"
              disabled={isCopying}
            >
              {isCopying ? (
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <Check className="h-5 w-5" />
                </motion.div>
              ) : (
                <>
                  <Copy className="mr-2 h-5 w-5" />
                  Copy
                </>
              )}
            </Button>
            <Button
              onClick={handleUsePrompt}
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-2"
            >
              <Check className="mr-2 h-5 w-5" />
              Use Prompt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </UserLayout>
  );
}

