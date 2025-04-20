"use client"

import type React from "react"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css"

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading Editor...</p>,
})

interface QuillEditorProps {
  value: string
  onChange: (value: string) => void
}

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange }) => {
  // Add a state to track if we're on the client
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  }

  if (!mounted) {
    return <div className="h-[460px] border rounded-lg bg-white p-4">Loading Editor...</div>
  }

  return (
    <div className="h-[500px] border rounded-lg bg-white">
      <ReactQuill theme="snow" value={value} onChange={onChange} modules={modules} className="h-[460px]" />
    </div>
  )
}

export default QuillEditor

