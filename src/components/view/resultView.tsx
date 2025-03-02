import { CalculatorView } from "@/schemas/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ResultViewProps {
  selectedCalculator: CalculatorView | null;
}

/**
 * This component presents the result of the expression and
 * also displays the mathematical expression through an accordion.
 */
const ResultView = ({ selectedCalculator }: ResultViewProps) => {
  return (
    <div>
      {/* Accordion to display the formula expression */}
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Click here for formula</AccordionTrigger>
          <AccordionContent>
            {/* Display the mathematical expression used in the calculation */}
            {selectedCalculator?.expression}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Display the calculated result */}
      <div className="lg:text-2xl md:text-lg mt-10 font-bold">
        Result: {selectedCalculator?.result}
      </div>
    </div>
  );
};

export default ResultView;
