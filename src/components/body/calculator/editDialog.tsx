import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Calculator } from "@/schemas/types";
import EditCalculatorForm from "./editForm";

/**
 * EditCalculatorDialog Component
 *
 * This component renders a dialog for editing a calculator.
 * It displays an `EditCalculatorForm` when `defaultValues` is provided.
 */
const EditCalculatorDialog = ({
  open,
  defaultValues,
  setOpen,
}: {
  open: boolean;
  defaultValues: Calculator | null;
  setOpen: React.Dispatch<React.SetStateAction<any | null>>;
}) => (
  <Dialog open={open} onOpenChange={() => setOpen(false)}>
    <DialogContent className="p-6">
      <DialogTitle className="px-8">Edit Calculator</DialogTitle>
      {defaultValues && (
        <EditCalculatorForm
          defaultValues={defaultValues}
          setOpen={() => setOpen(false)}
        />
      )}
    </DialogContent>
  </Dialog>
);

export default EditCalculatorDialog;
