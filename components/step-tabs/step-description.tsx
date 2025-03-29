"use client"

import { useState, useEffect, useCallback } from "react"
import { useWorkflow, type Step, type InputField } from "@/hooks/use-workflow" // Import types
import { type ProfileData } from "@/hooks/use-profile" // Import type
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useFeedback } from "@/hooks/use-feedback"
import { Info } from "lucide-react"

export default function StepDescription({
  stepData,
  primaryKeyword,
  profileData,
}: {
  stepData: Step // Use imported Step type
  primaryKeyword: string
  profileData: ProfileData // Use imported ProfileData type
}) {
  const { autoSaveOutput, updatePrimaryKeyword, stepOutputs } = useWorkflow()
  const { showFeedback } = useFeedback()
  const [localMultiInputs, setLocalMultiInputs] = useState<Record<string, string[]>>(() => {
    const initialMultiInputs: Record<string, string[]> = {}
    if (stepData.inputField) {
      stepData.inputField.forEach(field => {
        if (field.isMultiInput) {
          const savedValue = stepOutputs[stepData.id]?.[field.name]
          initialMultiInputs[field.name] = Array.isArray(savedValue) ? savedValue : savedValue ? [savedValue] : [""]
        }
      })
    }
    return initialMultiInputs
  })


  // Replace markdown bold with HTML strong
  const formattedDescription = stepData.description
    ? stepData.description.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>")
    : ""

  const handleInputChange = (stepId: number, fieldName: string, value: string) => {
    if (fieldName === "primaryKeyword") {
      updatePrimaryKeyword(value, stepId)
    } else {
      autoSaveOutput(stepId, fieldName, value)
    }
  }

  // --- New handlers for localMultiInputs state ---
  const [pendingUpdates, setPendingUpdates] = useState<Array<() => void>>([])

  useEffect(() => {
    if (pendingUpdates.length > 0) {
      pendingUpdates.forEach(update => update())
      setPendingUpdates([])
    }
  }, [pendingUpdates])

  const addLocalMultiInputItem = (fieldName: string, maxItems?: number) => {
    setLocalMultiInputs((prev) => {
      const currentValues = prev[fieldName] || [""]
      if (maxItems && currentValues.length >= maxItems) {
        showFeedback(`Maximum of ${maxItems} items allowed.`, "warning")
        return prev
      }
      const newValues = [...currentValues, ""]
      setPendingUpdates(prev => [...prev, () => autoSaveOutput(stepData.id, fieldName, newValues.filter(v => v.trim() !== ""))])
      return { ...prev, [fieldName]: newValues }
    })
  }

  const removeLocalMultiInputItem = (fieldName: string, index: number) => {
    setLocalMultiInputs((prev) => {
      const currentValues = [...(prev[fieldName] || [""])]
      if (currentValues.length <= 1) {
        currentValues[0] = "" // Clear if only one item
      } else {
        currentValues.splice(index, 1)
      }
      setPendingUpdates(prev => [...prev, () => autoSaveOutput(stepData.id, fieldName, currentValues.filter(v => v.trim() !== ""))])
      return { ...prev, [fieldName]: currentValues }
    })
  }

  const updateLocalMultiInputValue = (fieldName: string, index: number, value: string) => {
    setLocalMultiInputs((prev) => {
      const currentValues = [...(prev[fieldName] || [""])]
      currentValues[index] = value
      setPendingUpdates(prev => [...prev, () => autoSaveOutput(stepData.id, fieldName, currentValues.filter(v => v.trim() !== ""))])
      return { ...prev, [fieldName]: currentValues }
    })
  }
  // --- End of new handlers ---

  return (
    <div>
      <h3 className="text-xl font-semibold flex items-center mb-4">
        <Info className="w-5 h-5 mr-2 text-primary" /> Step Description
      </h3>

      <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: formattedDescription }} />

      {stepData.id > 1 && primaryKeyword && (
        <p className="mt-4 text-sm">
          <strong className="font-semibold">Primary Keyword:</strong>{" "}
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-md text-xs font-medium">
            {primaryKeyword}
          </span>
        </p>
      )}

      {profileData.ourDomain && (
        <p className="mt-1 text-sm">
          <strong className="font-semibold">Website Profile:</strong>{" "}
          <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md text-xs font-medium">
            {profileData.ourDomain}
          </span>
        </p>
      )}

      {stepData.inputField && stepData.inputField.length > 0 && (
        <div className="mt-6 space-y-4 border-t border-border pt-6">
          <h4 className="text-lg font-semibold mb-2">Inputs</h4>

          {stepData.inputField.map((inputField: InputField) => { // Use InputField type
            const fieldId = `input-${stepData.id}-${inputField.name}`
            const currentStepOutputs = stepOutputs[stepData.id] || {}
            let savedValue = currentStepOutputs[inputField.name]

            // Use local state for multi-inputs
            const multiInputValues = localMultiInputs[inputField.name] || [""]

            if (stepData.id === 1 && inputField.name === "primaryKeyword") {
              savedValue = primaryKeyword
            } else if (!inputField.isMultiInput) {
              // Ensure savedValue is a string for single inputs
              savedValue = typeof savedValue === 'string' ? savedValue : ''
            }


            return (
              <div key={fieldId} className="space-y-2">
                <label htmlFor={fieldId} className="block font-medium text-sm">
                  {inputField.label}
                </label>

                {inputField.isMultiInput ? (
                  <div className="space-y-2">
                    {multiInputValues.map((item, index) => ( // Use local state values
                      <div key={`${fieldId}-${index}`} className="flex items-center space-x-2">
                        <Input
                          id={`${fieldId}-${index}`}
                          value={item} // Use item from local state
                          placeholder={inputField.placeholder}
                          onChange={(e) => updateLocalMultiInputValue(inputField.name, index, e.target.value)} // Use new handler
                          className="flex-1"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeLocalMultiInputItem(inputField.name, index)} // Use new handler
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {(!inputField.maxItems || multiInputValues.length < inputField.maxItems) && ( // Check local state length
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addLocalMultiInputItem(inputField.name, inputField.maxItems)} // Use new handler
                        className="mt-2"
                      >
                        Add Item
                      </Button>
                    )}
                  </div>
                ) : (
                  <Input
                    id={fieldId}
                    value={savedValue} // Use potentially updated savedValue
                    placeholder={inputField.placeholder}
                    onChange={(e) => handleInputChange(stepData.id, inputField.name, e.target.value)}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
