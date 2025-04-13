"use client";

import { type Step, type Tool } from "@/hooks/use-workflow"; // Import types
import { useResourceLibrary } from "@/hooks/useResourceLibrary"; // Import useResourceLibrary
import { useFeedback } from "@/hooks/use-feedback";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardFooter } from "@/components/ui/card"; // Removed CardContent
import { ExternalLink } from "lucide-react"; // Removed X
import StockImageSearch from "@/components/stock-image-search";

export default function StepTools({ stepData }: { stepData: Step }) { // Use Step type
  const { getToolsForStep } = useResourceLibrary(); // Get assigned tools function
  const { showFeedback } = useFeedback(); // Keep for potential future use?

  const assignedTools = getToolsForStep(stepData.id); // Get assigned tools

  // Remove handleRemoveTool function as it's no longer needed
  /*
  const handleRemoveTool = (index: number) => {
    if (window.confirm("Are you sure you want to remove this tool?")) {
      removeTool(stepData.id, index) // removeTool is no longer available here
      showFeedback("Tool removed.", "info")
    }
  }
  */

  return (
    <div>
      {assignedTools.length > 0 ? ( // Check assignedTools length
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assignedTools.map((tool: Tool, index: number) => ( // Iterate over assignedTools
            <Card key={index} className="relative group">
              {/* Removed Remove button */}

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
        stepData.id !== 8 && ( // Keep special handling for step 8
          <p className="text-muted-foreground">No tools assigned to this step. Assign tools in the Resource Library.</p> // Updated message
         )
       )}

       {stepData.id === 6 && <StockImageSearch />} {/* Updated step ID check to 6 */}
     </div>
   )
}
