'use client'

import { useEffect, useState } from 'react'
import type { Bookmark, Folder } from '@/types'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TwitterPreview } from '@/components/twitter-preview'
import { extractTwitterId } from '@/lib/utils'
import { Edit, Trash, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { ConfirmationDialog } from '@/components/confirmation-dialog'

interface BookmarkListProps {
  bookmarks: Bookmark[]
  folders: Folder[]
  onRemove: (id: string) => void
  onUpdate: (id: string, bookmark: Partial<Bookmark>) => void
  searchQuery?: string
  selectedFolder?: string | null
}

export function BookmarkList({
  bookmarks,
  folders,
  onRemove,
  onUpdate,
  searchQuery = '',
  selectedFolder = null,
}: BookmarkListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [editFolderId, setEditFolderId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bookmarkToDelete, setBookmarkToDelete] = useState<string | null>(null)
  const [matchedBookmarks, setMatchedBookmarks] = useState<
    Record<string, string[]>
  >({})

  useEffect(() => {
    if (!searchQuery) {
      setMatchedBookmarks({})
      return
    }

    const matches: Record<string, string[]> = {}

    bookmarks.forEach((bookmark) => {
      if (
        bookmark.tweetContent &&
        bookmark.tweetContent
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) &&
        !bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !(bookmark.notes || '')
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ) {
        // Find the context around the match
        const content = bookmark.tweetContent.toLowerCase()
        const index = content.indexOf(searchQuery.toLowerCase())
        const start = Math.max(0, index - 20)
        const end = Math.min(content.length, index + searchQuery.length + 20)
        const context = bookmark.tweetContent.substring(start, end)

        matches[bookmark.id] = [context]
      }
    })

    setMatchedBookmarks(matches)
  }, [searchQuery, bookmarks])

  const startEditing = (bookmark: Bookmark) => {
    setEditingId(bookmark.id)
    setEditTitle(bookmark.title)
    setEditNotes(bookmark.notes || '')
    setEditFolderId(bookmark.folderId)
  }

  const saveEdit = (id: string) => {
    onUpdate(id, {
      title: editTitle,
      notes: editNotes,
      folderId: editFolderId,
    })
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const confirmDelete = (id: string) => {
    setBookmarkToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = () => {
    if (bookmarkToDelete) {
      onRemove(bookmarkToDelete)
      setBookmarkToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  if (bookmarks.length === 0) {
    return (
      <div className='text-center py-12'>
        <h3 className='text-lg font-medium text-muted-foreground'>
          {searchQuery
            ? 'No bookmarks match your search'
            : selectedFolder
              ? 'No bookmarks in this folder'
              : 'No bookmarks found'}
        </h3>
        <p className='text-sm text-muted-foreground mt-1'>
          {searchQuery
            ? 'Try a different search term'
            : selectedFolder
              ? 'Add bookmarks to this folder to see them here'
              : 'Add your first Twitter bookmark to get started'}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {bookmarks.map((bookmark) => {
          const twitterId = extractTwitterId(bookmark.url)
          const folderName = folders.find(
            (f) => f.id === bookmark.folderId,
          )?.name
          const hasContentMatch = matchedBookmarks[bookmark.id]?.length > 0

          return (
            <Card
              key={bookmark.id}
              className={`overflow-hidden ${hasContentMatch ? 'ring-1 ring-primary' : ''}`}
            >
              {editingId === bookmark.id ? (
                <CardContent className='p-4 space-y-4'>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder='Title'
                  />
                  <Textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder='Notes'
                    rows={3}
                  />
                  <Select
                    value={editFolderId || ''}
                    onValueChange={(value) => setEditFolderId(value || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select folder' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='none'>No folder</SelectItem>
                      {folders.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id}>
                          {folder.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className='flex justify-end space-x-2'>
                    <Button variant='outline' onClick={cancelEdit}>
                      Cancel
                    </Button>
                    <Button onClick={() => saveEdit(bookmark.id)}>Save</Button>
                  </div>
                </CardContent>
              ) : (
                <>
                  <CardHeader className='p-4 pb-0'>
                    <div className='flex justify-between items-start'>
                      <CardTitle className='text-lg'>
                        {bookmark.title}
                      </CardTitle>
                      <div className='flex space-x-1'>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => startEditing(bookmark)}
                        >
                          <Edit className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => confirmDelete(bookmark.id)}
                        >
                          <Trash className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                    {folderName && (
                      <Badge variant='outline' className='mt-2'>
                        {folderName}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className='p-4'>
                    {twitterId && <TwitterPreview tweetId={twitterId} />}

                    {/* Add matched content display */}
                    {hasContentMatch && (
                      <div className='mt-3 p-2 bg-primary/5 border border-primary/20 rounded-md'>
                        <p className='text-xs font-medium text-primary mb-1'>
                          Matched in tweet content:
                        </p>
                        {matchedBookmarks[bookmark.id].map((match, i) => (
                          <p key={i} className='text-sm'>
                            "...{match}..."
                          </p>
                        ))}
                      </div>
                    )}

                    {bookmark.notes && (
                      <div className='mt-3 text-sm text-muted-foreground'>
                        {bookmark.notes}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className='p-4 pt-0 flex justify-between items-center'>
                    <div className='text-xs text-muted-foreground'>
                      {formatDistanceToNow(new Date(bookmark.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                    <Button variant='ghost' size='sm' asChild>
                      <a
                        href={bookmark.url}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        <ExternalLink className='h-4 w-4 mr-1' />
                        Open
                      </a>
                    </Button>
                  </CardFooter>
                </>
              )}
            </Card>
          )
        })}
      </div>

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title='Delete Bookmark'
        description='Are you sure you want to delete this bookmark? This action cannot be undone.'
        confirmText='Delete'
        cancelText='Cancel'
        onConfirm={handleDelete}
      />
    </>
  )
}
