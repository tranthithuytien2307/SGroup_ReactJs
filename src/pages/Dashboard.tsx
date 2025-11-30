import WorkspaceSection from "@/features/dashboard/ui/WorkspaceSection";
import { workspaceAPI } from "@/shared/api/workspaceAPI";
import { useEffect, useState } from "react";
import DashboardContentHeader from "@/features/dashboard/ui/DashboardContentHeader";
import { useWorkspace } from "@/shared/context/WorkspaceContext";
import GenericFormModal from "@/shared/ui/modal/GenericFormModal";
import HeaderContent from "@/shared/ui/ContentHeader";

export default function Dashboard() {
  const { setWorkspaces, workspaces, createWorkspace } = useWorkspace();
  const [createModalOpen, setCreateModalOpen] = useState(false);

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
    const fetchData = async () => {
      try {
        const res = await workspaceAPI.getWorkspaces();
        setWorkspaces(res.data.responseObject);
      } catch (err) {
        console.log("Err: ", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex-1">
      <div className="flex flex-col h-screen">
        <HeaderContent headerContent="Dashboard" />
        <div className="flex-1 p-8 flex-col gap-3 overflow-y-auto">
          <DashboardContentHeader
            onAddWorkspace={() => setCreateModalOpen(true)}
          />
          <div className="flex-1">
            {Array.isArray(workspaces) &&
              workspaces.map((ws) => (
                <WorkspaceSection
                  key={ws.id}
                  id={ws.id}
                  name={ws.name}
                  description={ws.description}
                  countBoard={ws.countBoard}
                />
              ))}
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
