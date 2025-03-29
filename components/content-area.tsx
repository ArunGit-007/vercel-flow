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
  const { currentStep, steps, nextStep, prevStep } = useWorkflow()
  const currentStepData = steps.find((s) => s.id === currentStep) || null

  return (
    <main className="flex-1 overflow-y-auto relative bg-background rounded-l-xl m-2 border-l border-t border-b border-border/20 shadow-sm">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M0 0h1000v1000H0z" 
            fill="none"
          />
          <path 
            d="M250 250h500v500H250z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeDasharray="10 5"
          />
          <path 
            d="M500 500h500v500H500z" 
            stroke="currentColor" 
            strokeWidth="1" 
            strokeDasharray="5 5"
          />
        </svg>
      </div>
      <div className="sticky top-0 flex justify-between items-center pb-6 mb-8 border-b border-border/50 z-10 bg-background/80 backdrop-blur-sm pt-6 px-8">
        <h2 className="text-3xl font-heading font-bold tracking-tight text-foreground/90">{currentStepData?.title || "Loading..."}</h2>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={prevStep}
            className={`${currentStep <= 1 ? "hidden" : "inline-flex"} h-12 px-6 text-base bg-secondary/80 hover:bg-secondary/90 backdrop-blur-sm`}
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Previous
          </Button>
          <Button
            onClick={nextStep}
            className={`${currentStep > steps.length ? "hidden" : "inline-flex"} h-12 px-6 text-base bg-primary/90 hover:bg-primary/100 backdrop-blur-sm`}
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

      <div className="relative p-4">
        {/* Content card */}
        <div className="bg-background rounded-xl p-6 border border-border/20">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 -z-10" />
          <StepContent stepData={currentStepData} onOpenAddTool={onOpenAddTool} onOpenPromptForm={onOpenPromptForm} />
        </div>
      </div>
    </main>
  )
}
