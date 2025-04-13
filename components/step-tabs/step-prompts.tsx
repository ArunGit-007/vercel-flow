"use client"

import { useState } from "react";
import { useWorkflow, type Step, type Prompt } from "@/hooks/use-workflow"; // Import Step and Prompt types
import { useResourceLibrary } from "@/hooks/useResourceLibrary"; // Import useResourceLibrary
import { useFeedback } from "@/hooks/use-feedback";
import { Button } from "@/components/ui/button";
import { StarIcon, Copy, ChevronDown, ChevronUp, ExternalLink } from "lucide-react"; // Removed Edit, Trash2

export default function StepPrompts({ stepData }: { stepData: Step }) { // Use Step type
  const { replaceOutputPlaceholders } = useWorkflow(); // Only need placeholder replacement
  const { getPromptsForStep } = useResourceLibrary(); // Only need assigned prompts
  const { showFeedback } = useFeedback();
  const [expandedPrompts, setExpandedPrompts] = useState<Record<string, boolean>>({});

  const stepId = stepData.id;
  const assignedPrompts = getPromptsForStep(stepId); // Get assigned prompts
  // const assignedTools = getToolsForStep(stepId); // Remove - not needed here

  if (assignedPrompts.length === 0) {
    return (
      <p className="text-muted-foreground">No prompts assigned to this step. Assign prompts in the Resource Library.</p> // Updated message
    );
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
  const sortedPrompts = [...assignedPrompts].sort((a, b) => { // Sort assignedPrompts
    if (a.favorite && !b.favorite) return -1;
    if (!a.favorite && b.favorite) return 1;
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {sortedPrompts.map((prompt) => {
        const dynamicPromptContent = replaceOutputPlaceholders(prompt.content);
        const isExpanded = expandedPrompts[prompt.id];
        // const firstToolUrl = assignedTools.length > 0 ? assignedTools[0].url : null; // Remove tool URL logic

        return (
          <div key={prompt.id} className="prompt-card animate-fade-in relative"> {/* Added relative positioning */}
            {/* Removed Edit and Delete buttons */}

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

              {/* Removed Visit Tool button */}
            </div>
          </div>
        )
      })}
    </div>
  )
}
