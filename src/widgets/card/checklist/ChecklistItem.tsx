import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { useChecklistItemStore } from "../../../features/checklistItem/model/checklistItemStore";

export function ChecklistItem({
  item,
  checklistId,
}: {
  item: any;
  checklistId: number;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(item.content);
  const { toggleItem, updateItem, deleteItem } = useChecklistItemStore();

  const handleUpdate = async () => {
    if (content.trim() !== item.content) {
      await updateItem(checklistId, item.id, content.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="group flex items-start gap-3 py-1 px-2 rounded-md hover:bg-gray-50 transition-colors">
      <input
        type="checkbox"
        checked={item.is_completed}
        onChange={(e) => toggleItem(checklistId, item.id, e.target.checked)}
        className="mt-1.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
      />

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              autoFocus
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 text-sm border-2 border-blue-500 rounded-md outline-none bg-white shadow-inner"
              onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
            />
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium"
              >
                Lưu
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-500 p-1"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center w-full">
            <span
              onClick={() => setIsEditing(true)}
              className={`text-sm cursor-pointer break-words flex-1 ${item.is_completed ? "line-through text-gray-400" : "text-gray-700"}`}
            >
              {item.content}
            </span>
            <button
              onClick={() => deleteItem(checklistId, item.id)}
              className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
