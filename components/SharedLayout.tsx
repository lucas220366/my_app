"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SharedLayoutProps {
  children: React.ReactNode
}

export default function SharedLayout({ children }: SharedLayoutProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path ? "text-primary font-semibold" : "text-text-primary hover:text-primary transition-colors"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background-white to-background flex flex-col">
      <header className="container mx-auto px-4 py-6 border-b border-gray-200">
        <nav className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">ChatBotYard</span>
          </Link>
          <div className="space-x-4">
            <Link href="/how-it-works" className={isActive("/how-it-works")}>
              How it Works
            </Link>
            <Link href="/pricing" className={isActive("/pricing")}>
              Pricing
            </Link>
            <Link href="/blog" className={isActive("/blog")}>
              Blog
            </Link>
            <Link href="/contact" className={isActive("/contact")}>
              Contact Us
            </Link>
            <Button asChild variant="outline">
              <Link href="/auth">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">Sign Up Free</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16 flex-grow">{children}</main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-4">
            <Link href="/privacy" className="text-text-secondary hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-text-secondary hover:text-primary">
              Terms of Use
            </Link>
          </div>
          <div className="mt-4 text-center text-text-secondary">
            <p>&copy; 2025 ChatBotYard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

