"use client"

import { useState } from "react"
import { useWorkflow } from "@/hooks/use-workflow"
import { useFeedback } from "@/hooks/use-feedback"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Copy, Save, SatelliteIcon as Spy, FileText, BookOpen } from "lucide-react"
import { type Step } from "@/hooks/use-workflow" // Import Step type

export default function StepSearch({ stepData }: { stepData: Step }) { // Use Step type
  const { primaryKeyword, autoSaveOutput, stepOutputs } = useWorkflow()
  const { showFeedback } = useFeedback()
  const [searchParams, setSearchParams] = useState({
    keyword: primaryKeyword || "",
    exactMatch: false,
    intitle: "",
    site: "",
    excludeTerms: "pinterest quora reddit youtube amazon",
  })
  const [generatedQuery, setGeneratedQuery] = useState("")
  const [showQueryResult, setShowQueryResult] = useState(false)

  const handleParamChange = (param: keyof typeof searchParams, value: string | boolean) => {
    setSearchParams((prev) => ({
      ...prev,
      [param]: value,
    }))
  }

  const generateQuery = () => {
    if (!searchParams.keyword.trim()) {
      showFeedback("Please enter a keyword or phrase", "warning")
      return
    }

    const queryParts = []
    let processedKeyword = searchParams.keyword

    if (searchParams.exactMatch) {
      processedKeyword = `"${searchParams.keyword}"`
    }

    queryParts.push(processedKeyword)

    if (searchParams.site) {
      queryParts.push(`site:${searchParams.site}`)
    }

    if (searchParams.intitle) {
      queryParts.push(`intitle:${searchParams.intitle}`)
    }

    if (searchParams.excludeTerms) {
      searchParams.excludeTerms.split(/\s+/).forEach((term) => {
        if (term) {
          queryParts.push(`-${term}`)
        }
      })
    }

    const finalQuery = queryParts.join(" ")
    setGeneratedQuery(finalQuery)
    setShowQueryResult(true)
    return finalQuery
  }

  const applyQuickPreset = (presetType: "competitor" | "blogs" | "guides") => {
    const newParams = { ...searchParams }

    // Reset some fields
    newParams.site = ""
    newParams.intitle = ""
    newParams.excludeTerms = "pinterest quora reddit youtube amazon"

    switch (presetType) {
      case "competitor":
        const competitorDomains = stepOutputs[1]?.competitorWebsiteUrls || []
        newParams.site = competitorDomains[0] || "competitor.com"
        break
      case "blogs":
        newParams.intitle = "blog | article"
        break
      case "guides":
        newParams.intitle = "guide | tutorial | how to | learn"
        break
    }

    setSearchParams(newParams)
    generateQuery()
  }

  const openSearchQuery = () => {
    if (!generatedQuery) {
      showFeedback("Generate a query first.", "warning")
      return
    }

    window.open(`https://www.google.com/search?q=${encodeURIComponent(generatedQuery)}`, "_blank")
  }

  const saveSearchQueryToOutput = () => {
    if (!generatedQuery) {
      showFeedback("Generate a query first.", "warning")
      return
    }

    const stepId = stepData.id
    const fieldName = "savedSearchQueries"

    // Define interface for saved query objects
    interface SavedQuery {
      query: string;
      timestamp: string;
    }

    let existingQueries: SavedQuery[] = stepOutputs[stepId]?.[fieldName] || []
    if (!Array.isArray(existingQueries)) {
      existingQueries = []
    }

    const timestamp = new Date().toISOString()

    if (!existingQueries.some((q: SavedQuery) => q.query === generatedQuery)) { // Add type to 'q'
      existingQueries.push({ query: generatedQuery, timestamp })
      autoSaveOutput(stepId, fieldName, existingQueries)
      showFeedback("Search query saved to step outputs.", "success")
    } else {
      showFeedback("Search query already saved.", "info")
    }
  }

  const copyToClipboard = () => {
    if (!generatedQuery) {
      showFeedback("Generate a query first.", "warning")
      return
    }

    navigator.clipboard
      .writeText(generatedQuery)
      .then(() => showFeedback("Query copied!", "success"))
      .catch(() => showFeedback("Failed to copy query.", "error"))
  }

  return (
    <div>
      <h3 className="text-xl font-semibold flex items-center mb-4">
        <Search className="w-5 h-5 mr-2 text-primary" /> Quick Google Search Builder
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`search-keyword-${stepData.id}`}>Search for</Label>
          <div className="flex rounded-md shadow-sm">
            <Input
              id={`search-keyword-${stepData.id}`}
              value={searchParams.keyword}
              onChange={(e) => handleParamChange("keyword", e.target.value)}
              placeholder="Keyword or phrase"
              className="rounded-r-none"
            />
            <div className="inline-flex items-center px-3 rounded-r-md border border-l-0 bg-muted text-muted-foreground text-sm">
              <Checkbox
                id={`exact-match-${stepData.id}`}
                checked={searchParams.exactMatch}
                onCheckedChange={(checked) => handleParamChange("exactMatch", checked === true)}
                className="mr-2 h-4 w-4"
              />
              <Label htmlFor={`exact-match-${stepData.id}`} className="cursor-pointer">
                Exact
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`intitle-value-${stepData.id}`}>
            Must be in title <code className="text-xs bg-muted px-1 py-0.5 rounded">intitle:</code>
          </Label>
          <Input
            id={`intitle-value-${stepData.id}`}
            value={searchParams.intitle}
            onChange={(e) => handleParamChange("intitle", e.target.value)}
            placeholder="e.g., guide OR review"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`site-value-${stepData.id}`}>
            Limit to website <code className="text-xs bg-muted px-1 py-0.5 rounded">site:</code>
          </Label>
          <Input
            id={`site-value-${stepData.id}`}
            value={searchParams.site}
            onChange={(e) => handleParamChange("site", e.target.value)}
            placeholder="e.g., competitor.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`exclude-terms-${stepData.id}`}>
            Exclude sites/terms <code className="text-xs bg-muted px-1 py-0.5 rounded">-term</code>
          </Label>
          <Input
            id={`exclude-terms-${stepData.id}`}
            value={searchParams.excludeTerms}
            onChange={(e) => handleParamChange("excludeTerms", e.target.value)}
            placeholder="e.g., pinterest quora amazon"
          />
          <p className="text-xs text-muted-foreground">Separate terms with spaces.</p>
        </div>
      </div>

      <div className="mb-4 mt-4">
        <Label className="mb-2 block">Quick Presets</Label>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => applyQuickPreset("competitor")}>
            <Spy className="h-3.5 w-3.5 mr-1.5" /> Competitor Content
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyQuickPreset("blogs")}>
            <FileText className="h-3.5 w-3.5 mr-1.5" /> Blog Posts
          </Button>
          <Button variant="outline" size="sm" onClick={() => applyQuickPreset("guides")}>
            <BookOpen className="h-3.5 w-3.5 mr-1.5" /> Guides/Tutorials
          </Button>
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <Button variant="default" className="w-full md:w-auto" onClick={generateQuery}>
          <Search className="h-4 w-4 mr-2" /> Generate Search Query
        </Button>
      </div>

      {showQueryResult && (
        <div className="mt-4 animate-fade-in">
          <div className="space-y-2">
            <Label>Generated Query:</Label>
            <div className="flex rounded-md shadow-sm">
              <Textarea
                id={`search-output-${stepData.id}`}
                value={generatedQuery}
                readOnly
                rows={2}
                className="rounded-r-none font-mono text-sm"
              />
              <Button variant="secondary" className="rounded-l-none" onClick={copyToClipboard} title="Copy Query">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button className="flex-grow" onClick={openSearchQuery}>
              <Search className="h-4 w-4 mr-2" /> Open in Google
            </Button>
            <Button variant="secondary" onClick={saveSearchQueryToOutput}>
              <Save className="h-4 w-4 mr-2" /> Save to Outputs
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
