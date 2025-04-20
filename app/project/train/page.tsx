"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Save, HelpCircle, Sparkles, X, Loader2 } from "lucide-react";
import ProjectLayout from "@/components/layouts/ProjectLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { KnowledgeFileUpload } from "@/components/KnowledgeFileUpload";
import useTrainStore from "@/store/useTrainStore";
import useProjectStore from "@/store/useProjectStore";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface TrainingStatus {
  status: "idle" | "processing" | "completed" | "failed";
  lastTrainedAt?: string;
  error?: string;
}

interface Project {
  _id: string;
  knowledgeFiles?: string[];
  // ... other project properties
}

const FAQItem = React.memo(
  ({ faq, onRemove }: { faq: FAQ; onRemove: (id: string) => void }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gray-50 p-4 rounded-xl mb-4 relative"
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2"
        onClick={() => onRemove(faq.id)}
      >
        <X className="w-4 h-4" />
      </Button>
      <h3 className="font-semibold mb-2">{faq.question}</h3>
      <p className="text-gray-600">{faq.answer}</p>
    </motion.div>
  )
);

FAQItem.displayName = "FAQItem";

const FAQForm = React.memo(
  ({ onAddFAQ }: { onAddFAQ: (question: string, answer: string) => void }) => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (question.trim() && answer.trim()) {
        onAddFAQ(question, answer);
        setQuestion("");
        setAnswer("");
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 mb-4">
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter a question..."
        />
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter the answer..."
        />
        <Button type="submit" className="w-full">
          <Plus className="w-4 h-4 mr-2" /> Add FAQ
        </Button>
      </form>
    );
  }
);

FAQForm.displayName = "FAQForm";

const FAQList = React.memo(
  ({
    faqs,
    onRemoveFAQ,
  }: {
    faqs: Array<FAQ>;
    onRemoveFAQ: (id: string) => void;
  }) => (
    <AnimatePresence mode="popLayout">
      {faqs.map((faq: FAQ, index: number) => (
        <motion.div key={`faq-${faq.id}-${index}`}>
          <FAQItem faq={faq} onRemove={onRemoveFAQ} />
        </motion.div>
      ))}
    </AnimatePresence>
  )
);

FAQList.displayName = "FAQList";

const TrainAIPage: React.FC = () => {
  const { toast } = useToast();
  const {
    customFaqs,
    isLoading,
    error,
    trainingStatus,
    addCustomFaq,
    removeCustomFaq,
    trainProjectAI,
    fetchTrainingStatus,
    clearError,
  } = useTrainStore();
  const { selectedProject, getProjectById } = useProjectStore();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const projectId = selectedProject?._id; // Assuming you have access to project ID from params
  console.log("isLoading", isLoading);
  console.log("selectedProject", selectedProject);
  // Fetch initial training status
  useEffect(() => {
    if (projectId) {
      fetchTrainingStatus(projectId).catch((error) => {
        toast({
          title: "Error",
          description: "Failed to fetch training status",
          variant: "destructive",
        });
      });
    }
  }, [projectId, fetchTrainingStatus, toast]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      clearError();
    }
  }, [error, toast, clearError]);

  useEffect(() => {
    const projectId = selectedProject?._id;
    if (projectId) {
      getProjectById(projectId);
    }
  }, [selectedProject?._id, getProjectById]);

  const handleAddFAQ = useCallback(
    (question: string, answer: string) => {
      addCustomFaq({ question, answer });
    },
    [addCustomFaq]
  );

  const handleSave = useCallback(async () => {
    if (!projectId) {
      toast({
        title: "Error",
        description: "No project selected",
        variant: "destructive",
      });
      return;
    }

    try {
      await trainProjectAI(projectId, selectedFiles, customFaqs);
      toast({
        title: "Success",
        description: "AI training started successfully",
      });
    } catch (error: any) {
      console.error("Training error:", error);
      // Error is already handled by the store
    }
  }, [projectId, selectedFiles, customFaqs, trainProjectAI, toast]);

  const pageContent = useMemo(
    () => (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-black">Train Your AI</h1>
          <p className="text-base text-gray-600">
            Upload knowledge files and add FAQs to customize your AI assistant's
            responses.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Knowledge Files Section */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center mb-4">
              <Sparkles className="w-6 h-6 text-primary mr-2" />
              <h2 className="text-xl font-semibold">Knowledge Files</h2>
            </div>
            {selectedProject?.knowledgeFiles &&
              selectedProject.knowledgeFiles.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    Existing Files:
                  </h3>
                  <div className="space-y-2">
                    {selectedProject.knowledgeFiles.map(
                      (file: string, index: number) => (
                        <div
                          key={index}
                          className="text-sm text-gray-500 bg-gray-50 p-2 rounded"
                        >
                          {file}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            <KnowledgeFileUpload
              onFilesSelected={setSelectedFiles}
              selectedFiles={selectedFiles}
            />
          </div>

          {/* FAQ Training */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center mb-4">
              <HelpCircle className="w-6 h-6 text-primary mr-2" />
              <h2 className="text-xl font-semibold">FAQ Training</h2>
            </div>
            <FAQForm onAddFAQ={handleAddFAQ} />
          </div>
        </div>

        {/* FAQ List */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Sparkles className="w-6 h-6 text-primary mr-2" />
              <h2 className="text-xl font-semibold">Added FAQs</h2>
            </div>
            {trainingStatus.lastTrainedAt && (
              <p className="text-sm text-gray-500">
                Last trained:{" "}
                {new Date(trainingStatus.lastTrainedAt).toLocaleString()}
              </p>
            )}
          </div>
          <ScrollArea className="h-[300px] pr-4">
            <FAQList faqs={customFaqs} onRemoveFAQ={removeCustomFaq} />
          </ScrollArea>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {"Saving..."}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Training Data
              </>
            )}
          </Button>
        </div>

        {/* Training Status */}
        {trainingStatus.status !== "idle" && (
          <div
            className={cn("p-4 rounded-lg", {
              "bg-yellow-50 text-yellow-700":
                trainingStatus.status === "processing",
              "bg-green-50 text-green-700":
                trainingStatus.status === "completed",
              "bg-red-50 text-red-700": trainingStatus.status === "failed",
            })}
          >
            <p className="font-medium">
              Status:{" "}
              {trainingStatus.status.charAt(0).toUpperCase() +
                trainingStatus.status.slice(1)}
            </p>
            {trainingStatus.error && (
              <p className="text-sm mt-1">{trainingStatus.error}</p>
            )}
          </div>
        )}
      </div>
    ),
    [
      customFaqs,
      handleAddFAQ,
      removeCustomFaq,
      handleSave,
      isLoading,
      trainingStatus,
      selectedFiles,
      selectedProject,
    ]
  );

  return <ProjectLayout>{pageContent}</ProjectLayout>;
};

export default TrainAIPage;

