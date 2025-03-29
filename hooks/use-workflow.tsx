"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useFeedback } from "@/hooks/use-feedback"

// Define interfaces
interface Tool {
  name: string
  url: string
  category: string
}

interface InputField {
  name: string
  label: string
  placeholder: string
  isMultiInput?: boolean
  maxItems?: number
}

interface OutputField {
  name: string
  label: string
  placeholder: string
}

interface Step {
  id: number
  title: string
  icon: string
  category: string
  tools?: Tool[]
  inputField?: InputField[]
  outputFields?: OutputField[]
  description: string
}

interface Prompt {
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
  promptTemplates: Record<string, Prompt[]>
  showStep: (stepId: number) => void
  nextStep: () => void
  prevStep: () => void
  autoSaveOutput: (stepId: number, outputName: string, outputValue: any) => void
  updatePrimaryKeyword: (keyword: string, stepId: number) => void
  resetWorkflow: () => void
  addTool: (stepId: number, tool: Tool) => void
  removeTool: (stepId: number, toolIndex: number) => void
  addPrompt: (stepId: number, prompt: Prompt) => void
  deletePrompt: (stepId: number, promptId: number) => void
  replaceOutputPlaceholders: (content: string) => string
}

// Create the context
const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined)

// Define the workflow steps
const workflowSteps = [
  // Step 1
  {
    id: 1,
    title: "Competitor & Keyword Research",
    icon: "ri-search-eye-line",
    category: "Research & Planning",
    tools: [
      { name: "Google Keyword Planner", url: "https://ads.google.com/aw/keywordplanner/home", category: "Keyword Research (Free)" },
      { name: "SEMrush", url: "https://www.semrush.com/", category: "Keyword Research & SEO Suite (Premium)" },
      { name: "Ahrefs Keywords Explorer", url: "https://ahrefs.com/keywords-explorer", category: "Keyword Research & SEO Suite (Premium)" },
      { name: "SpyFu", url: "https://www.spyfu.com/", category: "Competitor Analysis (Premium)" },
      { name: "Ubersuggest", url: "https://neilpatel.com/ubersuggest/", category: "Keyword Research (Freemium)" },
      { name: "Moz Keyword Explorer", url: "https://moz.com/explorer", category: "Keyword Research (Premium)" }
    ],
    inputField: [
      { name: "primaryKeyword", label: "Selected Primary Keyword", placeholder: "Enter the main keyword for the article" },
      { name: "competitorWebsiteUrls", label: "Competitor URLs (Add up to 5 for this keyword)", placeholder: "e.g., competitor-site.com", isMultiInput: true, maxItems: 5 }
    ],
    description: "Analyze competitor URLs ranking for the target keyword using tools like Ahrefs or SEMrush. Identify content gaps, angles, and search intent. Extract LSI keywords. Finalize your primary keyword and define specific competitor URLs below. **Note:** Your website domain and general competitor domains can be set in Profile Settings."
  },
  // Step 2
  {
    id: 2,
    title: "Topic & Headline Brainstorm",
    icon: "ri-lightbulb-flash-line",
    category: "Research & Planning",
    tools: [
      { name: "AnswerThePublic", url: "https://answerthepublic.com/", category: "Topic Ideas (Freemium)" },
      { name: "BuzzSumo", url: "https://buzzsumo.com/", category: "Topic Research & Trends (Premium)" },
      { name: "Google Trends", url: "https://trends.google.com/trends/", category: "Trend Analysis (Free)" },
      { name: "CoSchedule Headline Analyzer", url: "https://coschedule.com/headline-analyzer", category: "Headline Analysis (Free)" },
      { name: "Sharethrough Headline Analyzer", url: "https://headlines.sharethrough.com/analyzer", category: "Headline Analysis (Free)" }
    ],
    description: "Brainstorm compelling blog topics and engaging headlines around your primary keyword. Use idea generators and analyze trending content. Draft several headlines and use analyzers to assess effectiveness. **Action:** Select a blog topic and a working headline.",
    outputFields: [
      { name: "selectedTopic", label: "Selected Blog Topic", placeholder: "Enter the chosen topic..." },
      { name: "workingHeadline", label: "Working Headline", placeholder: "Enter the draft headline..." }
    ]
  },
  // Step 3
  {
    id: 3,
    title: "AI Research (Perplexity)",
    icon: "ri-robot-2-line",
    category: "Research & Planning",
    tools: [
      { name: "Perplexity AI", url: "https://www.perplexity.ai/", category: "AI Research Tool" },
      { name: "ChatGPT", url: "https://chat.openai.com", category: "AI Research Assistant" },
      { name: "Google Scholar", url: "https://scholar.google.com/", category: "Academic Research" }
    ],
    description: "Use Perplexity AI for initial in-depth research on your topic and keyword. Explore facets, identify questions, and gather data. Use prompts in the 'Prompts' tab to guide research. **Action:** Conduct research using Perplexity and save key findings below.",
    outputFields: [
      { name: "researchOutput", label: "Perplexity Research Notes", placeholder: "Paste key findings, insights, and data from Perplexity..." }
    ]
  },
  // Step 4
  {
    id: 4,
    title: "Deep Research (Gemini/Grok)",
    icon: "ri-flask-line",
    category: "Research & Planning",
    tools: [
      { name: "Google Gemini", url: "https://gemini.google.com/", category: "Advanced AI Research" },
      { name: "Grok AI (X)", url: "https://x.ai/", category: "Advanced AI Research" },
      { name: "Claude", url: "https://claude.ai/", category: "Advanced AI Research" },
      { name: "Microsoft Copilot", url: "https://copilot.microsoft.com/", category: "AI Research Assistant" }
    ],
    description: "Expand research using Gemini, Grok, or other advanced AI. Focus on cross-referencing, finding unique insights, and addressing nuanced queries. **Action:** Conduct deep research and save key findings below. Use the 'Comprehensive Research Prompt' in the 'Prompts' tab.",
    outputFields: [
      { name: "deepResearchOutput", label: "Deep Research Notes", placeholder: "Paste key findings, diverse perspectives, and source links..." }
    ]
  },
  // Step 5
  {
    id: 5,
    title: "Outline Creation (NotebookLM)",
    icon: "ri-file-list-3-line",
    category: "Content Creation",
    tools: [
      { name: "NotebookLM", url: "https://notebooklm.google/", category: "AI Notebook & Outline" },
      { name: "Notion", url: "https://www.notion.so", category: "Outline & Notes" },
      { name: "MindMeister", url: "https://www.mindmeister.com", category: "Mind Mapping" }
    ],
    description: "Organize research from Steps 3 & 4. Use NotebookLM or your preferred tool to structure a detailed blog outline. Refine for logical flow, comprehensiveness, and SEO. **Action:** Create the final blog outline and paste it below.",
    outputFields: [
      { name: "outlineOutput", label: "Blog Outline", placeholder: "Paste the structured blog outline here (e.g., using Markdown headings)..." }
    ]
  },
  // Step 6
  {
    id: 6,
    title: "AI-Assisted Drafting (Claude)",
    icon: "ri-quill-pen-line",
    category: "Content Creation",
    tools: [
      { name: "Claude", url: "https://claude.ai/", category: "AI Drafting Assistant" },
      { name: "ChatGPT", url: "https://chat.openai.com", category: "AI Drafting Assistant" },
      { name: "Google Gemini", url: "https://gemini.google.com/", category: "AI Drafting Assistant" }
    ],
    description: "Use Claude (or another preferred AI) with your outline and keyword to generate a first draft. Guide the AI with prompts to ensure alignment with [brand voice]. Focus on a complete, well-structured draft. **Action:** Generate the draft using AI and save it below.",
    outputFields: [
      { name: "draftOutput", label: "AI-Generated Draft", placeholder: "Paste the full first draft generated by the AI..." }
    ]
  },
  // Step 7
  {
    id: 7,
    title: "Initial SEO Optimization",
    icon: "ri-seo-line",
    category: "Content Creation",
    tools: [
      { name: "Yoast SEO", url: "https://yoast.com/wordpress/plugins/seo/", category: "SEO Plugin (WordPress)" },
      { name: "Rank Math", url: "https://rankmath.com/", category: "SEO Plugin (WordPress)" },
      { name: "SEMrush Writing Assistant", url: "https://www.semrush.com/features/seo-writing-assistant/", category: "SEO Writing Guidance" },
      { name: "Surfer SEO", url: "https://surferseo.com/", category: "SEO Writing Guidance" }
    ],
    description: "Optimize the draft for on-page SEO. Refine keyword placement (title, headings, body), plan meta description/tags, and identify linking opportunities. Use SEO tools for guidance. **Action:** Optimize the draft and save the initial meta description.",
    outputFields: [
      { name: "metaDescriptionInitial", label: "Meta Description (Initial)", placeholder: "Draft the initial SEO-optimized meta description (120-155 chars)..." }
    ]
  },
  // Step 8
  {
    id: 8,
    title: "Multimedia & Stock Images",
    icon: "ri-image-line",
    category: "Content Creation",
    tools: [
      { name: "Unsplash", url: "https://unsplash.com/", category: "Free Stock Photos" },
      { name: "Pexels", url: "https://www.pexels.com/", category: "Free Stock Photos & Videos" },
      { name: "Canva", url: "https://www.canva.com/", category: "Image Design & Editing" },
      { name: "Midjourney", url: "https://www.midjourney.com/", category: "AI Image Generation" },
      { name: "DALL·E", url: "https://openai.com/dall-e-3", category: "AI Image Generation" }
    ],
    description: "Source and prepare multimedia elements. Find relevant stock photos, create custom graphics, or generate AI images. Optimize all media for web performance. **Action:** Collect and prepare all visual content for the blog post.",
    outputFields: [
      { name: "selectedImages", label: "Selected Image URLs", placeholder: "List the URLs of chosen images..." },
      { name: "imageNotes", label: "Image Notes", placeholder: "Notes about image placement, alt text, etc..." }
    ]
  },
  // Step 9
  {
    id: 9,
    title: "Engagement Elements (FAQs/CTAs)",
    icon: "ri-user-voice-line",
    category: "Content Creation",
    tools: [
      { name: "People Also Ask", url: "https://www.google.com/", category: "FAQ Research" },
      { name: "AnswerSocrates", url: "https://answersocrates.com/", category: "Question Research" },
      { name: "Button Generator", url: "https://www.buttonoptimizer.com/", category: "CTA Design" }
    ],
    description: "Add engagement elements like FAQs, CTAs, and interactive sections. Research common questions and create compelling calls-to-action. **Action:** Draft FAQs and plan strategic CTAs.",
    outputFields: [
      { name: "faqContent", label: "FAQ Content", placeholder: "Enter FAQ questions and answers..." },
      { name: "ctaElements", label: "CTA Elements", placeholder: "Describe CTAs and their placement..." }
    ]
  },
  // Step 10
  {
    id: 10,
    title: "Human Edit: Grammar & Mechanics",
    icon: "ri-edit-line",
    category: "Refinement & Optimization",
    tools: [
      { name: "Grammarly", url: "https://www.grammarly.com/", category: "Grammar & Style Checker" },
      { name: "ProWritingAid", url: "https://prowritingaid.com/", category: "Writing Enhancement" },
      { name: "Hemingway Editor", url: "https://hemingwayapp.com/", category: "Readability Check" }
    ],
    description: "Perform a thorough human edit focusing on grammar, mechanics, and readability. Use tools to catch errors and improve clarity. **Action:** Edit the content and note any significant changes.",
    outputFields: [
      { name: "editingNotes", label: "Editing Notes", placeholder: "Note major edits and improvements made..." }
    ]
  },
  // Step 11
  {
    id: 11,
    title: "Human Edit: Fact-Checking & Refinement",
    icon: "ri-shield-check-line",
    category: "Refinement & Optimization",
    tools: [
      { name: "Google Scholar", url: "https://scholar.google.com/", category: "Academic Verification" },
      { name: "Snopes", url: "https://www.snopes.com/", category: "Fact Checking" },
      { name: "Reuters Fact Check", url: "https://www.reuters.com/fact-check", category: "News Verification" }
    ],
    description: "Verify all facts, statistics, and claims. Cross-reference sources and update content as needed. **Action:** Document fact-checking process and any corrections made.",
    outputFields: [
      { name: "factCheckNotes", label: "Fact-Check Notes", placeholder: "Document verified facts and sources..." }
    ]
  },
  // Step 12
  {
    id: 12,
    title: "Plagiarism Check",
    icon: "ri-file-shield-2-line",
    category: "Refinement & Optimization",
    tools: [
      { name: "Copyscape", url: "https://www.copyscape.com/", category: "Plagiarism Detection" },
      { name: "Quetext", url: "https://www.quetext.com/", category: "Plagiarism Checker" },
      { name: "Duplichecker", url: "https://www.duplichecker.com/", category: "Free Plagiarism Check" }
    ],
    description: "Run a thorough plagiarism check to ensure content originality. Address any potential issues with duplicate content. **Action:** Run plagiarism check and document results.",
    outputFields: [
      { name: "plagiarismResults", label: "Plagiarism Check Results", placeholder: "Document plagiarism check findings..." }
    ]
  },
  // Step 13
  {
    id: 13,
    title: "Final SEO & Technical Check",
    icon: "ri-settings-3-line",
    category: "Refinement & Optimization",
    tools: [
      { name: "Google Search Console", url: "https://search.google.com/search-console", category: "SEO Tools" },
      { name: "Screaming Frog", url: "https://www.screamingfrog.co.uk/seo-spider/", category: "Technical SEO" },
      { name: "GTmetrix", url: "https://gtmetrix.com/", category: "Performance Check" }
    ],
    description: "Perform final SEO and technical checks. Verify meta tags, image optimization, internal links, and mobile responsiveness. **Action:** Complete technical checklist and finalize meta description.",
    outputFields: [
      { name: "technicalChecklist", label: "Technical Checklist", placeholder: "Document completed technical checks..." },
      { name: "finalMetaDescription", label: "Final Meta Description", placeholder: "Enter the final, optimized meta description..." }
    ]
  },
  // Step 14
  {
    id: 14,
    title: "Code Formatting & Cleanup",
    icon: "ri-code-s-slash-line",
    category: "Refinement & Optimization",
    tools: [
      { name: "Prettier", url: "https://prettier.io/", category: "Code Formatting" },
      { name: "HTML Formatter", url: "https://www.freeformatter.com/html-formatter.html", category: "HTML Cleanup" },
      { name: "CSS Formatter", url: "https://www.cleancss.com/css-beautify/", category: "CSS Cleanup" }
    ],
    description: "Clean up and format any code elements (HTML, CSS, etc.). Ensure proper syntax highlighting and code block formatting. **Action:** Format code blocks and document any technical notes.",
    outputFields: [
      { name: "codeFormatNotes", label: "Code Formatting Notes", placeholder: "Document code formatting changes..." }
    ]
  },
  // Step 15
  {
    id: 15,
    title: "Link Analysis & Optimization",
    icon: "ri-link-m",
    category: "Refinement & Optimization",
    tools: [
      { name: "Ahrefs", url: "https://ahrefs.com/", category: "Link Analysis" },
      { name: "Majestic", url: "https://majestic.com/", category: "Link Intelligence" },
      { name: "Moz Link Explorer", url: "https://moz.com/link-explorer", category: "Link Research" }
    ],
    description: "Review and optimize all links (internal and external). Check for broken links and ensure proper anchor text usage. **Action:** Document link analysis and any changes made.",
    outputFields: [
      { name: "linkAnalysisNotes", label: "Link Analysis Notes", placeholder: "Document link review findings..." }
    ]
  },
  // Step 16
  {
    id: 16,
    title: "Final Review & Publish",
    icon: "ri-check-double-line",
    category: "Refinement & Optimization",
    tools: [
      { name: "WordPress", url: "https://wordpress.org/", category: "CMS" },
      { name: "Google Analytics", url: "https://analytics.google.com/", category: "Analytics" },
      { name: "Social Share Preview", url: "https://socialsharepreview.com/", category: "Social Media Preview" }
    ],
    description: "Conduct a final review of all elements. Preview the post, check formatting across devices, and prepare for publishing. **Action:** Complete final checklist and publish.",
    outputFields: [
      { name: "finalChecklist", label: "Final Review Checklist", placeholder: "Complete final review checklist..." },
      { name: "publishNotes", label: "Publishing Notes", placeholder: "Add any publishing-related notes..." }
    ]
  }
]

