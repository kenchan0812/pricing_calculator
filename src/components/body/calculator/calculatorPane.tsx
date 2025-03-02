import CalculatorList from "./calculatorList";
import Header from "../header";
import CalculatorForm from "./calculatorForm";

/**
 * Calculator Pane
 *
 * This component represents the pane that displays and manages calculators.
 * It includes a header with options to create a new nested calculators and a list of existing calculators.
 */

const CalculatorPane = () => {
  return (
    <div>
      <Header
        title="Calculators"
        dialogTitle="Create a Calculator"
        FormComponent={CalculatorForm}
      />
      <CalculatorList />
    </div>
  );
};

export default CalculatorPane;
