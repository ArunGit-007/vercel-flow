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
  const { currentStep, steps, stepOutputs, resetWorkflow } = useWorkflow()
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
    <div className="container max-w-[1800px] mx-auto px-6">
      <div
        className={`flex rounded-2xl shadow-lg overflow-hidden border bg-card mt-8 mb-8 min-h-[calc(100vh-4rem)] relative ${isWorkflowComplete ? "hidden" : ""}`}
      >
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

