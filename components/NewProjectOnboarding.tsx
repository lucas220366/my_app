"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Upload,
  Loader,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import useProjectStore from "@/store/useProjectStore";
import useAvatarStore, { Avatar } from "@/store/useAvatarStore";

interface Step {
  number: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
}

interface CrawledPage {
  url: string;
  content: string;
}

interface NewProjectOnboardingProps {
  onComplete: (
    projectName: string,
    websiteUrl: string,
    crawledPages: CrawledPage[],
    avatar: {
      type: string;
      file?: File;
      avatarId?: string;
    }
  ) => void;
}

function isValidUrl(url: string) {
  try {
    new URL(url.startsWith("http") ? url : `https://${url}`);
    return true;
  } catch (e) {
    return false;
  }
}

export default function NewProjectOnboarding({
  onComplete,
}: NewProjectOnboardingProps) {
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [scrapedPages, setScrapedPages] = useState<
    Array<{ url: string; selected: boolean; content: string }>
  >([]);
  const [selectedAvatar, setSelectedAvatar] = useState<
    Avatar | { type: string; file?: File; id?: string } | null
  >(null);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingPageContent, setViewingPageContent] =
    useState<CrawledPage | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlError, setUrlError] = useState("");
  const { scrapeWebsite } = useProjectStore();
  const [isLoading, setIsLoading] = useState(false);
  const { avatars, isLoading: avatarsLoading, fetchAvatars } = useAvatarStore();
  const [currentAvatarPage, setCurrentAvatarPage] = useState(1);
  const avatarsPerPage = 4;

  const steps: Step[] = [
    {
      number: 1,
      title: "Project Details",
      isActive: step === 1,
      isCompleted: step > 1,
    },
    {
      number: 2,
      title: "Website Crawling",
      isActive: step === 2,
      isCompleted: step > 2,
    },
    {
      number: 3,
      title: "Select Avatar",
      isActive: step === 3,
      isCompleted: step > 3,
    },
  ];

  const handleNext = async () => {
    if (step === 1) {
      if (!projectName.trim()) {
        toast({
          title: "Please fill in all fields",
          description: "Project name is required.",
          variant: "destructive",
        });
        return;
      }
      if (!isValidUrl(websiteUrl)) {
        setUrlError("Please enter a valid URL");
        return;
      }
      setUrlError("");
      setStep(2);
      // Start crawling immediately when moving to step 2
      await handleWebsiteUrlSubmit();
    } else if (step === 2) {
      if (scrapedPages.length === 0) {
        toast({
          title: "No pages crawled",
          description: "Please wait for the crawling process to complete.",
          variant: "destructive",
        });
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!selectedAvatar) {
        toast({
          title: "Please select an avatar",
          description: "You must choose or upload an avatar before proceeding.",
          variant: "destructive",
        });
        return;
      }
      handleComplete();
    }
  };

  const handleWebsiteUrlSubmit = async () => {
    if (!websiteUrl) return;

    setIsLoading(true);
    try {
      const { scrapedPages: pages } = await scrapeWebsite(websiteUrl);
      setScrapedPages(pages);
      console.log("HUHUHUHU", pages);

      // Remove the automatic step advancement
      // setStep(3); // This line should be removed
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to scrape website",
        variant: "destructive",
      });
      // Optionally, go back to step 1 on error
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    if (!selectedAvatar) return;

    const crawledPages: CrawledPage[] = scrapedPages.map((page) => ({
      url: page.url,
      content: page.content || "",
    }));

    // Pass the avatar data based on type
    if (selectedAvatar.type === "custom" && "file" in selectedAvatar) {
      console.log("selectedAvatar FILE", selectedAvatar);

      onComplete(projectName, websiteUrl, crawledPages, {
        type: "custom",
        file: selectedAvatar.file,
      });
    } else if (selectedAvatar.type === "predefined" && "id" in selectedAvatar) {
      console.log("selectedAvatar PREDEFINED 22", selectedAvatar);

      onComplete(projectName, websiteUrl, crawledPages, {
        type: "predefined",
        avatarId: selectedAvatar.id,
      });
    }
  };

  const handleAvatarSelect = (avatarId: string) => {
    const avatar = avatars.find((a) => a._id === avatarId);
    if (avatar) {
      console.log("PREDEFINED AVATAR SELECTED", avatar);

      setSelectedAvatar({
        type: "predefined",
        id: avatar._id,
      });
      setCustomAvatar(null);
    }
  };

  const handleCustomAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the actual file for later upload
      setSelectedAvatar({
        type: "custom",
        file: file,
      });

      // Create preview URL for display
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          setCustomAvatar(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleRemovePage = (url: string) => {
    setScrapedPages(scrapedPages.filter((page) => page.url !== url));
  };

  const totalPages = Math.ceil(scrapedPages.length / 4);
  const paginatedPages = scrapedPages.slice(
    (currentPage - 1) * 4,
    currentPage * 4
  );

  const handleWebsiteUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setWebsiteUrl(url);
    if (url && !isValidUrl(url)) {
      setUrlError("Please enter a valid URL");
    } else {
      setUrlError("");
    }
  };

  const getCurrentAvatars = () => {
    const startIndex = (currentAvatarPage - 1) * avatarsPerPage;
    const endIndex = startIndex + avatarsPerPage;
    return avatars.slice(startIndex, endIndex);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4 md:p-6">
      {/* Progress Steps */}
      <div className="mb-8 md:mb-12">
        <div className="flex justify-between items-center relative mb-4 md:mb-8">
          {/* Progress Line */}
          <div className="absolute h-[2px] bg-gray-200 left-0 right-0 top-4 sm:top-5 -z-10" />
          <div
            className="absolute h-[2px] bg-primary left-0 top-4 sm:top-5 -z-10 transition-all duration-300"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          />

          {/* Steps */}
          {steps.map((s, index) => (
            <div key={s.number} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-lg font-semibold mb-1 sm:mb-2
                  ${
                    s.isActive
                      ? "bg-primary text-white"
                      : s.isCompleted
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
              >
                {s.isCompleted ? (
                  <Check size={16} className="sm:w-5 sm:h-5" />
                ) : (
                  s.number
                )}
              </div>
              <span
                className={`text-xs sm:text-sm font-medium text-center ${
                  s.isActive ? "text-primary" : "text-gray-500"
                }`}
              >
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3 sm:space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Project Details
            </h2>
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter your project name"
                className="text-base sm:text-lg p-4 sm:p-6"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                value={websiteUrl}
                onChange={handleWebsiteUrlChange}
                placeholder="example.com"
                className={`text-base sm:text-lg p-4 sm:p-6 ${
                  urlError ? "border-red-500" : ""
                }`}
              />
              {urlError && (
                <p className="text-red-500 text-sm mt-1">{urlError}</p>
              )}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3 sm:space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Website Crawling
            </h2>
            {isLoading ? (
              <div className="text-center space-y-3 sm:space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="inline-block"
                >
                  <Loader className="w-12 h-12 text-primary" />
                </motion.div>
                <p className="mt-4 text-lg">
                  Scanning your website... This may take some time based on the
                  amount of data...
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                <p className="text-base sm:text-lg">
                  Total pages crawled: {scrapedPages.length}
                </p>
                <div className="grid gap-2">
                  {paginatedPages.map((page) => (
                    <div
                      key={page.url}
                      className="flex items-center justify-between bg-gray-100 p-2 rounded text-sm sm:text-base"
                    >
                      <span className="truncate flex-1 mr-2">{page.url}</span>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setViewingPageContent({
                              url: page.url,
                              content: page.content || "No content available",
                            })
                          }
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePage(page.url)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Select your AI Avatar
            </h2>
            <div className="relative">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-0 z-10"
                  onClick={() =>
                    setCurrentAvatarPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentAvatarPage === 1}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <div className="overflow-hidden mx-8">
                  <div className="flex gap-4">
                    {getCurrentAvatars().map((avatar) => (
                      <motion.div
                        key={avatar._id}
                        className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all flex-shrink-0 w-[200px] ${
                          selectedAvatar?.type === "predefined" &&
                          selectedAvatar?.id === avatar._id &&
                          !customAvatar
                            ? "border-primary bg-primary/10"
                            : "border-gray-200 hover:border-primary/50"
                        }`}
                        onClick={() => handleAvatarSelect(avatar._id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img
                          src={avatar.imageUrl || "/placeholder.svg"}
                          alt={`Avatar ${avatar._id}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        {selectedAvatar?.type === "predefined" &&
                          selectedAvatar?.id === avatar._id &&
                          !customAvatar && (
                            <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                              <Check size={16} />
                            </div>
                          )}
                      </motion.div>
                    ))}

                    {currentAvatarPage ===
                      Math.ceil(avatars.length / avatarsPerPage) && (
                      <motion.div
                        className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all flex-shrink-0 w-[200px] ${
                          customAvatar
                            ? "border-primary bg-primary/10"
                            : "border-gray-200 hover:border-primary/50"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleCustomAvatarUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        {customAvatar ? (
                          <div className="relative">
                            <img
                              src={customAvatar || "/placeholder.svg"}
                              alt="Custom Avatar"
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                              <Check size={16} />
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-32 bg-gray-100 rounded-lg">
                            <Upload size={24} className="mb-2 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              Upload Custom
                            </span>
                          </div>
                        )}
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          variant="outline"
                          className="mt-2 w-full"
                        >
                          {customAvatar ? "Change Avatar" : "Upload Avatar"}
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 z-10"
                  onClick={() =>
                    setCurrentAvatarPage((prev) =>
                      Math.min(
                        prev + 1,
                        Math.ceil((avatars.length + 1) / avatarsPerPage)
                      )
                    )
                  }
                  disabled={
                    currentAvatarPage ===
                    Math.ceil((avatars.length + 1) / avatarsPerPage)
                  }
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>

              <div className="flex justify-center mt-4 gap-1">
                {Array.from({
                  length: Math.ceil((avatars.length + 1) / avatarsPerPage),
                }).map((_, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    size="sm"
                    className={`w-2 h-2 p-0 rounded-full ${
                      currentAvatarPage === idx + 1
                        ? "bg-primary"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setCurrentAvatarPage(idx + 1)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="mt-6 sm:mt-8 flex justify-between gap-2">
        {step > 1 && (
          <Button
            onClick={handleBack}
            variant="outline"
            className="px-3 sm:px-6"
          >
            <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Back
          </Button>
        )}
        <Button
          onClick={handleNext}
          className="ml-auto bg-primary hover:bg-primary/90 text-white px-3 sm:px-6"
          disabled={isLoading}
        >
          {step === 3 ? "Create Project" : "Continue"}
          <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>

      {/* View Page Content Dialog */}
      <Dialog
        open={!!viewingPageContent}
        onOpenChange={() => setViewingPageContent(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Page Content</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] mt-4">
            <h3 className="font-semibold mb-2">{viewingPageContent?.url}</h3>
            <p className="whitespace-pre-wrap">{viewingPageContent?.content}</p>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

