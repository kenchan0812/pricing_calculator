import { useEffect, useState } from "react";
import { ChevronsUpDown, MoreVertical, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { Team } from "@/schemas/types";
import CreateDialog from "./createDialog";
import { EditTeamDialog } from "./editTeamDialog";
import { DeleteTeamDialog } from "./deleteTeamDialog";
import { useTeamStore } from "@/store/store";

/**
 * TeamSwitcher Component
 *
 * This component manages the team selection dropdown in the sidebar. It allows users
 * to switch between teams, add a new team, edit an existing team, or delete a team.
 *
 */
export function TeamSwitcher({ teams }: { teams: Team[] }) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = useState<Team>(teams[0]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const selectedTeamId = useTeamStore((state) => state.selectedTeamId);
  const setSelectedTeamId = useTeamStore((state) => state.setSelectedTeamId);
  useEffect(() => {
    if (selectedTeamId !== activeTeam.team_id) {
      setSelectedTeamId(activeTeam.team_id);
    }
  }, [activeTeam, setSelectedTeamId]);
  useEffect(() => {
    const updatedTeam = teams.find((t) => t.team_id === activeTeam.team_id);

    if (updatedTeam) {
      setActiveTeam(updatedTeam);
    } else if (teams.length > 0) {
      setActiveTeam(teams[0]);
    }
  }, [teams]);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeTeam.team_name}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Teams
              </DropdownMenuLabel>
              {teams.map((team, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => setActiveTeam(team)}
                  className="gap-2 p-2"
                >
                  {team.team_name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 p-2"
                onClick={() => setDialogOpen(true)}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Add team
                </div>
              </DropdownMenuItem>
              <DropdownMenu modal={!isDeleteDialogOpen && !isEditDialogOpen}>
                <DropdownMenuTrigger asChild>
                  <DropdownMenuItem className="gap-2 p-2">
                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                      <MoreVertical className="size-4" />
                    </div>
                    <div className="font-medium text-muted-foreground">
                      Action
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <CreateDialog
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        sideBarName="Teams"
      />
      <EditTeamDialog
        open={isEditDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        teams={teams}
      />
      <DeleteTeamDialog
        open={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        teams={teams}
      />
    </>
  );
}
