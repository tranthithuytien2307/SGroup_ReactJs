import { Button } from "@/shared/ui/button";
import { WorkspaceIcon } from "@/shared/ui/icon/WorkspaceIcon";
import BoardCard from "./BoardCard";
import GenericFormModal from "@/shared/ui/modal/GenericFormModal";
import { useState } from "react";

type Board = {
  id: number;
  name: string;
  description?: string;
};

type WorkspaceSectionProps = {
  id: number;
  name: string;
  description?: string;
  boards: Board[];
  countBoard: number;
  onAddBoard?: (
    workspaceId: number ,
    data: { name: string; description?: string }
  ) => void;
};

export default function WorkspaceSection({
  id,
  name,
  description,
  boards,
  countBoard,
  onAddBoard,
}: WorkspaceSectionProps) {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleCreate = (data: { name: string; description?: string }) => {
    onAddBoard?.(id, data);
    setCreateModalOpen(false);
  };

  const modalCreateTexts = {
    title: "Create New Board",
    description:
      "Create a new board to organize your project tasks and collaborate with your team.",
    labelName: "Board Title",
    placeholderName: "Enter board title",
    labelDescription: "Description (optional)",
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

      <BoardCard workspaceId={id} />

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
