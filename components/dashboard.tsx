"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import ContentArea from "@/components/content-area"
import FinalMessage from "@/components/final-message"
import FeedbackContainer from "@/components/feedback-container"
import { ToolModal, ToolLibraryModal } from "@/components/tool-modals"
import { PromptModal, PromptLibraryModal } from "@/components/prompt-modals"
import ProfileModal from "@/components/profile-modal"
import QuickNavigation from "@/components/quick-navigation"
import { useWorkflow } from "@/hooks/use-workflow"
import { useFeedback } from "@/hooks/use-feedback"

export default function Dashboard() {
  const { currentStep, steps, resetWorkflow } = useWorkflow()
  const { feedbacks } = useFeedback()
  const [showModals, setShowModals] = useState({
    addTool: false,
    toolLibrary: false,
    promptForm: false,
    promptLibrary: false,
    profile: false,
  })

  const toggleModal = (modalName: keyof typeof showModals, state?: boolean) => {
    setShowModals((prev) => ({
      ...prev,
      [modalName]: state !== undefined ? state : !prev[modalName],
    }))
  }

  const isWorkflowComplete = currentStep > steps.length

  return (
    <div className="container max-w-[1800px] mx-auto px-4 md:px-6"> {/* Adjusted padding */}
      {/* Simplified outer container */}
      <div
        className={`flex mt-6 mb-6 min-h-[calc(100vh-3rem)] relative ${isWorkflowComplete ? "hidden" : ""}`} /* Removed rounded, shadow, border, bg, adjusted margin/min-height */
      >
        {/* Removed styling from inner container, kept flex layout and gap */}
        <div className="flex-1 flex gap-2">
          <Sidebar
            onOpenToolLibrary={() => toggleModal("toolLibrary", true)}
            onOpenPromptLibrary={() => toggleModal("promptLibrary", true)}
            onResetWorkflow={resetWorkflow}
            onOpenProfileModal={() => toggleModal("profile", true)}
          />

          <ContentArea
            onOpenAddTool={() => toggleModal("addTool", true)}
            onOpenPromptForm={() => toggleModal("promptForm", true)}
          />
        </div>
      </div>

      {isWorkflowComplete && <FinalMessage />}

      <FeedbackContainer feedbacks={feedbacks} />

      {/* Modals */}
      <ToolModal isOpen={showModals.addTool} onClose={() => toggleModal("addTool", false)} />
      <ToolLibraryModal isOpen={showModals.toolLibrary} onClose={() => toggleModal("toolLibrary", false)} />
      <PromptModal isOpen={showModals.promptForm} onClose={() => toggleModal("promptForm", false)} />
      <PromptLibraryModal isOpen={showModals.promptLibrary} onClose={() => toggleModal("promptLibrary", false)} />
      <ProfileModal isOpen={showModals.profile} onClose={() => toggleModal("profile", false)} />

      <QuickNavigation />
    </div>
  )
}
