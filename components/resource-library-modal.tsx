"use client";

import React, { useState } from 'react';
// Cleaned up duplicate imports
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useResourceLibrary } from "@/hooks/useResourceLibrary";
import { useWorkflow, type Prompt, type Tool, type Step } from "@/hooks/use-workflow"; // Import Step type and useWorkflow
import PromptForm from "@/components/prompt-form"; // Import the prompt form component
import ToolForm from "@/components/tool-form"; // Import the tool form component
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"; // Import AlertDialog for delete confirmation
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select components
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea for dropdowns

interface ResourceLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResourceLibraryModal({ isOpen, onClose }: ResourceLibraryModalProps) {
  const {
    prompts,
    tools,
    assignedPrompts,
    assignedTools,
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
  } = useResourceLibrary();
  const { steps: workflowSteps } = useWorkflow(); // Get steps definition - Moved to top level

  const [activeTab, setActiveTab] = useState("prompts"); // Default tab

  // --- State for Forms/Editing (Moved before early return) ---
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [showAddPromptForm, setShowAddPromptForm] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [showAddToolForm, setShowAddToolForm] = useState(false);

  if (!isOpen) return null; // Early return if modal is not open

  // --- Prompt Management UI ---
  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setShowAddPromptForm(false); // Ensure add form is hidden
  };

  const handleCloseForms = () => {
    setEditingPrompt(null);
    setShowAddPromptForm(false);
  };

  const handleDeletePrompt = (promptId: number) => {
      deletePromptDefinition(promptId);
      // Optionally close edit form if the deleted prompt was being edited
      if (editingPrompt?.id === promptId) {
          setEditingPrompt(null);
      }
  }

  const renderPromptManagement = () => {
    // If adding or editing, show the form instead of the list
    if (showAddPromptForm) {
      return <PromptForm onClose={handleCloseForms} />;
    }
    if (editingPrompt) {
      return <PromptForm prompt={editingPrompt} onClose={handleCloseForms} />;
    }

    // Otherwise, show the list and add button
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Prompt Definitions</h3>
          <Button size="sm" onClick={() => setShowAddPromptForm(true)}>
            Add New Prompt
          </Button>
        </div>

        {prompts.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No prompts defined yet.</p>
        ) : (
          <div className="space-y-3">
            {prompts.map(p => (
              <div key={p.id} className="border p-3 rounded-md bg-muted/20 flex justify-between items-start gap-2">
                <div className="flex-grow"> {/* Allow text content to take space */}
                  <p className="font-medium">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.category}</p>
                  <details className="mt-2 text-sm">
                    <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">View Content</summary>
                    <pre className="mt-1 p-2 text-xs bg-background rounded border whitespace-pre-wrap font-mono break-words"> {/* Added break-words */}
                      {p.content}
                    </pre>
                  </details>
                </div>
                <div className="flex gap-1 flex-shrink-0"> {/* Buttons container */}
                   <Button variant="ghost" size="sm" onClick={() => handleEditPrompt(p)}>Edit</Button>
                   <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the prompt definition
                            and unassign it from all steps.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeletePrompt(p.id)} className="bg-destructive hover:bg-destructive/90">
                            Delete Prompt
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // --- Tool Management UI ---
  // State moved above

  const handleEditTool = (tool: Tool) => {
    setEditingTool(tool);
    setShowAddToolForm(false); // Ensure add form is hidden
  };

  const handleCloseToolForms = () => {
    setEditingTool(null);
    setShowAddToolForm(false);
  };

   const handleDeleteTool = (toolName: string) => {
      deleteToolDefinition(toolName);
      // Optionally close edit form if the deleted tool was being edited
      if (editingTool?.name === toolName) {
          setEditingTool(null);
      }
  }


  const renderToolManagement = () => {
    // If adding or editing, show the form instead of the list
    if (showAddToolForm) {
      return <ToolForm onClose={handleCloseToolForms} />;
    }
    if (editingTool) {
      return <ToolForm tool={editingTool} onClose={handleCloseToolForms} />;
    }

    // Otherwise, show the list and add button
     return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Tool Definitions</h3>
           <Button size="sm" onClick={() => setShowAddToolForm(true)}>
            Add New Tool
          </Button>
        </div>

         {tools.length === 0 ? (
           <p className="text-muted-foreground text-center py-4">No tools defined yet.</p>
         ) : (
           <div className="space-y-3">
             {tools.map(t => (
               <div key={t.name} className="border p-3 rounded-md bg-muted/20 flex justify-between items-start gap-2">
                 <div className="flex-grow"> {/* Allow text content to take space */}
                   <p className="font-medium">{t.name}</p>
                   <p className="text-xs text-muted-foreground">{t.category}</p>
                   <a href={t.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline break-all">
                     {t.url}
                   </a>
                 </div>
                 <div className="flex gap-1 flex-shrink-0"> {/* Buttons container */}
                    <Button variant="ghost" size="sm" onClick={() => handleEditTool(t)}>Edit</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the tool definition
                            and unassign it from all steps.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteTool(t.name)} className="bg-destructive hover:bg-destructive/90">
                            Delete Tool
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                 </div>
               </div>
             ))}
           </div>
         )}
      </div>
    );
  };

  // --- Assignment Management UI ---
  // Removed useWorkflow call from here

  const renderAssignmentManagement = () => {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-4">Step Assignments</h3>
        <p className="text-sm text-muted-foreground mb-4">Assign prompts and tools to each workflow step.</p>

        <div className="space-y-4">
          {workflowSteps.map((step: Step) => (
            <div key={step.id} className="border p-4 rounded-md bg-muted/20">
              <h4 className="font-semibold mb-3">Step {step.id}: {step.title}</h4>
              <div className="grid grid-cols-2 gap-4">
                {/* Prompt Assignments for this step */}
                <div>
                  <h5 className="text-sm font-medium mb-2">Assigned Prompts</h5>
                  {/* TODO: Add UI to assign prompts */}
                  <div className="space-y-1 text-xs">
                     {(assignedPrompts[step.id] || []).length > 0 ? (
                       // Iterate directly over the Prompt objects in assignedPrompts[step.id]
                       (assignedPrompts[step.id] || []).map(prompt => (
                           <div key={prompt.id} className="flex justify-between items-center bg-background p-1.5 rounded border">
                             <span className="truncate pr-1">{prompt.title}</span> {/* Added truncate */}
                             <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive h-auto px-1 py-0 flex-shrink-0" onClick={() => unassignPromptFromStep(step.id, prompt.id)}>Remove</Button> {/* Added flex-shrink-0 */}
                           </div>
                       ))
                     ) : (
                       <p className="text-muted-foreground italic">None assigned</p>
                     )}
                  </div>
                   {/* Assign Prompt Dropdown */}
                   <Select
                      onValueChange={(promptId) => {
                        if (promptId) { // Ensure a value was selected
                           assignPromptToStep(step.id, Number(promptId));
                        }
                      }}
                      // Reset value after selection if needed, or handle within Select logic
                    >
                      <SelectTrigger className="mt-2 h-auto py-1 px-2 text-xs w-full">
                        <SelectValue placeholder="Assign Prompt..." />
                      </SelectTrigger>
                      <SelectContent>
                         <ScrollArea className="h-[150px]"> {/* Limit dropdown height */}
                            {prompts
                              .filter(p => !(assignedPrompts[step.id] || []).some(ap => ap.id === p.id)) // Filter out already assigned prompts
                              .map(p => (
                                <SelectItem key={p.id} value={String(p.id)}>
                                  {p.title} ({p.category})
                                </SelectItem>
                              ))
                            }
                            {prompts.filter(p => !(assignedPrompts[step.id] || []).some(ap => ap.id === p.id)).length === 0 && (
                               <p className="p-2 text-xs text-muted-foreground">No more prompts to assign.</p>
                            )}
                         </ScrollArea>
                      </SelectContent>
                    </Select>
                </div>

                {/* Tool Assignments for this step */}
                 <div>
                  <h5 className="text-sm font-medium mb-2">Assigned Tools</h5>
                   {/* TODO: Add UI to assign tools */}
                   <div className="space-y-1 text-xs">
                     {(assignedTools[step.id] || []).length > 0 ? (
                       // Iterate directly over the Tool objects in assignedTools[step.id]
                       (assignedTools[step.id] || []).map(tool => (
                           <div key={tool.name} className="flex justify-between items-center bg-background p-1.5 rounded border">
                             <span className="truncate pr-1">{tool.name}</span> {/* Added truncate */}
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive h-auto px-1 py-0 flex-shrink-0" onClick={() => unassignToolFromStep(step.id, tool.name)}>Remove</Button> {/* Added flex-shrink-0 */}
                           </div>
                       ))
                     ) : (
                       <p className="text-muted-foreground italic">None assigned</p>
                     )}
                   </div>
                    {/* Assign Tool Dropdown */}
                     <Select
                      onValueChange={(toolName) => {
                         if (toolName) { // Ensure a value was selected
                           assignToolToStep(step.id, toolName);
                         }
                      }}
                     >
                      <SelectTrigger className="mt-2 h-auto py-1 px-2 text-xs w-full">
                        <SelectValue placeholder="Assign Tool..." />
                      </SelectTrigger>
                      <SelectContent>
                         <ScrollArea className="h-[150px]"> {/* Limit dropdown height */}
                          {tools
                            .filter(t => !(assignedTools[step.id] || []).some(at => at.name === t.name)) // Filter out already assigned tools
                            .map(t => (
                              <SelectItem key={t.name} value={t.name}>
                                {t.name} ({t.category})
                              </SelectItem>
                            ))
                          }
                           {tools.filter(t => !(assignedTools[step.id] || []).some(at => at.name === t.name)).length === 0 && (
                               <p className="p-2 text-xs text-muted-foreground">No more tools to assign.</p>
                            )}
                          </ScrollArea>
                      </SelectContent>
                    </Select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Resource Library</DialogTitle>
          <DialogDescription>
            Manage prompt & tool definitions and assign them to workflow steps. Changes are saved automatically.
          </DialogDescription>
         </DialogHeader>

         {/* Make Tabs the flex container that grows */}
         <Tabs defaultValue="prompts" orientation="vertical" className="flex-grow overflow-hidden flex gap-4 py-4"> {/* Added flex-grow, overflow, flex, gap, py */}
            <TabsList className="w-[200px] flex-shrink-0 border-r pr-4 flex flex-col h-full justify-start items-stretch"> {/* Set width, shrink, border, padding */}
              <TabsTrigger value="prompts" className="justify-start">Prompts</TabsTrigger>
              <TabsTrigger value="tools" className="justify-start">Tools</TabsTrigger>
              <TabsTrigger value="assignments" className="justify-start">Assignments</TabsTrigger>
            </TabsList>

            {/* This div will now contain the content and handle scrolling */}
            <div className="flex-grow overflow-y-auto pr-2"> {/* Added flex-grow, overflow, padding */}
              <TabsContent value="prompts" className="mt-0"> {/* Removed h-full */}
                {renderPromptManagement()}
              </TabsContent>
              <TabsContent value="tools" className="mt-0"> {/* Removed h-full */}
                {renderToolManagement()}
              </TabsContent>
              <TabsContent value="assignments" className="mt-0"> {/* Removed h-full */}
                {renderAssignmentManagement()}
              </TabsContent>
            </div>
         </Tabs>
         {/* Removed the extra wrapping div */}

         <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
