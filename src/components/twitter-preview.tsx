"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"

interface TwitterPreviewProps {
  tweetId: string
}

export function TwitterPreview({ tweetId }: TwitterPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tweetRenderedRef = useRef<boolean>(false)

  useEffect(() => {
    // Skip if window.twttr is not available or container is not mounted
    if (!containerRef.current) return

    // Reset the rendered flag when tweet ID changes
    tweetRenderedRef.current = false

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
      // Prevent rendering if already rendered or container not available
      if (!containerRef.current || tweetRenderedRef.current) return

      // Clear the container before rendering
      containerRef.current.innerHTML = ""

      if (window.twttr) {
        window.twttr.widgets.createTweet(tweetId, containerRef.current, {
          theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
          dnt: true,
          width: "100%",
        }).then(() => {
          // Mark as rendered after successful rendering
          tweetRenderedRef.current = true
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
          // Reset rendered flag when theme changes
          tweetRenderedRef.current = false
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
      // Clean up when unmounting or when tweetId changes
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
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


