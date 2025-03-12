'use client'

import { useState } from 'react'
import type { Folder, Bookmark } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FolderIcon, Plus, Edit, Trash, ChevronRight } from 'lucide-react'

interface FolderSidebarProps {
  folders: Folder[]
  selectedFolder: string | null
  onSelectFolder: (id: string | null) => void
  onAddFolder: (folder: Folder) => void
  onRemoveFolder: (id: string) => void
  onUpdateFolder: (id: string, folder: Partial<Folder>) => void
  bookmarks: Bookmark[]
}

export function FolderSidebar({
  folders,
  selectedFolder,
  onSelectFolder,
  onAddFolder,
  onRemoveFolder,
  onUpdateFolder,
  bookmarks,
}: FolderSidebarProps) {
  const [newFolderName, setNewFolderName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const handleAddFolder = () => {
    if (!newFolderName.trim()) return

    const newFolder: Folder = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      createdAt: new Date().toISOString(),
    }

    onAddFolder(newFolder)
    setNewFolderName('')
    setIsAddDialogOpen(false)
  }

  const startEditing = (folder: Folder) => {
    setEditingId(folder.id)
    setEditName(folder.name)
  }

  const saveEdit = (id: string) => {
    if (!editName.trim()) return

    onUpdateFolder(id, { name: editName.trim() })
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const getBookmarkCount = (folderId: string | null) => {
    return bookmarks.filter((b) => b.folderId === folderId).length
  }

  const handleRemoveFolder = (id: string) => {
    // Check if folder has bookmarks
    const hasBookmarks = bookmarks.some((b) => b.folderId === id)

    if (hasBookmarks) {
      if (
        confirm(
          "This folder contains bookmarks. Moving them to 'Uncategorized' will remove them from this folder. Continue?",
        )
      ) {
        onRemoveFolder(id)
      }
    } else {
      onRemoveFolder(id)
    }

    if (selectedFolder === id) {
      onSelectFolder(null)
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-bold'>Folders</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size='sm'>
              <Plus className='h-4 w-4 mr-1' />
              New Folder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new folder</DialogTitle>
              <DialogDescription>
                Enter a name for your new folder
              </DialogDescription>
            </DialogHeader>
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder='Folder name'
              className='my-4'
            />
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddFolder}
                disabled={!newFolderName.trim()}
              >
                Create Folder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className='space-y-2'>
        <Card
          className={`cursor-pointer ${selectedFolder === null ? 'bg-accent text-muted' : 'hover:bg-accent  hover:text-muted'}`}
          onClick={() => onSelectFolder(null)}
        >
          <CardContent className='p-3 flex justify-between items-center'>
            <div className='flex items-center'>
              <FolderIcon
                className={`h-4 w-4 mr-2  ${selectedFolder === null ? 'text-muted' : ''}`}
              />
              <span>All Bookmarks</span>
            </div>
            <div className='flex items-center'>
              <p>{bookmarks.length}</p>
              <ChevronRight className={`h-4 w-4 ml-1`} />
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer ${selectedFolder === 'uncategorized' ? 'bg-accent text-muted' : 'hover:bg-accent  hover:text-muted'}`}
          onClick={() => onSelectFolder('uncategorized')}
        >
          <CardContent className='p-3 flex justify-between items-center'>
            <div className='flex items-center'>
              <FolderIcon
                className={`h-4 w-4 mr-2  ${selectedFolder === 'uncategorized' ? 'text-muted' : ''}`}
              />
              <span>Uncategorized</span>
            </div>
            <div className='flex items-center'>
              <p>{getBookmarkCount(null)}</p>
              <ChevronRight className='h-4 w-4 ml-1 ' />
            </div>
          </CardContent>
        </Card>

        {folders.map((folder) => (
          <Card
            key={folder.id}
            className={`${selectedFolder === folder.id ? 'bg-accent text-muted' : 'hover:bg-accent  hover:text-muted'}`}
          >
            <CardContent className='p-3'>
              {editingId === folder.id ? (
                <div className='flex items-center space-x-2'>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder='Folder name'
                    className='flex-1'
                    autoFocus
                  />
                  <Button size='sm' variant='ghost' onClick={cancelEdit}>
                    Cancel
                  </Button>
                  <Button size='sm' onClick={() => saveEdit(folder.id)}>
                    Save
                  </Button>
                </div>
              ) : (
                <div className='flex justify-between items-center'>
                  <div
                    className='flex items-center flex-1 cursor-pointer'
                    onClick={() => onSelectFolder(folder.id)}
                  >
                    <FolderIcon
                      className={`h-4 w-4 mr-2  ${selectedFolder === folder.id ? 'text-muted' : ''}`}
                    />
                    <span>{folder.name}</span>
                  </div>
                  <div className='flex items-center'>
                    <p className='mr-2'>{getBookmarkCount(folder.id)}</p>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => startEditing(folder)}
                    >
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleRemoveFolder(folder.id)}
                    >
                      <Trash className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {folders.length === 0 && (
        <div className='text-center py-8'>
          <p className='text-muted-foreground'>No folders created yet</p>
          <p className='text-sm text-muted-foreground mt-1'>
            Create folders to organize your bookmarks
          </p>
        </div>
      )}
    </div>
  )
}
