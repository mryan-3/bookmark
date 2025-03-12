"use client"

import { useState, useEffect } from "react"
import type { Bookmark } from "@/types"
import { decompressFromEncodedURIComponent } from "@/lib/compression"

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])

  useEffect(() => {
    // Load bookmarks from localStorage on mount
    const savedBookmarks = localStorage.getItem("vibe-bookmarks")
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks))
      } catch (error) {
        console.error("Error parsing bookmarks:", error)
      }
    }

    // Check URL for data parameter (for syncing)
    const url = new URL(window.location.href)
    const data = url.searchParams.get("data")

    if (data) {
      try {
        const decompressed = decompressFromEncodedURIComponent(data)
        const parsed = JSON.parse(decompressed)

        if (parsed.bookmarks) {
          // Merge with existing bookmarks
          setBookmarks((prevBookmarks) => {
            const existingIds = new Set(prevBookmarks.map((b) => b.id))
            const newBookmarks = parsed.bookmarks.filter((b) => !existingIds.has(b.id))
            return [...prevBookmarks, ...newBookmarks]
          })

          // Remove the data parameter from the URL to avoid reimporting on refresh
          url.searchParams.delete("data")
          window.history.replaceState({}, "", url.toString())
        }
      } catch (error) {
        console.error("Error importing bookmarks from URL:", error)
      }
    }

    // Listen for import events
    const handleImport = (event: CustomEvent) => {
      const { bookmarks: importedBookmarks } = event.detail

      if (importedBookmarks) {
        setBookmarks((prevBookmarks) => {
          const existingIds = new Set(prevBookmarks.map((b) => b.id))
          const newBookmarks = importedBookmarks.filter((b) => !existingIds.has(b.id))
          return [...prevBookmarks, ...newBookmarks]
        })
      }
    }

    window.addEventListener("vibe:import", handleImport as EventListener)

    return () => {
      window.removeEventListener("vibe:import", handleImport as EventListener)
    }
  }, [])

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("vibe-bookmarks", JSON.stringify(bookmarks))
  }, [bookmarks])

  const addBookmark = (bookmark: Bookmark) => {
    setBookmarks((prevBookmarks) => [...prevBookmarks, bookmark])
  }

  const removeBookmark = (id: string) => {
    setBookmarks((prevBookmarks) => prevBookmarks.filter((bookmark) => bookmark.id !== id))
  }

  const updateBookmark = (id: string, updatedFields: Partial<Bookmark>) => {
    setBookmarks((prevBookmarks) =>
      prevBookmarks.map((bookmark) => (bookmark.id === id ? { ...bookmark, ...updatedFields } : bookmark)),
    )
  }

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    updateBookmark,
  }
}


