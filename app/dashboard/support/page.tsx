"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PlusCircle,
  Paperclip,
  Clock,
  X,
  File,
  ImageIcon,
  Loader2,
} from "lucide-react";
import UserLayout from "@/components/layouts/UserLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import useSupportStore, { Ticket, Attachment } from "@/store/useSupportStore";

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

export default function SupportPage() {
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [isTicketDetailModalOpen, setIsTicketDetailModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newTicket, setNewTicket] = useState({ subject: "", description: "" });
  const [attachments, setAttachments] = useState<File[]>([]);
  const { tickets, isLoading, error, fetchTickets, createTicket } =
    useSupportStore();

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  console.log("selectedTicket", tickets);

  const handleNewTicket = async () => {
    const formData = new FormData();
    formData.append("subject", newTicket.subject);
    formData.append("description", newTicket.description);

    attachments.forEach((file) => {
      formData.append("files", file);
    });

    await createTicket(formData);
    setIsNewTicketModalOpen(false);
    setNewTicket({ subject: "", description: "" });
    setAttachments([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <ImageIcon className="h-6 w-6 text-blue-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <div className="text-red-500 text-center">{error}</div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-text-primary">Support</h1>
            <p className="text-base text-text-secondary">
              Need help? Create a new ticket or check the status of existing
              ones.
            </p>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mb-6"
        >
          <Button
            onClick={() => setIsNewTicketModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {tickets.map((ticket) => (
            <motion.div
              key={ticket._id}
              variants={itemVariants}
              className="bg-white p-6 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg"
              onClick={() => {
                setSelectedTicket(ticket);
                setIsTicketDetailModalOpen(true);
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium text-lg text-text-primary">
                  {ticket.subject}
                </h3>
                <Badge
                  variant={
                    ticket.status === "in progress" ? "default" : "success"
                  }
                  className={
                    ticket.status === "resolved"
                      ? "bg-green-500 hover:bg-green-600"
                      : ""
                  }
                >
                  {ticket.status}
                </Badge>
              </div>
              <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                {ticket.description}
              </p>
              <div className="flex items-center text-xs text-text-secondary">
                <Clock className="mr-1 h-3 w-3" />
                {new Date(ticket.createdAt).toLocaleDateString()}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Dialog
        open={isNewTicketModalOpen}
        onOpenChange={setIsNewTicketModalOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Create New Support Ticket
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-text-primary mb-1"
              >
                Subject
              </label>
              <Input
                id="subject"
                value={newTicket.subject}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, subject: e.target.value })
                }
                placeholder="Brief description of the issue"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-text-primary mb-1"
              >
                Description
              </label>
              <Textarea
                id="description"
                value={newTicket.description}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, description: e.target.value })
                }
                placeholder="Provide more details about your issue"
                rows={4}
              />
            </div>
            <div>
              <label
                htmlFor="attachments"
                className="block text-sm font-medium text-text-primary mb-1"
              >
                Attachments (optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Paperclip className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF, PDF up to 10MB each
                  </p>
                </div>
              </div>
            </div>
            {attachments.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Attached Files:</h4>
                <ul className="space-y-2">
                  {attachments.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-gray-100 p-2 rounded"
                    >
                      <div className="flex items-center">
                        {getFileIcon(file.name)}
                        <span className="ml-2 text-sm">{file.name}</span>
                        <span className="ml-2 text-xs text-gray-500">
                          ({(file.size / 1024).toFixed(2)} KB)
                        </span>
                      </div>
                      <button
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsNewTicketModalOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleNewTicket}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Submit Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isTicketDetailModalOpen}
        onOpenChange={setIsTicketDetailModalOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedTicket?.subject}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="mt-4 max-h-[60vh]">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Badge
                  variant={
                    selectedTicket?.status === "In Progress"
                      ? "default"
                      : "success"
                  }
                  className={
                    selectedTicket?.status === "Resolved"
                      ? "bg-green-500 hover:bg-green-600"
                      : ""
                  }
                >
                  {selectedTicket?.status}
                </Badge>
                <span className="text-sm text-text-secondary">
                  Created on{" "}
                  {selectedTicket &&
                    new Date(selectedTicket.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-lg">Description</h3>
                <p className="text-text-secondary">
                  {selectedTicket?.description}
                </p>
              </div>
              {selectedTicket?.attachments &&
                selectedTicket.attachments.length > 0 && (
                  <div>
                    <h3 className="font-medium text-lg">Attachments</h3>
                    <ul className="space-y-2">
                      {selectedTicket.attachments.map(
                        (attachment: Attachment) => (
                          <li
                            key={attachment._id}
                            className="flex items-center bg-gray-100 p-2 rounded"
                          >
                            <div className="flex items-center">
                              {getFileIcon(attachment.filename)}
                              <span className="ml-2 text-sm">
                                {attachment.filename}
                              </span>
                            </div>
                            <a
                              href={attachment.path}
                              download={attachment.filename}
                              className="ml-auto text-primary hover:text-primary/90"
                            >
                              Download
                            </a>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              <div>
                <h3 className="font-medium text-lg">Support Response</h3>
                {selectedTicket?.status === "In Progress" ? (
                  <div className="bg-blue-50 p-4 rounded-md flex items-center">
                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin mr-2" />
                    <p className="text-blue-700">
                      Your ticket is currently being processed. We'll get back
                      to you as soon as we can.
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-100 p-4 rounded-md">
                    <p className="whitespace-pre-wrap">
                      {selectedTicket?.supportResponse}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button onClick={() => setIsTicketDetailModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </UserLayout>
  );
}

