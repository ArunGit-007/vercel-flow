"use client"
import { useWorkflow } from "@/hooks/use-workflow"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import StepContent from "@/components/step-content"
import { ArrowLeft, ArrowRight, CheckCheck } from "lucide-react"

export default function ContentArea({
  onOpenAddTool,
  onOpenPromptForm,
}: {
  onOpenAddTool: () => void
  onOpenPromptForm: () => void
}) {
  const { currentStep, steps, showStep, nextStep, prevStep } = useWorkflow()
  const currentStepData = steps.find((s) => s.id === currentStep) || null

  return (
    <main className="flex-1 p-10 overflow-y-auto relative">
      <div className="sticky top-0 flex justify-between items-center pb-6 mb-8 border-b border-border z-10 bg-card pt-6 -mx-10 px-10">
        <h2 className="text-3xl font-heading font-semibold tracking-tight">{currentStepData?.title || "Loading..."}</h2>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={prevStep}
            className={`${currentStep <= 1 ? "hidden" : "inline-flex"} h-12 px-6 text-base`}
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Previous
          </Button>
          <Button
            onClick={nextStep}
            className={`${currentStep > steps.length ? "hidden" : "inline-flex"} h-12 px-6 text-base`}
          >
            {currentStep === steps.length ? (
              <>
                Finish Workflow <CheckCheck className="ml-2 h-5 w-5" />
              </>
            ) : (
              <>
                Next Step <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
          <ModeToggle />
        </div>
      </div>

      <StepContent stepData={currentStepData} onOpenAddTool={onOpenAddTool} onOpenPromptForm={onOpenPromptForm} />
    </main>
  )
}

