import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

/**
 * DeleteDialog Component
 * This component renders a confirmation dialog for deleting a variable.
 */

const DeleteDialog = ({
  deleteDialogOpen,
  setDeleteDialogOpen,
  confirmDelete,
}: {
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  variableToDelete: any;
  confirmDelete: () => void;
}) => (
  <Dialog
    open={deleteDialogOpen}
    onOpenChange={() => setDeleteDialogOpen(false)}
  >
    <DialogContent className="p-6">
      <DialogTitle className="px-8">Confirm Deletion</DialogTitle>
      <p>Are you sure you want to delete this variable?</p>
      <div className="mt-4 flex justify-end gap-4">
        <button
          className="bg-gray-300 text-black px-4 py-2 rounded-md"
          onClick={() => setDeleteDialogOpen(false)}
        >
          Cancel
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md"
          onClick={confirmDelete}
        >
          Confirm
        </button>
      </div>
    </DialogContent>
  </Dialog>
);

export default DeleteDialog;
