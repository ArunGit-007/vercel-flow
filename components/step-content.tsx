"use client"

import { useState, useEffect } from "react";
import { useWorkflow, type Step } from "@/hooks/use-workflow"; // Import Step type
import { useProfile } from "@/hooks/use-profile";
import { useResourceLibrary } from "@/hooks/useResourceLibrary"; // Import the new hook
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Info, FileText, PenToolIcon as Tool, Search, Save, Plus } from "lucide-react"
import StepDescription from "@/components/step-tabs/step-description"
import StepPrompts from "@/components/step-tabs/step-prompts"
import StepTools from "@/components/step-tabs/step-tools"
import StepSearch from "@/components/step-tabs/step-search"
import StepOutputs from "@/components/step-tabs/step-outputs"

// Removed local interface definitions

export default function StepContent({
  stepData,
}: {
  stepData: Step | null; // Use imported Step type
}) {
  const { primaryKeyword } = useWorkflow(); // Keep primaryKeyword if needed by StepDescription
  const { profileData } = useProfile();
  const { getPromptsForStep, getToolsForStep } = useResourceLibrary(); // Get functions from new hook
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    // Reset to description tab when step changes
    setActiveTab("description")
  }, [stepData?.id])

  if (!stepData) return <div>Loading step content...</div>;

  const stepId = stepData.id;
  const assignedPrompts = getPromptsForStep(stepId);
  const assignedTools = getToolsForStep(stepId);

  const hasPrompts = assignedPrompts.length > 0;
  const hasTools = assignedTools.length > 0;
  const hasSearch = [1, 3].includes(stepId); // Updated: Show search for new steps 1 and 3
  const hasOutputs = stepData.outputFields || stepId === 11; // Updated: Check against new final step ID (11)
  const showToolsTab = hasTools || stepId === 6; // Updated: Special case for new step 6 (Initial SEO & Multimedia)

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
              <FileText className="w-4 h-4 mr-1.5" /> Prompts ({assignedPrompts.length}) {/* Use assignedPrompts length */}
            </TabsTrigger>
          )}

          {showToolsTab && ( // Use showToolsTab flag
            <TabsTrigger
              value="tools"
              className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm" /* Adjusted styles */
            >
              <Tool className="w-4 h-4 mr-1.5" /> {/* Adjusted margin */}
              Tools {stepId !== 6 ? `(${assignedTools.length})` : ""} {/* Updated: Check against new step ID (6) */}
              {stepId === 6 ? "& Images" : ""} {/* Updated: Check against new step ID (6) */}
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
                <FileText className="w-4 h-4 mr-2 text-primary" /> Assigned Prompts {/* Adjusted icon size & Title */}
              </h3>
              {/* Removed Add New Prompt Button */}
            </div>
            {/* TODO: Refactor StepPrompts to use assignedPrompts from useResourceLibrary */}
            <StepPrompts stepData={stepData} /> {/* Remove assignedPrompts prop for now */}
          </TabsContent>
        )}

        {showToolsTab && ( // Use showToolsTab flag
          <TabsContent value="tools" className="bg-card rounded-lg p-5 border shadow-sm mt-0 animate-fade-in">
            <div className="flex justify-between items-center mb-3"> {/* Adjusted margin */}
              <h3 className="text-lg font-semibold flex items-center"> {/* Adjusted size */}
                <Tool className="w-4 h-4 mr-2 text-primary" /> Assigned Tools {/* Adjusted icon size & Title */}
              </h3>
              {/* Removed Add Tool Button */}
            </div>
             {/* TODO: Refactor StepTools to use assignedTools from useResourceLibrary */}
            <StepTools stepData={stepData} /> {/* Remove assignedTools prop for now */}
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
