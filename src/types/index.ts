export interface Bookmark {
  id: string
  url: string
  title: string
  notes?: string
  folderId: string | null
  createdAt: string
  tweetContent?: string
}

export interface Folder {
  id: string
  name: string
  createdAt: string
}

declare global {
  interface Window {
    twttr: any
  }
}


