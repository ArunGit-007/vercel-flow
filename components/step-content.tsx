"use client"

import { useState, useEffect } from "react"
import { useWorkflow, type Step } from "@/hooks/use-workflow" // Import Step type
import { useProfile } from "@/hooks/use-profile"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Info, FileText, PenToolIcon as Tool, Search, Save, Plus } from "lucide-react"
import StepDescription from "@/components/step-tabs/step-description"
import StepPrompts from "@/components/step-tabs/step-prompts"
import StepTools from "@/components/step-tabs/step-tools"
import StepSearch from "@/components/step-tabs/step-search"
import StepOutputs from "@/components/step-tabs/step-outputs"

// Removed local interface definitions

export default function StepContent({
  stepData,
  onOpenAddTool,
  onOpenPromptForm,
}: {
  stepData: Step | null // Use imported Step type
  onOpenAddTool: () => void
  onOpenPromptForm: () => void
}) {
  const { promptTemplates, primaryKeyword } = useWorkflow()
  const { profileData } = useProfile()
  const [activeTab, setActiveTab] = useState("description")

  useEffect(() => {
    // Reset to description tab when step changes
    setActiveTab("description")
  }, [stepData?.id])

  if (!stepData) return <div>Loading step content...</div>

  const stepId = stepData.id
  const stepPrompts = promptTemplates[String(stepId)] || []
  const hasPrompts = stepPrompts.length > 0
  const hasTools = stepData.tools && stepData.tools.length > 0
  const hasSearch = [1, 3, 4].includes(stepId)
  const hasOutputs = stepData.outputFields || stepId === 16

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Simplified TabsList */}
        <TabsList className="mb-4 bg-secondary rounded-lg p-1 inline-flex flex-wrap gap-1">
          <TabsTrigger
            value="description"
            className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm" /* Adjusted styles */
          >
            <Info className="w-4 h-4 mr-1.5" /> Description & Inputs {/* Adjusted margin */}
          </TabsTrigger>

          {hasPrompts && (
            <TabsTrigger
              value="prompts"
              className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm" /* Adjusted styles */
            >
              <FileText className="w-4 h-4 mr-1.5" /> Prompts ({stepPrompts.length}) {/* Adjusted margin */}
            </TabsTrigger>
          )}

          {(hasTools || stepId === 8) && (
            <TabsTrigger
              value="tools"
              className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm" /* Adjusted styles */
            >
              <Tool className="w-4 h-4 mr-1.5" /> {/* Adjusted margin */}
              Tools {stepId !== 8 ? `(${(stepData.tools || []).length})` : ""}
              {stepId === 8 ? "& Images" : ""}
            </TabsTrigger>
          )}

          {hasSearch && (
            <TabsTrigger
              value="search"
              className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm" /* Adjusted styles */
            >
              <Search className="w-4 h-4 mr-1.5" /> Quick Search {/* Adjusted margin */}
            </TabsTrigger>
          )}

          {hasOutputs && (
            <TabsTrigger
              value="outputs"
              className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm" /* Adjusted styles */
            >
              <Save className="w-4 h-4 mr-1.5" /> Outputs {/* Adjusted margin */}
            </TabsTrigger>
          )}
        </TabsList>

        {/* Simplified TabsContent */}
        <TabsContent value="description" className="bg-card rounded-lg p-5 border shadow-sm mt-0 animate-fade-in">
          <StepDescription stepData={stepData} primaryKeyword={primaryKeyword} profileData={profileData} />
        </TabsContent>

        {hasPrompts && (
          <TabsContent value="prompts" className="bg-card rounded-lg p-5 border shadow-sm mt-0 animate-fade-in">
            <div className="flex justify-between items-center mb-3"> {/* Adjusted margin */}
              <h3 className="text-lg font-semibold flex items-center"> {/* Adjusted size */}
                <FileText className="w-4 h-4 mr-2 text-primary" /> Workflow Prompts {/* Adjusted icon size */}
              </h3>
              <Button onClick={onOpenPromptForm} size="sm" variant="outline"> {/* Added variant */}
                <Plus className="w-4 h-4 mr-1.5" /> Add New Prompt {/* Adjusted margin */}
              </Button>
            </div>
            <StepPrompts stepData={stepData} />
          </TabsContent>
        )}

        {(hasTools || stepId === 8) && (
          <TabsContent value="tools" className="bg-card rounded-lg p-5 border shadow-sm mt-0 animate-fade-in">
            <div className="flex justify-between items-center mb-3"> {/* Adjusted margin */}
              <h3 className="text-lg font-semibold flex items-center"> {/* Adjusted size */}
                <Tool className="w-4 h-4 mr-2 text-primary" /> Recommended Tools {/* Adjusted icon size */}
              </h3>
              <Button onClick={onOpenAddTool} size="sm" variant="outline"> {/* Added variant */}
                <Plus className="w-4 h-4 mr-1.5" /> Add Tool {/* Adjusted margin */}
              </Button>
            </div>
            <StepTools stepData={stepData} />
          </TabsContent>
        )}

        {hasSearch && (
          <TabsContent value="search" className="bg-card rounded-lg p-5 border shadow-sm mt-0 animate-fade-in">
            <StepSearch stepData={stepData} />
          </TabsContent>
        )}

        {hasOutputs && (
          <TabsContent value="outputs" className="bg-card rounded-lg p-5 border shadow-sm mt-0 animate-fade-in">
            <StepOutputs stepData={stepData} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
