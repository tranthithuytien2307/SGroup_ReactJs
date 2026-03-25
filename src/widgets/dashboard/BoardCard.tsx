import {
  Ellipsis,
  Kanban,
  SquarePen,
  Trash,
  User,
  Archive,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
} from "../../shared/ui/dropdown-menu";
import { useEffect, useState } from "react";
import GenericFormModal from "../../shared/ui/modal/GenericFormModal";
import { useWorkspace } from "../../features/workspace/WorkspaceContext";
import type { Board } from "../../entities/board/model/boardType";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../shared/config/PATH";
import { getBoardsByWorkspaceId } from "../../features/board/model/getBoardByWorkspaceId";

type BoardCardProps = {
  workspace_id: number;
};

export default function BoardCard({ workspace_id }: BoardCardProps) {
  const { workspace, updateBoard, archiveBoard, deleteBoard } = useWorkspace();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!workspace?.id) return;

    const fetchBoards = async () => {
      const boardsData = await getBoardsByWorkspaceId(workspace.id);
      setBoards(boardsData);
    };

    fetchBoards();
  }, [workspace?.id]);

  const handleEdit = (board: Board) => {
    setSelectedBoard(board);
    setEditModalOpen(true);
  };

  const handleEditSave = async (data: {
    name: string;
    description?: string;
  }) => {
    if (!selectedBoard) return;
    await updateBoard(selectedBoard.id, data);
    setEditModalOpen(false);
  };

  const handleOnBoardDetail = (id: number) => {
    navigate(PATH.BOARDPAGE(id));
  };

  const handleArchive = async (board: Board) => {
    if (
      confirm(`Are you sure you want to archive the board "${board.name}"?`)
    ) {
      await archiveBoard(board.id);
    }
  };

  const handleDelete = async (board: any) => {
    await deleteBoard(board.id);
  };

  const modalEditTexts = {
    title: "Edit Board",
    description: "what Do You Want To Change?",
    labelName: "Board Title",
    placeholderName: "Enter board title",
    labelDescription: "Description",
    placeholderDescription: "Enter board description",
    buttonCancel: "Cancel",
    buttonAction: "Save Changes",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {boards.map((board: Board) => (
        <div key={board.id} onClick={() => handleOnBoardDetail(board.id)}>
          <div
            className="
          group relative
          h-full
          border rounded-xl
          bg-white
          hover:shadow-md
          transition
          cursor-pointer
          p-6
          flex flex-col
          justify-between
        "
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="
                absolute top-2 right-2 
                opacity-0 group-hover:opacity-100
                pointer-events-none group-hover:pointer-events-auto
                p-2 hover:bg-gray-100 rounded-md
                transition
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
                    className="flex items-center gap-2"
                  >
                    <SquarePen className="h-4 w-4" />
                    Edit Board
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onSelect={() => handleArchive(board)}
                    className="flex items-center gap-2"
                  >
                    <Archive className="h-4 w-4" />
                    Archive Board
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onSelect={() => handleDelete(board)}
                    className="flex items-center gap-2 text-red-500"
                  >
                    <Trash className="h-4 w-4" />
                    Delete Board
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenu>

            <div className="flex flex-col gap-3">
              <div className="flex gap-2 items-start">
                <Kanban className="h-4 w-4 mt-1 shrink-0" />
                <h3 className="font-medium text-gray-800 line-clamp-2 break-words">
                  {board.name}
                </h3>
              </div>

              <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">
                {board.description || "No description"}
              </p>
            </div>

            <div className="flex justify-between text-sm text-gray-600 mt-4">
              <p>
                {board.listCount === 1
                  ? `${board.listCount} list`
                  : `${board.listCount} lists`}
              </p>

              <div className="flex gap-1 items-center">
                <User className="w-4 h-4" />
                <p>{board.memberCount}</p>
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
