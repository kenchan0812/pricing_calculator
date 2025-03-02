import { useEffect, useState } from "react";
import {
  create,
  evaluateDependencies,
  addDependencies,
  subtractDependencies,
  divideDependencies,
  multiplyDependencies,
} from "mathjs/number";
import { useSelectionStore, useVariableStore } from "@/store/store";
import { Calculator, DataProps } from "@/schemas/types";
import { useNestedCalculators } from "@/api";

const math = create({
  evaluateDependencies,
  addDependencies,
  subtractDependencies,
  divideDependencies,
  multiplyDependencies,
});

/**
 * ExpressionCalculatorPane Component
 *
 * ExpressionCalculatorPane allows users to input and evaluate mathematical expressions dynamically.
 * - Utilizes Math.js for expression evaluation with support for variables and nested calculators.
 * - Syncs input expressions with global state management (Zustand) to maintain consistency across the application.
 * - Automatically updates the result when the input expression or related variables change.
 * - Prevents newline entry in the textarea when pressing "Enter".
 */

const ExpressionCalculatorPane = ({ value, onChange }: DataProps) => {
  const [scope, setScope] = useState<Record<string, any>>({});

  const [result, setResult] = useState("");
  const variables = useVariableStore((state) => state.variables);

  const selectedCalculatorId = useSelectionStore(
    (state) => state.selectedCalculatorId
  );
  const selectedProjectId = useSelectionStore(
    (state) => state.selectedProjectId
  );
  const setSelectedCalculatorExpression = useSelectionStore(
    (state) => state.setSelectedCalculatorExpression
  );
  const setSelectedCalculatorResult = useSelectionStore(
    (state) => state.setSelectedCalculatorResult
  );
  const useNestedCalculator = useNestedCalculators(
    selectedProjectId,
    selectedCalculatorId
  );

  // Update scope based on variables and nested calculators
  useEffect(() => {
    const newScope: Record<string, any> = {};

    // Add variables if they exist and are not empty
    if (
      variables &&
      variables.length > 0 &&
      !variables.every((variable) => variable == null)
    ) {
      variables.forEach((variable) => {
        if (variable) {
          newScope[variable.variable_name] = variable.variable_value;
        }
      });
    }

    // Add nested calculators if they exist and are not empty
    if (useNestedCalculator.data?.length > 0) {
      useNestedCalculator.data.forEach((calculator: Calculator) => {
        if (calculator && calculator.calculator_name) {
          newScope[calculator.calculator_name] = calculator.result ?? 0;
        }
      });
    }
    setScope(newScope);
  }, [variables, useNestedCalculator.data]);

  const handleChange = (e: any) => {
    const input = e.target.value;
    setSelectedCalculatorExpression(input);
    onChange(input);
    try {
      const evaluatedResult = math.evaluate(input, scope);
      setSelectedCalculatorResult(evaluatedResult);
      setResult(evaluatedResult);
    } catch (error) {
      setResult("Invalid Expression");
    }
  };
  useEffect(() => {
    handleChange({ target: { value: value } });
  }, [value, scope]);
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div className="h-full flex flex-col lg:p-6 md:p-3">
      <textarea
        className="w-full p-2 lg:text-base md:text-xs border rounded mb-4 bg-muted/100 outline-none flex-grow border-none resize-none"
        placeholder="Enter your expression"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
      />
      <div className="lg:text-lg md:text-sm font-medium">
        Result: <span className="font-bold">{result}</span>
      </div>
    </div>
  );
};
export default ExpressionCalculatorPane;
