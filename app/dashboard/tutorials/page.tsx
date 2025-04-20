"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Clock } from "lucide-react";
import UserLayout from "@/components/layouts/UserLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useTutorialStore from "@/store/useTutorialStore";

interface Tutorial {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

export default function TutorialsPage() {
  const { tutorials, isLoading, error, fetchTutorials } = useTutorialStore();

  useEffect(() => {
    fetchTutorials();
  }, [fetchTutorials]);

  const handleWatchVideo = (tutorial: Tutorial) => {
    window.open(tutorial.videoUrl, "_blank");
  };

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
        </div>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <Button onClick={() => fetchTutorials()} className="mt-4">
            Try Again
          </Button>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text-primary">Tutorials</h1>
          <p className="text-xl text-text-secondary">
            Master the art of AI avatar creation with our comprehensive video
            tutorials
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {tutorials.map((tutorial) => (
            <motion.div
              key={tutorial._id}
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-shadow hover:shadow-xl"
            >
              <div className="aspect-video bg-gray-100 relative">
                <img
                  src={`https://img.youtube.com/vi/${
                    tutorial.videoUrl.split("v=")[1]
                  }/maxresdefault.jpg`}
                  alt={tutorial.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <Button
                    onClick={() => handleWatchVideo(tutorial)}
                    className="bg-primary hover:bg-primary/90 text-white rounded-full p-3"
                  >
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-text-primary">
                  {tutorial.title}
                </h3>
                <p className="text-text-secondary">{tutorial.description}</p>
                <div className="flex items-center text-sm text-text-secondary">
                  <Clock className="h-4 w-4 mr-1" />
                  {`${Math.floor(tutorial.duration / 60)}:${(
                    tutorial.duration % 60
                  )
                    .toString()
                    .padStart(2, "0")}`}
                </div>
                <Button
                  onClick={() => handleWatchVideo(tutorial)}
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                >
                  Watch Tutorial
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </UserLayout>
  );
}

