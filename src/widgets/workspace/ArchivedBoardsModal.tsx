import { useBoardStore } from "../../features/board/model/boardStore";
import LoadingSpinner from "../../shared/ui/LoadingSpinner";
import toast from "react-hot-toast";

interface Board {
  id: number;
  name: string;
}

interface ArchivedBoardsModalProps {
  open: boolean;
  onClose: () => void;
  boards: Board[];
  loading: boolean;
  onOpenBoard: (id: number) => void;
}

export default function ArchivedBoardsModal({
  open,
  onClose,
  boards,
  loading,
  onOpenBoard,
}: ArchivedBoardsModalProps) {
  if (!open) return null;
  const unarchiveBoard = useBoardStore((state) => state.unarchiveBoard);

  const handleUnarchiveBoard = (id: number) => async () => {
    if (!id) return;

    const toastId = toast.loading("Restoring board...");

    try {
      await unarchiveBoard(id);

      toast.success("Board restored successfully", { id: toastId });

      onClose();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to restore board";

      toast.error(message, { id: toastId });

      console.error("Unarchive failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-[400px] max-h-[500px] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Archived Boards</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex flex-col gap-2">
          {loading && <LoadingSpinner />}

          {!loading && boards.length === 0 && (
            <p className="text-sm text-gray-500 italic">No archived boards</p>
          )}

          {!loading &&
            boards.map((board) => (
              <div
                key={board.id}
                className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100"
              >
                <span className="text-sm">{board.name}</span>

                <button
                  className="text-xs text-blue-600 hover:underline"
                  onClick={handleUnarchiveBoard(board.id)}
                >
                  Restore
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
