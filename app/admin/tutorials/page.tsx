"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useAdminTutorialStore, { Tutorial } from "@/store/useAdminTutorialStore";

const getVideoThumbnail = (videoUrl: string): string => {
  try {
    // Handle YouTube URLs
    if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
      const videoId = videoUrl.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      )?.[1];
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }
    // Add more video platform handlers here if needed
    return "/placeholder-thumbnail.jpg"; // Fallback image
  } catch {
    return "/placeholder-thumbnail.jpg"; // Fallback image
  }
};

const TutorialsManagementPage = () => {
  const {
    tutorials,
    isLoading,
    error,
    fetchTutorials,
    createTutorial,
    updateTutorial,
    deleteTutorial,
    clearError,
  } = useAdminTutorialStore();

  const [newTutorial, setNewTutorial] = useState({
    title: "",
    description: "",
    videoUrl: "",
    duration: 0,
  });

  const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchTutorials();
  }, [fetchTutorials]);

  const handleAddTutorial = async () => {
    if (
      newTutorial.title &&
      newTutorial.description &&
      newTutorial.videoUrl &&
      newTutorial.duration
    ) {
      try {
        await createTutorial(newTutorial);
        setNewTutorial({
          title: "",
          description: "",
          videoUrl: "",
          duration: 0,
        });
      } catch (error) {
        console.error("Failed to create tutorial:", error);
      }
    }
  };

  const handleUpdateTutorial = async () => {
    if (!editingTutorial?._id) return;

    try {
      await updateTutorial(editingTutorial._id, editingTutorial);
      setIsEditDialogOpen(false);
      setEditingTutorial(null);
    } catch (error) {
      console.error("Failed to update tutorial:", error);
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
        <h1 className="text-3xl font-bold">Tutorials Management</h1>

        <Card>
          <CardHeader>
            <CardTitle>Add New Tutorial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Tutorial Title"
                value={newTutorial.title}
                onChange={(e) =>
                  setNewTutorial({ ...newTutorial, title: e.target.value })
                }
              />
              <Textarea
                placeholder="Description"
                value={newTutorial.description}
                onChange={(e) =>
                  setNewTutorial({
                    ...newTutorial,
                    description: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Video URL"
                value={newTutorial.videoUrl}
                onChange={(e) =>
                  setNewTutorial({ ...newTutorial, videoUrl: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Duration (minutes)"
                value={newTutorial.duration}
                onChange={(e) =>
                  setNewTutorial({
                    ...newTutorial,
                    duration: Number(e.target.value),
                  })
                }
              />
              <Button onClick={handleAddTutorial}>
                <Plus className="mr-2 h-4 w-4" /> Add Tutorial
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tutorials.map((tutorial) => (
            <Card key={tutorial._id}>
              <CardHeader>
                <CardTitle>{tutorial.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video mb-4 overflow-hidden rounded-md">
                  <img
                    src={getVideoThumbnail(tutorial.videoUrl)}
                    alt={tutorial.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {tutorial.description}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Duration: {tutorial.duration} minutes
                </p>
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(tutorial.videoUrl, "_blank")}
                  >
                    <Play className="mr-2 h-4 w-4" /> Watch
                  </Button>
                  <div className="space-x-2">
                    <Dialog
                      open={isEditDialogOpen}
                      onOpenChange={setIsEditDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingTutorial(tutorial)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Tutorial</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input
                            placeholder="Tutorial Title"
                            value={editingTutorial?.title}
                            onChange={(e) =>
                              setEditingTutorial((prev) =>
                                prev ? { ...prev, title: e.target.value } : null
                              )
                            }
                          />
                          <Textarea
                            placeholder="Description"
                            value={editingTutorial?.description}
                            onChange={(e) =>
                              setEditingTutorial((prev) =>
                                prev
                                  ? { ...prev, description: e.target.value }
                                  : null
                              )
                            }
                          />
                          <Input
                            placeholder="Video URL"
                            value={editingTutorial?.videoUrl}
                            onChange={(e) =>
                              setEditingTutorial((prev) =>
                                prev
                                  ? { ...prev, videoUrl: e.target.value }
                                  : null
                              )
                            }
                          />
                          <Input
                            type="number"
                            placeholder="Duration (minutes)"
                            value={editingTutorial?.duration}
                            onChange={(e) =>
                              setEditingTutorial((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      duration: Number(e.target.value),
                                    }
                                  : null
                              )
                            }
                          />
                          <Button onClick={handleUpdateTutorial}>
                            Update Tutorial
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteTutorial(tutorial._id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </AdminLayout>
  );
};

export default TutorialsManagementPage;

