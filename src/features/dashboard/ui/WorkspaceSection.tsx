import { Button } from "@/shared/ui/button";
import { WorkspaceIcon } from "@/shared/ui/icon/WorkspaceIcon";
import BoardCard from "./BoardCard";
import GenericFormModal from "@/shared/ui/modal/GenericFormModal";
import { useState } from "react";
import { useWorkspace } from "@/shared/context/WorkspaceContext";

type WorkspaceSectionProps = {
  id: number;
  name: string;
  description?: string;
  countBoard: number;
  onAddBoard?: (
    workspace_id: number ,
    data: { name: string; description?: string }
  ) => void;
};

export default function WorkspaceSection({
  id,
  name,
  description,
  countBoard,
}: WorkspaceSectionProps) {
  const { createBoard } = useWorkspace();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleCreate = async (data: {
    name: string;
    description?: string;
    cover_url?: string;
  }) => {
    data.cover_url = "http:xxxxx";
    await createBoard(id, data);
    setCreateModalOpen(false);
  };
  const modalCreateTexts = {
    title: "Create New Board",
    description:
      "Create a new board to organize your project tasks and collaborate with your team.",
    labelName: "Board Title",
    placeholderName: "Enter board title",
    labelDescription: "Description",
    placeholderDescription: "Enter board description",
    buttonCancel: "Cancel",
    buttonAction: "Create Board",
  };

  return (
    <div className="md-10 pt-7 pb-5">
      <div className="flex justify-between items-start mb-4 w-full">
        <div>
          <div className="flex gap-2">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <WorkspaceIcon />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
          </div>
          <p className="text-gray-500 text-sm">{description}</p>
          <p className="text-xs text-gray-400 mt-1">{countBoard} boards</p>
        </div>
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="cursor-pointer"
        >
          + Add Board
        </Button>
      </div>

      <BoardCard workspace_id={id} />

      <GenericFormModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={handleCreate}
        texts={modalCreateTexts}
        autoFocusName={true}
      />
    </div>
  );
}
