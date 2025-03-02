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
import { calculatorSchema } from "@/schemas";
import { useSelectionStore } from "@/store/store";
import { useEffect } from "react";
import { Calculator } from "@/schemas/types";
import { useCreateCalculator } from "@/api";

/**
 * CalculatorForm Component
 *
 * This component provides a form for creating or updating a calculator.
 * It uses react-hook-form with Zod validation for form state management.
 * - Automatically formats the calculator name to follow PascalCase formatting.
 */

const CalculatorForm = ({
  defaultValues,
  setOpen,
}: {
  defaultValues?: Calculator;
  setOpen: (value: boolean) => void;
}) => {
  const createCalculator = useCreateCalculator();
  const selectedCalculatorId = useSelectionStore(
    (state) => state.selectedCalculatorId
  );
  const selectedProjectId = useSelectionStore(
    (state) => state.selectedProjectId
  );
  const calculatorForm = useForm<z.infer<typeof calculatorSchema>>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      project_id: 0,
      parent_calculator_id: 1,
      calculator_name: "",
    },
  });
  const { watch, setValue } = calculatorForm;
  const displayNameWatch = watch("calculator_name");

  useEffect(() => {
    if (displayNameWatch) {
      const formattedVariableName = displayNameWatch
        .replace(/[^a-zA-Z0-9_]/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
      setValue("calculator_name", formattedVariableName, {
        shouldValidate: true,
      });
    }
  }, [displayNameWatch, setValue]);

  const onSubmit = (data: z.infer<typeof calculatorSchema>) => {
    if (defaultValues) {
      if (defaultValues?.calculator_id) {
      }
    } else {
      createCalculator.mutate({
        project_id: selectedProjectId,
        parent_calculator_id: selectedCalculatorId,
        calculator_name: data.calculator_name,
      });
    }
    setOpen(false);
  };
  return (
    <Form {...calculatorForm}>
      <form
        onSubmit={calculatorForm.handleSubmit(onSubmit)}
        className="space-y-4 py-4 px-8 w-full mx-auto"
      >
        <FormField
          control={calculatorForm.control}
          name="calculator_name"
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

        <div className="flex justify-end">
          <Button type="submit" className="w-24">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CalculatorForm;
