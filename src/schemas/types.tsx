export type Team = {
  team_id: number;
  team_name: string;
  created_at: string;
  updated_at: string;
};

export type Project = {
  project_id: number;
  project_name: string;
  created_at: string;
  team_id: number;
  updated_at: string;
};

export type Variable = {
  variable_id: number;
  variable_name: string;
  variable_value: number;
  variable_display: string;
};
export type Calculator = {
  calculator_id: number;
  calculator_name: string;
  created_at: string;
  expression: string | null;
  note: string;
  note_id: number | null;
  parent_calculator_id: number | null;
  project_id: number;
  result: number | null;
  updated_at: string;
  variables: Variable[];
};

export interface CalculatorView {
  calculator_id: number;
  calculator_name: string;
  children: CalculatorView[];
  created_at: string;
  expression: string | null;
  note: string;
  note_id: number | null;
  parent_calculator_id: number | null;
  project_id: number;
  result: number | null;
  updated_at: string;
  variables: Variable[];
}

export type DataProps = {
  value: string;
  onChange: (value: string) => void;
};
