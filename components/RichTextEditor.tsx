"use client"

import type React from "react"
import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css"

const QuillNoSSR = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading Editor...</p>,
})

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
}

const formats = ["header", "bold", "italic", "underline", "strike", "list", "bullet", "link", "image"]

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  return (
    <QuillNoSSR
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      className="h-[500px] mb-12"
    />
  )
}

export default RichTextEditor

