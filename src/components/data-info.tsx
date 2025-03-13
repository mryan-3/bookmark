import { HardDrive, AlertTriangle, Download, Link } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function DataInfoCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <HardDrive className='h-5 w-5' />
          Data Storage & Backup
        </CardTitle>
        <CardDescription>
          Important information about your bookmarks
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='rounded-md bg-amber-50 p-3 dark:bg-amber-950/50'>
          <div className='flex items-start gap-2'>
            <AlertTriangle className='mt-0.5 h-4 w-4 text-amber-600 dark:text-amber-400' />
            <div className='space-y-1'>
              <p className='font-medium text-amber-800 dark:text-amber-300'>
                Local Storage Warning
              </p>
              <p className='text-sm text-amber-700 dark:text-amber-400'>
                Your bookmarks are stored in your browser's local storage.
                Clearing browser data, using private/incognito mode, or
                uninstalling your browser will erase your bookmarks.
              </p>
            </div>
          </div>
        </div>

        <div className='space-y-2'>
          <p className='font-medium'>How to prevent data loss:</p>
          <ul className='ml-6 list-disc space-y-1 text-sm'>
            <li className='flex items-start gap-1'>
              <Download className='mt-0.5 h-3.5 w-3.5 flex-shrink-0' />
              <span>
                <strong>Export regularly:</strong> Use the "Export JSON" button
                to save a backup file
              </span>
            </li>
            <li className='flex items-start gap-1'>
              <Link className='mt-0.5 h-3.5 w-3.5 flex-shrink-0' />
              <span>
                <strong>Create sync links:</strong> Generate and save a sync
                link to restore your data
              </span>
            </li>
          </ul>
        </div>

        <div className='text-sm text-muted-foreground'>
          <p>
            Vibe uses your browser's local storage to save bookmarks without
            requiring an account. This data persists until you clear your
            browser data or use the sync features to transfer it to another
            device.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
