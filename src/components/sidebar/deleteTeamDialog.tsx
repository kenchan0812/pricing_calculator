import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { Team } from "@/schemas/types";
import { useDeleteTeam } from "@/api";

interface DeleteTeamDialogProps {
  open: boolean;
  onClose: (value: boolean) => void;
  teams: Team[];
}

export function DeleteTeamDialog({
  open,
  onClose,
  teams,
}: DeleteTeamDialogProps) {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const { mutate } = useDeleteTeam();
  const handleDelete = () => {
    if (selectedTeam) {
      mutate(selectedTeam.team_id, {
        onSuccess: () => {
          onClose(false);
        },
        onError: (error) => {
          console.error("Failed to delete team:", error);
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Team</DialogTitle>
        </DialogHeader>
        <Select
          onValueChange={(value) => {
            const teamId = parseInt(value, 10); // Convert value to an integer
            setSelectedTeam(teams.find((t) => t.team_id === teamId) || null);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a team" />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team) => (
              <SelectItem key={team.team_id} value={team.team_id.toString()}>
                {team.team_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={handleDelete}
          disabled={!selectedTeam}
          variant="destructive"
        >
          Delete
        </Button>
      </DialogContent>
    </Dialog>
  );
}
