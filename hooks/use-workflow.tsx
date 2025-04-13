"use client"

import type React from "react";
import { createContext, useContext, useState, useEffect, useCallback } from "react"; // Add useCallback
import { useFeedback } from "@/hooks/use-feedback";
import { useProfile, ProfileData } from "@/hooks/use-profile"; // Import useProfile and ProfileData

// Define interfaces (and export them)
export interface Tool {
  name: string
  url: string
  category: string
}

export interface InputField {
  name: string
  label: string
  placeholder: string
  isMultiInput?: boolean
  maxItems?: number
}

export interface OutputField {
  name: string
  label: string
  placeholder: string
}

export interface Step {
  id: number
  title: string
  icon: string
  category: string
  // tools?: Tool[] // Remove default tools from step definition - will be managed by assignments
  inputField?: InputField[]
  outputFields?: OutputField[]
  description: string
}

export interface Prompt {
  id: number
  category: string
  title: string
  content: string
  favorite: boolean
}

// Define the workflow context type
type WorkflowContextType = {
  steps: Step[]
  currentStep: number
  stepOutputs: Record<number, Record<string, any>>
  primaryKeyword: string
  blogOutlineText: string
  // promptTemplates: Record<string, Prompt[]> // Prompt definitions will be managed elsewhere
  assignedPrompts: Record<number, Prompt[]> // State for assigned prompts per step
  assignedTools: Record<number, Tool[]> // State for assigned tools per step
  showStep: (stepId: number) => void
  nextStep: () => void
  prevStep: () => void
  autoSaveOutput: (stepId: number, outputName: string, outputValue: any) => void
  updatePrimaryKeyword: (keyword: string, stepId: number) => void
  resetWorkflow: () => void
  // addTool: (stepId: number, tool: Tool) => void // Remove - managed by Resource Library
  // removeTool: (stepId: number, toolIndex: number) => void // Remove - managed by Resource Library
  // addPrompt: (stepId: number, prompt: Prompt) => void // Remove - managed by Resource Library
  // deletePrompt: (stepId: number, promptId: number) => void // Remove - managed by Resource Library
  replaceOutputPlaceholders: (content: string) => string
}

// Create the context
const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

