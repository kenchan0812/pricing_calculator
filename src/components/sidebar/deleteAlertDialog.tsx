import { useDeleteProject } from "@/api";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogDescription,
} from "../ui/alert-dialog";
import { Project } from "@/schemas/types";
import { useState, useEffect } from "react";

interface DeleteProjectDialogProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
}

const DeleteProjectDialog: React.FC<DeleteProjectDialogProps> = ({
  open,
  onClose,
  project,
}) => {
  const [isOpen, setIsOpen] = useState(open);
  const deleteProject = useDeleteProject();
  useEffect(() => {
    setIsOpen(open);
  }, [open]);
  
  if (!project) return null;

  const handleDelete = () => {
    if (!project) return;

    deleteProject.mutate(project.project_id, {
      onSuccess: () => {
        console.log(`Project deleted: ${project.project_name}`);
        setIsOpen(false);
        onClose();
      },
      onError: (error) => {
        console.error("Failed to delete project:", error);
        alert("Error deleting project. Please try again.");
      },
    });
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={() => {setIsOpen(false); onClose()}}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Project?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the project{" "}
            <strong>{project.project_name}</strong>? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setIsOpen(false);
              onClose();
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 text-white"
            disabled={deleteProject.isPending}
          >
            {deleteProject.isPending ? "Deleting..." : "Delete Project"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProjectDialog;
