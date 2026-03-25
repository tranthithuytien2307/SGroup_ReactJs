import { ArrowLeft, X } from "lucide-react";
import { useState } from "react";
import type { Card } from "../../../entities/card/model/cardType";
import { useChecklistStore } from "../../../features/checklist/model/checklistStore";

export default function ChecklistPopup({
  onClose,
  onBack,
  card,
}: {
  onClose: () => void;
  onBack: () => void;
  card: Card;
}) {
  const [title, setTitle] = useState("");
  const createChecklist = useChecklistStore((state) => state.createChecklist);

  const handleAddChecklist = async () => {
    if (!title.trim()) return;

    try {
      await createChecklist(card.id, title.trim()); // store tự cập nhật
      setTitle("");
      onClose();
    } catch (error) {
      console.error("Failed to create checklist:", error);
    }
  };

  return (
    <div className="absolute top-12 left-0 w-[320px] bg-white shadow-xl rounded-lg border z-50 p-4">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <button onClick={onBack}>
          <ArrowLeft size={18} />
        </button>

        <p className="font-semibold">Thêm danh sách công việc</p>

        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          className="border rounded px-2 py-1 w-full"
          placeholder="Tiêu đề"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          onClick={handleAddChecklist}
          className="bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
        >
          Thêm
        </button>
      </div>
    </div>
  );
}
