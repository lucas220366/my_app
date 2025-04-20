"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === "user@example.com") {
      router.push("/dashboard")
    } else if (email === "admin@example.com") {
      router.push("/admin")
    } else {
      alert("Invalid email or password")
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-text-primary">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-slate-200 focus:border-primary-blue"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-text-primary">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-slate-200 focus:border-primary-blue"
          />
        </div>
        <Button type="submit" className="w-full bg-primary-blue hover:bg-primary-blue/90 text-white">
          Log In
        </Button>
      </form>
      <div className="mt-4 text-center">
        <Link href="/auth/register" className="text-sm text-primary-blue hover:text-primary-blue/90">
          Don't have an account? Sign up
        </Link>
      </div>
      <div className="mt-2 text-center">
        <Link href="/auth/forgot-password" className="text-sm text-primary-blue hover:text-primary-blue/90">
          Forgot your password?
        </Link>
      </div>
    </motion.div>
  )
}

