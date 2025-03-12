"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Bookmark, Folder } from "@/types"
import { extractTwitterId } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { TwitterPreview } from "@/components/twitter-preview"

interface AddBookmarkFormProps {
  onAdd: (bookmark: Bookmark) => void
  folders: Folder[]
}

export function AddBookmarkForm({ onAdd, folders }: AddBookmarkFormProps) {
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [notes, setNotes] = useState("")
  const [folderId, setFolderId] = useState<string | null>(null)
  const [isValidUrl, setIsValidUrl] = useState(false)
  const [twitterId, setTwitterId] = useState<string | null>(null)

  const handleUrlChange = (value: string) => {
    setUrl(value)
    const id = extractTwitterId(value)
    setIsValidUrl(!!id)
    setTwitterId(id)

    // If no title is set yet, use the URL as a placeholder title
    if (!title && value) {
      setTitle(`Tweet from ${value.split("/")[3] || "Twitter"}`)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) return

    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      url,
      title: title || url,
      notes,
      folderId: folderId || null,
      createdAt: new Date().toISOString(),
    }

    onAdd(newBookmark)

    // Reset form
    setUrl("")
    setTitle("")
    setNotes("")
    setFolderId(null)
    setIsValidUrl(false)
    setTwitterId(null)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="url"
            placeholder="Paste Twitter/X post URL"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Input type="text" placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Textarea placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
        </div>

        <div className="space-y-2">
          <Select value={folderId || ""} onValueChange={(value) => setFolderId(value || null)}>
            <SelectTrigger>
              <SelectValue placeholder="Select folder (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No folder</SelectItem>
              {folders.map((folder) => (
                <SelectItem key={folder.id} value={folder.id}>
                  {folder.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={!isValidUrl}>
          Save Bookmark
        </Button>
      </form>

      {isValidUrl && twitterId && (
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-2">Preview</h3>
          <TwitterPreview tweetId={twitterId} />
        </Card>
      )}
    </div>
  )
}


