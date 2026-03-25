import { Plus } from "lucide-react";
import type { Label } from "../../../entities/label/model/labelType";

type Props = {
  labels: Label[];
  onEditLabel?: (label: Label) => void;
  onAddLabel?: () => void;
};

export default function CardLabelsSection({
  labels,
  onEditLabel,
  onAddLabel,
}: Props) {
  return (
    <div className="space-y-2">
      <p className="font-medium text-gray-700">Nhãn</p>

      <div className="flex gap-2 flex-wrap items-center">
        {labels.length === 0 ? (
          <p className="text-xs text-gray-400 italic">Chưa có nhãn</p>
        ) : (
          labels.map((l) => (
            <div
              key={l.id}
              style={{ background: l.color }}
              onClick={() => onEditLabel?.(l)}
              className="px-3 py-1.5 text-white text-xs font-medium rounded-md cursor-pointer hover:opacity-80 transition"
            >
              {l.name || "Không tên"}
            </div>
          ))
        )}

        <button
          onClick={onAddLabel}
          className="flex items-center justify-center w-8 h-7 bg-gray-100 hover:bg-gray-200 rounded-md transition"
        >
          <Plus size={14} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}