// Define the NEW 11-step workflow structure
const workflowSteps: Omit<Step, 'tools'>[] = [
  // Step 1: Keyword & Competitor Research (Old 1)
  {
    id: 1,
    title: "Keyword & Competitor Research",
    icon: "ri-search-eye-line",
    category: "Research & Planning",
    inputField: [
      { name: "primaryKeyword", label: "Selected Primary Keyword", placeholder: "Enter the main keyword for the article" },
      { name: "competitorWebsiteUrls", label: "Competitor URLs (Add up to 5 for this keyword)", placeholder: "e.g., competitor-site.com", isMultiInput: true, maxItems: 5 }
    ],
    description: "Analyze competitor URLs ranking for the target keyword using tools like Ahrefs or SEMrush. Identify content gaps, angles, and search intent. Extract LSI keywords. Finalize your primary keyword and define specific competitor URLs below. **Note:** Your website domain and general competitor domains can be set in Profile Settings."
  },
  // Step 2: Topic & Headline Brainstorm (Old 2)
  {
    id: 2,
    title: "Topic & Headline Brainstorm",
    icon: "ri-lightbulb-flash-line",
    category: "Research & Planning",
    outputFields: [
      { name: "selectedTopic", label: "Selected Blog Topic", placeholder: "Enter the chosen topic..." },
      { name: "workingHeadline", label: "Working Headline", placeholder: "Enter the draft headline..." }
    ],
    description: "Brainstorm compelling blog topics and engaging headlines around your primary keyword. Use idea generators and analyze trending content. Draft several headlines and use analyzers to assess effectiveness. **Action:** Select a blog topic and a working headline."
  },
  // Step 3: AI Research (Old 3 & 4)
  {
    id: 3,
    title: "AI Research",
    icon: "ri-robot-2-line",
    category: "Research & Planning",
    outputFields: [
      { name: "researchOutput", label: "Initial AI Research Notes", placeholder: "Paste key findings, insights, and data from initial AI research (e.g., Perplexity)..." },
      { name: "deepResearchOutput", label: "Deep AI Research Notes", placeholder: "Paste key findings, diverse perspectives, and source links from deep AI research (e.g., Gemini, Claude)..." }
    ],
    description: "Utilize AI tools (like Perplexity, Gemini, Claude) for initial and deep research on your topic and keyword. Explore facets, gather data, cross-reference, and find unique insights. Use relevant prompts. **Action:** Conduct research and save key findings."
  },
  // Step 4: Outline Creation (Old 5)
  {
    id: 4,
    title: "Outline Creation",
    icon: "ri-file-list-3-line",
    category: "Content Creation",
    outputFields: [
      { name: "outlineOutput", label: "Blog Outline", placeholder: "Paste the structured blog outline here (e.g., using Markdown headings)..." }
    ],
    description: "Organize research from Step 3. Use NotebookLM or your preferred tool to structure a detailed blog outline. Refine for logical flow, comprehensiveness, and SEO. **Action:** Create the final blog outline and paste it below."
  },
  // Step 5: AI Drafting (Old 6)
  {
    id: 5,
    title: "AI Drafting",
    icon: "ri-quill-pen-line",
    category: "Content Creation",
    outputFields: [
      { name: "draftOutput", label: "AI-Generated Draft", placeholder: "Paste the full first draft generated by the AI..." }
    ],
    description: "Use Claude (or another preferred AI) with your outline and keyword to generate a first draft. Guide the AI with prompts to ensure alignment with [brand voice]. Focus on a complete, well-structured draft. **Action:** Generate the draft using AI and save it below."
  },
  // Step 6: Initial SEO & Multimedia (Old 7 & 8)
  {
    id: 6,
    title: "Initial SEO & Multimedia",
    icon: "ri-image-line", // Keep image icon as primary
    category: "Content Creation",
    outputFields: [
       { name: "metaDescriptionInitial", label: "Meta Description (Initial)", placeholder: "Draft the initial SEO-optimized meta description (120-155 chars)..." },
       { name: "selectedImages", label: "Selected Image URLs", placeholder: "List the URLs of chosen images..." },
       { name: "imageNotes", label: "Image Notes", placeholder: "Notes about image placement, alt text, etc..." }
    ],
    description: "Optimize the draft for initial on-page SEO (keywords, meta description). Source and prepare relevant multimedia (images, graphics), optimizing for web. **Actions:** Optimize SEO, prepare media."
  },
  // Step 7: Engagement Elements (Old 9)
  {
    id: 7,
    title: "Engagement Elements",
    icon: "ri-user-voice-line",
    category: "Content Creation",
    outputFields: [
      { name: "faqContent", label: "FAQ Content", placeholder: "Enter FAQ questions and answers..." },
      { name: "ctaElements", label: "CTA Elements", placeholder: "Describe CTAs and their placement..." }
    ],
    description: "Add engagement elements like FAQs, CTAs, and interactive sections. Research common questions and create compelling calls-to-action. **Action:** Draft FAQs and plan strategic CTAs."
  },
  // Step 8: Human Edit: Grammar & Style (Old 10)
  {
    id: 8,
    title: "Human Edit: Grammar & Style",
    icon: "ri-edit-line",
    category: "Refinement & Optimization",
    outputFields: [
      { name: "editingNotes", label: "Editing Notes", placeholder: "Note major edits and improvements made..." }
    ],
    description: "Perform a thorough human edit focusing on grammar, mechanics, style ([brand voice]), and readability. Use tools like Grammarly to catch errors and improve clarity. **Action:** Edit the content and note significant changes."
  },
  // Step 9: Fact-Checking & Plagiarism (Old 11 & 12)
  {
    id: 9,
    title: "Fact-Checking & Plagiarism",
    icon: "ri-shield-check-line", // Keep shield icon
    category: "Refinement & Optimization",
    outputFields: [
        { name: "factCheckNotes", label: "Fact-Check Notes", placeholder: "Document verified facts and sources..." },
        { name: "plagiarismResults", label: "Plagiarism Check Results", placeholder: "Document plagiarism check findings..." }
    ],
    description: "Verify all facts, statistics, and claims. Cross-reference sources. Run a thorough plagiarism check to ensure content originality. **Actions:** Document fact-checking and plagiarism results."
  },
  // Step 10: Final Technical Checks (Old 13, 14, 15)
  {
    id: 10,
    title: "Final Technical Checks",
    icon: "ri-settings-3-line", // Keep settings icon
    category: "Refinement & Optimization",
    outputFields: [
        { name: "technicalChecklist", label: "Technical Checklist", placeholder: "Document completed technical checks..." },
        { name: "finalMetaDescription", label: "Final Meta Description", placeholder: "Enter the final, optimized meta description..." },
        { name: "codeFormatNotes", label: "Code Formatting Notes", placeholder: "Document code formatting changes..." },
        { name: "linkAnalysisNotes", label: "Link Analysis Notes", placeholder: "Document link review findings..." }
    ],
    description: "Perform final SEO/technical checks: meta tags, image optimization, internal/external links, mobile responsiveness, code formatting. **Actions:** Complete checks, finalize meta description."
  },
  // Step 11: Publish Readiness (Old 16)
  {
    id: 11,
    title: "Publish Readiness",
    icon: "ri-check-double-line",
    category: "Refinement & Optimization",
    outputFields: [
      { name: "finalChecklist", label: "Final Review Checklist", placeholder: "Complete final review checklist..." },
      { name: "publishNotes", label: "Publishing Notes", placeholder: "Add any publishing-related notes..." }
    ],
    description: "Conduct a final review of all elements. Preview the post, check formatting across devices, and prepare for publishing. **Action:** Complete final checklist and publish."
  }
];

