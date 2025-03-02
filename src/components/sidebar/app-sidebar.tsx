import * as React from "react";

import { NavMain } from "@/components/sidebar/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./team-switcher";
import { Spinner } from "../ui/spinner";
import { useProjects, useTeams } from "@/api";
import { Project, Team } from "@/schemas/types";
import { useTeamStore } from "@/store/store";

/**
 * AppSidebar Component
 *
 * This component serves as the root sidebar of the application. It:
 * - Fetches and displays teams using the `useTeams` hook.
 * - Manages the selected team using a global store (`useTeamStore`).
 * - Fetches and displays projects related to the selected team using the `useProjects` hook.
 */

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {
    data: teamData,
    isLoading: isTeamsLoading,
    isError: isTeamsError,
  } = useTeams();

  const selectedTeamId = useTeamStore((state) => state.selectedTeamId);
  const teams: Team[] = teamData?.map((team: Team) => team) || [];
  if (selectedTeamId === null) {
    useTeamStore.setState({ selectedTeamId: teams[0]?.team_id });
  }
  const { data: projectData, isLoading: isProjectLoading } =
    useProjects(selectedTeamId);
  const project = projectData?.map((project: Project) => project) || [];
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        {isTeamsLoading ? (
          <Spinner size="medium" className="text-primary" />
        ) : isTeamsError ? (
          <div className="text-red-500">Failed to load teams</div>
        ) : (
          <TeamSwitcher teams={teams} />
        )}
      </SidebarHeader>
      <SidebarContent>
        {isProjectLoading ? (
          <Spinner size="medium" className="text-primary" />
        ) : (
          <NavMain items={project} />
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
