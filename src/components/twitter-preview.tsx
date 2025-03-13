'use client'
import { Tweet } from 'react-tweet'
import { ClientTweetCard } from './tweet-component'

export const IndexPage = () => <Tweet id='1628832338187636740' />

interface TwitterPreviewProps {
  tweetId: string
}

export function TwitterPreview({ tweetId }: TwitterPreviewProps) {
  return (
    <div className='light'>
      <ClientTweetCard id={tweetId} />
    </div>
  )
}
