"use client"

import type React from "react"

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
  Palette,
  Pencil,
  Image,
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
  const { steps, currentStep, showStep } = useWorkflow()
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
    "ri-image-line": <Image className="w-5 h-5" />,
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
      className={`${
        isSidebarCollapsed ? "w-[var(--sidebar-width-collapsed)]" : "w-[var(--sidebar-width)]"
      } flex-shrink-0 p-6 relative transition-all duration-300 border-r border-border/50 bg-gradient-to-b from-background to-background/95 backdrop-blur-sm`}
    >
      <button
        className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer z-10 shadow-lg border-none text-sm transition-all duration-300 hover:scale-110 hover:shadow-primary/30"
        onClick={toggleSidebar}
        aria-label={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>

      <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl overflow-y-auto h-[calc(100vh-8rem)] shadow-inner relative scrollbar-none border border-border/50">
        <div className="relative">
          {/* Header Background with Gradient Overlay */}
          <div className="absolute inset-0 h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent pointer-events-none" />
          
          {/* Main Header Content */}
          <div className="px-6 pt-6 pb-4 relative">
            {/* Profile Section */}
            <div className="flex flex-col items-center">
              {/* Profile Image Container */}
              <div 
                className="relative mb-4 cursor-pointer group"
                onClick={onOpenProfileModal}
                title={`Edit Website Profile & Settings ${profileData.ourDomain ? "(" + profileData.ourDomain + ")" : ""}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 scale-110 -z-10" />
                <img
                  src={profileData.logoUrl || DEFAULT_LOGO_SVG}
                  alt="Profile"
                  className={`${
                    isSidebarCollapsed ? "w-14 h-14" : "w-20 h-20"
                  } rounded-2xl object-cover shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-primary/20 border-2 border-background`}
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_LOGO_SVG
                  }}
                />
                {/* Decorative Ring */}
                <div className="absolute -inset-1 bg-gradient-to-br from-primary/50 to-primary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="px-4 py-2 bg-secondary/80 hover:bg-secondary/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenToolLibrary();
                  }}
                  title="Tool Library"
                >
                  <PenToolIcon className="w-4 h-4" />
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  className="px-4 py-2 bg-secondary/80 hover:bg-secondary/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenPromptLibrary();
                  }}
                  title="Prompt Library"
                >
                  <FileText className="w-4 h-4" />
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  className="px-4 py-2 bg-secondary/80 hover:bg-secondary/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    onResetWorkflow();
                  }}
                  title="Reset Workflow"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className={`flex items-center mt-6 gap-3 ${isSidebarCollapsed ? "justify-center" : ""}`}>
              <div className="flex-1 h-1.5 bg-primary/5 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full bg-gradient-to-r from-primary/90 to-primary/70 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
              </div>
              {!isSidebarCollapsed && (
                <div className="text-xs font-medium text-primary/80">{Math.round(progress)}%</div>
              )}
            </div>
          </div>
        </div>

        {/* Steps list */}
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-20rem)] scrollbar-none">
          <StepsList
            steps={allSteps}
            currentStep={currentStep}
            showStep={showStep}
            isCollapsed={isSidebarCollapsed}
            stepIcons={stepIcons}
          />
        </div>
      </div>
    </aside>
  )
}

function StepsList({
  steps,
  currentStep,
  showStep,
  isCollapsed,
  stepIcons,
}: {
  steps: any[]
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
              className={`step-item group ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
              onClick={() => showStep(step.id)}
              data-step-id={step.id}
              title={step.title}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {isCompleted
                    ? stepIcons["ri-check-line"]
                    : stepIcons[step.icon] || stepIcons["ri-checkbox-blank-circle-line"]}
                </div>
                {!isCollapsed && (
                  <span className="step-number">Step {step.id}</span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}

