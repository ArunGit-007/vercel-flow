"use client"

import type React from "react"

import { WorkflowProvider } from "@/hooks/use-workflow";
import { FeedbackProvider } from "@/hooks/use-feedback";
import { ProfileProvider } from "@/hooks/use-profile";
import { ResourceLibraryProvider } from "@/hooks/useResourceLibrary";
import { ThemeProvider } from "@/components/theme-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <FeedbackProvider>
        <ProfileProvider>
          <ResourceLibraryProvider>
            <WorkflowProvider>{children}</WorkflowProvider>
          </ResourceLibraryProvider>
        </ProfileProvider>
      </FeedbackProvider>
    </ThemeProvider>
  )
}
