"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"

interface TwitterPreviewProps {
  tweetId: string
}

export function TwitterPreview({ tweetId }: TwitterPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Skip if window.twttr is not available or container is not mounted
    if (!containerRef.current) return

    // Clean up any existing tweet
    if (containerRef.current) {
      containerRef.current.innerHTML = ""
    }

    // Load Twitter widget script if not already loaded
    if (!window.twttr) {
      const script = document.createElement("script")
      script.setAttribute("src", "https://platform.twitter.com/widgets.js")
      script.setAttribute("async", "true")
      document.head.appendChild(script)

      script.onload = () => {
        renderTweet()
      }
    } else {
      renderTweet()
    }

    function renderTweet() {
      if (window.twttr && containerRef.current) {
        window.twttr.widgets.createTweet(tweetId, containerRef.current, {
          theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
          dnt: true,
          width: "100%",
        })
      }
    }

    // Re-render tweet when theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class" &&
          mutation.target === document.documentElement
        ) {
          renderTweet()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => {
      observer.disconnect()
    }
  }, [tweetId])

  return (
    <div ref={containerRef} className="twitter-embed">
      <Card className="p-4 flex items-center justify-center min-h-[150px]">
        <p className="text-sm text-muted-foreground">Loading tweet...</p>
      </Card>
    </div>
  )
}


