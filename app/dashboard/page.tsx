"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, Pencil, ImageIcon, Plus, Search } from "lucide-react";
import UserLayout from "@/components/layouts/UserLayout";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import NewProjectOnboarding from "@/components/NewProjectOnboarding";
import useAuthStore from "@/store/useAuthStore";
import useProjectStore from "@/store/useProjectStore";
import useAvatarStore from "@/store/useAvatarStore";

interface Project {
  _id: string;
  name: string;
  lastEdited?: string;
  image?: string;
  avatar: {
    type: string;
    imageUrl?: string;
    avatarId?: string;
  };
}

interface CrawledPage {
  id: string;
  url: string;
  content: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function Dashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { avatars, isLoading: avatarsLoading, fetchAvatars } = useAvatarStore();

  // Replace static projects with store
  const {
    projects,
    isLoading: projectsLoading,
    fetchProjects,
    updateProject,
    deleteProject,
    setSelectedProject: setSelectedProjectStore,
  } = useProjectStore();

  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  // Fetch projects on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
      fetchAvatars();
    }
  }, [isAuthenticated, fetchProjects, fetchAvatars]);

  // Auth check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, authLoading, router]);

  // Search filter
  useEffect(() => {
    const filtered = projects.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [searchQuery, projects]);

  const handleRename = async () => {
    if (!selectedProject) return;

    try {
      await updateProject(selectedProject._id, { name: newProjectName });

      toast({
        title: "Project renamed",
        description: `Project has been renamed to "${newProjectName}"`,
      });

      setIsRenameDialogOpen(false);
      setSelectedProject(null);
      setNewProjectName("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to rename project",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (projectId: string) => {
    try {
      await deleteProject(projectId);

      toast({
        title: "Project deleted",
        description: "The project has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const handleNewProject = () => {
    setIsNewProjectDialogOpen(true);
  };

  const handleNewProjectComplete = async (
    projectName: string,
    websiteUrl: string,
    scrapedPages: CrawledPage[],
    avatar: {
      type: string;
      file?: File;
      avatarId?: string;
    }
  ) => {
    try {
      // Create the project directly with all data
      const newProject = await useProjectStore.getState().createProject({
        name: projectName,
        websiteUrl,
        scrapedPages: scrapedPages.map((page) => ({
          url: page.url,
          content: page.content,
          selected: true,
        })),
        avatar: {
          type: avatar.type as "predefined" | "custom",
          id: avatar.avatarId,
          file: avatar.file,
        },
      });

      setIsNewProjectDialogOpen(false);
      toast({
        title: "Project Created",
        description: "Your new project has been created successfully.",
      });
      setSelectedProjectStore(newProject);
      router.push(`/project/setup?id=${newProject._id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
    }
  };

  return (
    <UserLayout>
      <div className="space-y-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              Create and Manage Your Projects
            </h1>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mb-6"
        >
          <Button
            className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-2 rounded-[15px] shadow-md transition-all duration-200 ease-in-out"
            onClick={handleNewProject}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Project
          </Button>
        </motion.div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search projects..."
            className="pl-10 py-2 border-gray-300 rounded-[15px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Manage your projects
        </h2>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {projectsLoading ? (
            // Add your loading skeleton here
            <div>Loading projects...</div>
          ) : filteredProjects.length === 0 ? (
            <div>No projects found</div>
          ) : (
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project._id}
                  layout
                  variants={itemVariants}
                  className="group relative overflow-hidden rounded-[15px] border border-border/40 bg-background shadow-sm transition-all hover:border-border hover:shadow-md"
                >
                  <div className="aspect-[1.6/1] relative overflow-hidden bg-muted">
                    <motion.div
                      initial={false}
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      className="h-full"
                    >
                      {project.avatar.imageUrl ? (
                        <img
                          src={project.avatar.imageUrl || "/placeholder.svg"}
                          alt={project.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-accent">
                          <ImageIcon className="h-12 w-12 text-text-secondary/40" />
                        </div>
                      )}
                    </motion.div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 backdrop-blur-[2px] transition-all duration-200 group-hover:opacity-100">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="secondary"
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-white font-medium px-4 py-2 rounded-[15px] shadow-md transition-all duration-200 ease-in-out"
                          onClick={() => {
                            setSelectedProjectStore(project);
                            router.push(`/project/setup?id=${project._id}`);
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="bg-white hover:bg-white/90 rounded-[15px] shadow-md"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedProject(project);
                                setNewProjectName(project.name);
                                setIsRenameDialogOpen(true);
                              }}
                            >
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(project._id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </motion.div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-text-primary truncate">
                      {project.name}
                    </h3>
                    <p className="text-sm text-text-secondary mt-0.5">
                      Last edited {project.lastEdited}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>

        {/* Rename Dialog */}
        <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename Project</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter new project name"
                className="border-border rounded-[15px]"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsRenameDialogOpen(false);
                  setSelectedProject(null);
                  setNewProjectName("");
                }}
                className="rounded-[15px]"
              >
                Cancel
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90 text-white rounded-[15px]"
                onClick={handleRename}
                disabled={
                  !newProjectName || newProjectName === selectedProject?.name
                }
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* New Project Dialog */}
        <Dialog
          open={isNewProjectDialogOpen}
          onOpenChange={setIsNewProjectDialogOpen}
        >
          <DialogContent className="sm:max-w-[900px]">
            <NewProjectOnboarding onComplete={handleNewProjectComplete} />
          </DialogContent>
        </Dialog>
      </div>
    </UserLayout>
  );
}

