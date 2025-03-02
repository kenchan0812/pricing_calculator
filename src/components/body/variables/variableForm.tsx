import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { variableSchema } from "@/schemas";
import { useEffect } from "react";
import { useSelectionStore } from "@/store/store";
import { useCreateVariable, useUpdateVariable } from "@/api";
import { Variable } from "@/schemas/types";

/**
 * VariableForm Component
 *
 * This component provides a form for creating and updating variables.
 * It utilizes React Hook Form with Zod validation and integrates with the application state.
 * - If `variableState` is provided, the form updates an existing variable.
 * - Otherwise, it creates a new variable under the selected calculator.
 * - The `variable_display` field is auto-formatted into `variable_name`.
 * - The form handles submission via API hooks for creation and updates.
 */

const VariableForm = ({
  variableState,
  setOpen,
}: {
  variableState?: Variable;
  setOpen: (value: boolean) => void;
}) => {
  const variableForm = useForm<z.infer<typeof variableSchema>>({
    resolver: zodResolver(variableSchema),
    defaultValues: variableState || {
      variable_name: "",
      variable_value: 0,
      variable_display: "",
    },
  });
  const selectedCalculatorId = useSelectionStore(
    (state) => state.selectedCalculatorId
  );
  const { watch, setValue } = variableForm;
  const displayNameWatch = watch("variable_display");
  const updateVariable = useUpdateVariable();
  const createVariable = useCreateVariable();
  if (!selectedCalculatorId) return null;
  useEffect(() => {
    if (displayNameWatch) {
      const formattedVariableName = displayNameWatch
        .replace(/[^a-zA-Z0-9_]/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
      setValue("variable_name", formattedVariableName, {
        shouldValidate: true,
      });
    }
  }, [displayNameWatch, setValue]);

  const onSubmit = (data: z.infer<typeof variableSchema>) => {
    if (variableState) {
      if (variableState?.variable_id) {
        updateVariable.mutate({
          variable_id: variableState.variable_id,
          variable_name: data.variable_name,
          variable_display: data.variable_display,
          variable_value: data.variable_value,
        });
      }
    } else {
      createVariable.mutate({
        calculator_id: selectedCalculatorId,
        variable_name: data.variable_name,
        variable_display: data.variable_display,
        variable_value: data.variable_value,
      });
    }
    setOpen(false);
  };

  return (
    <Form {...variableForm}>
      <form
        onSubmit={variableForm.handleSubmit(onSubmit)}
        className="space-y-4 py-4 px-8 w-full mx-auto"
      >
        <FormField
          control={variableForm.control}
          name="variable_display"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter display name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={variableForm.control}
          name="variable_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Variable Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Generated variable name"
                  readOnly
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={variableForm.control}
          name="variable_value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Variable Value</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  placeholder="Enter value"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" className="w-24">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VariableForm;
