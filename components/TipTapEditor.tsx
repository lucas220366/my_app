"use client"

import type React from "react"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

interface TipTapEditorProps {
  content: string
  onChange: (content: string) => void
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  return (
    <div className="border rounded-lg bg-white p-4">
      <EditorContent editor={editor} className="prose max-w-none min-h-[460px]" />
    </div>
  )
}

export default TipTapEditor

