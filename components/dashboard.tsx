"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import ContentArea from "@/components/content-area"
import FinalMessage from "@/components/final-message"
import FeedbackContainer from "@/components/feedback-container";
// import { ToolLibraryModal } from "@/components/tool-modals"; // Remove ToolLibraryModal import
// import { PromptLibraryModal } from "@/components/prompt-modals"; // Remove PromptLibraryModal import
import ResourceLibraryModal from "@/components/resource-library-modal"; // Import the new modal
import ProfileModal from "@/components/profile-modal";
import QuickNavigation from "@/components/quick-navigation";
import { useWorkflow } from "@/hooks/use-workflow";
import { useFeedback } from "@/hooks/use-feedback"

export default function Dashboard() {
  const { currentStep, steps, resetWorkflow } = useWorkflow()
  const { feedbacks } = useFeedback();
  const [showModals, setShowModals] = useState({
    // toolLibrary: false, // Remove state for tool library modal
    // promptLibrary: false, // Remove state for prompt library modal
    resourceLibrary: false, // Add state for unified resource library modal
    profile: false,
  });

  // Update toggleModal type to include resourceLibrary
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
            // onOpenToolLibrary={() => toggleModal("toolLibrary", true)} // Remove prop
            // onOpenPromptLibrary={() => toggleModal("promptLibrary", true)} // Remove prop
            onOpenResourceLibrary={() => toggleModal("resourceLibrary", true)} // Add new prop
            onResetWorkflow={resetWorkflow}
            onOpenProfileModal={() => toggleModal("profile", true)}
          />

          <ContentArea
            // onOpenAddTool={() => toggleModal("addTool", true)} // Remove prop
            // onOpenPromptForm={() => toggleModal("promptForm", true)} // Remove prop
          />
         </div>
       </div>

       {isWorkflowComplete && <FinalMessage />} {/* Re-add conditional rendering of FinalMessage */}

       <FeedbackContainer feedbacks={feedbacks} />

      {/* Modals */}
      {/* Removed old library modals */}
      <ResourceLibraryModal isOpen={showModals.resourceLibrary} onClose={() => toggleModal("resourceLibrary", false)} /> {/* Render the new modal */}
      <ProfileModal isOpen={showModals.profile} onClose={() => toggleModal("profile", false)} />

      <QuickNavigation />
    </div>
  )
}
