import { useEffect, useState } from "react";
import { CheckSquare, X } from "lucide-react";

import { ChecklistItem } from "./ChecklistItem";
import { useChecklistItemStore } from "../../../features/checklistItem/model/checklistItemStore";

const EMPTY_ITEMS: any[] = [];

export function ChecklistGroup({
  ch,
  cardId,
  deleteChecklist,
  updateChecklistTitle,
}: any) {
  const [isAdding, setIsAdding] = useState(false);
  const [newItemContent, setNewItemContent] = useState("");

  const addItem = useChecklistItemStore((s) => s.addItem);
  const fetchProgress = useChecklistItemStore((s) => s.fetchProgress);
  const progress = useChecklistItemStore(
    (s) => s.progressByChecklistId[ch.id] || 0,
  );
  const items = useChecklistItemStore(
    (s) => s.itemsByChecklistId[ch.id] || EMPTY_ITEMS,
  );

  useEffect(() => {
    if (ch.id) {
      fetchProgress(ch.id);
    }
  }, [ch.id]);

  const handleAddItem = async () => {
    if (!newItemContent.trim()) return;
    await addItem(ch.id, newItemContent.trim());
    setNewItemContent("");
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 flex-1">
          <CheckSquare size={20} className="text-gray-600" />
          <input
            defaultValue={ch.title}
            onBlur={(e) => updateChecklistTitle(ch.id, cardId, e.target.value)}
            className="font-bold text-gray-700 border-none outline-none bg-transparent p-1 focus:bg-white focus:ring-2 focus:ring-blue-500 rounded w-full"
          />
        </div>
        <button
          onClick={() => deleteChecklist(ch.id, cardId)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded text-sm transition-colors"
        >
          Xóa
        </button>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500 w-8 text-right font-bold">
          {progress}%
        </span>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${progress === 100 ? "bg-green-500" : "bg-blue-500"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Items List */}
      <div className="ml-8 space-y-1">
        {items.map((item) => (
          <ChecklistItem key={item.id} item={item} checklistId={ch.id} />
        ))}

        {isAdding ? (
          <div className="mt-2 space-y-2">
            <textarea
              autoFocus
              placeholder="Thêm một mục"
              value={newItemContent}
              onChange={(e) => setNewItemContent(e.target.value)}
              className="w-full p-2 text-sm border-2 border-blue-500 rounded-md outline-none shadow-sm"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddItem}
                className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-medium"
              >
                Thêm
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="text-gray-500 hover:text-gray-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="mt-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm font-medium transition-colors"
          >
            Thêm một mục
          </button>
        )}
      </div>
    </div>
  );
}
