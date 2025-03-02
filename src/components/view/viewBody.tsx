import { useCalculatorHierarchy } from "@/api";
import { CalculatorView } from "@/schemas/types";
import { useSelectionStore } from "@/store/store";
import { useEffect, useState } from "react";
import {
  create,
  evaluateDependencies,
  addDependencies,
  subtractDependencies,
  divideDependencies,
  multiplyDependencies,
} from "mathjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VariableView from "./variableView";
import ResultView from "./resultView";
import { traverseCalculatorBFS } from "@/lib/utils";

// Create a Math.js instance with specific dependencies for evaluation
const math = create({
  evaluateDependencies,
  addDependencies,
  subtractDependencies,
  divideDependencies,
  multiplyDependencies,
});

const ViewBody = () => {
  // State for selected calculator
  const [selectedCalculator, setSelectedCalculator] =
    useState<CalculatorView | null>(null);

  // State for list of calculators
  const [calculatorList, setCalculatorList] = useState<CalculatorView[]>([]);

  // State for storing the entire calculator hierarchy as local database
  const [database, setDatabase] = useState<CalculatorView | null>(null);

  // Get selected project ID from store
  const selectedProjectId = useSelectionStore(
    (state) => state.selectedProjectId
  );

  // Fetch calculator hierarchy for the selected project
  const calculatorHierarchy = useCalculatorHierarchy(selectedProjectId);

  // Update the local database state when new data is received from the API
  useEffect(() => {
    if (calculatorHierarchy.data) {
      setDatabase(calculatorHierarchy.data);
    }
  }, [calculatorHierarchy.data]);

  // Convert the calculator hierarchy into a flat list using BFS traversal
  useEffect(() => {
    if (!database) return;
    const list: any = traverseCalculatorBFS(database);
    setCalculatorList(list);
  }, [database]);

  /**
   * Updates calculations for the given calculator and its dependencies.
   * It evaluates expressions based on variable values and propagates results upward.
   *
   * @param updatedDatabase The updated calculator hierarchy
   * @param calculatorId The ID of the calculator whose values changed
   */
  const updateCalculations = (
    updatedDatabase: CalculatorView,
    calculatorId: number
  ) => {
    const nodeMap = new Map<number, CalculatorView>();

    // Build a map of calculators using DFS traversal
    const traverseDFS = (node: CalculatorView | null) => {
      if (!node) return;
      nodeMap.set(node.calculator_id, node);
      node.children?.forEach(traverseDFS);
    };
    traverseDFS(updatedDatabase);

    // Start from the updated calculator and propagate changes upward
    let current: CalculatorView | null = nodeMap.get(calculatorId) ?? null;
    while (current) {
      if (current.expression) {
        try {
          // Parse variables if they are stored as a string
          const variables =
            typeof current.variables === "string"
              ? JSON.parse(current.variables)
              : current.variables;

          // Create a variable scope for Math.js evaluation
          let scope = Object.fromEntries(
            variables.map((v: any) => [v.variable_name, v.variable_value])
          );

          // Add children results to the scope if available
          if (current.children && current.children.length > 0) {
            current.children.forEach((child) => {
              if (child.result !== undefined) {
                scope[child.calculator_name] = child.result ?? 0;
              }
            });
          }

          // Evaluate the expression and update the result
          if (typeof current.expression === "string") {
            current.result = math.evaluate(current.expression, scope);
          }
        } catch (error) {
          console.error(
            "Error evaluating expression for calculator:",
            current.calculator_name,
            error
          );
        }
      }

      // Move to the parent calculator (if it exists)
      current = current.parent_calculator_id
        ? nodeMap.get(current.parent_calculator_id) ?? null
        : null;
    }

    // Update the selected calculator with new calculations
    setSelectedCalculator(nodeMap.get(calculatorId) ?? null);
  };

  /**
   * Handles changes in variable values and updates the calculator hierarchy accordingly.
   *
   * @param calculator_id ID of the calculator to update
   * @param variable_id ID of the variable being changed
   * @param value New value for the variable
   */
  const handleVariableChange = (
    calculator_id: number,
    variable_id: number,
    value: number
  ) => {
    if (!database) return;

    // Create a deep copy of the database to avoid mutating the original state
    const updatedDatabase = JSON.parse(JSON.stringify(database));
    const queue = [updatedDatabase];

    while (queue.length > 0) {
      const current = queue.shift();

      if (current.calculator_id === calculator_id) {
        // Parse variables if they are stored as a string
        let variables =
          typeof current.variables === "string"
            ? JSON.parse(current.variables)
            : current.variables;

        // Update the specific variable's value
        variables = variables.map((variable: any) =>
          variable.variable_id === variable_id
            ? { ...variable, variable_value: value }
            : variable
        );

        current.variables = variables;
        break;
      }

      // Continue traversal for child calculators
      if (current.children && current.children.length > 0) {
        queue.push(...current.children);
      }
    }

    // Recalculate results and update the database
    updateCalculations(updatedDatabase, calculator_id);
    setDatabase(updatedDatabase);
  };

  return (
    <div className="h-full lg:mx-32 md:mx-8 my-8 p-4 shadow-md rounded-lg bg-muted/100">
      <div className="flex flex-col items-center">
        <div className="flex justify-center">
          <label className="block mb-2 lg:text-lg md:text-base font-semibold self-center">
            Select Calculator:
          </label>
          <Select
            onValueChange={(value) => {
              const calcId = parseInt(value);
              const foundCalculator = calculatorList.find(
                (calc) => calc.calculator_id === calcId
              );
              setSelectedCalculator(foundCalculator || null);
            }}
          >
            <SelectTrigger className="w-56 p-2 rounded ml-10 bg-white">
              <SelectValue placeholder="Select a calculator" />
            </SelectTrigger>
            <SelectContent>
              {calculatorList.map((calc) => (
                <SelectItem
                  key={calc.calculator_id}
                  value={calc.calculator_id.toString()}
                >
                  {calc.calculator_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="font-bold lg:text-5xl md:text-2xl my-10">
          {selectedCalculator?.calculator_name}
        </div>
      </div>

      {/* Render variable inputs */}
      <VariableView
        selectedCalculator={selectedCalculator}
        onVariableChange={handleVariableChange}
      />

      {/* Render result display */}
      <ResultView selectedCalculator={selectedCalculator} />
    </div>
  );
};

export default ViewBody;
