"use client"

import { useWorkflow } from "@/hooks/use-workflow"
import { Button } from "@/components/ui/button"
import { CheckCircle, Eye, Download, RotateCcw, ArrowLeft } from "lucide-react"

export default function FinalMessage() {
  const { showStep, resetWorkflow } = useWorkflow()

  return (
    <div className="container max-w-[1800px] mx-auto animate-fade-in py-16 px-6">
      <div className="max-w-5xl mx-auto p-16 rounded-xl bg-gradient-to-br from-success/5 to-success/10 border border-success/20 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-60 h-60 bg-success/10 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <CheckCircle className="w-24 h-24 text-success mx-auto mb-8" />

        <h2 className="text-4xl font-heading font-bold mb-6">Workflow Completed!</h2>

        <p className="text-muted-foreground mb-10 max-w-2xl mx-auto text-lg">
          Congratulations! You've successfully completed all steps. Review the final output in Step 16 or export your
          content below.
        </p>

        <div className="flex justify-center gap-6">
          <Button variant="outline" onClick={() => showStep(16)} className="min-w-[220px] h-14 text-lg">
            <Eye className="mr-3 h-5 w-5" /> Review Final Output
          </Button>

          <Button
            onClick={() => {
              /* Export report */
              console.log("Downloading report...")
              alert("Report download functionality would be implemented here.")
            }}
            className="min-w-[220px] h-14 text-lg"
          >
            <Download className="mr-3 h-5 w-5" /> Download Report
          </Button>
        </div>

        <div className="mt-12 pt-6 border-t border-success/20">
          <div className="flex justify-center gap-6">
            <Button variant="ghost" onClick={() => showStep(1)} className="text-muted-foreground h-12 text-base">
              <ArrowLeft className="mr-2 h-5 w-5" /> Back to Workflow
            </Button>

            <Button variant="ghost" onClick={resetWorkflow} className="text-muted-foreground h-12 text-base">
              <RotateCcw className="mr-2 h-5 w-5" /> Reset Workflow
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

