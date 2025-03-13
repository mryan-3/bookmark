"use client"

import { useState } from "react"
import { BookmarkList } from "@/components/bookmark-list"
import { FolderSidebar } from "@/components/folder-sidebar"
import { AddBookmarkForm } from "@/components/add-bookmark-form"
import { SyncPanel } from "@/components/sync-panel"
import { useBookmarks } from "@/hooks/use-bookmarks"
import { useFolders } from "@/hooks/use-folders"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const { bookmarks, addBookmark, removeBookmark, updateBookmark } = useBookmarks()
  const { folders, addFolder, removeFolder, updateFolder } = useFolders()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesSearch =
      searchQuery === "" ||
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFolder = selectedFolder === null || bookmark.folderId === selectedFolder

    return matchesSearch && matchesFolder
  })

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b sticky top-0 z-10 bg-background">
        <div className="container flex items-center justify-between h-16 px-4">
          <h1 className="text-2xl font-bold animate-bounce">SkramkooB</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? "Cancel" : "Add Bookmark"}
            </Button>
          </div>
        </div>
        {showAddForm && (
          <div className="container px-4 py-4 border-b">
            <AddBookmarkForm
              onAdd={(bookmark) => {
                addBookmark(bookmark)
                setShowAddForm(false)
              }}
              folders={folders}
            />
          </div>
        )}
        <div className="container px-4 py-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search bookmarks..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <Tabs defaultValue="bookmarks" className="flex-1">
        <div className="container px-4 pt-4">
          <TabsList>
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
            <TabsTrigger value="folders">Folders</TabsTrigger>
            <TabsTrigger value="sync">Sync</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="bookmarks" className="flex-1 p-0">
          <div className="container px-4 py-4">
            <BookmarkList
              bookmarks={filteredBookmarks}
              folders={folders}
              onRemove={removeBookmark}
              onUpdate={updateBookmark}
            />
          </div>
        </TabsContent>

        <TabsContent value="folders" className="flex-1 p-0">
          <div className="container px-4 py-4">
            <FolderSidebar
              folders={folders}
              selectedFolder={selectedFolder}
              onSelectFolder={setSelectedFolder}
              onAddFolder={addFolder}
              onRemoveFolder={removeFolder}
              onUpdateFolder={updateFolder}
              bookmarks={bookmarks}
            />
          </div>
        </TabsContent>

        <TabsContent value="sync" className="flex-1 p-0">
          <div className="container px-4 py-4">
            <SyncPanel bookmarks={bookmarks} folders={folders} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


