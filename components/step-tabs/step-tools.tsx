"use client"

import { useWorkflow } from "@/hooks/use-workflow"
import { useFeedback } from "@/hooks/use-feedback"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { ExternalLink, X } from "lucide-react"
import StockImageSearch from "@/components/stock-image-search"

export default function StepTools({ stepData }: { stepData: any }) {
  const { removeTool } = useWorkflow()
  const { showFeedback } = useFeedback()

  const tools = stepData.tools || []

  const handleRemoveTool = (index: number) => {
    if (window.confirm("Are you sure you want to remove this tool?")) {
      removeTool(stepData.id, index)
      showFeedback("Tool removed.", "info")
    }
  }

  return (
    <div>
      {tools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool: any, index: number) => (
            <Card key={index} className="relative group">
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-3 right-3 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveTool(index)}
                aria-label="Remove tool"
              >
                <X className="h-3.5 w-3.5" />
              </Button>

              <CardHeader className="space-y-2 pb-4">
                <h4 className="font-heading font-semibold text-base">{tool.name}</h4>
                <p className="text-xs bg-muted/50 px-2 py-1 rounded-full inline-block text-muted-foreground">
                  {tool.category || "General"}
                </p>
              </CardHeader>

              {tool.url && (
                <CardFooter className="pt-4">
                  <Button 
                    variant="default"
                    size="sm"
                    className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                    onClick={() => window.open(tool.url, '_blank', 'noopener,noreferrer')}
                  >
                    Visit Tool <ExternalLink className="ml-2" />
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      ) : (
        stepData.id !== 8 && (
          <p className="text-muted-foreground">No specific tools recommended for this step. You can add your own.</p>
        )
      )}

      {stepData.id === 8 && <StockImageSearch />}
    </div>
  )
}

