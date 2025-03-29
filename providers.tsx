"use client"

import type React from "react"

import { WorkflowProvider } from "@/hooks/use-workflow"
import { FeedbackProvider } from "@/hooks/use-feedback"
import { ProfileProvider } from "@/hooks/use-profile"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FeedbackProvider>
      <ProfileProvider>
        <WorkflowProvider>{children}</WorkflowProvider>
      </ProfileProvider>
    </FeedbackProvider>
  )
}

