import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { Team } from "@/schemas/types";
import { useUpdateTeam } from "@/api";

interface EditTeamDialogProps {
  open: boolean;
  onClose: (value: boolean) => void;
  teams: Team[];
}

export function EditTeamDialog({ open, onClose, teams }: EditTeamDialogProps) {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamName, setTeamName] = useState("");
  const { mutate, isPending } = useUpdateTeam();

  const handleSave = () => {
    if (selectedTeam) {
      mutate({ team_id: selectedTeam.team_id, team_name: teamName });
      setTeamName("");
      onClose(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setTeamName("");
          onClose(false);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
        </DialogHeader>
        <Select
          onValueChange={(value) => {
            const teamId = parseInt(value, 10); // Convert value to an integer
            const team = teams.find((t) => t.team_id === teamId);
            setSelectedTeam(team || null);
            setTeamName(team?.team_name || "");
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
        {selectedTeam && (
          <Input
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="New team name"
          />
        )}
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving..." : "Save"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
