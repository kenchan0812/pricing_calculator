import { Variable } from "@/schemas/types";
import { create } from "zustand";

/**
 * Zustand store for managing the selected team.
 */
interface TeamStore {
  selectedTeamId: number | null;
  setSelectedTeamId: (teamId: number | null) => void;
}

export const useTeamStore = create<TeamStore>((set) => ({
  selectedTeamId: null,

  // Sets the selected team ID
  setSelectedTeamId: (teamId: number | null) => set({ selectedTeamId: teamId }),
}));

/**
 * Zustand store for managing project and calculator selections.
 */
interface SelectionStore {
  selectedProjectId: number | null;
  selectedCalculatorId: number | null;
  setSelectedProjectId: (projectId: number | null) => void;
  setSelectedCalculatorId: (calculatorId: number | null) => void;
  selectedParentCalculatorId: number | null;
  setSelectedParentCalculatorId: (calculatorId: number | null) => void;
  selectedCalculatorName: string | null;
  setSelectedCalculatorName: (calculatorName: string | null) => void;
  selectedCalculatorResult: number | null;
  setSelectedCalculatorResult: (calculatorResult: number | null) => void;
  selectedCalculatorExpression: string | null;
  setSelectedCalculatorExpression: (
    calculatorExpression: string | null
  ) => void;
  selectedCalculatorNote: string | null;
  setSelectedCalculatorNote: (note: string | null) => void;

  resetSelection: () => void;
}

export const useSelectionStore = create<SelectionStore>((set) => ({
  selectedProjectId: null,
  selectedCalculatorId: null,
  selectedParentCalculatorId: null,
  selectedCalculatorName: null,
  selectedCalculatorResult: null,
  selectedCalculatorExpression: null,
  selectedCalculatorNote: null,

  // Sets the selected project ID and resets the selected calculator ID
  setSelectedProjectId: (projectId) => {
    set({ selectedProjectId: projectId, selectedCalculatorId: null });
  },

  // Sets the selected calculator ID
  setSelectedCalculatorId: (calculatorId) => {
    set({ selectedCalculatorId: calculatorId });
  },

  // Sets the selected parent calculator ID
  setSelectedParentCalculatorId: (calculatorId) => {
    set({ selectedParentCalculatorId: calculatorId });
  },

  // Sets the selected calculator name
  setSelectedCalculatorName: (calculatorName) => {
    set({ selectedCalculatorName: calculatorName });
  },

  // Sets the selected calculator result
  setSelectedCalculatorResult: (calculatorResult) => {
    set({ selectedCalculatorResult: calculatorResult });
  },

  // Sets the selected calculator expression
  setSelectedCalculatorExpression: (calculatorExpression) => {
    set({ selectedCalculatorExpression: calculatorExpression });
  },

  // Sets the selected calculator note
  setSelectedCalculatorNote: (note) => {
    set({ selectedCalculatorNote: note });
  },

  // Resets selection by clearing project and calculator IDs
  resetSelection: () => {
    set({ selectedProjectId: null, selectedCalculatorId: null });
  },
}));

/**
 * Zustand store for managing variables in the application.
 */
type VariableStore = {
  variables: Variable[] | null;
  setVariables: (data: Variable[] | string) => void;
  addVariable: (variable: Variable) => void;
  resetVariables: () => void;
};

export const useVariableStore = create<VariableStore>((set) => ({
  variables: null,

  // Sets variables from either an array or a JSON string
  setVariables: (data) => {
    if (typeof data === "string") {
      set({ variables: JSON.parse(data) });
    } else {
      set({ variables: data });
    }
  },

  // Adds a new variable to the list
  addVariable: (variable) =>
    set((state) => ({
      variables: state.variables ? [...state.variables, variable] : [variable],
    })),

  // Resets variables to an empty array
  resetVariables: () =>
    set(() => ({
      variables: [],
    })),
}));

/**
 * Zustand store for handling a toggle state.
 */
type ToggleStore = {
  toggle: boolean;
  setToggle: () => void;
};

export const useToggle = create<ToggleStore>((set) => ({
  toggle: false,

  // Toggles the boolean state
  setToggle: () => set((state) => ({ toggle: !state.toggle })),
}));
