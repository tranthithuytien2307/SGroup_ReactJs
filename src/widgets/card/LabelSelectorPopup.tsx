import { ArrowLeft, X, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useLabelStore } from "../../features/label/model/labelStore";
import type { Label } from "../../entities/label/model/labelType";

export default function LabelSelectorPopup({
  onBack,
  onClose,
  onCreateLabel,
  boardId,
  onEditLabel,
  cardId,
}: {
  onBack: () => void;
  onClose: () => void;
  onCreateLabel: () => void;
  boardId: number;
  cardId: number;
  onEditLabel: (label: Label) => void;
}) {
  const [search, setSearch] = useState("");
  const labels = useLabelStore((state) => state.labelsByBoardId[boardId]) || [];
  const getLabelByBoardId = useLabelStore((state) => state.getLabelsByBoardId);

  const labelsOfCard =
    useLabelStore((state) => state.labelsByCardId[cardId]) || [];
  const attachLabel = useLabelStore((state) => state.attachLabelsToCard);
  const detachLabel = useLabelStore((state) => state.detachLabelsFromCard);
  const isChecked = (id: number) => labelsOfCard.some((l) => l.id === id);
  const toggle = async (label: Label) => {
    if (isChecked(label.id)) {
      await detachLabel(cardId, [label.id]);
    } else {
      await attachLabel(cardId, [label]);
    }
  };

  const filtered = labels.filter((l) =>
    (l.name || "").toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    if (!labels.length) {
      getLabelByBoardId(boardId);
    }
  }, [boardId]);

  return (
    <div className="absolute top-12 left-0 w-[320px] bg-white shadow-xl rounded-lg border z-999">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <button onClick={onBack}>
          <ArrowLeft size={18} />
        </button>

        <p className="font-medium">Nhãn</p>

        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="p-3">
        <input
          placeholder="Tìm nhãn..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded px-2 py-2 text-sm"
        />
      </div>

      {/* LABEL LIST */}
      <div className="px-3 space-y-2 max-h-[300px] overflow-y-auto">
        <p className="text-xs text-gray-500">Nhãn</p>

        {filtered.map((label) => (
          <div key={label.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isChecked(label.id)}
              onChange={() => toggle(label)}
            />

            <div
              style={{ background: label.color }}
              className="flex-1 px-3 py-2 rounded text-sm text-black flex justify-between items-center"
            >
              {label.name}

              <Pencil
                size={14}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditLabel(label);
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-3">
        <button
          className="w-full bg-gray-100 hover:bg-gray-200 rounded py-2 text-sm"
          onClick={onCreateLabel}
        >
          Tạo nhãn mới
        </button>
      </div>
    </div>
  );
}
