import { z } from "zod";

// Schema for validating Variable form inputs
export const variableSchema = z.object({
  variable_name: z.string(),
  variable_value: z.number(),
  variable_display: z.string(),
});

// Schema for validating Calculator form inputs
export const calculatorSchema = z.object({
  project_id: z.number(),
  parent_calculator_id: z.number(),
  calculator_name: z.string(),
});

// Schema for validating the Sidebar form input
export const sideBarSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

// Schema for validating Calculator edits
export const editCalculatorSchema = z.object({
  calculator_name: z.string().min(1, {
    message: "Name is required",
  }),
  calculator_id: z.number(),
});
