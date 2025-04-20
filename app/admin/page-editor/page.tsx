"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import AdminLayout from "@/components/layouts/AdminLayout"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Bold, Italic, Save } from "lucide-react"

export default function PageEditorPage() {
  const [selectedPage, setSelectedPage] = useState<"privacy" | "terms">("privacy")
  const [content, setContent] = useState("")
  const editorRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    // In a real application, fetch the content from your backend
    setContent(
      selectedPage === "privacy"
        ? "<h1>Privacy Policy</h1><p>This is the privacy policy content...</p>"
        : "<h1>Terms and Conditions</h1><p>This is the terms and conditions content...</p>",
    )
  }, [selectedPage])

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content
    }
  }, [content])

  const handleSave = () => {
    // In a real application, send the updated content to your backend
    if (editorRef.current) {
      const updatedContent = editorRef.current.innerHTML
      console.log(`Saving ${selectedPage}:`, updatedContent)

      toast({
        title: "Changes Saved",
        description: "Your changes have been successfully saved.",
        duration: 3000,
      })
    }
  }

  const execCommand = (command: string) => {
    document.execCommand(command, false, undefined)
    editorRef.current?.focus()
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 max-w-4xl mx-auto"
      >
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-[#4CAF50]"
        >
          Page Editor
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-4 md:mb-6 flex flex-col sm:flex-row gap-2 sm:space-x-4"
        >
          <Button
            onClick={() => setSelectedPage("privacy")}
            variant={selectedPage === "privacy" ? "default" : "outline"}
            className={`${selectedPage === "privacy" ? "bg-[#4CAF50] hover:bg-[#2E7D32]" : "hover:text-[#4CAF50] hover:border-[#4CAF50]"} w-full sm:w-auto transition-all duration-300`}
          >
            Privacy Policy
          </Button>
          <Button
            onClick={() => setSelectedPage("terms")}
            variant={selectedPage === "terms" ? "default" : "outline"}
            className={`${selectedPage === "terms" ? "bg-[#4CAF50] hover:bg-[#2E7D32]" : "hover:text-[#4CAF50] hover:border-[#4CAF50]"} w-full sm:w-auto transition-all duration-300`}
          >
            Terms and Conditions
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-4 flex space-x-2"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => execCommand("bold")}
              variant="outline"
              size="icon"
              className="w-10 h-10 border-[#C8E6C9] hover:bg-[#C8E6C9] hover:text-[#2E7D32] transition-all duration-300"
            >
              <Bold className="h-4 w-4" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => execCommand("italic")}
              variant="outline"
              size="icon"
              className="w-10 h-10 border-[#C8E6C9] hover:bg-[#C8E6C9] hover:text-[#2E7D32] transition-all duration-300"
            >
              <Italic className="h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="relative"
        >
          <div
            ref={editorRef}
            contentEditable
            className="w-full min-h-[300px] md:min-h-[400px] lg:min-h-[500px] p-3 md:p-4 border border-[#C8E6C9] rounded-lg mb-4 md:mb-6 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent overflow-auto"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex justify-end"
        >
          <Button
            onClick={handleSave}
            className="w-full sm:w-auto bg-[#4CAF50] hover:bg-[#2E7D32] text-white transition-all duration-300 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </motion.div>
      </motion.div>
    </AdminLayout>
  )
}

