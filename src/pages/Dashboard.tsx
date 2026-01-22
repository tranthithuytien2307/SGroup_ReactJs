import WorkspaceSection from "../widgets/dashboard/WorkspaceSection";
import { workspaceAPI } from "../entities/workspace/api/workspaceAPI";
import { useEffect, useState } from "react";
import DashboardContentHeader from "../widgets/dashboard/DashboardContentHeader";
import { useWorkspace } from "../features/workspace/WorkspaceContext";
import GenericFormModal from "../shared/ui/modal/GenericFormModal";
import HeaderContent from "../shared/ui/ContentHeader";
import { useSelectedWorkspace } from "../features/workspace/SelectedWorkspaceContext";

export default function Dashboard() {
  const { setWorkspace, workspace, createWorkspace } = useWorkspace();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { selected } = useSelectedWorkspace();

  const modalCreateWorkspaceTexts = {
    title: "Create New Workspace",
    description:
      "Create a new workspace to organize your project tasks and collaborate with your team.",
    labelName: "Workspace Title",
    placeholderName: "Enter workspace title",
    labelDescription: "Description (optional)",
    placeholderDescription: "Enter workspace description",
    buttonCancel: "Cancel",
    buttonAction: "Create Workspace",
  };

  const handleAddWorkspace = async (data: {
    name: string;
    description?: string;
  }) => {
    await createWorkspace(data);
    setCreateModalOpen(false);
  };

  useEffect(() => {
    console.log("Dashboard mounted");
    if (!selected) return;
    console.log("Selected workspace changed:", selected);

    const fetchData = async () => {
      try {
        const res = await workspaceAPI.getWorkspace(selected.id);
        setWorkspace(res.data.responseObject);
        console.log("Workspaces loaded:", res.data.responseObject);
      } catch (err) {
        console.log("Err: ", err);
      }
    };
    fetchData();
  }, [selected]);

  return (
    <div className="flex-1">
      <div className="flex flex-col h-screen">
        <HeaderContent headerContent="Dashboard" />
        <div className="flex-1 p-8 flex-col gap-3 overflow-y-auto">
          <DashboardContentHeader
            onAddWorkspace={() => setCreateModalOpen(true)}
          />
          <div className="flex-1">
            {workspace ? (
              <WorkspaceSection
                key={workspace.id}
                id={workspace.id}
                name={workspace.name}
                description={workspace.description}
                countBoard={workspace.countBoard}
              />
            ) : (
              <p className="">workspace null</p>
            )}
          </div>
          <GenericFormModal
            open={createModalOpen}
            onOpenChange={setCreateModalOpen}
            onSubmit={handleAddWorkspace}
            texts={modalCreateWorkspaceTexts}
            autoFocusName={true}
          />
        </div>
      </div>
    </div>
  );
}
