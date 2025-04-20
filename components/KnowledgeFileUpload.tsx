"use client";

import type React from "react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X, FileText, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv",
  "application/json",
];

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

interface KnowledgeFileUploadProps {
  onFilesSelected: (files: File[]) => void;
  selectedFiles: File[];
}

export const KnowledgeFileUpload: React.FC<KnowledgeFileUploadProps> = ({
  onFilesSelected,
  selectedFiles,
}) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File) => {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error(`Unsupported file type: ${file.type}`);
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(
        `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`
      );
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(e.target.files).forEach((file) => {
      try {
        validateFile(file);
        validFiles.push(file);
      } catch (err) {
        errors.push(`${file.name}: ${(err as Error).message}`);
      }
    });

    if (errors.length > 0) {
      errors.forEach((error) => {
        toast({
          title: "Invalid File",
          description: error,
          variant: "destructive",
        });
      });
    }

    if (validFiles.length > 0) {
      onFilesSelected([...selectedFiles, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    onFilesSelected(newFiles);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/"))
      return <ImageIcon className="w-6 h-6 text-blue-500" />;
    if (type === "application/pdf")
      return <File className="w-6 h-6 text-red-500" />;
    return <FileText className="w-6 h-6 text-gray-500" />;
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    droppedFiles.forEach((file) => {
      try {
        validateFile(file);
        validFiles.push(file);
      } catch (err) {
        errors.push(`${file.name}: ${(err as Error).message}`);
      }
    });

    if (errors.length > 0) {
      errors.forEach((error) => {
        toast({
          title: "Invalid File",
          description: error,
          variant: "destructive",
        });
      });
    }

    if (validFiles.length > 0) {
      onFilesSelected([...selectedFiles, ...validFiles]);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
          {
            "border-primary bg-primary/5": isDragging,
            "border-gray-300 hover:border-primary": !isDragging,
          }
        )}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept={ALLOWED_MIME_TYPES.join(",")}
        />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">
          Click to upload or drag and drop
        </p>
        <p className="text-xs text-gray-500">
          PDF, DOC, DOCX, TXT, CSV, JSON (Max 20MB each)
        </p>
      </div>

      <AnimatePresence>
        {uploading && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-blue-50 p-4 rounded-md"
          >
            <p className="text-blue-700 mb-2">Uploading files...</p>
            <Progress value={uploadProgress} className="w-full" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        <AnimatePresence>
          {selectedFiles.map((file, index) => (
            <motion.div
              key={`${file.name}-${file.size}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-4 rounded-md shadow flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                {getFileIcon(file.type)}
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

