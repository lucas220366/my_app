"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Edit2, Upload, Check, X } from "lucide-react";
import ProjectLayout from "@/components/layouts/ProjectLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSearchParams } from "next/navigation";
import useProjectStore from "@/store/useProjectStore";
import useAvatarStore, { Avatar } from "@/store/useAvatarStore";

export default function ProjectSetupPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");

  const { selectedProject, getProjectById, updateProject, isLoading } =
    useProjectStore();
  const {
    avatars,
    isLoading: isAvatarLoading,
    fetchAvatars,
  } = useAvatarStore();
  const [projectName, setProjectName] = useState(selectedProject?.name || "");
  const [avatarUrl, setAvatarUrl] = useState(
    selectedProject?.avatar?.imageUrl ||
      (avatars && avatars.length > 0 ? avatars[0]?.imageUrl : "")
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempProjectName, setTempProjectName] = useState(projectName);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (projectId || selectedProject) {
        try {
          const project = await getProjectById(
            projectId || selectedProject?._id
          );
          setProjectName(project.name);
          setAvatarUrl(project.avatar?.imageUrl || avatars[0].imageUrl);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to fetch project details",
            variant: "destructive",
          });
        }
      }
    };
    fetchProject();
  }, [projectId, getProjectById, toast]);

  useEffect(() => {
    fetchAvatars();
  }, [fetchAvatars]);

  const handleNameEdit = () => {
    setIsEditingName(true);
    setTempProjectName(projectName);
  };

  const handleNameSave = async () => {
    if (!projectId) return;

    try {
      await updateProject(projectId, { name: tempProjectName });
      setProjectName(tempProjectName);
      setIsEditingName(false);
      toast({
        title: "Project name updated",
        description: "Your project name has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project name",
        variant: "destructive",
      });
    }
  };

  const handleNameCancel = () => {
    setIsEditingName(false);
    setTempProjectName(projectName);
  };

  const handleAvatarChange = async (avatar: Avatar) => {
    if (!projectId) return;

    try {
      await updateProject(projectId, {
        avatar: {
          type: "predefined",
          imageUrl: avatar.imageUrl,
          avatarId: avatar._id,
        },
      });
      setAvatarUrl(avatar.imageUrl);
      setIsAvatarDialogOpen(false);
      toast({
        title: "Avatar updated",
        description: "Your AI avatar has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update avatar",
        variant: "destructive",
      });
    }
  };

  const handleCustomAvatarUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log("handleCustomAvatarUpload", e.target.files);
    if (!projectId) return;
    const file = e.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("image", file);
        // Note: You'll need to implement the actual file upload logic in your updateProject function
        await updateProject(projectId, {
          avatar: {
            type: "custom",
            file: file,
          },
        });
        const url = URL.createObjectURL(file);
        setAvatarUrl(url);
        setIsAvatarDialogOpen(false);
        toast({
          title: "Custom avatar uploaded",
          description: "Your custom AI avatar has been successfully uploaded.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload custom avatar",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <ProjectLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </ProjectLayout>
    );
  }

  return (
    <ProjectLayout>
      <div className="max-w-4xl mx-auto space-y-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Project Setup
          </h1>
          <p className="text-base text-gray-600">
            Customize your project settings and AI assistant details.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white p-6 sm:p-8 rounded-xl shadow-lg space-y-8"
        >
          {/* Project Name Section */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Project Name
            </h2>
            {isEditingName ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <Input
                  value={tempProjectName}
                  onChange={(e) => setTempProjectName(e.target.value)}
                  className="flex-grow text-lg"
                />
                <div className="flex space-x-2">
                  <Button onClick={handleNameSave} size="sm" variant="ghost">
                    <Check className="h-5 w-5 text-green-600" />
                  </Button>
                  <Button onClick={handleNameCancel} size="sm" variant="ghost">
                    <X className="h-5 w-5 text-red-600" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-xl text-gray-700">{projectName}</span>
                <Button
                  onClick={handleNameEdit}
                  variant="ghost"
                  className="text-primary"
                >
                  <Edit2 className="h-5 w-5 mr-2" />
                  Edit
                </Button>
              </div>
            )}
          </div>

          {/* AI Avatar Section */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
              AI Avatar
            </h2>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden">
                <Image
                  src={avatarUrl || "/placeholder.svg"}
                  alt="AI Avatar"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="space-y-3">
                <Button
                  onClick={() => setIsAvatarDialogOpen(true)}
                  variant="outline"
                  className="text-primary w-full sm:w-auto"
                >
                  Choose from Library
                </Button>
                <div>
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <div className="flex items-center space-x-2 text-primary hover:text-primary/80">
                      <Upload className="h-4 w-4" />
                      <span>Upload custom avatar</span>
                    </div>
                  </Label>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleCustomAvatarUpload}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Recommended: 256x256px or larger, PNG or JPG
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Avatar Dialog */}
      <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Choose your AI Avatar
            </DialogTitle>
            <DialogDescription>
              Select an avatar from our library or upload your own.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            {avatars.map((avatar, index) => (
              <motion.div
                key={avatar._id}
                className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  avatarUrl === avatar.imageUrl
                    ? "border-primary bg-primary/10"
                    : "border-gray-200 hover:border-primary/50"
                }`}
                onClick={() => handleAvatarChange(avatar)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src={avatar.imageUrl || "/placeholder.svg"}
                  alt={`Avatar ${index + 1}`}
                  width={150}
                  height={150}
                  className="rounded-lg"
                />
                {avatarUrl === avatar.imageUrl && (
                  <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                    <Check size={16} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          <div className="mt-4">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Custom Avatar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </ProjectLayout>
  );
}

