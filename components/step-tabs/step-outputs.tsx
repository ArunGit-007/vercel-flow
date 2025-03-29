"use client"

import { useState, useEffect } from "react" // Removed useRef
import { useWorkflow, type Step, type OutputField } from "@/hooks/use-workflow" // Import types
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Save, FileCheck, FileText } from "lucide-react"

export default function StepOutputs({ stepData }: { stepData: Step }) { // Use Step type
  const { stepOutputs, autoSaveOutput } = useWorkflow() // Removed unused primaryKeyword, blogOutlineText
  const [wordCounts, setWordCounts] = useState<Record<string, number>>({})

  // Removed unused isInitialRender ref

  const updateWordCount = (text: string, fieldId: string) => {
    const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).filter(Boolean).length
    setWordCounts((prev) => ({
      ...prev,
      [fieldId]: wordCount,
    }))
  }

  const handleTextareaChange = (stepId: number, fieldName: string, value: string, fieldId: string) => {
    autoSaveOutput(stepId, fieldName, value)
    updateWordCount(value, fieldId)
  }

  // For final step (16) - generate final blog output
  const generateFinalBlogOutput = () => {
    const outputOrder = [
      { stepId: 1, field: "primaryKeyword", label: "Primary Keyword" },
      { stepId: 2, field: "selectedTopic", label: "Selected Topic" },
      { stepId: 2, field: "workingHeadline", label: "Working Headline" },
      { stepId: 7, field: "metaDescriptionInitial", label: "Meta Description (Initial)" },
      { stepId: 13, field: "metaDescriptionFinal", label: "Meta Description (Final)" },
      { stepId: 3, field: "researchOutput", label: "Perplexity Research Notes" },
      { stepId: 4, field: "deepResearchOutput", label: "Deep Research Notes" },
      { stepId: 5, field: "outlineOutput", label: "Blog Outline" },
      { stepId: 6, field: "draftOutput", label: "AI-Generated Draft" },
      { stepId: 10, field: "editedDraftGrammar", label: "Draft after Grammar Edit" },
      { stepId: 11, field: "editedDraftRefined", label: "Draft after Refinement" },
      { stepId: 9, field: "faqContent", label: "FAQs" },
      { stepId: 9, field: "ctaContent", label: "CTAs" },
      { stepId: 15, field: "linkAuditNotes", label: "Link Audit Notes" },
      { stepId: 14, field: "finalHtmlCode", label: "Final Code (HTML/Markdown)" },
      ...[1, 3, 4].flatMap((id) => {
        const queries = stepOutputs[id]?.savedSearchQueries || []
        return queries.length > 0
          ? [{ stepId: id, field: "savedSearchQueries", label: `Saved Search Queries (Step ${id})` }]
          : []
      }),
    ]

    return (
      <div className="border-b border-border pb-8 mb-8">
        <h3 className="text-2xl font-semibold flex items-center mb-6">
          <FileCheck className="w-6 h-6 mr-3 text-primary" /> Final Article Review & Export
        </h3>

        <p className="text-muted-foreground mb-8 text-base">
          Review the compiled outputs below. You can make final edits directly in these textareas before exporting.
        </p>

        <div className="space-y-10">
          {outputOrder.map((item) => {
            let outputContent = stepOutputs[item.stepId]?.[item.field] || ""
            const isSearchQueries = item.field === "savedSearchQueries"
            const outputId = `review-output-step${item.stepId}-${item.field}` // Define outputId here

            if (isSearchQueries && Array.isArray(outputContent)) {
              outputContent = outputContent.map((q) => q.query).join("\n")
            } else if (typeof outputContent !== "string") {
              outputContent = JSON.stringify(outputContent, null, 2)
            }

            // Move useEffect call outside the conditional
            // useEffect(() => {
            //   if (outputContent.trim()) {
            //     updateWordCount(outputContent, outputId)
            //   }
            // }, [outputContent, outputId])

            if (outputContent.trim()) {
              const rows =
                item.field.includes("Draft") || item.field === "finalHtmlCode" || item.field === "outlineOutput"
                  ? 20
                  : 8

              return (
                <div key={outputId} className="space-y-3">
                  <Label htmlFor={outputId} className="text-lg font-semibold flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-primary" /> {item.label}
                  </Label>

                  <Textarea
                    id={outputId}
                    value={outputContent}
                    rows={rows}
                    readOnly={isSearchQueries}
                    onChange={(e) => {
                      if (!isSearchQueries) {
                        handleTextareaChange(item.stepId, item.field, e.target.value, outputId)
                      }
                    }}
                    className="text-base"
                  />

                  <div className="text-right text-sm text-muted-foreground">{wordCounts[outputId] || 0} words</div>
                </div>
              )
            }

            return null
          })}
        </div>

        <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-border">
          <Button variant="outline" size="lg" onClick={() => exportReport("text")} className="h-12 px-6 text-base">
            <FileText className="h-5 w-5 mr-2" /> Export .txt
          </Button>
          <Button variant="outline" size="lg" onClick={() => exportReport("markdown")} className="h-12 px-6 text-base">
            <FileText className="h-5 w-5 mr-2" /> Export .md
          </Button>
          <Button variant="outline" size="lg" onClick={() => exportReport("html")} className="h-12 px-6 text-base">
            <FileText className="h-5 w-5 mr-2" /> Export .html
          </Button>
        </div>
      </div>
    )
  }

  const exportReport = (format: "text" | "markdown" | "html") => {
    // This would be implemented with the export functionality
    console.log(`Exporting in ${format} format`)
    alert(`Exporting in ${format} format. This functionality would be implemented here.`)
  }

  useEffect(() => {
    if (stepData.id === 16) {
      // When stepData.id is 16, loop through outputOrder and update word counts
      const outputOrder = [
        { stepId: 1, field: "primaryKeyword", label: "Primary Keyword" },
        { stepId: 2, field: "selectedTopic", label: "Selected Topic" },
        { stepId: 2, field: "workingHeadline", label: "Working Headline" },
        { stepId: 7, field: "metaDescriptionInitial", label: "Meta Description (Initial)" },
        { stepId: 13, field: "metaDescriptionFinal", label: "Meta Description (Final)" },
        { stepId: 3, field: "researchOutput", label: "Perplexity Research Notes" },
        { stepId: 4, field: "deepResearchOutput", label: "Deep Research Notes" },
        { stepId: 5, field: "outlineOutput", label: "Blog Outline" },
        { stepId: 6, field: "draftOutput", label: "AI-Generated Draft" },
        { stepId: 10, field: "editedDraftGrammar", label: "Draft after Grammar Edit" },
        { stepId: 11, field: "editedDraftRefined", label: "Draft after Refinement" },
        { stepId: 9, field: "faqContent", label: "FAQs" },
        { stepId: 9, field: "ctaContent", label: "CTAs" },
        { stepId: 15, field: "linkAuditNotes", label: "Link Audit Notes" },
        { stepId: 14, field: "finalHtmlCode", label: "Final Code (HTML/Markdown)" },
        ...[1, 3, 4].flatMap((id) => {
          const queries = stepOutputs[id]?.savedSearchQueries || []
          return queries.length > 0
            ? [{ stepId: id, field: "savedSearchQueries", label: `Saved Search Queries (Step ${id})` }]
            : []
        }),
      ]

      outputOrder.forEach((item) => {
        let outputContent = stepOutputs[item.stepId]?.[item.field] || ""
        const isSearchQueries = item.field === "savedSearchQueries"
        const outputId = `review-output-step${item.stepId}-${item.field}`

        if (isSearchQueries && Array.isArray(outputContent)) {
          outputContent = outputContent.map((q) => q.query).join("\n")
        } else if (typeof outputContent !== "string") {
          outputContent = JSON.stringify(outputContent, null, 2)
        }

        if (outputContent.trim()) {
          updateWordCount(outputContent, outputId)
        }
      })
    } else {
      // When stepData.id is not 16, loop through stepData.outputFields and update word counts
      if (stepData.outputFields) {
        stepData.outputFields.forEach((outputField: OutputField) => { // Use OutputField type
          const outputId = `output-${stepData.id}-${outputField.name}`
          const currentStepOutputs = stepOutputs[stepData.id] || {}
          const savedOutput = currentStepOutputs[outputField.name] || ""

          updateWordCount(savedOutput, outputId)
        })
      }
    }
  }, [stepData, stepOutputs])

  if (stepData.id === 16) {
    return generateFinalBlogOutput()
  }

  if (!stepData.outputFields || stepData.outputFields.length === 0) {
    return <p className="text-muted-foreground">No specific outputs defined for this step.</p>
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold flex items-center mb-6">
        <Save className="w-6 h-6 mr-3 text-primary" /> Step Outputs
      </h3>

      <div className="space-y-8">
        {stepData.outputFields.map((outputField: OutputField) => { // Use OutputField type
          const outputId = `output-${stepData.id}-${outputField.name}`
          const currentStepOutputs = stepOutputs[stepData.id] || {}
          const savedOutput = currentStepOutputs[outputField.name] || ""

          // Move useEffect call outside the conditional
          // useEffect(() => {
          //   updateWordCount(savedOutput, outputId)
          // }, [savedOutput, outputId])

          return (
            <div key={outputId} className="space-y-3">
              <Label htmlFor={outputId} className="text-lg">
                {outputField.label}
              </Label>
              <Textarea
                id={outputId}
                value={savedOutput}
                placeholder={outputField.placeholder}
                rows={8}
                onChange={(e) => handleTextareaChange(stepData.id, outputField.name, e.target.value, outputId)}
                className="text-base"
              />
              <div className="text-right text-sm text-muted-foreground">{wordCounts[outputId] || 0} words</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
