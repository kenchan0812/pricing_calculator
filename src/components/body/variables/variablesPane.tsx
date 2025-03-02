import VariableList from "./variableList";
import Header from "../header";
import VariableForm from "./variableForm";
/**
 * Variables Pane
 *
 * This component represents the pane that displays and manages variables.
 * It includes a header with options to create a new variable and a list of existing variables.
 */

const VariablesPane = () => {
  return (
    <div>
      <Header
        title="Variables"
        dialogTitle="Create a Variable"
        FormComponent={VariableForm}
      />
      <VariableList />
    </div>
  );
};

export default VariablesPane;
