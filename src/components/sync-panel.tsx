'use client'

import { useState, useEffect } from 'react'
import type { Bookmark, Folder } from '@/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from '@/lib/compression'
import { QRCodeSVG } from 'qrcode.react'
import {
  Copy,
  Download,
  Upload,
  RefreshCw,
  Check,
  Smartphone,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { toast } from 'sonner'

interface SyncPanelProps {
  bookmarks: Bookmark[]
  folders: Folder[]
}

export function SyncPanel({ bookmarks, folders }: SyncPanelProps) {
  const [syncUrl, setSyncUrl] = useState('')
  const [importUrl, setImportUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    // Generate sync URL when component mounts
    generateSyncUrl()
  }, [bookmarks, folders])

  const generateSyncUrl = async () => {
    setIsGenerating(true)

    try {
      const data = {
        bookmarks,
        folders,
        timestamp: new Date().toISOString(),
      }

      const jsonString = JSON.stringify(data)
      const compressed = compressToEncodedURIComponent(jsonString)

      // Create a shareable URL with the compressed data
      const baseUrl = window.location.origin
      const url = `${baseUrl}?data=${compressed}`

      setSyncUrl(url)
    } catch (error) {
      console.error('Error generating sync URL:', error)
      {
        /*
      toast({
        title: "Error generating sync URL",
        description: "Please try again later",
        variant: "destructive",
      })
        */
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(syncUrl)
    setCopied(true)

    {
      /*
    toast({
      title: 'Link copied!',
      description: 'Share this link to sync your bookmarks across devices',
    })
        */
    }

    setTimeout(() => setCopied(false), 2000)
  }

  const exportData = () => {
    const data = {
      bookmarks,
      folders,
      exportedAt: new Date().toISOString(),
    }

    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `vibe-bookmarks-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    {
      /*
    toast({
      title: 'Bookmarks exported!',
      description: 'Your bookmarks have been exported as a JSON file',
    })
    */
    }
  }

  const handleImportFromUrl = () => {
    if (!importUrl) return

    try {
      // Extract the data parameter from the URL
      const url = new URL(importUrl)
      const data = url.searchParams.get('data')

      if (!data) {
        throw new Error('No data found in URL')
      }

      // Decompress and parse the data
      const decompressed = decompressFromEncodedURIComponent(data)
      const parsed = JSON.parse(decompressed)

      if (!parsed.bookmarks || !parsed.folders) {
        throw new Error('Invalid data format')
      }

      // Dispatch an event to notify the app to import the data
      const event = new CustomEvent('vibe:import', { detail: parsed })
      window.dispatchEvent(event)

      {
        /*
      toast({
        title: 'Import successful!',
        description: `Imported ${parsed.bookmarks.length} bookmarks and ${parsed.folders.length} folders`,
      })
      */
      }

      setImportUrl('')
    } catch (error) {
      console.error('Error importing data:', error)

      {
        /*
      toast({
        title: 'Import failed',
        description: 'The URL provided does not contain valid bookmark data',
        variant: 'destructive',
      })
      */
      }
    }
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Sync Your Bookmarks</CardTitle>
          <CardDescription>
            Share your bookmarks across devices without signing up
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='link'>
            <TabsList className='mb-4'>
              <TabsTrigger value='link'>Sync Link</TabsTrigger>
              <TabsTrigger value='qr'>QR Code</TabsTrigger>
              <TabsTrigger value='import'>Import</TabsTrigger>
            </TabsList>

            <TabsContent value='link' className='space-y-4'>
              <div className='flex space-x-2'>
                <Input value={syncUrl} readOnly className='font-mono text-xs' />
                <Button onClick={copyToClipboard} disabled={isGenerating}>
                  {copied ? (
                    <Check className='h-4 w-4 mr-1' />
                  ) : (
                    <Copy className='h-4 w-4 mr-1' />
                  )}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>

              <div className='flex space-x-2'>
                <Button
                  variant='outline'
                  onClick={generateSyncUrl}
                  className='flex-1'
                >
                  <RefreshCw className='h-4 w-4 mr-1' />
                  Regenerate Link
                </Button>
                <Button
                  variant='outline'
                  onClick={exportData}
                  className='flex-1'
                >
                  <Download className='h-4 w-4 mr-1' />
                  Export JSON
                </Button>
              </div>

              <Alert>
                <Smartphone className='h-4 w-4' />
                <AlertTitle>How to use</AlertTitle>
                <AlertDescription>
                  Copy this link and open it on another device to sync your
                  bookmarks. The link contains all your bookmark data.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value='qr' className='space-y-4'>
              <div className='flex justify-center p-4 bg-white rounded-lg'>
                {syncUrl ? (
                  <QRCodeSVG value={syncUrl} size={200} />
                ) : (
                  <div className='h-[200px] w-[200px] flex items-center justify-center'>
                    <RefreshCw className='h-8 w-8 animate-spin text-muted-foreground' />
                  </div>
                )}
              </div>

              <Alert>
                <Smartphone className='h-4 w-4' />
                <AlertTitle>How to use</AlertTitle>
                <AlertDescription>
                  Scan this QR code with your phone's camera to open the sync
                  link on your mobile device.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value='import' className='space-y-4'>
              <div className='flex space-x-2'>
                <Input
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  placeholder='Paste sync link here'
                  className='flex-1'
                />
                <Button onClick={handleImportFromUrl} disabled={!importUrl}>
                  <Upload className='h-4 w-4 mr-1' />
                  Import
                </Button>
              </div>

              <Alert>
                <AlertTitle>Note</AlertTitle>
                <AlertDescription>
                  Importing will merge the bookmarks and folders from the link
                  with your existing data. Duplicates will be handled
                  automatically.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
