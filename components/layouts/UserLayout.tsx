"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Home, LogOut, ChevronRight, User, Video, HelpCircle, CreditCard, Settings, Menu, X } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import useAuthStore from "@/store/useAuthStore"
import ProtectedRoute from "@/components/ProtectedRoute"

const navItems = [
  { name: "Projects", href: "/dashboard", icon: Home },
  { name: "Create AI Avatar", href: "/dashboard/ai-avatars", icon: User },
  { name: "Tutorials", href: "/dashboard/tutorials", icon: Video },
  { name: "Support", href: "/dashboard/support", icon: HelpCircle },
  { name: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

const sidebarVariants = {
  expanded: { width: 240 },
  collapsed: { width: 64 },
}

const navItemVariants = {
  expanded: { opacity: 1, x: 0 },
  collapsed: { opacity: 1, x: 0 },
}

interface UserLayoutProps {
  children: React.ReactNode
}

export default function UserLayout({ children }: UserLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { logout, user } = useAuthStore()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLogout = async () => {
    await logout()
    router.push("/auth")
  }

  const Sidebar = useMemo(() => {
    return () => {
      return (
        <motion.div
          initial={false}
          animate={isExpanded ? "expanded" : "collapsed"}
          variants={sidebarVariants}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn(
            "relative flex h-full flex-col border-r border-border bg-sidebar py-8 text-text-primary",
            isExpanded ? "items-start" : "items-center",
            isMobile ? "fixed inset-y-0 left-0 z-50" : "",
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
                <div className="h-8 w-8 text-[#4CAF50]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span className="ml-3 text-lg font-semibold text-text-primary">{user?.fullName || "Dashboard"}</span>
              </motion.div>
            ) : (
              <div className="h-8 w-8 text-[#4CAF50]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
            )}
          </motion.div>

          {/* Navigation */}
          <motion.div className="flex w-full flex-1 flex-col space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/dashboard")
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
                        ? "bg-accent text-text-primary"
                        : "text-text-secondary hover:bg-accent hover:text-text-primary",
                      !isExpanded && "justify-center",
                    )}
                    onClick={() => isMobile && setIsMobileMenuOpen(false)}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center">
                      <item.icon className={cn("h-5 w-5", isActive ? "text-[#4CAF50]" : "text-text-secondary")} />
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
              )
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
                "flex w-full items-center rounded-lg px-2 py-2.5 text-sm font-medium text-text-secondary transition-all duration-200 hover:bg-accent hover:text-text-primary",
                !isExpanded && "justify-center",
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
          {!isMobile && (
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className="absolute -right-3 top-11 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background-white text-text-primary shadow-md hover:bg-accent"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </motion.button>
          )}
        </motion.div>
      )
    }
  }, [isExpanded, isMobile, pathname, router, user, logout])

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        {/* Mobile Menu Button */}
        {isMobile && (
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        )}

        {/* Sidebar */}
        {!isMobile && <Sidebar />}

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMobile && isMobileMenuOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-0 z-50 bg-background"
            >
              <Sidebar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-8 bg-background">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {children}
            <Toaster />
          </motion.div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

