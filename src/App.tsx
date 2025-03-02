import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import CalculatorBody from "./components/body/calculatorBody";
import { Button } from "./components/ui/button";
import { useSelectionStore, useTeamStore, useToggle } from "./store/store";
import { Fragment, useEffect, useState } from "react";
import EditableLabel from "./components/ui/editable-label";
import { useUpdateCalculator } from "./api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import ViewBody from "./components/view/viewBody";

const App = () => {
  // Mutation function for updating calculator data
  const { mutate, isPending } = useUpdateCalculator();

  // State for managing breadcrumb navigation history
  const [breadcrumbHistory, setBreadcrumbHistory] = useState<
    { id: number; name: string }[]
  >([]);

  // State management hooks for selected calculator data
  const setSelectedCalculatorId = useSelectionStore(
    (state) => state.setSelectedCalculatorId
  );
  const selectedCalculatorId = useSelectionStore(
    (state) => state.selectedCalculatorId
  );
  const selectedCalculatorName = useSelectionStore(
    (state) => state.selectedCalculatorName
  );
  const selectedCalculatorResult = useSelectionStore(
    (state) => state.selectedCalculatorResult
  );
  const selectedCalculatorExpression = useSelectionStore(
    (state) => state.selectedCalculatorExpression
  );
  const selectedCalculatorNote = useSelectionStore(
    (state) => state.selectedCalculatorNote
  );
  const selectedProjectId = useSelectionStore(
    (state) => state.selectedProjectId
  );

  // Tracks whether the selected project ID matches the currently active project
  const toggle = useToggle((state) => state.toggle);
  const selectedTeamId = useTeamStore((state) => state.selectedTeamId);

  // Local state for editable label
  const [label, setLabel] = useState(selectedCalculatorName || "");

  // Handles breadcrumb navigation back
  const handleGoBack = () => {
    if (breadcrumbHistory.length > 1) {
      const newHistory = breadcrumbHistory.slice(
        0,
        breadcrumbHistory.length - 1
      );
      const lastBreadcrumb = newHistory[newHistory.length - 1];

      setSelectedCalculatorId(lastBreadcrumb.id);
      setBreadcrumbHistory(newHistory);
    }
  };

  // Handles saving calculator data
  const handleSave = () => {
    if (!selectedCalculatorId) return;
    if (!selectedCalculatorName) return;
    mutate({
      calculator_id: selectedCalculatorId,
      calculator_name: label,
      result: selectedCalculatorResult ?? 0,
      expression: selectedCalculatorExpression ?? "",
      note: selectedCalculatorNote ?? "",
    });
  };

  // Handles breadcrumb click navigation
  const handleBreadcrumbClick = (breadcrumb: { id: number; name: string }) => {
    setSelectedCalculatorId(breadcrumb.id);
    setBreadcrumbHistory(
      breadcrumbHistory.slice(0, breadcrumbHistory.indexOf(breadcrumb) + 1)
    );
  };

  // Updates breadcrumb history when selected calculator changes
  useEffect(() => {
    if (selectedCalculatorId) {
      setBreadcrumbHistory((prev) => {
        if (prev[prev.length - 1]?.id !== selectedCalculatorId) {
          return [
            ...prev,
            { id: selectedCalculatorId, name: selectedCalculatorName || "" },
          ];
        }
        return prev;
      });
    }
  }, [selectedCalculatorId, selectedCalculatorName]);

  // Updates label when selected calculator name changes
  useEffect(() => {
    setLabel(selectedCalculatorName || "");
  }, [selectedCalculatorName]);

  // Resets breadcrumb history when team, project, or toggle changes
  useEffect(() => {
    setBreadcrumbHistory([]);
  }, [selectedTeamId, selectedProjectId, toggle]);

  return (
    <SidebarProvider>
      {/* Sidebar with project navigation */}
      <AppSidebar />
      <SidebarInset>
        {/* Header section with breadcrumb navigation */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-white z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbHistory.map((breadcrumb, index) => (
                <Fragment key={index}>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href="#"
                      onClick={() => handleBreadcrumbClick(breadcrumb)}
                    >
                      {breadcrumb.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {index < breadcrumbHistory.length - 1 && (
                    <BreadcrumbSeparator className="hidden md:block" />
                  )}
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Tabs for switching between Editor and View */}
        <Tabs defaultValue="Editor" className="h-full flex flex-col">
          <TabsList className="grid grid-cols-2 w-[10rem] self-center mt-5">
            <TabsTrigger value="Editor">Editor</TabsTrigger>
            <TabsTrigger value="View">View</TabsTrigger>
          </TabsList>

          {/* Editor Tab Content */}
          <TabsContent value="Editor" className="h-full w-full">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center lg:mx-32 md:mx-8">
                <Button className="w-24" onClick={handleGoBack}>
                  Go Back
                </Button>
                <EditableLabel text={label} onSave={setLabel} />
                <Button
                  className="w-24 bg-green-600"
                  onClick={handleSave}
                  disabled={isPending}
                >
                  Save
                </Button>
              </div>
              {/* Calculator Body */}
              <CalculatorBody />
            </div>
          </TabsContent>

          {/* View Tab Content */}
          <TabsContent value="View">
            <ViewBody />
          </TabsContent>
        </Tabs>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default App;
