import { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface HeaderProps {
  title: string;
  dialogTitle: string;
  FormComponent: React.FC<{ setOpen: (open: boolean) => void }>;
}

/**
 * Header Component for Variables and Calculators
 *
 * This component serves as a header for sections related to variables and calculators.
 * - Displays a title indicating the section.
 * - Provides a button with a "+" icon to open a dialog.
 * - Uses `Dialog` for modal functionality.
 * - Accepts a form component (`FormComponent`) as a prop, which is rendered inside the dialog.
 */
const Header: React.FC<HeaderProps> = ({
  title,
  dialogTitle,
  FormComponent,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-[60px] py-3 px-6 flex justify-between sticky top-0 z-10 bg-muted/100 shadow-sm">
      <div className="lg:text-lg font-bold self-center opacity-70">{title}</div>

      <Dialog open={open} onOpenChange={setOpen}>
        <button
          className="inline-flex items-center justify-center rounded-md px-2 text-gray-500 hover:text-black hover:bg-gray-200 hover:opacity-70 outline-none focus-visible:ring-2 focus-visible:ring-gray-300 [&>svg]:size-4 [&>svg]:shrink-0 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <Plus />
        </button>
        <DialogContent className="p-6">
          <DialogTitle className="px-8">{dialogTitle}</DialogTitle>
          <FormComponent setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;
