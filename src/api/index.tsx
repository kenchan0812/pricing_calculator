import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios";

// =====================================
// ========== TEAMS ENDPOINT ===========
// =====================================

export const useTeams = () =>
  useQuery({
    queryKey: ["TEAMS"],
    queryFn: async () => {
      return axiosInstance.get("/teams").then((res) => res.data);
    },
  });

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (team_name: string) =>
      axiosInstance.post("/teams", { team_name }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["TEAMS"] }),
  });
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      team_id,
      team_name,
    }: {
      team_id: number;
      team_name: string;
    }) => axiosInstance.put(`/teams/${team_id}`, { team_name }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["TEAMS"] }),
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (team_id: number) => axiosInstance.delete(`/teams/${team_id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["TEAMS"] }),
  });
};

// =====================================
// ========= PROJECTS ENDPOINT =========
// =====================================
export const useProjects = (team_id: number | null) =>
  useQuery({
    queryKey: ["PROJECTS", team_id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/projects?team_id=${team_id}`);
      return response.data;
    },
    enabled: !!team_id,
  });

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      team_id,
      project_name,
    }: {
      team_id: number | null;
      project_name: string;
    }) => axiosInstance.post("/projects", { team_id, project_name }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["PROJECTS"] }),
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      project_id,
      project_name,
    }: {
      project_id: number;
      project_name: string;
    }) => axiosInstance.put(`/projects/${project_id}`, { project_name }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["PROJECTS"] }),
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (project_id: number) =>
      axiosInstance.delete(`/projects/${project_id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["PROJECTS"] }),
  });
};

// =====================================
// ======== CALCULATOR ENDPOINT ========
// =====================================
export const useCalculators = (
  projectId: number | null,
  parentCalculatorId?: number | null,
  calculator_id?: number | null
) =>
  useQuery({
    queryKey: ["CALCULATOR", projectId, parentCalculatorId, calculator_id],
    queryFn: async () => {
      const url = parentCalculatorId
        ? `/calculator/${projectId}/${parentCalculatorId}/${calculator_id}`
        : `/calculator/${projectId}/${null}/${null}`;
      const response = await axiosInstance.get(url);
      return response.data;
    },
    enabled: !!projectId,
  });

export const useNestedCalculators = (
  projectId: number | null,
  parentCalculatorId: number | null
) =>
  useQuery({
    queryKey: ["NESTED_CALCULATOR", projectId, parentCalculatorId],
    queryFn: async () => {
      const url = `/nestedCalculator/${projectId}/${parentCalculatorId}`;
      const response = await axiosInstance.get(url);
      return response.data;
    },
    enabled: !!projectId && parentCalculatorId !== null, // Ensure both projectId and parentCalculatorId are available
  });

export const useCalculatorHierarchy = (projectId: number | null) =>
  useQuery({
    queryKey: ["CALCULATOR_HIERARCHY", projectId],
    queryFn: async () => {
      const url = `/calculatorHierarchy/${projectId}`;
      const response = await axiosInstance.get(url);
      return response.data;
    },
    enabled: !!projectId,
  });

export const useCreateCalculator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      project_id,
      parent_calculator_id,
      calculator_name,
    }: {
      project_id: number | null;
      parent_calculator_id: number | null;
      calculator_name: string;
    }) =>
      axiosInstance.post("/calculator", {
        project_id,
        parent_calculator_id,
        calculator_name,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["NESTED_CALCULATOR"] });
    },
  });
};

export const useUpdateCalculator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (calculator: {
      calculator_id: number;
      calculator_name: string;
      expression?: string;
      result?: number;
      note?: string;
    }) =>
      axiosInstance.put(`/calculators/${calculator.calculator_id}`, {
        calculator_name: calculator.calculator_name,
        expression: calculator.expression,
        result: calculator.result,
        note: calculator.note,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["NESTED_CALCULATOR"] });
    },
  });
};

export const useDeleteCalculator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (calculator_id: number) => {
      return axiosInstance.delete(`/calculators/${calculator_id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["CALCULATOR"] });
      queryClient.invalidateQueries({ queryKey: ["NESTED_CALCULATOR"] });
    },
  });
};

// =====================================
// ========== VARIABLES ENDPOINT =======
// =====================================
export const useVariables = () =>
  useQuery({
    queryKey: ["VARIABLES"],
    queryFn: async () => {
      return axiosInstance.get("/variables").then((res) => res.data);
    },
  });

export const useCreateVariable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variable: {
      calculator_id: number;
      variable_name: string;
      variable_display: string;
      variable_value: number;
    }) => axiosInstance.post("/variables", variable),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["CALCULATOR"] }),
  });
};

export const useUpdateVariable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variable: {
      variable_id: number;
      variable_name: string;
      variable_display: string;
      variable_value: number;
    }) =>
      axiosInstance.put(`/variables/${variable.variable_id}`, {
        variable_name: variable.variable_name,
        variable_display: variable.variable_display,
        variable_value: variable.variable_value,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["CALCULATOR"] }),
  });
};

export const useDeleteVariable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variableId: number) =>
      axiosInstance.delete(`/variables/${variableId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["CALCULATOR"] });
    },
  });
};

// =====================================
// ========== NOTES ENDPOINT ===========
// =====================================
export const useNotes = () =>
  useQuery({
    queryKey: ["NOTES"],
    queryFn: async () => {
      return axiosInstance.get("/notes").then((res) => res.data);
    },
  });

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (note: { calculator_id: number; note_content: string }) =>
      axiosInstance.post("/notes", note),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["NOTES"] }),
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (note: { note_id: number; note_content: string }) =>
      axiosInstance.put(`/notes/${note.note_id}`, note),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["NOTES"] }),
  });
};
