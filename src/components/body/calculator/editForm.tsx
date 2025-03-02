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
import { editCalculatorSchema } from "@/schemas";
import { useEffect } from "react";
import { Calculator } from "@/schemas/types";
import { useUpdateCalculator } from "@/api";

/**
 * EditCalculatorForm Component
 *
 * This component provides a form for editing an existing calculator.
 * It uses react-hook-form with Zod validation to handle form state and validation.
 * - Auto-formats the calculator name to follow a PascalCase-like format.
 */

const EditCalculatorForm = ({
  defaultValues,
  setOpen,
}: {
  defaultValues?: Calculator;
  setOpen: (value: boolean) => void;
}) => {
  const updateCalculator = useUpdateCalculator();

  const calculatorForm = useForm<z.infer<typeof editCalculatorSchema>>({
    resolver: zodResolver(editCalculatorSchema),
    defaultValues: defaultValues || {
      calculator_id: 0,
      calculator_name: "",
    },
  });

  const { watch, setValue } = calculatorForm;
  const displayNameWatch = watch("calculator_name");

  useEffect(() => {
    if (displayNameWatch) {
      const formattedCalculatorName = displayNameWatch
        .replace(/[^a-zA-Z0-9_]/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
      setValue("calculator_name", formattedCalculatorName, {
        shouldValidate: true,
      });
    }
  }, [displayNameWatch, setValue]);

  const onSubmit = (data: z.infer<typeof editCalculatorSchema>) => {
    if (defaultValues) {
      updateCalculator.mutate({
        calculator_id: defaultValues.calculator_id,
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

export default EditCalculatorForm;
