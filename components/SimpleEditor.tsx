"use client"

import type React from "react"
import { Textarea } from "@/components/ui/textarea"

interface SimpleEditorProps {
  value: string
  onChange: (value: string) => void
}

const SimpleEditor: React.FC<SimpleEditorProps> = ({ value, onChange }) => {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-[400px] w-full p-4"
      placeholder="Enter your content here..."
    />
  )
}

export default SimpleEditor

