"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import AdminLayout from "@/components/layouts/AdminLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Upload } from "lucide-react"
import Image from "next/image"

interface Expert {
  id: number
  title: string
  image: string
  systemInstructions: string
}

const initialExperts: Expert[] = [
  {
    id: 1,
    title: "Dental Expert",
    image: "https://example.com/dental-expert.jpg",
    systemInstructions:
      "You are a dental expert AI assistant. Provide accurate information about dental health and procedures.",
  },
  {
    id: 2,
    title: "Plumbing Expert",
    image: "https://example.com/plumbing-expert.jpg",
    systemInstructions: "You are a plumbing expert AI assistant. Offer advice on plumbing issues and maintenance.",
  },
]

export default function AIExpertsManagementPage() {
  const [experts, setExperts] = useState<Expert[]>(initialExperts)
  const [newExpert, setNewExpert] = useState<Partial<Expert>>({ title: "", image: "", systemInstructions: "" })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddExpert = () => {
    if (newExpert.title && newExpert.image && newExpert.systemInstructions) {
      setExperts([...experts, { ...newExpert, id: Date.now() } as Expert])
      setNewExpert({ title: "", image: "", systemInstructions: "" })
    }
  }

  const handleDeleteExpert = (id: number) => {
    setExperts(experts.filter((expert) => expert.id !== id))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewExpert({ ...newExpert, image: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <h1 className="text-3xl font-bold">AI Experts Management</h1>

        <Card>
          <CardHeader>
            <CardTitle>Add New AI Expert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Expert Title"
                value={newExpert.title}
                onChange={(e) => setNewExpert({ ...newExpert, title: e.target.value })}
              />
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                />
                <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                  <Upload className="mr-2 h-4 w-4" /> Upload Image
                </Button>
                {newExpert.image && (
                  <div className="mt-2">
                    <Image
                      src={newExpert.image || "/placeholder.svg"}
                      alt="Preview"
                      width={100}
                      height={100}
                      className="rounded-md object-cover"
                    />
                  </div>
                )}
              </div>
              <Textarea
                placeholder="System Instructions"
                value={newExpert.systemInstructions}
                onChange={(e) => setNewExpert({ ...newExpert, systemInstructions: e.target.value })}
              />
              <Button onClick={handleAddExpert}>
                <Plus className="mr-2 h-4 w-4" /> Add AI Expert
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          {experts.map((expert) => (
            <Card key={expert.id} className="overflow-hidden">
              <div className="aspect-square relative">
                <Image src={expert.image || "/placeholder.svg"} alt={expert.title} layout="fill" objectFit="cover" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{expert.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{expert.systemInstructions}</p>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteExpert(expert.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </AdminLayout>
  )
}

