"use client"

import { useState, useEffect } from "react"
import type { Folder } from "@/types"
import { decompressFromEncodedURIComponent } from "@/lib/compression"

export function useFolders() {
  const [folders, setFolders] = useState<Folder[]>([])

  useEffect(() => {
    // Load folders from localStorage on mount
    const savedFolders = localStorage.getItem("vibe-folders")
    if (savedFolders) {
      try {
        setFolders(JSON.parse(savedFolders))
      } catch (error) {
        console.error("Error parsing folders:", error)
      }
    }

    // Check URL for data parameter (for syncing)
    const url = new URL(window.location.href)
    const data = url.searchParams.get("data")

    if (data) {
      try {
        const decompressed = decompressFromEncodedURIComponent(data)
        const parsed = JSON.parse(decompressed)

        if (parsed.folders) {
          // Merge with existing folders
          setFolders((prevFolders) => {
            const existingIds = new Set(prevFolders.map((f) => f.id))
            const newFolders = parsed.folders.filter((f) => !existingIds.has(f.id))
            return [...prevFolders, ...newFolders]
          })
        }
      } catch (error) {
        console.error("Error importing folders from URL:", error)
      }
    }

    // Listen for import events
    const handleImport = (event: CustomEvent) => {
      const { folders: importedFolders } = event.detail

      if (importedFolders) {
        setFolders((prevFolders) => {
          const existingIds = new Set(prevFolders.map((f) => f.id))
          const newFolders = importedFolders.filter((f) => !existingIds.has(f.id))
          return [...prevFolders, ...newFolders]
        })
      }
    }

    window.addEventListener("vibe:import", handleImport as EventListener)

    return () => {
      window.removeEventListener("vibe:import", handleImport as EventListener)
    }
  }, [])

  // Save folders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("vibe-folders", JSON.stringify(folders))
  }, [folders])

  const addFolder = (folder: Folder) => {
    setFolders((prevFolders) => [...prevFolders, folder])
  }

  const removeFolder = (id: string) => {
    setFolders((prevFolders) => prevFolders.filter((folder) => folder.id !== id))
  }

  const updateFolder = (id: string, updatedFields: Partial<Folder>) => {
    setFolders((prevFolders) =>
      prevFolders.map((folder) => (folder.id === id ? { ...folder, ...updatedFields } : folder)),
    )
  }

  return {
    folders,
    addFolder,
    removeFolder,
    updateFolder,
  }
}


