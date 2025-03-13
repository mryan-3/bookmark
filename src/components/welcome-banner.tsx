'use client'

import {Info, HardDrive, Share2, FolderArchive } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export function WelcomeBanner() {
  {
    /*
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if this is the first visit
    const hasSeenWelcome = localStorage.getItem('vibe-welcome-seen')
    if (!hasSeenWelcome) {
      setIsVisible(true)
    }
  }, [])

  const dismissBanner = () => {
    localStorage.setItem('vibe-welcome-seen', 'true')
    setIsVisible(false)
  }

  if (!isVisible) return null
      */
  }

  return (
    <Card className='mb-6 border-primary/20 bg-primary/5'>
      <CardHeader className='pb-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Info className='h-5 w-5 text-primary' />
            <CardTitle className='text-xl font-bold'>Welcome to SkramkooB</CardTitle>
          </div>
        </div>
        <CardDescription>Your personal bookmark manager</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type='single' collapsible className='w-full'>
          <AccordionItem value='features'>
            <AccordionTrigger>Key Features</AccordionTrigger>
            <AccordionContent>
              <ul className='ml-6 list-disc space-y-1 text-sm'>
                <li>Save Twitter/X posts with custom titles and notes</li>
                <li>Organize bookmarks into folders</li>
                <li>Search and filter your collection</li>
                <li>Sync across devices without signing up</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='data'>
            <AccordionTrigger>How Your Data is Stored</AccordionTrigger>
            <AccordionContent>
              <div className='space-y-2 text-sm'>
                <p>
                  <strong>Local Storage:</strong> All your bookmarks and folders
                  are saved in your browser's local storage. This means:
                </p>
                <ul className='ml-6 list-disc space-y-1'>
                  <li>Your data stays on your device</li>
                  <li>No account required</li>
                  <li>Data persists between sessions</li>
                  <li>
                    <span className='text-destructive font-medium'>
                      Warning:
                    </span>{' '}
                    Clearing browser data will erase your bookmarks
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='backup'>
            <AccordionTrigger>Preventing Data Loss</AccordionTrigger>
            <AccordionContent>
              <div className='space-y-2 text-sm'>
                <p>To ensure your bookmarks aren't lost:</p>
                <ul className='ml-6 list-disc space-y-1'>
                  <li>
                    <strong>Export regularly:</strong> Use the "Export JSON"
                    button in the Sync tab
                  </li>
                  <li>
                    <strong>Generate sync links:</strong> Create and save a sync
                    link to restore your data
                  </li>
                  <li>
                    <strong>Use multiple devices:</strong> Sync your bookmarks
                    across devices as a backup
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className='flex justify-between w-full border-t pt-4'>
        <div className='flex gap-4 text-sm text-muted-foreground w-full ustify-between'>
          <div className='flex items-center'>
            <HardDrive className='mr-1 h-4 w-4' />
            <p className='text-xs md:text-sm'>Local Storage</p>
          </div>
          <div className='flex items-center'>
            <Share2 className='mr-1 h-4 w-4' />

            <p className='text-xs md:text-sm'>Device Sync</p>
          </div>
          <div className='flex items-center'>
            <FolderArchive className='mr-1 h-4 w-4' />
            <p className='text-xs md:text-sm'>No Sign-up</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
