import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import SideBarForm from "./sideBarForm";

const CreateDialog = ({
  sideBarName,
  open,
  onClose,
}: {
  sideBarName: string;
  open: boolean;
  onClose: (value: boolean) => void;
}) => {
  return (
    <div>
      <Dialog open={open} onOpenChange={() => onClose(false)}>
        <DialogContent className="p-6">
          <DialogTitle className="px-8">Add {sideBarName}</DialogTitle>
          <SideBarForm
            setOpen={() => onClose(false)}
            sideBarName={sideBarName}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateDialog;