// Provider component
export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [steps, setSteps] = useState<Step[]>(workflowSteps)
  const [currentStep, setCurrentStep] = useState(1)
  const [stepOutputs, setStepOutputs] = useState<Record<number, Record<string, any>>>({})
  const [primaryKeyword, setPrimaryKeyword] = useState("")
  const [blogOutlineText, setBlogOutlineText] = useState("")
  const [promptTemplates, setPromptTemplates] = useState<Record<string, Prompt[]>>({})
  const { showFeedback } = useFeedback()

  // Storage keys
  const WORKFLOW_STORAGE_KEY = "aiBlogWorkflowDashboardData_v3"
  const PROMPT_STORAGE_KEY = "promptTemplates_v2"

  // Load saved data on mount
  useEffect(() => {
    loadSavedWorkflowData()
    loadPromptTemplates()
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

        // Load tools data if saved
        if (data.steps && Array.isArray(data.steps)) {
          setSteps((prevSteps: Step[]) => {
            return prevSteps.map((step: Step, index: number) => {
              if (data.steps[index] && data.steps[index].tools) {
                if (Array.isArray(data.steps[index].tools)) {
                  return { ...step, tools: data.steps[index].tools }
                }
              }
              return step
            })
          })
        }

        console.log("Loaded workflow data from localStorage")
      } catch (e) {
        console.error("Error parsing saved workflow data:", e)
        clearSavedWorkflowData()
      }
    } else {
      console.log("No saved workflow data found, using defaults.")
      const initialStepOutputs: Record<number, Record<string, any>> = {}
      steps.forEach((step: Step) => {
        initialStepOutputs[step.id] = {}
      })
      setStepOutputs(initialStepOutputs)
    }
  }

  // Load prompt templates from localStorage
  const loadPromptTemplates = () => {
    const savedPrompts = localStorage.getItem(PROMPT_STORAGE_KEY)
    if (savedPrompts) {
      try {
        setPromptTemplates(JSON.parse(savedPrompts))
        console.log("Loaded prompt templates.")
      } catch (e) {
        console.error("Error loading prompt templates:", e)
        setPromptTemplates({})
      }
    } else {
      // Default prompts
      const defaultPrompts = {
        "3": [
          {
            id: 301,
            category: "Perplexity Research",
            title: "Keyword Cluster Ideas",
            content:
              "Generate 5-7 keyword clusters related to [primary keyword], focusing on informational intent. For each cluster, suggest 3 long-tail keywords.",
            favorite: false,
          },
          {
            id: 302,
            category: "Perplexity Research",
            title: "FAQ Generation",
            content:
              "Identify the top 10 frequently asked questions about [primary keyword] based on current search trends and 'People Also Ask'.",
            favorite: true,
          },
        ],
        "6": [
          {
            id: 601,
            category: "AI Drafting",
            title: "Blog Post Section Draft",
            content:
              "Draft the section '[Section Title from Outline]' for a blog post about [primary keyword], based on the following points from the outline:\n[Paste relevant outline points here]\n\nMaintain a [brand voice] tone for a [Specify Audience, e.g., beginner] audience.",
            favorite: false,
          },
        ],
      }
      setPromptTemplates(defaultPrompts)
      savePromptTemplates(defaultPrompts)
    }
  }

  // Save workflow data to localStorage
  const saveWorkflowData = () => {
    if (!stepOutputs[1]) stepOutputs[1] = {}
    stepOutputs[1].primaryKeyword = primaryKeyword

    if (!stepOutputs[5]) stepOutputs[5] = {}
    const outlineText = stepOutputs[5]?.outlineOutput || blogOutlineText

    const data = {
      stepOutputs,
      currentStep,
      primaryKeyword,
      blogOutlineText: outlineText,
      steps: steps.map((step: Step) => ({ tools: step.tools || [] })),
    }

    try {
      localStorage.setItem(WORKFLOW_STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.error("Error saving workflow data:", e)
      showFeedback("Error saving progress. Data might be too large.", "error")
    }
  }

  // Clear saved workflow data
  const clearSavedWorkflowData = () => {
    const initialStepOutputs: Record<number, Record<string, any>> = {}
    steps.forEach((step: Step) => {
      initialStepOutputs[step.id] = {}
    })
    setStepOutputs(initialStepOutputs)
    setCurrentStep(1)
    setPrimaryKeyword("")
    setBlogOutlineText("")
    localStorage.removeItem(WORKFLOW_STORAGE_KEY)
    console.log("Cleared saved workflow data.")
  }

  // Save prompt templates to localStorage
  const savePromptTemplates = (templates = promptTemplates) => {
    try {
      localStorage.setItem(PROMPT_STORAGE_KEY, JSON.stringify(templates))
    } catch (e) {
      console.error("Error saving prompt templates:", e)
      showFeedback("Error saving prompt library.", "error")
    }
  }

  // Show a specific step
  const showStep = (stepId: number) => {
    if (stepId < 1) stepId = 1
    if (stepId > steps.length + 1) stepId = steps.length + 1

    setCurrentStep(stepId)
    saveWorkflowData()
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

    // Save to localStorage after state update
    setTimeout(() => saveWorkflowData(), 0)
  }

  // Update primary keyword
  const updatePrimaryKeyword = (keyword: string, stepId: number) => {
    const trimmedKeyword = keyword.trim()
    if (primaryKeyword !== trimmedKeyword) {
      setPrimaryKeyword(trimmedKeyword)
      autoSaveOutput(stepId, "primaryKeyword", trimmedKeyword)
      showFeedback("Primary keyword updated.", "info")
    }
  }

  // Reset workflow
  const resetWorkflow = () => {
    if (
      window.confirm(
        "Are you sure you want to reset the current workflow? All step outputs and the primary keyword will be cleared. Profile settings will remain.",
      )
    ) {
      clearSavedWorkflowData()
      showFeedback("Workflow has been reset.", "success")
    }
  }

  // Add a tool to a step
  const addTool = (stepId: number, tool: Tool) => {
    setSteps((prev: Step[]) => {
      return prev.map((step: Step) => {
        if (step.id === stepId) {
          const updatedTools = [...(step.tools || []), tool]
          return { ...step, tools: updatedTools }
        }
        return step
      })
    })

    // Save to localStorage after state update
    setTimeout(() => saveWorkflowData(), 0)
  }

  // Remove a tool from a step
  const removeTool = (stepId: number, toolIndex: number) => {
    setSteps((prev: Step[]) => {
      return prev.map((step: Step) => {
        if (step.id === stepId && step.tools) {
          const updatedTools = [...step.tools]
          updatedTools.splice(toolIndex, 1)
          return { ...step, tools: updatedTools }
        }
        return step
      })
    })

    // Save to localStorage after state update
    setTimeout(() => saveWorkflowData(), 0)
  }

  // Add a prompt to a step
  const addPrompt = (stepId: number, prompt: Prompt) => {
    setPromptTemplates((prev: Record<string, Prompt[]>) => {
      const newTemplates = { ...prev }
      if (!newTemplates[stepId]) {
        newTemplates[stepId] = []
      }
      newTemplates[stepId].push(prompt)
      return newTemplates
    })

    // Save to localStorage after state update
    setTimeout(() => savePromptTemplates(), 0)
  }

  // Delete a prompt from a step
  const deletePrompt = (stepId: number, promptId: number) => {
    setPromptTemplates((prev: Record<string, Prompt[]>) => {
      const newTemplates = { ...prev }
      if (newTemplates[stepId]) {
        newTemplates[stepId] = newTemplates[stepId].filter((p: Prompt) => p.id !== promptId)
        if (newTemplates[stepId].length === 0) {
          delete newTemplates[stepId]
        }
      }
      return newTemplates
    })

    // Save to localStorage after state update
    setTimeout(() => savePromptTemplates(), 0)
  }

  // Replace output placeholders in prompt content
  const replaceOutputPlaceholders = (content: string) => {
    let updatedContent = content

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
  }

  return (
    <WorkflowContext.Provider
      value={{
        steps,
        currentStep,
        stepOutputs,
        primaryKeyword,
        blogOutlineText,
        promptTemplates,
        showStep,
        nextStep,
        prevStep,
        autoSaveOutput,
        updatePrimaryKeyword,
        resetWorkflow,
        addTool,
        removeTool,
        addPrompt,
        deletePrompt,
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

