"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminLayout from "@/components/layouts/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MessageSquare, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useAdminTicketStore from "@/store/useAdminTicketStore";

interface Ticket {
  _id: string;
  user: {
    email: string;
    name: string;
  };
  subject: string;
  description: string;
  status: "in progress" | "resolved";
  supportResponse?: string;
  createdAt: string;
  updatedAt: string;
  attachments: string[];
}

export default function TicketsManagementPage() {
  const { tickets, isLoading, error, fetchTickets, respondToTicket } =
    useAdminTicketStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      fetchTickets(searchTerm);
    }, 300);

    return () => clearTimeout(debounceSearch);
  }, [searchTerm, fetchTickets]);

  const handleReply = async () => {
    if (selectedTicket && replyText) {
      try {
        await respondToTicket(selectedTicket._id, replyText);
        setReplyText("");
        await fetchTickets(searchTerm);
      } catch (error) {
        console.error("Failed to respond to ticket:", error);
      }
    }
  };

  const handleStatusChange = async (ticketId: string) => {
    try {
      await respondToTicket(ticketId, "");
      await fetchTickets(searchTerm);
    } catch (error) {
      console.error("Failed to update ticket status:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <h1 className="text-3xl font-bold">Ticket Management</h1>

        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket._id}>
                <TableCell>{ticket.user.email}</TableCell>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      ticket.status === "in progress"
                        ? "destructive"
                        : "success"
                    }
                    className={
                      ticket.status === "resolved"
                        ? "bg-green-500 hover:bg-green-600"
                        : ""
                    }
                  >
                    {ticket.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(ticket.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(ticket.updatedAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" /> Reply
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Reply to Ticket #{ticket._id}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium">User:</p>
                          <p>{ticket.user.email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Subject:</p>
                          <p>{ticket.subject}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Description:</p>
                          <p>{ticket.description}</p>
                        </div>
                        {ticket.attachments.length > 0 && (
                          <div>
                            <p className="text-sm font-medium">Attachments:</p>
                            {ticket.attachments.map((attachment, index) => (
                              <Button
                                key={index}
                                variant="link"
                                className="p-0"
                              >
                                <Download className="mr-2 h-4 w-4" />
                                {attachment}
                              </Button>
                            ))}
                          </div>
                        )}
                        <Textarea
                          placeholder="Type your reply here..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <div className="flex justify-between">
                          <Button
                            variant="outline"
                            onClick={() => handleStatusChange(ticket._id)}
                          >
                            Mark as Resolved
                          </Button>
                          <Button onClick={handleReply}>Send Reply</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </AdminLayout>
  );
}

