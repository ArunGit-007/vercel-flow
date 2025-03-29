"use client"

import { useState } from "react"
import { useWorkflow } from "@/hooks/use-workflow"
import { useFeedback } from "@/hooks/use-feedback"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Copy, ArrowRight, Star } from "lucide-react"

export function PromptModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { currentStep, addPrompt, steps } = useWorkflow()
  const { showFeedback } = useFeedback()
  const [promptData, setPromptData] = useState({
    title: "",
    category: "",
    content: "",
    favorite: false,
  })

  // Set default category based on current step
  useState(() => {
    if (isOpen) {
      const currentStepData = steps.find((s) => s.id === currentStep)
      if (currentStepData) {
        setPromptData((prev) => ({
          ...prev,
          category: `${currentStepData.title} Prompts`,
        }))
      }
    }
  })

  const handleInputChange = (field: keyof typeof promptData, value: string | boolean) => {
    setPromptData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    if (!promptData.title.trim() || !promptData.content.trim()) {
      showFeedback("Title and Content are required.", "error")
      return
    }

    const newPrompt = {
      id: Date.now(),
      title: promptData.title.trim(),
      category: promptData.category.trim() || "General Prompts",
      content: promptData.content.trim(),
      favorite: promptData.favorite,
    }

    addPrompt(currentStep, newPrompt)
    showFeedback("Prompt added successfully.", "success")

    // Reset form and close modal
    setPromptData({ title: "", category: "", content: "", favorite: false })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Prompt</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="promptTitle">Prompt Title</Label>
            <Input
              id="promptTitle"
              value={promptData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter a concise title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="promptCategory">Category</Label>
            <Input
              id="promptCategory"
              value={promptData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              placeholder="e.g., Research, Drafting, SEO"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="promptContent">Prompt Content</Label>
            <Textarea
              id="promptContent"
              value={promptData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="Enter the full prompt text. Use [primary keyword] or [output from step X: field name] for dynamic content. Use [our domain], [brand voice] etc. for static profile details."
              rows={5}
            />
            <p className="text-xs text-muted-foreground">
              Dynamic Placeholders: [primary keyword], [Blog Outline], [output from step X: field name]
              <br />
              Static Placeholders: [our domain], [brand voice], [general competitors], [social handles], [sitemap url],
              [wp-admin url]
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="promptFavorite"
              checked={promptData.favorite}
              onCheckedChange={(checked) => handleInputChange("favorite", checked === true)}
            />
            <Label htmlFor="promptFavorite" className="font-normal">
              Mark as Favorite
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Prompt</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function PromptLibraryModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { promptTemplates, showStep, replaceOutputPlaceholders } = useWorkflow()
  const { showFeedback } = useFeedback()
  const [searchQuery, setSearchQuery] = useState("")

  // Collect all prompts from all steps
  let allPrompts: any[] = []
  for (const stepId in promptTemplates) {
    if (promptTemplates[stepId] && promptTemplates[stepId].length > 0) {
      allPrompts = allPrompts.concat(
        promptTemplates[stepId].map((prompt) => ({
          ...prompt,
          stepId: Number.parseInt(stepId),
        })),
      )
    }
  }

  // Sort prompts: favorites first, then by step, then alphabetically
  allPrompts.sort((a, b) => {
    if (a.favorite && !b.favorite) return -1
    if (!a.favorite && b.favorite) return 1
    if (a.stepId !== b.stepId) return a.stepId - b.stepId
    return a.title.localeCompare(b.title)
  })

  // Filter by search query
  const filteredPrompts = searchQuery
    ? allPrompts.filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : allPrompts

  const copyToClipboard = (content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => showFeedback("Prompt copied!", "success"))
      .catch(() => showFeedback("Failed to copy prompt.", "error"))
  }

  const handleGoToStep = (stepId: number) => {
    showStep(stepId)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Prompt Library</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Search prompts by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          <div className="overflow-y-auto max-h-[50vh] pr-2 -mr-2">
            {filteredPrompts.length > 0 ? (
              <div className="divide-y">
                {filteredPrompts.map((prompt) => {
                  const dynamicContent = replaceOutputPlaceholders(prompt.content)

                  return (
                    <div key={`${prompt.id}-${prompt.stepId}`} className="library-item">
                      <h4 className="font-heading font-semibold text-base flex items-center">
                        {prompt.favorite && <Star className="h-4 w-4 text-yellow-400 mr-1.5" />}
                        {prompt.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Category: {prompt.category || "General"} | Step: {prompt.stepId}
                      </p>
                      <pre className="mt-2 p-3 text-sm bg-muted rounded-md border whitespace-pre-wrap overflow-x-auto font-mono line-clamp-3">
                        {dynamicContent}
                      </pre>
                      <div className="mt-2 flex gap-2">
                        <Button variant="default" size="sm" onClick={() => copyToClipboard(dynamicContent)}>
                          <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleGoToStep(prompt.stepId)}>
                          Go to Step <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                {searchQuery
                  ? "No prompts found matching your search."
                  : "No prompts found. Add prompts in workflow steps."}
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

