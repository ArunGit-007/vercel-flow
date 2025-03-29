"use client"

import { useState } from "react"
import { useWorkflow } from "@/hooks/use-workflow"
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
  stepData: any
  primaryKeyword: string
  profileData: any
}) {
  const { autoSaveOutput, updatePrimaryKeyword, stepOutputs } = useWorkflow()
  const { showFeedback } = useFeedback()
  const [multiInputs, setMultiInputs] = useState<Record<string, string[]>>({})

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

  const handleMultiInputChange = (stepId: number, fieldName: string, values: string[]) => {
    autoSaveOutput(
      stepId,
      fieldName,
      values.filter((v) => v.trim() !== ""),
    )
  }

  const addMultiInputItem = (fieldName: string, maxItems?: number) => {
    setMultiInputs((prev) => {
      const currentValues = prev[fieldName] || []
      if (maxItems && currentValues.length >= maxItems) {
        showFeedback(`Maximum of ${maxItems} items allowed.`, "warning")
        return prev
      }
      return {
        ...prev,
        [fieldName]: [...currentValues, ""],
      }
    })
  }

  const removeMultiInputItem = (fieldName: string, index: number) => {
    setMultiInputs((prev) => {
      const currentValues = [...(prev[fieldName] || [])]
      if (currentValues.length <= 1) {
        currentValues[0] = ""
      } else {
        currentValues.splice(index, 1)
      }
      handleMultiInputChange(stepData.id, fieldName, currentValues)
      return {
        ...prev,
        [fieldName]: currentValues,
      }
    })
  }

  const updateMultiInputValue = (fieldName: string, index: number, value: string) => {
    setMultiInputs((prev) => {
      const currentValues = [...(prev[fieldName] || [])]
      currentValues[index] = value
      handleMultiInputChange(stepData.id, fieldName, currentValues)
      return {
        ...prev,
        [fieldName]: currentValues,
      }
    })
  }

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

          {stepData.inputField.map((inputField: any) => {
            const fieldId = `input-${stepData.id}-${inputField.name}`
            const currentStepOutputs = stepOutputs[stepData.id] || {}
            let savedValue = currentStepOutputs[inputField.name] || ""

            if (stepData.id === 1 && inputField.name === "primaryKeyword") {
              savedValue = primaryKeyword
            }

            return (
              <div key={fieldId} className="space-y-2">
                <label htmlFor={fieldId} className="block font-medium text-sm">
                  {inputField.label}
                </label>

                {inputField.isMultiInput ? (
                  <div className="space-y-2">
                    {(Array.isArray(savedValue) ? savedValue : savedValue ? [savedValue] : [""]).map((item, index) => (
                      <div key={`${fieldId}-${index}`} className="flex items-center space-x-2">
                        <Input
                          id={`${fieldId}-${index}`}
                          value={item}
                          placeholder={inputField.placeholder}
                          onChange={(e) => updateMultiInputValue(inputField.name, index, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeMultiInputItem(inputField.name, index)}
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {(!inputField.maxItems ||
                      (Array.isArray(savedValue) ? savedValue.length : 1) < inputField.maxItems) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addMultiInputItem(inputField.name, inputField.maxItems)}
                        className="mt-2"
                      >
                        Add Item
                      </Button>
                    )}
                  </div>
                ) : (
                  <Input
                    id={fieldId}
                    value={savedValue}
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

