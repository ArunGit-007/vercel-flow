"use client"

import { useState, useEffect } from "react"
import { useWorkflow } from "@/hooks/use-workflow"
import { useProfile } from "@/hooks/use-profile"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Info, FileText, PenToolIcon as Tool, Search, Save, Plus } from "lucide-react"
import StepDescription from "@/components/step-tabs/step-description"
import StepPrompts from "@/components/step-tabs/step-prompts"
import StepTools from "@/components/step-tabs/step-tools"
import StepSearch from "@/components/step-tabs/step-search"
import StepOutputs from "@/components/step-tabs/step-outputs"

export default function StepContent({
  stepData,
  onOpenAddTool,
  onOpenPromptForm,
}: {
  stepData: any
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
        <TabsList className="mb-6 border-b rounded-none w-full justify-start h-auto flex-wrap">
          <TabsTrigger value="description" className="tab-button data-[state=active]:active">
            <Info className="w-4 h-4 mr-2" /> Description & Inputs
          </TabsTrigger>

          {hasPrompts && (
            <TabsTrigger value="prompts" className="tab-button data-[state=active]:active">
              <FileText className="w-4 h-4 mr-2" /> Prompts ({stepPrompts.length})
            </TabsTrigger>
          )}

          {(hasTools || stepId === 8) && (
            <TabsTrigger value="tools" className="tab-button data-[state=active]:active">
              <Tool className="w-4 h-4 mr-2" />
              Tools {stepId !== 8 ? `(${(stepData.tools || []).length})` : ""}
              {stepId === 8 ? "& Images" : ""}
            </TabsTrigger>
          )}

          {hasSearch && (
            <TabsTrigger value="search" className="tab-button data-[state=active]:active">
              <Search className="w-4 h-4 mr-2" /> Quick Search
            </TabsTrigger>
          )}

          {hasOutputs && (
            <TabsTrigger value="outputs" className="tab-button data-[state=active]:active">
              <Save className="w-4 h-4 mr-2" /> Outputs
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="description" className="bg-card rounded-xl p-6 border shadow-sm mt-0 animate-fade-in">
          <StepDescription stepData={stepData} primaryKeyword={primaryKeyword} profileData={profileData} />
        </TabsContent>

        {hasPrompts && (
          <TabsContent value="prompts" className="bg-card rounded-xl p-6 border shadow-sm mt-0 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary" /> Workflow Prompts
              </h3>
              <Button onClick={onOpenPromptForm} size="sm">
                <Plus className="w-4 h-4 mr-2" /> Add New Prompt
              </Button>
            </div>
            <StepPrompts stepData={stepData} />
          </TabsContent>
        )}

        {(hasTools || stepId === 8) && (
          <TabsContent value="tools" className="bg-card rounded-xl p-6 border shadow-sm mt-0 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold flex items-center">
                <Tool className="w-5 h-5 mr-2 text-primary" /> Recommended Tools
              </h3>
              <Button onClick={onOpenAddTool} size="sm">
                <Plus className="w-4 h-4 mr-2" /> Add Tool
              </Button>
            </div>
            <StepTools stepData={stepData} />
          </TabsContent>
        )}

        {hasSearch && (
          <TabsContent value="search" className="bg-card rounded-xl p-6 border shadow-sm mt-0 animate-fade-in">
            <StepSearch stepData={stepData} />
          </TabsContent>
        )}

        {hasOutputs && (
          <TabsContent value="outputs" className="bg-card rounded-xl p-6 border shadow-sm mt-0 animate-fade-in">
            <StepOutputs stepData={stepData} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

