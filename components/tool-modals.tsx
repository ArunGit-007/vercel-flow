"use client"

import type React from "react"

import { useState } from "react"
import { useWorkflow } from "@/hooks/use-workflow"
import { useFeedback } from "@/hooks/use-feedback"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ExternalLink, ArrowRight } from "lucide-react"

export function ToolModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { currentStep, addTool } = useWorkflow()
  const { showFeedback } = useFeedback()
  const [toolData, setToolData] = useState({
    name: "",
    url: "",
    category: "",
  })

  const handleInputChange = (field: keyof typeof toolData, value: string) => {
    setToolData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    if (!toolData.name.trim()) {
      showFeedback("Tool Name is required.", "error")
      return
    }

    const newTool = {
      name: toolData.name.trim(),
      url: toolData.url.trim() || null,
      category: toolData.category.trim() || "General",
    }

    addTool(currentStep, newTool)
    showFeedback("Tool added successfully.", "success")

    // Reset form and close modal
    setToolData({ name: "", url: "", category: "" })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Tool</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="toolName">Tool Name</Label>
            <Input
              id="toolName"
              value={toolData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., Awesome SEO Analyzer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="toolUrl">Tool URL (Optional)</Label>
            <Input
              id="toolUrl"
              value={toolData.url}
              onChange={(e) => handleInputChange("url", e.target.value)}
              placeholder="https://example.com"
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="toolCategory">Category (Optional)</Label>
            <Input
              id="toolCategory"
              value={toolData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              placeholder="e.g., SEO Analysis"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Add Tool</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ToolLibraryModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { steps, showStep } = useWorkflow()
  const [searchQuery, setSearchQuery] = useState("")

  // Collect all tools from all steps
  const allTools = steps.flatMap((step) =>
    (step.tools || []).map((tool) => ({
      ...tool,
      stepId: step.id,
    })),
  )

  // Remove duplicates by name
  const uniqueTools = allTools.filter((tool, index, self) => index === self.findIndex((t) => t.name === tool.name))

  // Sort alphabetically
  uniqueTools.sort((a, b) => a.name.localeCompare(b.name))

  // Filter by search query
  const filteredTools = searchQuery
    ? uniqueTools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (tool.category && tool.category.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : uniqueTools

  const handleGoToStep = (stepId: number) => {
    showStep(stepId)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Tool Library</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Search tools by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          <div className="overflow-y-auto max-h-[50vh] pr-2 -mr-2">
            {filteredTools.length > 0 ? (
              <div className="divide-y">
                {filteredTools.map((tool, index) => (
                  <div key={`${tool.name}-${index}`} className="library-item">
                    <h4 className="font-heading font-semibold text-base">{tool.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Category: {tool.category || "General"} | Step: {tool.stepId}
                    </p>
                    <div className="mt-2 flex gap-2">
                      {tool.url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={tool.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Visit
                          </a>
                        </Button>
                      )}
                      <Button variant="default" size="sm" onClick={() => handleGoToStep(tool.stepId)}>
                        Go to Step <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                {searchQuery ? "No tools found matching your search." : "No tools found in the workflow."}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Search(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

