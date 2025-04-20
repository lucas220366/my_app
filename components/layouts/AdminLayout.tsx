"use client";

import type React from "react";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  BarChart2,
  Users,
  Image,
  Video,
  TicketIcon,
  CreditCard,
  LogOut,
  ChevronRight,
  FileText,
  Edit,
} from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import useAdminAuthStore from "@/store/useAdminAuthStore";
import ProtectedAdminRoute from "@/components/ProtectAdminRoute";

const navItems = [
  { name: "Overview", href: "/admin", icon: BarChart2 },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Avatar Management", href: "/admin/avatars", icon: Image },
  { name: "Tutorials", href: "/admin/tutorials", icon: Video },
  { name: "Tickets", href: "/admin/tickets", icon: TicketIcon },
  { name: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
  { name: "Blog Management", href: "/admin/blog", icon: FileText },
  { name: "Page Editor", href: "/admin/page-editor", icon: Edit },
];

const sidebarVariants = {
  expanded: { width: 240 },
  collapsed: { width: 64 },
};

const navItemVariants = {
  expanded: { opacity: 1, x: 0 },
  collapsed: { opacity: 1, x: 0 },
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const { logout } = useAdminAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/admin");
  };

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-gray-100">
        <div className="flex">
          <motion.div
            initial={false}
            animate={isExpanded ? "expanded" : "collapsed"}
            variants={sidebarVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "relative flex h-screen flex-col border-r border-gray-200 bg-white py-8 text-gray-800",
              isExpanded ? "items-start" : "items-center"
            )}
          >
            {/* Logo */}
            <motion.div
              className={cn("mb-8 px-4", isExpanded ? "w-full" : "")}
              initial={false}
              animate={isExpanded ? "expanded" : "collapsed"}
              variants={navItemVariants}
            >
              {isExpanded ? (
                <motion.div
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="h-8 w-8 text-primary">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <span className="ml-3 text-lg font-semibold text-gray-900">
                    Admin Panel
                  </span>
                </motion.div>
              ) : (
                <div className="h-8 w-8 text-primary">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
              )}
            </motion.div>

            {/* Navigation */}
            <motion.div className="flex w-full flex-1 flex-col space-y-1 px-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.name}
                    initial={false}
                    animate={isExpanded ? "expanded" : "collapsed"}
                    variants={navItemVariants}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex w-full items-center rounded-lg px-2 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary text-white"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                        !isExpanded && "justify-center"
                      )}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center"
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5",
                            isActive ? "text-white" : "text-gray-500"
                          )}
                        />
                        {isExpanded && (
                          <motion.span
                            className="ml-3"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Logout */}
            <motion.div
              className="px-3 mt-auto"
              initial={false}
              animate={isExpanded ? "expanded" : "collapsed"}
              variants={navItemVariants}
            >
              <motion.button
                className={cn(
                  "flex w-full items-center rounded-lg px-2 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900",
                  !isExpanded && "justify-center"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                {isExpanded && (
                  <motion.span
                    className="ml-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Logout
                  </motion.span>
                )}
              </motion.button>
            </motion.div>

            {/* Expand/Collapse Toggle */}
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className="absolute -right-3 top-11 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-md hover:bg-gray-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Main Content */}
          <main className="flex-1 p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {children}
              <Toaster />
            </motion.div>
          </main>
        </div>
      </div>
    </ProtectedAdminRoute>
  );
}