// Provider component
export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [steps] = useState<Omit<Step, 'tools'>[]>(workflowSteps) // Use Omit<Step, 'tools'> and remove setSteps
  const [currentStep, setCurrentStep] = useState(1)
  const [stepOutputs, setStepOutputs] = useState<Record<number, Record<string, any>>>({})
  const [primaryKeyword, setPrimaryKeyword] = useState("")
  const [blogOutlineText, setBlogOutlineText] = useState("")
  // const [promptTemplates, setPromptTemplates] = useState<Record<string, Prompt[]>>({}) // Remove prompt template state
  const { showFeedback } = useFeedback()
  const { profileData } = useProfile() // Get profile data

  // Storage keys
  const WORKFLOW_STORAGE_KEY = "aiBlogWorkflowDashboardData_v3"
  // const PROMPT_STORAGE_KEY = "promptTemplates_v2" // Remove old prompt key
  const RESOURCE_ASSIGNMENT_KEY = "resourceAssignments_v1" // New key for assignments

  // State for assigned resources
  const [assignedPrompts, setAssignedPrompts] = useState<Record<number, Prompt[]>>({})
  const [assignedTools, setAssignedTools] = useState<Record<number, Tool[]>>({})

  // Load saved data on mount
  useEffect(() => {
    loadSavedWorkflowData()
    // loadPromptTemplates() // Prompt definitions will be loaded by Resource Library hook
    loadResourceAssignments() // Load assignments
  }, [])

  // Load workflow data from localStorage
  const loadSavedWorkflowData = () => {
    const saved = localStorage.getItem(WORKFLOW_STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setStepOutputs(data.stepOutputs || {})
        setCurrentStep(data.currentStep || 1)
        setPrimaryKeyword(data.primaryKeyword || "")
        setBlogOutlineText(data.blogOutlineText || "")

        // Load tools data if saved - REMOVED as tools are now managed by assignments
        /*
        if (data.steps && Array.isArray(data.steps)) {
          setSteps((prevSteps: Step[]) => { // Error was here: setSteps doesn't exist anymore
            return prevSteps.map((step: Step, index: number) => {
              if (data.steps[index] && data.steps[index].tools) { // Error was here: tools doesn't exist on Step
                if (Array.isArray(data.steps[index].tools)) {
                  return { ...step, tools: data.steps[index].tools }
                }
              }
              return step
            })
          })
        }
        */

        console.log("Loaded workflow data from localStorage")
      } catch (e) {
        console.error("Error parsing saved workflow data:", e)
        clearSavedWorkflowData() // Clear only workflow data on error
      }
    } else {
      console.log("No saved workflow data found, using defaults.")
      const initialStepOutputs: Record<number, Record<string, any>> = {}
      workflowSteps.forEach((step) => { // Use workflowSteps (without tools)
        initialStepOutputs[step.id] = {}
      })
      setStepOutputs(initialStepOutputs)
    }
  }

  // Load resource assignments from localStorage
  const loadResourceAssignments = () => {
    const savedAssignments = localStorage.getItem(RESOURCE_ASSIGNMENT_KEY)
    if (savedAssignments) {
      try {
        const assignments = JSON.parse(savedAssignments)
        setAssignedPrompts(assignments.prompts || {})
        setAssignedTools(assignments.tools || {})
        console.log("Loaded resource assignments.")
      } catch (e) {
        console.error("Error loading resource assignments:", e)
        setAssignedPrompts({})
        setAssignedTools({})
      }
    } else {
      console.log("No saved resource assignments found.")
      // Optionally load default assignments here if needed
    }
  }

  // Load prompt templates from localStorage - REMOVED (will be in Resource Library hook)
  /*
  const loadPromptTemplates = () => { ... }
  */

  // Save workflow data to localStorage
  const saveWorkflowData = useCallback(() => { // Use useCallback
    // Ensure step 1 output exists
    const outputsToSave = { ...stepOutputs }
    if (!outputsToSave[1]) outputsToSave[1] = {}
    outputsToSave[1].primaryKeyword = primaryKeyword

    // Ensure step 5 output exists for outline
    if (!outputsToSave[5]) outputsToSave[5] = {}
    const outlineText = outputsToSave[5]?.outlineOutput || blogOutlineText

    const data = {
      stepOutputs: outputsToSave, // Save the potentially modified outputs
      currentStep,
      primaryKeyword,
      blogOutlineText: outlineText,
      // steps: steps.map((step: Step) => ({ tools: step.tools || [] })), // DO NOT save steps/tools here anymore - Error was here: tools doesn't exist
    }

    try {
      localStorage.setItem(WORKFLOW_STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.error("Error saving workflow data:", e)
      showFeedback("Error saving progress. Data might be too large.", "error")
    }
  }, [stepOutputs, currentStep, primaryKeyword, blogOutlineText, showFeedback]) // Add dependencies

  // Debounced save function
  useEffect(() => {
    const handler = setTimeout(() => {
      saveWorkflowData()
    }, 500) // Save 500ms after the last change

    return () => {
      clearTimeout(handler)
    }
  }, [saveWorkflowData]) // Re-run when saveWorkflowData changes (due to its dependencies)


  // Clear saved workflow data (ONLY workflow-specific data)
  const clearSavedWorkflowData = () => {
    const initialStepOutputs: Record<number, Record<string, any>> = {}
    workflowSteps.forEach((step) => { // Use workflowSteps
      initialStepOutputs[step.id] = {}
    })
    setStepOutputs(initialStepOutputs)
    setCurrentStep(1)
    setPrimaryKeyword("")
    setBlogOutlineText("")
    localStorage.removeItem(WORKFLOW_STORAGE_KEY) // Only remove this key
    console.log("Cleared saved workflow data.")
    // DO NOT clear resource assignments, prompts, tools, or profile data here
  }

  // Save prompt templates to localStorage - REMOVED (will be in Resource Library hook)
  /*
  const savePromptTemplates = (templates = promptTemplates) => { ... }
  */

  // Show a specific step
  const showStep = (stepId: number) => {
    if (stepId < 1) stepId = 1
    if (stepId > workflowSteps.length + 1) stepId = workflowSteps.length + 1 // Use workflowSteps length

    setCurrentStep(stepId)
    // saveWorkflowData() // Saving is now debounced
  }

  // Navigate to next step
  const nextStep = () => {
    showStep(currentStep + 1)
  }

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      showStep(currentStep - 1)
    }
  }

  // Auto-save output for a step
  const autoSaveOutput = (stepId: number, outputName: string, outputValue: any) => {
    setStepOutputs((prev: Record<number, Record<string, any>>) => {
      const newOutputs = { ...prev }
      if (!newOutputs[stepId]) {
        newOutputs[stepId] = {}
      }
      newOutputs[stepId][outputName] = outputValue

      // Special handling for outline
      if (stepId === 5 && outputName === "outlineOutput") {
        setBlogOutlineText(outputValue)
      }

      return newOutputs
    })

    // Save to localStorage after state update - Handled by debounced saveWorkflowData
    // setTimeout(() => saveWorkflowData(), 0)
  }

  // Update primary keyword
  const updatePrimaryKeyword = (keyword: string, stepId: number) => {
    const trimmedKeyword = keyword.trim()
    if (primaryKeyword !== trimmedKeyword) {
      setPrimaryKeyword(trimmedKeyword)
      autoSaveOutput(stepId, "primaryKeyword", trimmedKeyword) // This will trigger debounced save
      showFeedback("Primary keyword updated.", "info")
    }
  }

  // Reset workflow
  const resetWorkflow = () => {
    if (
      window.confirm(
        "Are you sure you want to reset the current workflow? All step outputs and the primary keyword will be cleared. Profile settings and resource assignments will remain.", // Updated confirmation message
      )
    ) {
      clearSavedWorkflowData() // Only clears workflow data now
      showFeedback("Workflow has been reset.", "success")
    }
  }

  // Add a tool to a step - REMOVED
  /*
  const addTool = (stepId: number, tool: Tool) => { ... } // Error was here: setSteps doesn't exist
  */

  // Remove a tool from a step - REMOVED
  /*
  const removeTool = (stepId: number, toolIndex: number) => { ... } // Error was here: setSteps doesn't exist
  */

  // Add a prompt to a step - REMOVED
  /*
  const addPrompt = (stepId: number, prompt: Prompt) => { ... } // Error was here: setPromptTemplates doesn't exist
  */

  // Delete a prompt from a step - REMOVED
  /*
  const deletePrompt = (stepId: number, promptId: number) => { ... } // Error was here: setPromptTemplates doesn't exist
  */

  // Replace output placeholders in prompt content
  const replaceOutputPlaceholders = useCallback((content: string) => { // Use useCallback
    let updatedContent = content
    const { profileData } = useProfile(); // Get profile data inside the function

    // Replace static profile placeholders first
    const staticPlaceholders: { [key: string]: keyof ProfileData } = {
      "\\[logo url\\]": "logoUrl",
      "\\[our domain\\]": "ourDomain",
      "\\[general competitors\\]": "generalCompetitors",
      "\\[brand voice\\]": "brandVoice",
      "\\[social handles\\]": "socialHandles",
      "\\[sitemap url\\]": "sitemapUrl",
      "\\[wp admin url\\]": "wpAdminUrl",
    };

    for (const placeholder in staticPlaceholders) {
      const profileKey = staticPlaceholders[placeholder];
      const regex = new RegExp(placeholder, "gi");
      const value = profileData[profileKey] || `(${placeholder.replace(/\\\[|\\\]/g, '')} Not Set in Profile)`;
      updatedContent = updatedContent.replace(regex, value.trim() === "" ? `(${placeholder.replace(/\\\[|\\\]/g, '')} Not Set in Profile)` : value);
    }


    // Replace [output from step X: field] placeholders
    const outputPlaceholderRegex = /\[output from step (\d+):\s*([^\]]+)\]/gi
    let match
    while ((match = outputPlaceholderRegex.exec(content)) !== null) {
      const stepNum = Number.parseInt(match[1])
      const outputFieldName = match[2].trim()
      const stepData = stepOutputs[stepNum] || {}
      const savedOutput = stepData[outputFieldName]
      const fallbackText = `(Output from Step ${stepNum}: '${outputFieldName}' ${savedOutput === undefined ? "not found" : "is empty"})`

      let replacementText =
        savedOutput !== undefined && String(savedOutput).trim() !== "" ? String(savedOutput) : fallbackText

      if (Array.isArray(savedOutput)) {
        replacementText = savedOutput.join(", ")
        if (replacementText === "") replacementText = fallbackText
      }

      updatedContent = updatedContent.replace(match[0], replacementText)
    }

    // Replace [Blog Outline] placeholder
    if (updatedContent.includes("[Blog Outline]")) {
      const outlineText = blogOutlineText || "(Blog Outline is empty)"
      updatedContent = updatedContent.replace(
        /\[Blog Outline\]/gi,
        outlineText.trim() === "" ? "(Blog Outline is empty)" : outlineText,
      )
    }

    // Replace [primary keyword] placeholder
    if (updatedContent.includes("[primary keyword]")) {
      const pkText = primaryKeyword || "(Primary Keyword Not Set)"
      updatedContent = updatedContent.replace(
        /\[primary keyword\]/gi,
        pkText.trim() === "" ? "(Primary Keyword Not Set)" : pkText,
      )
    }

    return updatedContent
  }, [stepOutputs, blogOutlineText, primaryKeyword, profileData]) // Add dependencies

  return (
    <WorkflowContext.Provider
      value={{
        steps, // Pass the static steps definition
        currentStep,
        stepOutputs,
        primaryKeyword,
        blogOutlineText,
        assignedPrompts, // Pass assigned prompts
        assignedTools, // Pass assigned tools
        showStep,
        nextStep,
        prevStep,
        autoSaveOutput,
        updatePrimaryKeyword,
        resetWorkflow,
        // addTool, // Removed
        // removeTool, // Removed
        // addPrompt, // Removed
        // deletePrompt, // Removed
        replaceOutputPlaceholders,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  )
}

// Hook to use the workflow context
export function useWorkflow() {
  const context = useContext(WorkflowContext)
  if (context === undefined) {
    throw new Error("useWorkflow must be used within a WorkflowProvider")
  }
  return context
}
