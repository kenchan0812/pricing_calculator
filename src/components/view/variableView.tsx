import { CalculatorView } from "@/schemas/types";
import { useEffect, useState } from "react";

interface VariableViewProps {
  selectedCalculator: CalculatorView | null;
  onVariableChange: (
    calculator_id: number,
    variable: number,
    value: number
  ) => void;
}

const VariableView = ({
  selectedCalculator,
  onVariableChange,
}: VariableViewProps) => {
  // State to store a local copy of the selected calculator
  const [localCalculator, setLocalCalculator] = useState<CalculatorView | null>(
    null
  );

  // Update localCalculator when selectedCalculator changes
  useEffect(() => {
    setLocalCalculator(selectedCalculator);
  }, [selectedCalculator]);

  /**
   * Handles updating the variable value when the user modifies an input field.
   * Updates both the local state and invokes the provided callback to update the parent state.
   */
  const handleVariableChange = (variableId: number, value: number) => {
    if (!localCalculator) return;

    // Update the variable value in the local state
    const updatedVariables = localCalculator.variables.map((variable) =>
      variable.variable_id === variableId
        ? { ...variable, variable_value: value }
        : variable
    );

    // Update the local calculator with the new variables
    setLocalCalculator({ ...localCalculator, variables: updatedVariables });

    // Propagate the change to the parent component
    onVariableChange(localCalculator.calculator_id, variableId, value);
  };

  // Return null if no valid variables are present
  if (
    localCalculator === null ||
    (localCalculator.variables.length === 1 &&
      localCalculator.variables[0] === null)
  ) {
    return null;
  }

  return (
    <div className="rounded-lg">
      <h2 className="lg:text-lg md:text-base font-semibold mb-2">Variables</h2>

      {localCalculator.variables.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {localCalculator.variables.map((variable) => (
            <div key={variable.variable_id} className="mb-3">
              {/* Display the variable name */}
              <label className="block font-medium lg:text-base md:text-xs">
                {variable.variable_display}
              </label>

              {/* Input field for variable value */}
              <input
                type="number"
                className="p-2 rounded w-full border"
                value={variable.variable_value}
                onChange={(e) =>
                  handleVariableChange(
                    variable.variable_id,
                    parseFloat(e.target.value)
                  )
                }
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No variables available.</p>
      )}
    </div>
  );
};

export default VariableView;
