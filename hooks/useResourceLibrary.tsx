"use client"

import type React from "react";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useFeedback } from "@/hooks/use-feedback";
import type { Prompt, Tool, Step } from "@/hooks/use-workflow"; // Import types

// --- Interfaces ---

export interface ResourceLibraryData {
  prompts: Prompt[]; // All defined prompts
  tools: Tool[]; // All defined tools
  assignments: {
    prompts: Record<number, number[]>; // Map Step ID -> Array of Prompt IDs
    tools: Record<number, string[]>; // Map Step ID -> Array of Tool Names (assuming names are unique identifiers for now)
  };
}

type ResourceLibraryContextType = {
  prompts: Prompt[];
  tools: Tool[];
  assignedPrompts: Record<number, Prompt[]>; // Derived from assignments and definitions
  assignedTools: Record<number, Tool[]>; // Derived from assignments and definitions
  addPromptDefinition: (prompt: Omit<Prompt, 'id'>) => number; // Returns new ID
  updatePromptDefinition: (prompt: Prompt) => void;
  deletePromptDefinition: (promptId: number) => void; // Also unassigns it
  addToolDefinition: (tool: Tool) => void;
  updateToolDefinition: (tool: Tool) => void; // Assumes name is key for update
  deleteToolDefinition: (toolName: string) => void; // Also unassigns it
  assignPromptToStep: (stepId: number, promptId: number) => void;
  unassignPromptFromStep: (stepId: number, promptId: number) => void;
  assignToolToStep: (stepId: number, toolName: string) => void;
  unassignToolFromStep: (stepId: number, toolName: string) => void;
  getPromptsForStep: (stepId: number) => Prompt[];
  getToolsForStep: (stepId: number) => Tool[];
};

// --- Context ---

const ResourceLibraryContext = createContext<ResourceLibraryContextType | undefined>(undefined);

// --- Storage Keys ---
const RESOURCE_DEFINITIONS_KEY = "resourceDefinitions_v1";
const RESOURCE_ASSIGNMENTS_KEY = "resourceAssignments_v1"; // Same key as used in useWorkflow for loading

