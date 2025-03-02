import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import VariableForm from "./variableForm";
import { useVariableStore } from "@/store/store";
import { MoreHorizontal } from "lucide-react";
import { useDeleteVariable } from "@/api";
import DeleteDialog from "./deleteDialog";
/**
 * VariablesList Component
 *
 * This component displays a list of variables and allows users to edit or delete them.
 * Users can click on a variable to open a dialog for editing or use the delete button to remove a variable.
 *
 */

const VariablesList = () => {
  const [selectedVariable, setSelectedVariable] = useState<any | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [variableToDelete, setVariableToDelete] = useState<any | null>(null);
  const variables = useVariableStore((state) => state.variables);
  const { mutate } = useDeleteVariable();

  if (
    !variables ||
    variables.length === 0 ||
    variables.every((variable) => variable === null)
  ) {
    return null;
  }

  const handleDeleteVariable = (variable: any) => {
    setVariableToDelete(variable);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (variableToDelete) {
      mutate(variableToDelete.variable_id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
        },
        onError: (error) => {
          console.error("Failed to delete variable:", error);
        },
      });
    }
  };

  return (
    <div className="px-6">
      <div className="flex flex-col">
        {variables.map((variable) => (
          <div className="flex" key={variable.variable_id}>
            <div
              className="bg-white shadow-sm rounded-lg p-2 cursor-pointer hover:shadow-md transition duration-100 flex justify-between mt-2 w-full"
              onClick={() => setSelectedVariable(variable)}
            >
              <h2 className="lg:text-base md:text-xs font-semibold">
                {variable.variable_display}
              </h2>
              <p className="text-gray-500 lg:text-base md:text-xs self-center">
                {variable.variable_value}
              </p>
            </div>
            <MoreHorizontal
              className="self-center mt-2 ml-4 rounded-md text-gray-500 hover:text-black hover:bg-gray-200 hover:opacity-70 outline-none focus-visible:ring-2 focus-visible:ring-gray-300 cursor-pointer size-7"
              onClick={() => handleDeleteVariable(variable)}
            />
          </div>
        ))}
      </div>

      <Dialog
        open={!!selectedVariable}
        onOpenChange={() => setSelectedVariable(null)}
      >
        <DialogContent className="p-6">
          <DialogTitle className="px-8">Edit Variable</DialogTitle>
          {selectedVariable && (
            <VariableForm
              variableState={selectedVariable}
              setOpen={() => setSelectedVariable(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <DeleteDialog
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        variableToDelete={variableToDelete}
        confirmDelete={confirmDelete}
      />
    </div>
  );
};

export default VariablesList;
