import { useEffect, useMemo, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import ExpressionCalculatorPane from "./math/math";
import VariablesPane from "./variables/variablesPane";
import EditorPane from "./note/calculatorTextEditor";
import { useCalculators } from "@/api";
import CalculatorPane from "./calculator/calculatorPane";
import { useSelectionStore, useVariableStore } from "@/store/store";
import { Variable } from "@/schemas/types";
import { useSidebarBreakpoint } from "@/hooks/use-laptop";

/**
 * Calculator Body Component
 *
 * This is the main body component that holds the following sections:
 * - **Variables**: Manages and displays variables used in calculations.
 * - **Calculator**: Manages and displays nested calculators.
 * - **Expression**: Allows users to input and evaluate mathematical expressions.
 * - **Notes**: Provides an editor for adding notes related to calculations.
 *
 * This component utilizes a resizable panel layout.
 * It also manages state updates based on the selected project and calculator.
 */
const CalculatorBody = () => {
  const isCompactSidebar = useSidebarBreakpoint();

  const [noteState, setNoteState] = useState("");
  const [expressionState, setexpressionState] = useState("");
  const selectedProjectId = useSelectionStore(
    (state) => state.selectedProjectId
  );
  const addVariable = useVariableStore((state) => state.addVariable);
  const resetVariables = useVariableStore((state) => state.resetVariables);

  const selectedCalculatorId = useSelectionStore(
    (state) => state.selectedCalculatorId
  );
  const setSelectedCalculatorId = useSelectionStore(
    (state) => state.setSelectedCalculatorId
  );
  const selectedParentCalculatorId = useSelectionStore(
    (state) => state.selectedParentCalculatorId
  );
  const setSelectedParentCalculatorId = useSelectionStore(
    (state) => state.setSelectedParentCalculatorId
  );
  const setSelectedCalculatorName = useSelectionStore(
    (state) => state.setSelectedCalculatorName
  );

  const calculator = useCalculators(
    selectedProjectId,
    selectedParentCalculatorId,
    selectedCalculatorId
  );
  const panelSizes = useMemo(
    () => ({
      top: isCompactSidebar ? 70 : 50,
      bottom: isCompactSidebar ? 30 : 50,
    }),
    [isCompactSidebar]
  );

  const columnSpans = useMemo(
    () => ({
      variables: isCompactSidebar ? "col-span-2" : "col-span-1",
      calculator: isCompactSidebar ? "col-span-2" : "col-span-1",
      expression: isCompactSidebar ? "col-span-2" : "col-span-2",
    }),
    [isCompactSidebar]
  );
  useEffect(() => {
    if (calculator.data) {
      setSelectedCalculatorId(calculator.data.calculator_id);
      setSelectedParentCalculatorId(calculator.data.parent_calculator_id);
      setSelectedCalculatorName(calculator.data.calculator_name);
    }
    if (calculator.data) {
      const note =
        typeof calculator.data.note === "string"
          ? JSON.parse(calculator.data.note)
          : calculator.data.note;
      setNoteState(note.note_content ?? "");
    } else {
      setNoteState("");
    }
    if (calculator.data) {
      resetVariables();
      const variables =
        typeof calculator.data.variables === "string"
          ? JSON.parse(calculator.data.variables)
          : calculator.data;
      variables.forEach((variable: Variable) => {
        addVariable(variable);
      });
    }

    if (calculator.data) {
      setexpressionState(calculator.data.expression || "");
    }
  }, [calculator.data, selectedProjectId]);

  return (
    <ResizablePanelGroup
      direction="vertical"
      className="gap-4 lg:px-32 md:px-8 py-8 flex-1"
    >
      <ResizablePanel defaultSize={panelSizes.top}>
        <div
          className={`grid ${
            isCompactSidebar ? "grid-cols-6" : "grid-cols-4"
          } gap-4 h-full`}
        >
          <div
            className={`${columnSpans.variables} bg-muted/100 rounded-xl overflow-y-scroll`}
          >
            <VariablesPane />
          </div>
          <div
            className={`${columnSpans.calculator} bg-muted/100 rounded-xl overflow-y-scroll`}
          >
            <CalculatorPane />
          </div>
          <div className={`${columnSpans.expression} bg-muted/100 rounded-xl`}>
            <ExpressionCalculatorPane
              value={expressionState}
              onChange={(newValue) => setexpressionState(newValue)}
            />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={panelSizes.bottom}>
        <div className="grid grid-cols-4 gap-4 h-full">
          <div className="col-span-4 bg-muted/100 rounded-xl relative overflow-y-scroll">
            <EditorPane
              value={noteState}
              onChange={(newValue) => setNoteState(newValue)}
            />
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default CalculatorBody;
