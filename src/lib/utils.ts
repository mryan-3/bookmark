import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractTwitterId(url: string): string | null {
  if (!url) return null

  try {
    const patterns = [
      /twitter\.com\/\w+\/status\/(\d+)/i,
      /x\.com\/\w+\/status\/(\d+)/i,
      /t\.co\/(\w+)/i,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }

    return null
  } catch (error) {
    console.error('Error extracting Twitter ID:', error)
    return null
  }
}
