import { MoreHorizontal, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Project } from "@/schemas/types";
import { useEffect, useState } from "react";
import CreateDialog from "./createDialog";
import DeleteProjectDialog from "./deleteAlertDialog";
import EditDialog from "./editDialog";
import { useSelectionStore, useTeamStore, useToggle } from "@/store/store";

/**
 * NavMain Component
 *
 * Displays a list of projects in a sidebar with options to create, edit, and delete projects.
 * Uses Zustand for state management and manages modal dialogs for project actions.
 *
 * Props:
 * - `items`: Array of projects to display.
 */
export function NavMain({ items }: { items: Project[] }) {
  const { isMobile } = useSidebar();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProjectDelete, setSelectedProjectDelete] =
    useState<Project | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    id: number | null;
    name: string;
  }>({ id: null, name: "" });
  const setSelectedProjectId = useSelectionStore(
    (state) => state.setSelectedProjectId
  );
  const selectedParentCalculatorId = useSelectionStore(
    (state) => state.selectedParentCalculatorId
  );
  const setSelectedCalculatorId = useSelectionStore(
    (state) => state.setSelectedCalculatorId
  );
  const selectedProjectId = useSelectionStore(
    (state) => state.selectedProjectId
  );
  const setSelectedParentCalculatorId = useSelectionStore(
    (state) => state.setSelectedParentCalculatorId
  );
  const setToggle = useToggle((state) => state.setToggle);
  const selectedTeamId = useTeamStore((state) => state.selectedTeamId);
  const handleDeleteClick = (project: Project) => {
    console.log(items.length);
    if (items.length > 1) {
      setSelectedProjectDelete(project);
      setDeleteDialogOpen(true);
    }
  };

  const handleEditClick = (item: { id: number; name: string }) => {
    setSelectedItem(item);
    setIsEditOpen(true);
  };
  const handleSelectProject = (project: Project) => {
    if (project.project_id === selectedProjectId) {
      setToggle();
    }
    setSelectedProjectId(project.project_id);
    setSelectedParentCalculatorId(null);
    setSelectedCalculatorId(selectedParentCalculatorId);
  };
  useEffect(() => {
    setSelectedProjectId(items[0]?.project_id);
    setSelectedParentCalculatorId(null);
  }, [selectedTeamId]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarGroupAction
        title="Add Project"
        onClick={() => setDialogOpen(true)}
      >
        <Plus /> <span className="sr-only">Add Project</span>
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.project_id}>
              <SidebarMenuButton asChild>
                <button
                  key={item.project_id}
                  onClick={() => handleSelectProject(item)}
                >
                  {item.project_name}
                </button>
              </SidebarMenuButton>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction>
                    <MoreHorizontal />
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                  className="min-w-56 rounded-lg"
                >
                  <DropdownMenuItem
                    onClick={() =>
                      handleEditClick({
                        id: item.project_id,
                        name: item.project_name,
                      })
                    }
                  >
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={() => handleDeleteClick(item)}
                  >
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
      <CreateDialog
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        sideBarName="Project"
      />
      <DeleteProjectDialog
        open={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        project={selectedProjectDelete}
      />
      <EditDialog
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        sideBarName="Project"
        itemId={selectedItem.id}
        initialName={selectedItem.name}
      />
    </SidebarGroup>
  );
}
