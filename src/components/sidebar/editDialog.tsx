import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import EditSideBarForm from "./editSideBarForm";

const EditDialog = ({
  sideBarName,
  open,
  onClose,
  itemId,
  initialName,
}: {
  sideBarName: string;
  open: boolean;
  onClose: (value: boolean) => void;
  itemId: number | null;
  initialName: string;
}) => {
  return (
    <Dialog open={open} onOpenChange={() => onClose(false)}>
      <DialogContent className="p-6">
        <DialogTitle className="px-8">Edit {sideBarName}</DialogTitle>
        <EditSideBarForm
          setOpen={() => onClose(false)}
          sideBarName={sideBarName}
          itemId={itemId}
          initialName={initialName}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
