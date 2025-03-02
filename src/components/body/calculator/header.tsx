import { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import CalculatorForm from "./calculatorForm";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-[60px] py-3 px-6 flex justify-between sticky top-0 z-10 bg-muted/100 shadow-sm">
      <div className="text-lg font-bold self-center opacity-70">
        Calculators
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <button
          className="inline-flex items-center justify-center rounded-md px-2 text-gray-500 hover:text-black hover:bg-gray-200 hover:opacity-70 outline-none focus-visible:ring-2 focus-visible:ring-gray-300 [&>svg]:size-4 [&>svg]:shrink-0 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <Plus />
        </button>
        <DialogContent className="p-6">
          <DialogTitle className="px-8">Create a Calculator</DialogTitle>

          <CalculatorForm setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;
