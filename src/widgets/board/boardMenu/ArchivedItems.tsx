import React, { useEffect, useMemo, useState } from "react";
import { X, ChevronLeft, Archive as ArchiveIcon } from "lucide-react";
import { useBoardStore } from "../../../features/board/model/boardStore";
import { unarchiveCard } from "../../../features/card/model/unarchiveCard";
import { useListStore } from "../../../features/list/model/listStore";
import { useCardStore } from "../../../features/card/model/cardStore";
import { getListByBoardId } from "../../../features/list/model/getListByBoardId";
import type { List } from "../../../entities/list/model/listType";

interface ArchivedItemsProps {
  onClose: () => void;
  onBack: () => void;
  boardId: number;
}

type ArchivedItem = {
  id: number;
  title: string;
  type: "card" | "list";
  archived_at?: string;
};

const ArchivedItems: React.FC<ArchivedItemsProps> = ({
  onClose,
  onBack,
  boardId,
}) => {
  const archived = useBoardStore((s) => s.archivedItems);
  const getArchived = useBoardStore((s) => s.getBoardArchived);
  const setLists = useListStore((s) => s.setLists);
  const setCards = useCardStore((s) => s.setCards);
  const unarchiveList = useListStore((s) => s.unarchiveList);
  const deleteList = useListStore((s) => s.deleteList);
  const deleteCard = useCardStore((s) => s.deleteCard);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (boardId) {
      getArchived(boardId);
    }
  }, [boardId]);

  const items: ArchivedItem[] = useMemo(() => {
    const listItems: ArchivedItem[] =
      archived?.lists?.map((l) => ({
        id: l.id,
        title: l.name,
        type: "list" as const,
        archived_at: l.archived_at ?? undefined,
      })) || [];

    const cardItems: ArchivedItem[] =
      archived?.cards?.map((c) => ({
        id: c.id,
        title: c.title,
        type: "card" as const,
        archived_at: c.archived_at ?? undefined,
      })) || [];

    return [...listItems, ...cardItems];
  }, [archived]);

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleRestore = async (item: ArchivedItem) => {
    try {
      if (item.type === "card") {
        await unarchiveCard(item.id);
      } else {
        await unarchiveList(item.id);
      }
      const listData: List[] = await getListByBoardId(boardId);

      setLists(listData);

      const allCards = listData.flatMap((l) => l.cards || []);
      setCards(allCards);

      await getArchived(boardId);
    } catch (error) {
      console.error("Restore failed:", error);
    }
  };

  const handleDelete = async (item: ArchivedItem) => {
    try {
      if (item.type === "card") {
        await deleteCard(item.id);
      } else {
        await deleteList(item.id);
      }
      await getArchived(boardId);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="fixed top-0 right-0 w-[340px] h-full bg-white shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between px-4 h-12 border-b border-gray-200">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-100 rounded border border-gray-200"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="font-semibold text-gray-700 text-sm">Mục đã lưu trữ</h2>

        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {filteredItems.length === 0 && (
          <p className="text-sm text-gray-500 text-center mt-10">
            Không có mục lưu trữ
          </p>
        )}

        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div key={`${item.type}-${item.id}`}>
              <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:border-blue-400 cursor-pointer group transition">
                <span className="text-sm text-gray-700">{item.title}</span>

                <div className="flex items-center gap-2 mt-2 text-gray-500">
                  <ArchiveIcon className="w-3.5 h-3.5" />
                  <span className="text-xs">
                    {item.type === "card"
                      ? "Thẻ đã lưu trữ"
                      : "Danh sách đã lưu trữ"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 text-xs text-gray-600 mt-1 px-1">
                <button
                  className="hover:underline"
                  onClick={() => handleRestore(item)}
                >
                  Khôi phục
                </button>

                <span>•</span>

                <button
                  className="hover:underline text-red-600"
                  onClick={() => handleDelete(item)}
                >
                  Xoá
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArchivedItems;