// --- Default Data ---
// Updated with more comprehensive defaults based on original workflowSteps
const defaultPrompts: Prompt[] = [
    // Step 3 Prompts
    {
        id: 301, // Keep existing IDs or generate new ones consistently
        category: "Perplexity Research",
        title: "Keyword Cluster Ideas",
        content:
          "Generate 5-7 keyword clusters related to [primary keyword], focusing on informational intent. For each cluster, suggest 3 long-tail keywords.",
        favorite: false,
      },
      {
        id: 302, // Keep existing IDs or generate new ones consistently
        category: "Perplexity Research",
        title: "FAQ Generation",
        content:
          "Identify the top 10 frequently asked questions about [primary keyword] based on current search trends and 'People Also Ask'.",
        favorite: true,
      },
     // Step 4 Prompts (Example - Add actual prompts if they existed)
     {
        id: 401,
        category: "Deep Research",
        title: "Comprehensive Research Prompt",
        content: "Conduct deep research on [primary keyword] using multiple sources. Focus on unique angles, statistics, expert opinions, and counter-arguments. Synthesize findings relevant to the topic: '[selectedTopic]'.",
        favorite: false,
     },
     // Step 6 Prompts
      {
        id: 601, // Keep existing IDs or generate new ones consistently
        category: "AI Drafting",
        title: "Blog Post Section Draft",
        content:
          "Draft the section '[Section Title from Outline]' for a blog post about [primary keyword], based on the following points from the outline:\n[Paste relevant outline points here]\n\nMaintain a [brand voice] tone for a [Specify Audience, e.g., beginner] audience.",
        favorite: false,
      },
     // Add any other default prompts that existed in the original file here...
];
const defaultTools: Tool[] = [
    // Step 1 Tools
    { name: "Google Keyword Planner", url: "https://ads.google.com/aw/keywordplanner/home", category: "Keyword Research (Free)" },
    { name: "SEMrush", url: "https://www.semrush.com/", category: "Keyword Research & SEO Suite (Premium)" },
    { name: "Ahrefs Keywords Explorer", url: "https://ahrefs.com/keywords-explorer", category: "Keyword Research & SEO Suite (Premium)" },
    { name: "SpyFu", url: "https://www.spyfu.com/", category: "Competitor Analysis (Premium)" },
    { name: "Ubersuggest", url: "https://neilpatel.com/ubersuggest/", category: "Keyword Research (Freemium)" },
    { name: "Moz Keyword Explorer", url: "https://moz.com/explorer", category: "Keyword Research (Premium)" },
    // Step 2 Tools
    { name: "AnswerThePublic", url: "https://answerthepublic.com/", category: "Topic Ideas (Freemium)" },
    { name: "BuzzSumo", url: "https://buzzsumo.com/", category: "Topic Research & Trends (Premium)" },
    { name: "Google Trends", url: "https://trends.google.com/trends/", category: "Trend Analysis (Free)" },
    { name: "CoSchedule Headline Analyzer", url: "https://coschedule.com/headline-analyzer", category: "Headline Analysis (Free)" },
    { name: "Sharethrough Headline Analyzer", url: "https://headlines.sharethrough.com/analyzer", category: "Headline Analysis (Free)" },
    // Step 3 Tools
    { name: "Perplexity AI", url: "https://www.perplexity.ai/", category: "AI Research Tool" },
    { name: "ChatGPT", url: "https://chat.openai.com", category: "AI Research Assistant" }, // Added from original step 3
    { name: "Google Scholar", url: "https://scholar.google.com/", category: "Academic Research" }, // Added from original step 3
    // Step 4 Tools
    { name: "Google Gemini", url: "https://gemini.google.com/", category: "Advanced AI Research" },
    { name: "Grok AI (X)", url: "https://x.ai/", category: "Advanced AI Research" },
    { name: "Claude", url: "https://claude.ai/", category: "Advanced AI Research" }, // Added from original step 4
    { name: "Microsoft Copilot", url: "https://copilot.microsoft.com/", category: "AI Research Assistant" }, // Added from original step 4
    // Step 5 Tools
    { name: "NotebookLM", url: "https://notebooklm.google/", category: "AI Notebook & Outline" },
    { name: "Notion", url: "https://www.notion.so", category: "Outline & Notes" }, // Added from original step 5
    { name: "MindMeister", url: "https://www.mindmeister.com", category: "Mind Mapping" }, // Added from original step 5
    // Step 6 Tools (Claude already added in Step 4, add others)
    // { name: "ChatGPT", url: "https://chat.openai.com", category: "AI Drafting Assistant" }, // Already added
    // { name: "Google Gemini", url: "https://gemini.google.com/", category: "AI Drafting Assistant" }, // Already added
    // Step 7 Tools
    { name: "Yoast SEO", url: "https://yoast.com/wordpress/plugins/seo/", category: "SEO Plugin (WordPress)" },
    { name: "Rank Math", url: "https://rankmath.com/", category: "SEO Plugin (WordPress)" },
    { name: "SEMrush Writing Assistant", url: "https://www.semrush.com/features/seo-writing-assistant/", category: "SEO Writing Guidance" },
    { name: "Surfer SEO", url: "https://surferseo.com/", category: "SEO Writing Guidance" },
    // Step 8 Tools
    { name: "Unsplash", url: "https://unsplash.com/", category: "Free Stock Photos" },
    { name: "Pexels", url: "https://www.pexels.com/", category: "Free Stock Photos & Videos" },
    { name: "Canva", url: "https://www.canva.com/", category: "Image Design & Editing" },
    { name: "Midjourney", url: "https://www.midjourney.com/", category: "AI Image Generation" },
    { name: "DALL·E", url: "https://openai.com/dall-e-3", category: "AI Image Generation" },
    // Step 9 Tools
    { name: "People Also Ask", url: "https://www.google.com/", category: "FAQ Research" },
    { name: "AnswerSocrates", url: "https://answersocrates.com/", category: "Question Research" },
    { name: "Button Generator", url: "https://www.buttonoptimizer.com/", category: "CTA Design" },
    // Step 10 Tools
    { name: "Grammarly", url: "https://www.grammarly.com/", category: "Grammar & Style Checker" },
    { name: "ProWritingAid", url: "https://prowritingaid.com/", category: "Writing Enhancement" },
    { name: "Hemingway Editor", url: "https://hemingwayapp.com/", category: "Readability Check" },
    // Step 11 Tools
    // { name: "Google Scholar", url: "https://scholar.google.com/", category: "Academic Verification" }, // Already added
    { name: "Snopes", url: "https://www.snopes.com/", category: "Fact Checking" },
    { name: "Reuters Fact Check", url: "https://www.reuters.com/fact-check", category: "News Verification" },
    // Step 12 Tools
    { name: "Copyscape", url: "https://www.copyscape.com/", category: "Plagiarism Detection" },
    { name: "Quetext", url: "https://www.quetext.com/", category: "Plagiarism Checker" },
    { name: "Duplichecker", url: "https://www.duplichecker.com/", category: "Free Plagiarism Check" },
    // Step 13 Tools
    { name: "Google Search Console", url: "https://search.google.com/search-console", category: "SEO Tools" },
    { name: "Screaming Frog", url: "https://www.screamingfrog.co.uk/seo-spider/", category: "Technical SEO" },
    { name: "GTmetrix", url: "https://gtmetrix.com/", category: "Performance Check" },
    // Step 14 Tools
    { name: "Prettier", url: "https://prettier.io/", category: "Code Formatting" },
    { name: "HTML Formatter", url: "https://www.freeformatter.com/html-formatter.html", category: "HTML Cleanup" },
    { name: "CSS Formatter", url: "https://www.cleancss.com/css-beautify/", category: "CSS Cleanup" },
    // Step 15 Tools
    { name: "Ahrefs", url: "https://ahrefs.com/", category: "Link Analysis" }, // Added from original step 15
    { name: "Majestic", url: "https://majestic.com/", category: "Link Intelligence" },
    { name: "Moz Link Explorer", url: "https://moz.com/link-explorer", category: "Link Research" }, // Added from original step 15
    // Step 16 Tools
    { name: "WordPress", url: "https://wordpress.org/", category: "CMS" },
    { name: "Google Analytics", url: "https://analytics.google.com/", category: "Analytics" },
    { name: "Social Share Preview", url: "https://socialsharepreview.com/", category: "Social Media Preview" },
];
const defaultAssignments = { prompts: {}, tools: {} }; // Keep assignments empty by default

