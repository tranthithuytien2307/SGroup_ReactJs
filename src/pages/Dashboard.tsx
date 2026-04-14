import WorkspaceSection from "../widgets/dashboard/WorkspaceSection";
import { useState } from "react";
import DashboardContentHeader from "../widgets/dashboard/DashboardContentHeader";
import { useWorkspace } from "../features/workspace/WorkspaceContext";
import GenericFormModal from "../shared/ui/modal/GenericFormModal";
import HeaderContent from "../shared/ui/ContentHeader";
import LoadingSpinner from "../shared/ui/LoadingSpinner";

export default function Dashboard() {
  const { workspace, workspaces, loading, createWorkspace } = useWorkspace();
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

  return (
    <div className="flex-1">
      <div className="flex flex-col h-screen">
        <HeaderContent headerContent="Dashboard" />
        <div className="flex-1 p-8 flex-col gap-3 overflow-y-auto">
          <DashboardContentHeader
            onAddWorkspace={() => setCreateModalOpen(true)}
          />
          <div className="flex-1">
            {loading ? (
              <div className="flex min-h-[240px] items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : workspace ? (
              <WorkspaceSection
                key={workspace.id}
                id={workspace.id}
                name={workspace.name}
                description={workspace.description}
                countBoard={workspace.countBoard}
              />
            ) : workspaces.length === 0 ? (
              <div className="flex min-h-[240px] flex-col items-start justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white px-6">
                <p className="text-xl font-semibold text-gray-900">
                  No workspace yet
                </p>
                <p className="text-sm text-gray-500">
                  Create your first workspace to start managing boards.
                </p>
              </div>
            ) : (
              <div className="flex min-h-[240px] items-center justify-center">
                <LoadingSpinner />
              </div>
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
