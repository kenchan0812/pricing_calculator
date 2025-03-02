import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Calculator } from "@/schemas/types";

/**
 * DeleteCalculatorDialog Component
 *
 * This component renders a confirmation dialog for deleting a calculator.
 */

const DeleteCalculatorDialog = ({
  deleteDialogOpen,
  setDeleteDialogOpen,
  confirmDelete,
}: {
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  calculatorToDelete: Calculator | null;
  confirmDelete: () => void;
}) => (
  <Dialog
    open={deleteDialogOpen}
    onOpenChange={() => setDeleteDialogOpen(false)}
  >
    <DialogContent className="p-6">
      <DialogTitle className="px-8">Confirm Deletion</DialogTitle>
      <p>Are you sure you want to delete this calculator?</p>
      <div className="mt-4 flex justify-end gap-4">
        <button
          className="bg-gray-300 text-black px-4 py-2 rounded-md"
          onClick={() => setDeleteDialogOpen(false)}
        >
          Cancel
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md"
          onClick={() => {
            confirmDelete();
            setDeleteDialogOpen(false);
          }}
        >
          Confirm
        </button>
      </div>
    </DialogContent>
  </Dialog>
);

export default DeleteCalculatorDialog;
