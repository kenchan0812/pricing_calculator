import { CalculatorView } from "@/schemas/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes efficiently.
 * It combines `clsx` for conditional class merging and `twMerge` to handle Tailwind class conflicts.
 * @param inputs - Class names or conditions for conditional classes.
 * @returns A merged class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parses the `variables` field of a CalculatorView object if it's stored as a JSON string.
 * Ensures that variables are always returned as an object or array.
 * @param calculator - The calculator object to process.
 * @returns A new CalculatorView object with `variables` parsed if necessary.
 */
export const parseCalculatorVariables = (calculator: CalculatorView) => {
  if (!calculator || !calculator.variables) return calculator;

  return {
    ...calculator,
    variables:
      typeof calculator.variables === "string"
        ? JSON.parse(calculator.variables)
        : calculator.variables,
  };
};

/**
 * Traverses a calculator tree using Breadth-First Search (BFS).
 * Used for iterating over all calculators in a project while maintaining hierarchical relationships.
 * @param calculator - The root calculator object.
 * @returns An array of calculators in BFS order.
 */
export const traverseCalculatorBFS = (calculator: CalculatorView | null) => {
  if (!calculator) return;

  const queue = [parseCalculatorVariables(calculator)];
  const resultList = [];

  while (queue.length > 0) {
    const current = queue.shift();
    resultList.push(current);

    if (current?.children && current.children.length > 0) {
      queue.push(...current.children.map(parseCalculatorVariables));
    }
  }
  return resultList;
};
