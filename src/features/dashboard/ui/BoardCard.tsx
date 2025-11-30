import { Ellipsis, Kanban, SquarePen, Trash, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
} from "@/shared/ui/dropdown-menu";
import { useState } from "react";
import GenericFormModal from "@/shared/ui/modal/GenericFormModal";
import { useWorkspace } from "@/shared/context/WorkspaceContext";
import type { Board } from "@/shared/types";

type BoardCardProps = {
  workspaceId: number;
};

export default function BoardCard({ workspaceId }: BoardCardProps) {
  const { workspaces, updateBoard, deleteBoard } = useWorkspace();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  const workspace = workspaces.find((ws) => ws.id === workspaceId);
  const boards = workspace?.boards ?? [];

  const handleEdit = (board: Board) => {
    setSelectedBoard(board);
    setEditModalOpen(true);
  };

  const handleEditSave = async (data: {
    name: string;
    description?: string;
    cover_url?: string;
  }) => {
    if (!selectedBoard) return;
    data.cover_url = "http:xxxxx";
    await updateBoard(workspaceId, selectedBoard.id, data);
    setEditModalOpen(false);
  };

  const handleDelete = async (board: any) => {
    await deleteBoard(workspaceId, board.id);
  };

  const modalEditTexts = {
    title: "Edit Board",
    description: "Update your board title and description.",
    labelName: "Board Title",
    placeholderName: "Enter board title",
    labelDescription: "Description (optional)",
    placeholderDescription: "Enter board description",
    buttonCancel: "Cancel",
    buttonAction: "Save Changes",
  };

  return (
    <div className="flex gap-5 flex-wrap">
      {boards.map((board: Board) => (
        <div key={board.id}>
          <div className="group relative min-w-70 border rounded-xl shadow-sm bg-white hover:shadow-md transition cursor-pointer p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="
                    absolute top-2 right-2 
                    opacity-0 group-hover:opacity-100
                    pointer-events-none group-hover:pointer-events-auto
                    flex items-center justify-center p-2 
                    hover:bg-gray-100 rounded-md 
                    transition-opacity duration-150
                  "
                >
                  <Ellipsis className="w-5 h-5 text-gray-500" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuPortal>
                <DropdownMenuContent
                  side="bottom"
                  align="end"
                  sideOffset={6}
                  className="z-50 w-40"
                >
                  <DropdownMenuItem
                    onSelect={() => handleEdit(board)}
                    className="flex items-center gap-2 px-3 py-2"
                  >
                    <SquarePen className="h-4 w-4" /> Edit Board
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 px-3 py-2 text-red-500"
                    onSelect={() => handleDelete(board)}
                  >
                    <Trash className="h-4 w-4" /> Delete Board
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenu>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <Kanban className="h-4 w-4" />
                <h3 className="font-medium text-gray-800">{board.name}</h3>
              </div>
              <p className="text-sm text-gray-500">Main</p>
              <div className="flex justify-between">
                <p>1-3 lists</p>
                <div className="flex gap-1 items-center">
                  <User className="w-4 h-4" />
                  <p>1</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {selectedBoard && (
        <GenericFormModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          initialData={{
            name: selectedBoard.name,
            description: selectedBoard.description || "",
          }}
          onSubmit={handleEditSave}
          texts={modalEditTexts}
          autoFocusName
        />
      )}
    </div>
  );
}
