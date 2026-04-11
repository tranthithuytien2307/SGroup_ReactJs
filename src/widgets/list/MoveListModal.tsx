import { useEffect, useMemo, useState } from "react";
import { useBoardStore } from "../../features/board/model/boardStore";
import { useListStore } from "../../features/list/model/listStore";
import { listAPI } from "../../entities/list/api/listAPI";

type Props = {
  onClose: () => void;
  onBack: () => void;
  listId: number;
};

export default function MoveListModal({ onClose, onBack, listId }: Props) {
  const boards = useBoardStore((s) => s.boards);
  const getBoardsByUser = useBoardStore((s) => s.getBoardsByUser);

  const moveList = useListStore((s) => s.moveList);

  const [selectedBoard, setSelectedBoard] = useState<number>();
  const [listsInBoard, setListsInBoard] = useState<any[]>([]);
  const [selectedPos, setSelectedPos] = useState(1);

  useEffect(() => {
    getBoardsByUser();
  }, []);

  useEffect(() => {
    if (boards.length > 0 && !selectedBoard) {
      setSelectedBoard(boards[0].id);
    }
  }, [boards]);

  useEffect(() => {
    const fetchLists = async () => {
      if (!selectedBoard) return;

      try {
        const res = await listAPI.getListsByBoardId(selectedBoard);
        const lists = res.data.responseObject || [];

        const sorted = lists.sort((a: any, b: any) => a.position - b.position);

        setListsInBoard(sorted);
        setSelectedPos(sorted.length + 1);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLists();
  }, [selectedBoard]);

  const positions = useMemo(() => {
    return Array.from({ length: listsInBoard.length + 1 }, (_, i) => i + 1);
  }, [listsInBoard]);

  const handleMove = async () => {
    if (!selectedBoard) return;

    await moveList(listId, selectedBoard, selectedPos - 1);

    onClose();
  };

  return (
    <div className="absolute right-0 top-10 z-50 w-80 translate-x-full ml-2 rounded-xl border bg-white shadow-xl">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <button
          onClick={onBack}
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100"
        >
          ←
        </button>

        <span className="text-sm font-semibold text-gray-700">
          Di chuyển danh sách
        </span>

        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100"
        >
          ✕
        </button>
      </div>

      <div className="p-4 space-y-4 text-sm">
        <div>
          <label className="block mb-1 text-gray-600">Bảng thông tin</label>

          <select
            value={selectedBoard}
            onChange={(e) => setSelectedBoard(Number(e.target.value))}
            className="w-full border rounded-md px-3 py-2 truncate"
          >
            {boards.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name.length > 40 ? b.name.slice(0, 40) + "..." : b.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-gray-600">Vị trí</label>

          <select
            value={selectedPos}
            onChange={(e) => setSelectedPos(Number(e.target.value))}
            className="w-full border rounded-md px-3 py-2"
          >
            {positions.map((p) => (
              <option key={p} value={p}>
                Vị trí {p}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleMove}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Di chuyển
        </button>
      </div>
    </div>
  );
}
