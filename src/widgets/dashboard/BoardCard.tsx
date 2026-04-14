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
import toast from "react-hot-toast";
import { useBoardStore } from "../../features/board/model/boardStore";

type BoardCardProps = {
  workspace_id: number;
};

export default function BoardCard({ workspace_id }: BoardCardProps) {
  const { workspace, updateBoard } = useWorkspace();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const navigate = useNavigate();
  const boards = useBoardStore((state) => state.boards);
  const setBoards = useBoardStore((state) => state.setBoards);
  const getBoardsByWorkspace = useBoardStore(
    (state) => state.getBoardsByWorkspace,
  );
  const archiveBoardStore = useBoardStore((state) => state.archiveBoard);
  const deleteBoardStore = useBoardStore((state) => state.deleteBoard);

  useEffect(() => {
    if (!workspace?.id) return;
    getBoardsByWorkspace(workspace.id);
  }, [workspace?.id]);

  const handleEdit = (board: Board) => {
    setSelectedBoard(board);
    setEditModalOpen(true);
  };

  const handleEditSave = async (data: {
    name: string;
    description?: string;
    cover_url?: string;
    theme?: string;
  }) => {
    if (!selectedBoard) return;

    try {
      await updateBoard(selectedBoard.id, {
        ...data,
        cover_url: undefined,
        theme: undefined,
      });

      setBoards((prev) =>
        prev.map((b) =>
          b.id === selectedBoard.id
            ? { ...b, name: data.name, description: data.description }
            : b,
        ),
      );

      toast.success("Board updated successfully");
      setEditModalOpen(false);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || "Update failed";

      toast.error(message);
    }
  };

  const handleOnBoardDetail = (id: number) => {
    navigate(PATH.BOARDPAGE(id));
  };

  const handleArchive = async (board: Board) => {
    if (!confirm(`Archive "${board.name}"?`)) return;

    try {
      await archiveBoardStore(board.id);

      setBoards((prev) => prev.filter((b) => b.id !== board.id));

      toast.success("Board archived successfully");
    } catch (error) {
      toast.error("Failed to archive board");
    }
  };

  const handleDelete = async (board: Board) => {
    if (!confirm(`Delete "${board.name}"?`)) return;

    try {
      await deleteBoardStore(board.id);

      toast.success("Board deleted successfully");
    } catch (error) {
      toast.error("Failed to delete board");
    }
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
        <div key={board.id}>
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
                  onClick={(e) => e.stopPropagation()}
                  className="
                    absolute top-2 right-2 
                    opacity-0 group-hover:opacity-100
                    pointer-events-none group-hover:pointer-events-auto
                    p-2 rounded-md
                    hover:bg-gray-100
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
                  sideOffset={8}
                  className="
                    z-50 w-48
                    rounded-xl
                    border border-gray-200
                    bg-white
                    shadow-lg
                    p-1.5
                  "
                >
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.stopPropagation();
                      handleEdit(board);
                    }}
                    className="
                      flex items-center gap-3
                      px-3 py-2
                      rounded-md
                      cursor-pointer
                      text-sm text-gray-700
                      hover:bg-gray-100
                      transition
                    "
                  >
                    <SquarePen className="h-4 w-4 text-gray-500" />
                    <span>Edit Board</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.stopPropagation();
                      handleArchive(board);
                    }}
                    className="
                      flex items-center gap-3
                      px-3 py-2
                      rounded-md
                      cursor-pointer
                      text-sm text-gray-700
                      hover:bg-gray-100
                      transition
                    "
                  >
                    <Archive className="h-4 w-4 text-gray-500" />
                    <span>Archive Board</span>
                  </DropdownMenuItem>

                  <div className="my-1 border-t border-gray-200" />

                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.stopPropagation();
                      handleDelete(board);
                    }}
                    className="
                      flex items-center gap-3
                      px-3 py-2
                      rounded-md
                      cursor-pointer
                      text-sm text-red-600
                      hover:bg-red-50
                      transition
                    "
                  >
                    <Trash className="h-4 w-4" />
                    <span>Delete Board</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenu>

            <div
              className="flex flex-col gap-3 cursor-pointer"
              onClick={() => handleOnBoardDetail(board.id)}
            >
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

            <div
              onClick={() => handleOnBoardDetail(board.id)}
              className="flex justify-between text-sm text-gray-600 mt-4"
            >
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
