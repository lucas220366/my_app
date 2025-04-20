"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import useAdminBlogStore from "@/store/useAdminBlogStore";

interface BlogPost {
  _id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string | File;
  imagePreview?: string;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
}

export default function BlogManagementPage() {
  const {
    blogs,
    isLoading,
    error,
    createBlog,
    updateBlog,
    deleteBlog,
    fetchAllBlogs,
  } = useAdminBlogStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost> | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAllBlogs();
  }, [fetchAllBlogs]);

  const handleOpenDialog = (post: BlogPost | null = null) => {
    setCurrentPost(
      post
        ? {
            ...post,
            imagePreview:
              typeof post.imageUrl === "string" ? post.imageUrl : undefined,
          }
        : {
            title: "",
            description: "",
            content: "",
            imageUrl: "",
            keywords: [],
          }
    );
    setIsEditing(!!post);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentPost(null);
    setIsEditing(false);
  };

  const handleSavePost = async () => {
    if (!currentPost) return;

    try {
      if (isEditing && currentPost._id) {
        const { imagePreview, ...postData } = currentPost;
        await updateBlog(currentPost._id, postData);
        toast({ title: "Blog post updated successfully" });
      } else {
        await createBlog(
          currentPost as Omit<BlogPost, "_id" | "createdAt" | "updatedAt">
        );
        toast({ title: "New blog post created successfully" });
      }
      handleCloseDialog();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save blog post",
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await deleteBlog(id);
      toast({ title: "Blog post deleted successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentPost) {
      // Store the actual file object
      setCurrentPost({
        ...currentPost,
        imageUrl: file,
        // Also create a preview URL for display
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="space-y-4 sm:space-y-8 px-2 sm:px-4 md:px-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold text-[#2E7D32]"
          >
            Blog Management
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-[#4CAF50] hover:bg-[#2E7D32] text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Post
            </Button>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4CAF50]" />
          </div>
        ) : blogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-64 text-center p-4"
          >
            <div className="w-16 h-16 mb-4 text-[#81C784]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#2E7D32] mb-2">
              No Blog Posts Yet
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by creating your first blog post!
            </p>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-[#4CAF50] hover:bg-[#2E7D32] text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> Create First Post
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((post) => (
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                key={post._id}
              >
                <Card className="h-full overflow-hidden border border-[#C8E6C9] hover:border-[#4CAF50] transition-colors">
                  <div className="aspect-video relative">
                    <Image
                      src={
                        post.imageUrl || "/placeholder.svg?height=300&width=600"
                      }
                      alt={post.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 text-[#2E7D32]">
                      {post.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(post)}
                        className="h-8 w-8 p-0 border-[#81C784] hover:border-[#4CAF50] hover:bg-[#C8E6C9]"
                      >
                        <Edit className="h-4 w-4 text-[#2E7D32]" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePost(post._id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#2E7D32]">
              {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
            </DialogTitle>
          </DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4 py-2 sm:py-4"
          >
            <div className="grid gap-1 sm:gap-2">
              <label
                htmlFor="title"
                className="text-sm font-medium text-[#2E7D32]"
              >
                Title
              </label>
              <Input
                id="title"
                value={currentPost?.title || ""}
                onChange={(e) =>
                  setCurrentPost({ ...currentPost!, title: e.target.value })
                }
                className="border-[#C8E6C9] focus:border-[#4CAF50] focus:ring-[#81C784]"
              />
            </div>
            <div className="grid gap-1 sm:gap-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-[#2E7D32]"
              >
                Description
              </label>
              <Textarea
                id="description"
                value={currentPost?.description || ""}
                onChange={(e) =>
                  setCurrentPost({
                    ...currentPost!,
                    description: e.target.value,
                  })
                }
                className="border-[#C8E6C9] focus:border-[#4CAF50] focus:ring-[#81C784]"
              />
            </div>
            <div className="grid gap-1 sm:gap-2">
              <label
                htmlFor="content"
                className="text-sm font-medium text-[#2E7D32]"
              >
                Content
              </label>
              <Textarea
                id="content"
                value={currentPost?.content || ""}
                onChange={(e) =>
                  setCurrentPost({ ...currentPost!, content: e.target.value })
                }
                rows={6}
                className="min-h-[100px] sm:min-h-[200px] border-[#C8E6C9] focus:border-[#4CAF50] focus:ring-[#81C784]"
              />
            </div>
            <div className="grid gap-1 sm:gap-2">
              <label
                htmlFor="keywords"
                className="text-sm font-medium text-[#2E7D32]"
              >
                Keywords (comma-separated)
              </label>
              <Input
                id="keywords"
                value={currentPost?.keywords.join(", ") || ""}
                onChange={(e) =>
                  setCurrentPost({
                    ...currentPost!,
                    keywords: e.target.value.split(",").map((k) => k.trim()),
                  })
                }
                className="border-[#C8E6C9] focus:border-[#4CAF50] focus:ring-[#81C784]"
              />
            </div>
            <div className="grid gap-1 sm:gap-2">
              <label
                htmlFor="image"
                className="text-sm font-medium text-[#2E7D32]"
              >
                Image
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full sm:w-auto border-[#81C784] hover:border-[#4CAF50] hover:bg-[#C8E6C9] text-[#2E7D32]"
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload Image
                </Button>
                {currentPost?.imagePreview && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative w-full sm:w-32 h-24 sm:h-24 rounded overflow-hidden border-2 border-[#4CAF50]"
                  >
                    <Image
                      src={currentPost.imagePreview || currentPost.imageUrl}
                      alt="Preview"
                      layout="fill"
                      objectFit="cover"
                      className="rounded"
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              className="w-full sm:w-auto border-[#81C784] hover:border-[#4CAF50] hover:bg-[#C8E6C9] text-[#2E7D32]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePost}
              className="w-full sm:w-auto bg-[#4CAF50] hover:bg-[#2E7D32] text-white"
            >
              {isEditing ? "Update" : "Create"} Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

