import { useEffect, useRef, useState } from "react";
import { useListStore } from "../../features/list/model/listStore";

type Props = {
  initialTitle: string;
  onClose: () => void;
  listId: number;
};

export default function CopyListModal({
  initialTitle,
  onClose,
  listId,
}: Props) {
  const [title, setTitle] = useState(initialTitle + " (copy)");
  const inputRef = useRef<HTMLInputElement>(null);
  const copyList = useListStore((state) => state.copyList);

  const handleCopyList = async () => {
    if (!title.trim()) return;
    await copyList(listId, title.trim());
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="absolute left-full top-10 ml-2 z-[60] w-72 rounded-xl border bg-white shadow-xl">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <span className="text-sm font-semibold text-gray-700">
          Sao chép danh sách
        </span>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100"
        >
          ✕
        </button>
      </div>

      <div className="p-4 space-y-3">
        <label className="text-xs text-gray-500">Tên</label>

        <input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={() => {
            if (!title.trim()) return;
            handleCopyList();
            onClose();
          }}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
        >
          Tạo danh sách
        </button>
      </div>
    </div>
  );
}
