"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import useAdminAvatarStore from "@/store/useAdminAvatarStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Avatar {
  _id: string;
  name: string;
  imageUrl: string;
  prompt: string;
  style?: string;
}

interface NewAvatar {
  name: string;
  prompt: string;
  style?: string;
  imageUrl?: string;
}

const AvatarManagementPage: React.FC = () => {
  const {
    avatars,
    isLoading,
    error,
    fetchAvatars,
    generateAvatar,
    deleteAvatar,
    updateAvatar,
  } = useAdminAvatarStore();
  const [newAvatar, setNewAvatar] = useState<NewAvatar>({
    name: "",
    prompt: "",
    style: "",
  });
  const [uploadError, setUploadError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingAvatar, setEditingAvatar] = useState<Avatar | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<NewAvatar>({
    name: "",
    prompt: "",
    style: "",
  });

  useEffect(() => {
    fetchAvatars();
  }, [fetchAvatars]);

  const handleAddAvatar = async (): Promise<void> => {
    if (!newAvatar.name || !newAvatar.prompt) {
      setUploadError("Name and prompt are required");
      return;
    }

    try {
      await generateAvatar({
        name: newAvatar.name,
        prompt: newAvatar.prompt,
        style: newAvatar.style || undefined,
        referenceImage: newAvatar.imageUrl,
      });

      // Clear the form and any errors
      setNewAvatar({ name: "", prompt: "", style: "" });
      setUploadError("");

      // Optionally refresh the avatars list
      await fetchAvatars();
    } catch (error) {
      console.error("Failed to generate avatar:", error);
      setUploadError("Failed to generate avatar. Please try again.");
    }
  };

  const handleDeleteAvatar = async (id: string): Promise<void> => {
    try {
      await deleteAvatar(id);
    } catch (error) {
      console.error("Failed to delete avatar:", error);
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit: boolean = false
  ): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setUploadError("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (isEdit) {
        setEditForm({ ...editForm, imageUrl: reader.result as string });
      } else {
        setNewAvatar({ ...newAvatar, imageUrl: reader.result as string });
      }
      setUploadError("");
    };
    reader.onerror = () => {
      setUploadError("Failed to read file");
    };
    reader.readAsDataURL(file);
  };

  const handleEditClick = (avatar: Avatar) => {
    setEditingAvatar(avatar);
    setEditForm({
      name: avatar.name,
      prompt: avatar.prompt,
      style: avatar.style || "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateAvatar = async () => {
    if (!editingAvatar) return;

    try {
      // Set loading state
      setUploadError("");

      await updateAvatar(editingAvatar._id, {
        name: editForm.name,
        prompt: editForm.prompt,
        style: editForm.style || undefined,
        referenceImage: editForm.imageUrl,
      });

      // Close modal and reset form
      setIsEditModalOpen(false);
      setEditingAvatar(null);
      setEditForm({ name: "", prompt: "", style: "" });

      // Fetch updated avatars list
      await fetchAvatars();
    } catch (error) {
      console.error("Failed to update avatar:", error);
      setUploadError("Failed to update avatar. Please try again.");
    }
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <h1 className="text-3xl font-bold">Avatar Management</h1>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <Card>
          <CardHeader>
            <CardTitle>Add New Avatar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadError && (
                <div className="text-red-500 text-sm">{uploadError}</div>
              )}
              <Input
                placeholder="Avatar Name"
                value={newAvatar.name}
                onChange={(e) =>
                  setNewAvatar({ ...newAvatar, name: e.target.value })
                }
              />
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleImageUpload(e)}
                  className="hidden"
                  accept="image/*"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload Image
                </Button>
                {newAvatar.imageUrl && (
                  <div className="mt-2">
                    <Image
                      src={newAvatar.imageUrl || "/placeholder.svg"}
                      alt="Preview"
                      width={100}
                      height={100}
                      className="rounded-md object-cover"
                    />
                  </div>
                )}
              </div>
              <Textarea
                placeholder="Prompt Text"
                value={newAvatar.prompt}
                onChange={(e) =>
                  setNewAvatar({ ...newAvatar, prompt: e.target.value })
                }
              />
              <Input
                placeholder="Style (optional)"
                value={newAvatar.style}
                onChange={(e) =>
                  setNewAvatar({ ...newAvatar, style: e.target.value })
                }
              />
              <Button onClick={handleAddAvatar} disabled={isLoading}>
                <Plus className="mr-2 h-4 w-4" />{" "}
                {isLoading ? "Generating..." : "Add Avatar"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          {avatars.map((avatar) => (
            <Card key={avatar._id} className="overflow-hidden">
              <div className="aspect-square relative">
                <Image
                  src={avatar.imageUrl || "/placeholder.svg"}
                  alt={avatar.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{avatar.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {avatar.prompt}
                </p>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(avatar)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteAvatar(avatar._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Avatar</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {uploadError && (
                <div className="text-red-500 text-sm">{uploadError}</div>
              )}
              <Input
                placeholder="Avatar Name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleImageUpload(e, true)}
                  className="hidden"
                  accept="image/*"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload Reference Image
                </Button>
                {editForm.imageUrl ? (
                  <div className="mt-2">
                    <Image
                      src={editForm.imageUrl}
                      alt="Preview"
                      width={100}
                      height={100}
                      className="rounded-md object-cover"
                    />
                  </div>
                ) : editingAvatar?.imageUrl ? (
                  <div className="mt-2">
                    <Image
                      src={editingAvatar.imageUrl}
                      alt="Current Avatar"
                      width={100}
                      height={100}
                      className="rounded-md object-cover"
                    />
                  </div>
                ) : null}
              </div>
              <Textarea
                placeholder="Prompt Text"
                value={editForm.prompt}
                onChange={(e) =>
                  setEditForm({ ...editForm, prompt: e.target.value })
                }
              />
              <Input
                placeholder="Style (optional)"
                value={editForm.style}
                onChange={(e) =>
                  setEditForm({ ...editForm, style: e.target.value })
                }
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateAvatar} disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Avatar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </AdminLayout>
  );
};

export default AvatarManagementPage;

