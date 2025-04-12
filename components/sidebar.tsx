"use client"

import type React from "react"
import Image from "next/image" // Import next/image
import { useState, useEffect } from "react"
import { useWorkflow } from "@/hooks/use-workflow"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useProfile } from "@/hooks/use-profile"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  PenToolIcon,
  FileText,
  RotateCcw,
  Search,
  Lightbulb,
  BotIcon as Robot,
  FlaskRoundIcon as Flask,
  FileIcon as FileList,
  Edit,
  // Palette, // Removed unused import
  // Pencil, // Removed unused import
  LucideImage, // Renamed Image import to avoid conflict with next/image
  MessageSquare,
  FileCheck,
  Link,
  Code,
  CheckCircle,
  CheckSquare,
  Settings,
  Shield,
  Feather,
  LineChart,
} from "lucide-react"

export default function Sidebar({
  onOpenToolLibrary,
  onOpenPromptLibrary,
  onResetWorkflow,
  onOpenProfileModal,
}: {
  onOpenToolLibrary: () => void
  onOpenPromptLibrary: () => void
  onResetWorkflow: () => void
  onOpenProfileModal: () => void
}) {
  const { currentStep, showStep } = useWorkflow() // Removed unused 'steps'
  const { profileData } = useProfile()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorage("sidebarCollapsed", false)
  const [progress, setProgress] = useState(0)

  // Define all the step icons
  const stepIcons: Record<string, React.ReactNode> = {
    "ri-search-eye-line": <Search className="w-5 h-5" />,
    "ri-lightbulb-flash-line": <Lightbulb className="w-5 h-5" />,
    "ri-robot-2-line": <Robot className="w-5 h-5" />,
    "ri-flask-line": <Flask className="w-5 h-5" />,
    "ri-file-list-3-line": <FileList className="w-5 h-5" />,
    "ri-quill-pen-line": <Feather className="w-5 h-5" />,
    "ri-seo-line": <LineChart className="w-5 h-5" />,
    "ri-image-line": <LucideImage className="w-5 h-5" />, // Use renamed import
    "ri-user-voice-line": <MessageSquare className="w-5 h-5" />,
    "ri-edit-line": <Edit className="w-5 h-5" />,
    "ri-shield-check-line": <Shield className="w-5 h-5" />,
    "ri-file-shield-2-line": <FileCheck className="w-5 h-5" />,
    "ri-settings-3-line": <Settings className="w-5 h-5" />,
    "ri-code-s-slash-line": <Code className="w-5 h-5" />,
    "ri-link-m": <Link className="w-5 h-5" />,
    "ri-check-double-line": <CheckSquare className="w-5 h-5" />,
    "ri-checkbox-blank-circle-line": <div className="w-2 h-2 rounded-full bg-current" />,
    "ri-check-line": <CheckCircle className="w-5 h-5" />
  }

  // Complete list of steps from the original HTML
  const allSteps = [
    {
      id: 1,
      title: "Competitor & Keyword Research",
      icon: "ri-search-eye-line",
      category: "Research & Planning",
    },
    {
      id: 2,
      title: "Topic & Headline Brainstorm",
      icon: "ri-lightbulb-flash-line",
      category: "Research & Planning",
    },
    {
      id: 3,
      title: "AI Research (Perplexity)",
      icon: "ri-robot-2-line",
      category: "Research & Planning",
    },
    {
      id: 4,
      title: "Deep Research (Gemini/Grok)",
      icon: "ri-flask-line",
      category: "Research & Planning",
    },
    {
      id: 5,
      title: "Outline Creation (NotebookLM)",
      icon: "ri-file-list-3-line",
      category: "Content Creation",
    },
    {
      id: 6,
      title: "AI-Assisted Drafting (Claude)",
      icon: "ri-quill-pen-line",
      category: "Content Creation",
    },
    {
      id: 7,
      title: "Initial SEO Optimization",
      icon: "ri-seo-line",
      category: "Content Creation",
    },
    {
      id: 8,
      title: "Multimedia & Stock Images",
      icon: "ri-image-line",
      category: "Content Creation",
    },
    {
      id: 9,
      title: "Engagement Elements (FAQs/CTAs)",
      icon: "ri-user-voice-line",
      category: "Content Creation",
    },
    {
      id: 10,
      title: "Human Edit: Grammar & Mechanics",
      icon: "ri-edit-line",
      category: "Refinement & Optimization",
    },
    {
      id: 11,
      title: "Human Edit: Fact-Checking & Refinement",
      icon: "ri-shield-check-line",
      category: "Refinement & Optimization",
    },
    {
      id: 12,
      title: "Plagiarism Check",
      icon: "ri-file-shield-2-line",
      category: "Refinement & Optimization",
    },
    {
      id: 13,
      title: "Final SEO & Technical Check",
      icon: "ri-settings-3-line",
      category: "Refinement & Optimization",
    },
    {
      id: 14,
      title: "Code Formatting & Cleanup",
      icon: "ri-code-s-slash-line",
      category: "Refinement & Optimization",
    },
    {
      id: 15,
      title: "Link Analysis & Optimization",
      icon: "ri-link-m",
      category: "Refinement & Optimization",
    },
    {
      id: 16,
      title: "Final Review & Publish Readiness",
      icon: "ri-check-double-line",
      category: "Refinement & Optimization",
    }
  ]

  useEffect(() => {
    const completedSteps = Math.max(0, currentStep - 1)
    const totalSteps = allSteps.length
    const calculatedProgress = currentStep > totalSteps ? 100 : totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0
    setProgress(calculatedProgress)
  }, [currentStep, allSteps.length])

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const DEFAULT_LOGO_SVG =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2364748b'%3E%3Cpath d='M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4ZM12 6C14.21 6 16 7.79 16 10C16 12.21 14.21 14 12 14C9.79 14 8 12.21 8 10C8 7.79 9.79 6 12 6ZM12 15C15.31 15 18 16.79 18 18V19H6V18C6 16.79 8.69 15 12 15Z'%3E%3C/path%3E%3C/svg%3E"

  return (
    <aside
      className={`${ // Use template literal for cleaner className construction
        isSidebarCollapsed ? "w-[var(--sidebar-width-collapsed)]" : "w-[var(--sidebar-width)]"
      } flex-shrink-0 relative transition-all duration-300 bg-card rounded-lg border border-border flex flex-col`} // Ensure all classes are within the template literal
    >
      {/* Collapse/Expand Button */}
      <button
        className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer z-20 shadow-md border-none text-sm transition-all duration-300 hover:scale-105 hover:shadow-md"
        onClick={toggleSidebar}
        aria-label={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>

      {/* Header Section */}
      <div className="px-4 pt-4 pb-4 relative flex-shrink-0"> {/* Padding for header content */}
        <div className="flex flex-col items-center">
          {/* Profile Image */}
          <div
            className="relative mb-4 cursor-pointer group"
            onClick={onOpenProfileModal}
            title={`Edit Website Profile & Settings ${profileData.ourDomain ? "(" + profileData.ourDomain + ")" : ""}`}
          >
            <Image
              src={profileData.logoUrl || DEFAULT_LOGO_SVG}
              alt="Profile Logo"
              width={isSidebarCollapsed ? 56 : 80}
              height={isSidebarCollapsed ? 56 : 80}
              className={`${
                isSidebarCollapsed ? "w-14 h-14" : "w-20 h-20"
              } rounded-lg object-cover shadow-md transition-all duration-300 group-hover:scale-105 border border-border`}
            />
          </div>
          {/* Action Buttons */}
          <div className={`flex gap-1 mt-3 ${isSidebarCollapsed ? 'flex-col' : ''}`}>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-secondary" onClick={(e) => { e.stopPropagation(); onOpenToolLibrary(); }} title="Tool Library">
              <PenToolIcon className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-secondary" onClick={(e) => { e.stopPropagation(); onOpenPromptLibrary(); }} title="Prompt Library">
              <FileText className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-secondary" onClick={(e) => { e.stopPropagation(); onResetWorkflow(); }} title="Reset Workflow">
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        </div>
        {/* Progress Bar */}
        <div className={`flex items-center mt-4 gap-2 ${isSidebarCollapsed ? "justify-center" : ""}`}>
          <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          {!isSidebarCollapsed && (
            <div className="text-xs font-medium text-muted-foreground">{Math.round(progress)}%</div>
          )}
        </div>
      </div>

      {/* Steps List Section - Takes remaining space and scrolls */}
      <div className="px-2 py-2 overflow-y-auto scrollbar-none flex-grow"> {/* Padding for steps list */}
        <StepsList
          steps={allSteps}
          currentStep={currentStep}
          showStep={showStep}
          isCollapsed={isSidebarCollapsed}
          stepIcons={stepIcons}
        />
      </div>
    </aside>
  )
}

// Define Step interface before StepsList
interface Step {
  id: number;
  title: string;
  icon: string;
  category: string;
}

function StepsList({
  steps,
  currentStep,
  showStep,
  isCollapsed,
  stepIcons,
}: {
  steps: Step[] // Use specific Step interface
  currentStep: number
  showStep: (stepId: number) => void
  isCollapsed: boolean
  stepIcons: Record<string, React.ReactNode>
}) {
  let currentCategory: string | null = null;

  return (
    <>
      {steps.map((step) => {
        const isNewCategory = step.category !== currentCategory;
        if (isNewCategory) {
          currentCategory = step.category;
        }

        const isCompleted = step.id < currentStep
        const isActive = step.id === currentStep

        return (
          <div key={step.id}>
            {isNewCategory && !isCollapsed && (
              <div className="step-category">
                {currentCategory}
              </div>
            )}
            <div
              className={`step-item group ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""} ${
                isCollapsed ? "justify-center" : ""
              }`}
              onClick={() => showStep(step.id)}
              data-step-id={step.id}
              title={step.title}
            >
              <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
                <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md ${ /* Ensure consistent icon container size */
                  isCollapsed ? "hover:bg-secondary" : "" /* Use secondary for hover */
                }`}>
                  {isCompleted
                    ? stepIcons["ri-check-line"] // Check icon already defined
                    : stepIcons[step.icon] || stepIcons["ri-checkbox-blank-circle-line"]} {/* Default icon */}
                </div>
                {!isCollapsed && (
                  <span className="step-number">Step {step.id}</span> /* Reverted to show Step number */
                )}
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}
