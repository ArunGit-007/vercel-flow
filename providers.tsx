"use client"

import type React from "react"

import { WorkflowProvider } from "@/hooks/use-workflow";
import { FeedbackProvider } from "@/hooks/use-feedback";
import { ProfileProvider } from "@/hooks/use-profile";
import { ResourceLibraryProvider } from "@/hooks/useResourceLibrary"; // Import the new provider

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FeedbackProvider>
      <ProfileProvider>
        <ResourceLibraryProvider> {/* Wrap WorkflowProvider */}
          <WorkflowProvider>{children}</WorkflowProvider>
        </ResourceLibraryProvider>
      </ProfileProvider>
    </FeedbackProvider>
  )
}