// --- Provider Component ---

export function ResourceLibraryProvider({ children }: { children: React.ReactNode }) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [assignments, setAssignments] = useState<{ prompts: Record<number, number[]>; tools: Record<number, string[]> }>({ prompts: {}, tools: {} });
  const { showFeedback } = useFeedback();

  // --- Load Data ---
  useEffect(() => {
    loadDefinitions();
    loadAssignments();
  }, []);

  const loadDefinitions = () => {
    const saved = localStorage.getItem(RESOURCE_DEFINITIONS_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        // Add stricter check: ensure data exists, has valid arrays, AND arrays are not empty
        if (data && Array.isArray(data.prompts) && data.prompts.length > 0 && Array.isArray(data.tools) && data.tools.length > 0) {
            setPrompts(data.prompts);
            setTools(data.tools);
            console.log("Loaded resource definitions from localStorage.");
        } else {
            // Loaded data is invalid, incomplete, or empty, load defaults instead
            console.warn("Invalid, incomplete, or empty resource definitions found in localStorage, loading defaults.");
            setPrompts(defaultPrompts);
            setTools(defaultTools);
            saveDefinitions(defaultPrompts, defaultTools); // Save defaults
        }
      } catch (e) {
        console.error("Error parsing resource definitions from localStorage:", e);
        setPrompts(defaultPrompts); // Reset to defaults on error
        setTools(defaultTools);
        saveDefinitions(defaultPrompts, defaultTools); // Save defaults
      }
    } else {
      console.log("No saved resource definitions found, loading and saving defaults.");
      setPrompts(defaultPrompts);
      setTools(defaultTools);
      // Save defaults if nothing was found
      saveDefinitions(defaultPrompts, defaultTools);
    }
  };

  const loadAssignments = () => {
    const saved = localStorage.getItem(RESOURCE_ASSIGNMENTS_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        // Check if loaded data seems to be from an old structure (e.g., > 11 steps)
        const maxNewStepId = 11; // Define the new maximum step ID
        const hasOldKeys = Object.keys(data?.prompts || {}).some(key => Number(key) > maxNewStepId) ||
                           Object.keys(data?.tools || {}).some(key => Number(key) > maxNewStepId);

        if (hasOldKeys) {
            console.warn("Detected assignments from old step structure. Clearing assignments.");
            setAssignments(defaultAssignments); // Set to empty
            saveAssignments(defaultAssignments); // Save the empty assignments
        } else {
            setAssignments(data || defaultAssignments); // Load normally
            console.log("Loaded resource assignments.");
        }
      } catch (e) {
        console.error("Error loading/parsing resource assignments:", e);
        setAssignments(defaultAssignments); // Reset to defaults on error
      }
    } else {
        console.log("No saved resource assignments found, using defaults.");
        setAssignments(defaultAssignments);
        // Save defaults if nothing was found
        saveAssignments(defaultAssignments);
    }
  };

  // --- Save Data ---
  const saveDefinitions = useCallback((currentPrompts: Prompt[], currentTools: Tool[]) => {
    try {
      const data = { prompts: currentPrompts, tools: currentTools };
      localStorage.setItem(RESOURCE_DEFINITIONS_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Error saving resource definitions:", e);
      showFeedback("Error saving resource library definitions.", "error");
    }
  }, [showFeedback]);

  const saveAssignments = useCallback((currentAssignments: { prompts: Record<number, number[]>; tools: Record<number, string[]> }) => {
    try {
      localStorage.setItem(RESOURCE_ASSIGNMENTS_KEY, JSON.stringify(currentAssignments));
    } catch (e) {
      console.error("Error saving resource assignments:", e);
      showFeedback("Error saving resource assignments.", "error");
    }
  }, [showFeedback]);

  // --- Definition Management ---

  const addPromptDefinition = (promptData: Omit<Prompt, 'id'>): number => {
    const newId = Date.now(); // Simple ID generation
    const newPrompt: Prompt = { ...promptData, id: newId };
    const updatedPrompts = [...prompts, newPrompt];
    setPrompts(updatedPrompts);
    saveDefinitions(updatedPrompts, tools);
    showFeedback(`Prompt "${newPrompt.title}" added.`, "success");
    return newId;
  };

  const updatePromptDefinition = (updatedPrompt: Prompt) => {
    const updatedPrompts = prompts.map(p => p.id === updatedPrompt.id ? updatedPrompt : p);
    if (updatedPrompts.length === prompts.length) { // Ensure prompt was found
        setPrompts(updatedPrompts);
        saveDefinitions(updatedPrompts, tools);
        showFeedback(`Prompt "${updatedPrompt.title}" updated.`, "success");
    } else {
        showFeedback(`Error: Prompt with ID ${updatedPrompt.id} not found.`, "error");
    }
  };

  const deletePromptDefinition = (promptId: number) => {
     // First, unassign this prompt from all steps
     const newAssignments = { ...assignments };
     let changedAssignments = false;
     Object.keys(newAssignments.prompts).forEach(stepIdStr => {
       const stepId = Number(stepIdStr);
       const initialLength = newAssignments.prompts[stepId]?.length ?? 0;
       newAssignments.prompts[stepId] = (newAssignments.prompts[stepId] || []).filter(id => id !== promptId);
       if (newAssignments.prompts[stepId].length === 0) {
         delete newAssignments.prompts[stepId];
       }
       if ((newAssignments.prompts[stepId]?.length ?? 0) !== initialLength) {
           changedAssignments = true;
       }
     });

     if (changedAssignments) {
         setAssignments(newAssignments);
         saveAssignments(newAssignments);
     }

    // Then, delete the definition
    const updatedPrompts = prompts.filter(p => p.id !== promptId);
    setPrompts(updatedPrompts);
    saveDefinitions(updatedPrompts, tools);
    showFeedback(`Prompt deleted.`, "success");
  };

  const addToolDefinition = (toolData: Tool) => {
     if (tools.some(t => t.name === toolData.name)) {
        showFeedback(`Tool "${toolData.name}" already exists.`, "error");
        return;
     }
    const updatedTools = [...tools, toolData];
    setTools(updatedTools);
    saveDefinitions(prompts, updatedTools);
    showFeedback(`Tool "${toolData.name}" added.`, "success");
  };

  const updateToolDefinition = (updatedTool: Tool) => {
    const updatedTools = tools.map(t => t.name === updatedTool.name ? updatedTool : t);
     if (tools.some(t => t.name === updatedTool.name)) { // Check if tool exists
        setTools(updatedTools);
        saveDefinitions(prompts, updatedTools);
        showFeedback(`Tool "${updatedTool.name}" updated.`, "success");
     } else {
        showFeedback(`Error: Tool "${updatedTool.name}" not found.`, "error");
     }
  };

  const deleteToolDefinition = (toolName: string) => {
    // First, unassign this tool from all steps
    const newAssignments = { ...assignments };
    let changedAssignments = false;
    Object.keys(newAssignments.tools).forEach(stepIdStr => {
      const stepId = Number(stepIdStr);
      const initialLength = newAssignments.tools[stepId]?.length ?? 0;
      newAssignments.tools[stepId] = (newAssignments.tools[stepId] || []).filter(name => name !== toolName);
      if (newAssignments.tools[stepId].length === 0) {
        delete newAssignments.tools[stepId];
      }
       if ((newAssignments.tools[stepId]?.length ?? 0) !== initialLength) {
           changedAssignments = true;
       }
    });

     if (changedAssignments) {
         setAssignments(newAssignments);
         saveAssignments(newAssignments);
     }

    // Then, delete the definition
    const updatedTools = tools.filter(t => t.name !== toolName);
    setTools(updatedTools);
    saveDefinitions(prompts, updatedTools);
    showFeedback(`Tool "${toolName}" deleted.`, "success");
  };

  // --- Assignment Management ---

  const assignPromptToStep = (stepId: number, promptId: number) => {
    if (!prompts.some(p => p.id === promptId)) {
        showFeedback(`Error: Prompt ID ${promptId} not found.`, "error");
        return;
    }
    setAssignments(prev => {
      const newAssignments = { ...prev };
      const currentAssigned = newAssignments.prompts[stepId] || [];
      if (!currentAssigned.includes(promptId)) {
        newAssignments.prompts[stepId] = [...currentAssigned, promptId];
        saveAssignments(newAssignments); // Save immediately
        showFeedback(`Prompt assigned to step ${stepId}.`, "success");
        return newAssignments;
      }
      return prev; // No change needed
    });
  };

  const unassignPromptFromStep = (stepId: number, promptId: number) => {
    setAssignments(prev => {
      const newAssignments = { ...prev };
      const currentAssigned = newAssignments.prompts[stepId] || [];
      const updatedAssigned = currentAssigned.filter(id => id !== promptId);

      if (updatedAssigned.length !== currentAssigned.length) { // Check if something changed
        if (updatedAssigned.length === 0) {
          delete newAssignments.prompts[stepId];
        } else {
          newAssignments.prompts[stepId] = updatedAssigned;
        }
        saveAssignments(newAssignments); // Save immediately
        showFeedback(`Prompt unassigned from step ${stepId}.`, "success");
        return newAssignments;
      }
      return prev; // No change needed
    });
  };

 const assignToolToStep = (stepId: number, toolName: string) => {
     if (!tools.some(t => t.name === toolName)) {
        showFeedback(`Error: Tool "${toolName}" not found.`, "error");
        return;
     }
    setAssignments(prev => {
      const newAssignments = { ...prev };
      const currentAssigned = newAssignments.tools[stepId] || [];
      if (!currentAssigned.includes(toolName)) {
        newAssignments.tools[stepId] = [...currentAssigned, toolName];
        saveAssignments(newAssignments); // Save immediately
        showFeedback(`Tool "${toolName}" assigned to step ${stepId}.`, "success");
        return newAssignments;
      }
      return prev; // No change needed
    });
  };

  const unassignToolFromStep = (stepId: number, toolName: string) => {
    setAssignments(prev => {
      const newAssignments = { ...prev };
      const currentAssigned = newAssignments.tools[stepId] || [];
      const updatedAssigned = currentAssigned.filter(name => name !== toolName);

       if (updatedAssigned.length !== currentAssigned.length) { // Check if something changed
            if (updatedAssigned.length === 0) {
              delete newAssignments.tools[stepId];
            } else {
              newAssignments.tools[stepId] = updatedAssigned;
            }
            saveAssignments(newAssignments); // Save immediately
            showFeedback(`Tool "${toolName}" unassigned from step ${stepId}.`, "success");
            return newAssignments;
       }
      return prev; // No change needed
    });
  };

  // --- Getters for Assigned Resources ---
  // These derive the full Prompt/Tool objects based on assigned IDs/names

  const getPromptsForStep = useCallback((stepId: number): Prompt[] => {
    const assignedIds = assignments.prompts[stepId] || [];
    return assignedIds.map(id => prompts.find(p => p.id === id)).filter((p): p is Prompt => !!p);
  }, [assignments.prompts, prompts]);

  const getToolsForStep = useCallback((stepId: number): Tool[] => {
    const assignedNames = assignments.tools[stepId] || [];
    return assignedNames.map(name => tools.find(t => t.name === name)).filter((t): t is Tool => !!t);
  }, [assignments.tools, tools]);

  // --- Derived State for Context ---
  // Create the derived assignedPrompts/Tools state to pass down
  // This recalculates whenever assignments or definitions change
  const derivedAssignedPrompts = Object.keys(assignments.prompts).reduce((acc, stepIdStr) => {
      const stepId = Number(stepIdStr);
      acc[stepId] = getPromptsForStep(stepId);
      return acc;
  }, {} as Record<number, Prompt[]>);

  const derivedAssignedTools = Object.keys(assignments.tools).reduce((acc, stepIdStr) => {
      const stepId = Number(stepIdStr);
      acc[stepId] = getToolsForStep(stepId);
      return acc;
  }, {} as Record<number, Tool[]>);


  // --- Context Value ---
  const contextValue: ResourceLibraryContextType = {
    prompts,
    tools,
    assignedPrompts: derivedAssignedPrompts, // Use derived state
    assignedTools: derivedAssignedTools,   // Use derived state
    addPromptDefinition,
    updatePromptDefinition,
    deletePromptDefinition,
    addToolDefinition,
    updateToolDefinition,
    deleteToolDefinition,
    assignPromptToStep,
    unassignPromptFromStep,
    assignToolToStep,
    unassignToolFromStep,
    getPromptsForStep,
    getToolsForStep,
  };

  return (
    <ResourceLibraryContext.Provider value={contextValue}>
      {children}
    </ResourceLibraryContext.Provider>
  );
}

// --- Hook ---
export function useResourceLibrary() {
  const context = useContext(ResourceLibraryContext);
  if (context === undefined) {
    throw new Error("useResourceLibrary must be used within a ResourceLibraryProvider");
  }
  return context;
}
