"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"

export default function QuickNavigation() {
  const [visible, setVisible] = useState(false)

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={`fixed right-6 bottom-6 z-40 transition-all duration-300 ${visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-5 pointer-events-none"}`}
    >
      <Button
        variant="default"
        size="icon"
        className="h-11 w-11 rounded-full shadow-lg"
        onClick={scrollToTop}
        title="Scroll to top"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </div>
  )
}

