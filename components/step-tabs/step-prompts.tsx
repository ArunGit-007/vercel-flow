"use client"

import { useState } from "react"
import { useWorkflow } from "@/hooks/use-workflow"
import { useFeedback } from "@/hooks/use-feedback"
import { Button } from "@/components/ui/button"
import { StarIcon, Edit, Trash2, Copy, ChevronDown, ChevronUp, ExternalLink } from "lucide-react"

export default function StepPrompts({ stepData }: { stepData: any }) {
  const { promptTemplates, replaceOutputPlaceholders } = useWorkflow()
  const { showFeedback } = useFeedback()
  const [expandedPrompts, setExpandedPrompts] = useState<Record<string, boolean>>({})

  const stepId = stepData.id
  const stepPrompts = promptTemplates[String(stepId)] || []

  if (stepPrompts.length === 0) {
    return (
      <p className="text-muted-foreground">No prompts defined for this step. Click 'Add New Prompt' to create one.</p>
    )
  }

  const togglePromptContent = (promptId: number) => {
    console.log("togglePromptContent called for promptId:", promptId);
    setExpandedPrompts((prev) => {
      const newState = {
        ...prev,
        [promptId]: !prev[promptId],
      };
      console.log("New expandedPrompts state:", newState);
      return newState;
    });
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => showFeedback("Prompt copied!", "success"))
      .catch(() => showFeedback("Failed to copy prompt.", "error"))
  }

  // Sort prompts: favorites first, then alphabetically
  const sortedPrompts = [...stepPrompts].sort((a, b) => {
    if (a.favorite && !b.favorite) return -1
    if (!a.favorite && b.favorite) return 1
    return a.title.localeCompare(b.title)
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {sortedPrompts.map((prompt) => {
        const dynamicPromptContent = replaceOutputPlaceholders(prompt.content)
        const isExpanded = expandedPrompts[prompt.id]
        const firstToolUrl = stepData.tools && stepData.tools.length > 0 ? stepData.tools[0].url : null

        return (
          <div key={prompt.id} className="prompt-card animate-fade-in">
            <div className="absolute top-2 right-2 flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full opacity-60 hover:opacity-100 hover:bg-background"
                onClick={() => {
                  /* Edit prompt */
                }}
                title="Edit Prompt"
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full opacity-60 hover:opacity-100 hover:bg-background"
                onClick={() => {
                  /* Delete prompt */
                }}
                title="Delete Prompt"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => { 
                console.log("Parent div onClick triggered for promptId:", prompt.id);
                togglePromptContent(prompt.id);
              }}
            >
              <h5
                className="font-heading font-semibold text-base flex items-center"
                // Removed onClick from h5 to simplify
              >
                {prompt.favorite && <StarIcon className="h-4 w-4 text-yellow-400 mr-1.5" />}
                <span className="flex-grow pr-2 truncate">{prompt.title}</span>
              </h5>
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              )}
            </div>

            {isExpanded && (
              <pre className="mt-2 p-3 text-sm bg-muted rounded-md border whitespace-pre-wrap overflow-x-auto font-mono">
                {dynamicPromptContent}
              </pre>
            )}

            <div className={`flex gap-3 mt-auto ${!isExpanded && "hidden"} pt-4 border-t border-border mt-4`}>
              <Button
                variant="default"
                size="sm"
                onClick={() => copyToClipboard(dynamicPromptContent)}
                className="flex-1"
              >
                <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy Prompt
              </Button>

              {firstToolUrl && (
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <a href={firstToolUrl} target="_blank" rel="noopener noreferrer">
                    Visit Tool <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
