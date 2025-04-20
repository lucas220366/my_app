import type { ReactNode } from "react"

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-background-white rounded-lg shadow-lg w-full max-w-md border border-slate-200">{children}</div>
    </div>
  )
}

