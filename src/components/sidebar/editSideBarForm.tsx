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
import { useUpdateProject, useUpdateTeam } from "@/api";

/**
 * EditSideBarForm Component
 *
 * This component provides a form to edit the name of a team or project in the sidebar.
 * It uses React Hook Form with Zod validation for handling form state and validation.
 * Based on the `sideBarName` prop, it updates either a team or a project via API mutations.
 * The form displays an input field for entering the new name and a submit button to save changes.
 */
const EditSideBarForm = ({
  setOpen,
  sideBarName,
  itemId,
  initialName,
}: {
  setOpen: (value: boolean) => void;
  sideBarName: string;
  itemId: number | null;
  initialName: string;
}) => {
  const updateTeam = useUpdateTeam();
  const updateProject = useUpdateProject();

  const form = useForm<z.infer<typeof sideBarSchema>>({
    resolver: zodResolver(sideBarSchema),
    defaultValues: { name: initialName },
  });
  if (!itemId) return null;

  const onSubmit = (data: z.infer<typeof sideBarSchema>) => {
    if (sideBarName === "Teams") {
      updateTeam.mutate(
        { team_id: itemId, team_name: data.name },
        {
          onSuccess: () => {
            console.log("Team updated");
          },
          onError: (error) => {
            console.error("Failed to update team:", error);
            alert("Error updating team. Please try again.");
          },
        }
      );
    }
    if (sideBarName === "Project") {
      updateProject.mutate(
        {
          project_id: itemId,
          project_name: data.name,
        },
        {
          onSuccess: () => {
            console.log("Project updated");
          },
          onError: (error) => {
            console.error("Failed to update project:", error);
            alert("Error updating project. Please try again.");
          },
        }
      );
    }
    setOpen(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 py-4 px-8 w-full mx-auto"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Edit {sideBarName} Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter new name" />
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

export default EditSideBarForm;
