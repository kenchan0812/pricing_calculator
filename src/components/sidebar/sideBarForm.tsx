import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { sideBarSchema } from "@/schemas";
import { useCreateProject, useCreateTeam } from "@/api";
import { useTeamStore } from "@/store/store";

/**
 * SideBarForm Component
 *
 * A reusable form for creating a "Team" or "Project" based on `sideBarName`.
 * Uses react-hook-form with Zod validation and triggers API calls via
 * `useCreateTeam` and `useCreateProject`. Closes the modal on success.
 *
 * Props:
 * - `setOpen`: Function to close the modal.
 * - `sideBarName`: "Teams" or "Project" to determine the creation type.
 */
const SideBarForm = ({
  setOpen,
  sideBarName,
}: {
  setOpen: (value: boolean) => void;
  sideBarName: string;
}) => {
  const team = useCreateTeam();
  const project = useCreateProject();
  const selectedTeamId = useTeamStore((state) => state.selectedTeamId);

  const sideBarForm = useForm<z.infer<typeof sideBarSchema>>({
    resolver: zodResolver(sideBarSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: z.infer<typeof sideBarSchema>) => {
    if (sideBarName === "Teams") {
      team.mutate(data.name, {
        onError: (error) => {
          console.error("Failed to create team:", error);
          alert("Error creating team. Please try again.");
        },
      });
      console.log("Team created");
    }
    if (sideBarName === "Project") {
      project.mutate(
        { team_id: selectedTeamId, project_name: data.name },
        {
          onError: (error: Error) => {
            console.error("Failed to create project:", error);
            alert("Error creating project. Please try again.");
          },
        }
      );
    }
    setOpen(false);
  };

  return (
    <Form {...sideBarForm}>
      <form
        onSubmit={sideBarForm.handleSubmit(onSubmit)}
        className="space-y-4 py-4 px-8 w-full mx-auto"
      >
        <FormField
          control={sideBarForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter {sideBarName} Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter display name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" className="w-24">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SideBarForm;
