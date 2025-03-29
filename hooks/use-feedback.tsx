"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

type FeedbackType = "success" | "error" | "warning" | "info"

interface FeedbackMessage {
  id: string
  message: string
  type: FeedbackType
}

type FeedbackContextType = {
  feedbacks: FeedbackMessage[]
  showFeedback: (message: string, type?: FeedbackType, duration?: number) => void
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined)

const FEEDBACK_DISPLAY_DURATION = 2500

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [feedbacks, setFeedbacks] = useState<FeedbackMessage[]>([])

  const showFeedback = (
    message: string,
    type: FeedbackType = "success",
    duration: number = FEEDBACK_DISPLAY_DURATION,
  ) => {
    const id = `feedback-${Date.now()}`
    const newFeedback = { id, message, type }

    setFeedbacks((prev) => [...prev, newFeedback])

    setTimeout(() => {
      setFeedbacks((prev) => prev.filter((f) => f.id !== id))
    }, duration)
  }

  return <FeedbackContext.Provider value={{ feedbacks, showFeedback }}>{children}</FeedbackContext.Provider>
}

export function useFeedback() {
  const context = useContext(FeedbackContext)
  if (context === undefined) {
    throw new Error("useFeedback must be used within a FeedbackProvider")
  }
  return context
}

