import { Button } from "../../shared/ui/button";
import { WorkspaceIcon } from "../../shared/ui/icon/WorkspaceIcon";
import BoardCard from "./BoardCard";
import GenericFormModal from "../../shared/ui/modal/GenericFormModal";
import { useState } from "react";
import { useWorkspace } from "../../features/workspace/WorkspaceContext";
import { getBoardsByWorkspaceId } from "../../features/board/model/getBoardByWorkspaceId";
import type { Board } from "../../entities/board/model/boardType";
import { useBoardStore } from "../../features/board/model/boardStore";

type WorkspaceSectionProps = {
  id: number;
  name: string;
  description?: string;
  countBoard: number;
  onAddBoard?: (
    workspace_id: number,
    data: { name: string; description?: string },
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
  const boards = useBoardStore((state) => state.boards);
  const setBoards = useBoardStore((state) => state.setBoards);

  const handleCreate = async (data: {
    name: string;
    description?: string;
    cover_url?: string;
  }) => {
    data.cover_url = "http:xxxxx";
    await createBoard(id, data);
    const boardsData = await getBoardsByWorkspaceId(id);
    setBoards(boardsData);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 w-full">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-sm">
            <WorkspaceIcon />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                {name}
              </h2>

              <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                {countBoard} boards
              </span>
            </div>

            {description && (
              <p className="text-sm text-gray-500 mt-1 max-w-xl line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>

        <Button
          onClick={() => setCreateModalOpen(true)}
          className="
            cursor-pointer
            bg-black
            hover:bg-gray-800
            text-white
            px-5
            h-10
            rounded-md
            shadow-sm
            transition
          "
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
