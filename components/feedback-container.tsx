"use client"

import { useEffect, useState } from "react"
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react"

type FeedbackType = "success" | "error" | "warning" | "info"

interface FeedbackMessage {
  id: string
  message: string
  type: FeedbackType
}

export default function FeedbackContainer({
  feedbacks,
}: {
  feedbacks: FeedbackMessage[]
}) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 w-auto max-w-[90%]">
      {feedbacks.map((feedback) => (
        <FeedbackMessage key={feedback.id} message={feedback.message} type={feedback.type} />
      ))}
    </div>
  )
}

function FeedbackMessage({
  message,
  type,
}: {
  message: string
  type: FeedbackType
}) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 10)
    return () => clearTimeout(timer)
  }, [])

  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
  }

  return (
    <div className={`feedback-message ${type} ${show ? "show" : ""}`}>
      {icons[type]}
      {message}
    </div>
  )
}

