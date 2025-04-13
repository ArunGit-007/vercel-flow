"use client"
import { useWorkflow } from "@/hooks/use-workflow"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import StepContent from "@/components/step-content"
import { ArrowLeft, ArrowRight, CheckCheck } from "lucide-react";

export default function ContentArea() { // Remove props from function signature
  const { currentStep, steps, nextStep, prevStep } = useWorkflow();
  const currentStepData = steps.find((s) => s.id === currentStep) || null;

  return (
    /* Make main container the card */
    <main className="flex-1 overflow-y-auto relative bg-card rounded-lg border border-border flex flex-col"> {/* Use bg-card, add flex flex-col */}
      {/* Decorative background pattern - removed */}
      {/* <div className="absolute inset-0 -z-10 opacity-[0.02] dark:opacity-[0.03]"> */}
        {/* Simplified SVG or removed if too distracting */}
         {/* <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M11 10h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zM10 11h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm-1 1h1v1h-1v-1z" fill="currentColor" fillOpacity="0.4" fillRule="evenodd"></path></svg> */} {/* Corrected properties */}
      {/* </div> */}
      {/* Simplified sticky header - Now part of the flex column */}
      <div className="sticky top-0 flex justify-between items-center p-4 border-b border-border z-10 bg-card/95 backdrop-blur-sm flex-shrink-0"> {/* Use bg-card, add flex-shrink-0 */}
        <h2 className="text-xl font-heading font-semibold tracking-tight text-foreground">{currentStepData?.title || "Loading..."}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm" /* Adjusted size */
            onClick={prevStep}
            className={`${currentStep <= 1 ? "hidden" : "inline-flex"}`} /* Removed explicit bg/hover/blur */
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Previous {/* Adjusted icon size/margin */}
          </Button>
          <Button
            variant="default" /* Explicitly set default variant */
            size="sm" /* Adjusted size */
            onClick={nextStep}
            className={`${currentStep > steps.length ? "hidden" : "inline-flex"}`} /* Removed explicit bg/hover/blur */
          >
            {currentStep === steps.length ? (
              <>
                Finish Workflow <CheckCheck className="ml-1.5 h-4 w-4" /> {/* Adjusted icon size/margin */}
              </>
            ) : (
              <>
                Next Step <ArrowRight className="ml-1.5 h-4 w-4" /> {/* Adjusted icon size/margin */}
              </>
            )}
          </Button>
          <ModeToggle />
        </div>
      </div>

      {/* Content area - Takes remaining space and scrolls */}
      <div className="p-6 overflow-y-auto scrollbar-none flex-grow"> {/* Added flex-grow, overflow, padding */}
        <StepContent stepData={currentStepData} /> {/* Remove props passed to StepContent */}
      </div>
    </main>
  )
}
