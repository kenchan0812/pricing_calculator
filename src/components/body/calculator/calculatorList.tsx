import { useState } from "react";
import { useSelectionStore } from "@/store/store";
import { useDeleteCalculator, useNestedCalculators } from "@/api";
import { Calculator } from "@/schemas/types";
import { MoreHorizontal } from "lucide-react";
import EditCalculatorDialog from "./editDialog";
import DeleteCalculatorDialog from "./deleteDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Calculators Component
 *
 * This component displays a list of direct child calculators and allows users to edit or delete them.
 * Users can click on a calculator to access its nested calculators or use the horizontal button to open a dropdown menu for editing or deletion.
 */

const CalculatorList = () => {
  const [selectedCalculator, setSelectedCalculator] = useState<any | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [calculatorToDelete, setCalculatorToDelete] = useState<any | null>(
    null
  );
  const setSelectedParentCalculatorId = useSelectionStore(
    (state) => state.setSelectedParentCalculatorId
  );
  const setSelectedProjectId = useSelectionStore(
    (state) => state.setSelectedProjectId
  );
  const selectedCalculatorId = useSelectionStore(
    (state) => state.selectedCalculatorId
  );
  const setSelectedCalculatorId = useSelectionStore(
    (state) => state.setSelectedCalculatorId
  );
  const selectedProjectId = useSelectionStore(
    (state) => state.selectedProjectId
  );
  const setSelectedCalculatorName = useSelectionStore(
    (state) => state.setSelectedCalculatorName
  );
  const useNestedCalculator = useNestedCalculators(
    selectedProjectId,
    selectedCalculatorId
  );
  const { mutate } = useDeleteCalculator();

  if (!useNestedCalculator.data) return null;

  const handleOnClick = (calculator: Calculator) => {
    setSelectedParentCalculatorId(calculator.calculator_id);
    setSelectedProjectId(calculator.project_id);
    setSelectedCalculatorId(calculator.calculator_id);
    setSelectedCalculatorName(calculator.calculator_name);
  };

  const handleDeleteCalculator = (calculator: Calculator) => {
    setCalculatorToDelete(calculator);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="px-6">
      <div className="flex flex-col">
        {useNestedCalculator.data.map((calculator: Calculator) => (
          <div key={calculator.calculator_id} className="flex">
            <div
              className="bg-white shadow-sm rounded-lg p-2 cursor-pointer hover:shadow-md transition duration-100 flex justify-between mt-2 w-full"
              onClick={() => handleOnClick(calculator)}
            >
              <div className="flex justify-between w-full">
                <h2 className="lg:text-base md:text-xs font-semibold">
                  {calculator.calculator_name}
                </h2>
                <p className="text-gray-500 lg:text-base md:text-xs">
                  {calculator.result ?? 0}
                </p>
              </div>
            </div>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <MoreHorizontal className="self-center ml-4 rounded-md mt-2 text-gray-500 hover:text-black hover:bg-gray-200 hover:opacity-70 outline-none focus-visible:ring-2 focus-visible:ring-gray-300 cursor-pointer size-7" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-56 rounded-lg">
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedCalculator({
                      calculator_id: calculator.calculator_id,
                      calculator_name: calculator.calculator_name,
                    });
                    setEditDialogOpen(true);
                  }}
                >
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={() => handleDeleteCalculator(calculator)}
                >
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
      <EditCalculatorDialog
        open={editDialogOpen}
        defaultValues={selectedCalculator}
        setOpen={() => setEditDialogOpen(false)}
      />

      <DeleteCalculatorDialog
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        calculatorToDelete={calculatorToDelete}
        confirmDelete={() => {
          mutate(calculatorToDelete.calculator_id);
        }}
      />
    </div>
  );
};

export default CalculatorList;
