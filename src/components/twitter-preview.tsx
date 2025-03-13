'use client'
import { Tweet } from 'react-tweet'

export const IndexPage = () => <Tweet id='1628832338187636740' />

interface TwitterPreviewProps {
  tweetId: string
}

export function TwitterPreview({ tweetId }: TwitterPreviewProps) {
  return (
    <div className='light'>
      <Tweet id={tweetId} />
    </div>
  )
}
