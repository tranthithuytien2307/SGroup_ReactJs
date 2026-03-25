import { Check } from "lucide-react";

const COLORS = [
  "#A8D5BA",
  "#E6D67A",
  "#EAD39C",
  "#E8B7B1",
  "#CBB8D9",
  "#52C49F",
  "#F2D024",
  "#FFA500",
  "#F06A5F",
  "#B075E6",
  "#2E8B57",
  "#A67C00",
  "#C65D00",
  "#C0392B",
  "#8E44AD",
  "#B0C4DE",
  "#A7C7D7",
  "#C5DCA0",
  "#E1B6CE",
  "#C0C0C0",
  "#5F8DD6",
  "#6FB1C7",
  "#8BC34A",
  "#D96BAF",
  "#9AA0A6",
  "#2F6FCC",
  "#2F7F95",
  "#5A7F24",
  "#A64D79",
  "#6B6F75",
];

export default function LabelForm({
  title,
  onChangeTitle,
  selectedColor,
  onSelectColor,
}: {
  title: string;
  onChangeTitle: (val: string) => void;
  selectedColor: string | null;
  onSelectColor: (color: string) => void;
}) {
  return (
    <>
      {/* Preview */}
      <div className="p-4">
        <div
          className="h-10 rounded border"
          style={{ background: selectedColor || "transparent" }}
        />
      </div>

      {/* Title */}
      <div className="px-4">
        <p className="text-xs text-gray-500 mb-1">Tiêu đề</p>
        <input
          value={title}
          onChange={(e) => onChangeTitle(e.target.value)}
          className="w-full border rounded px-2 py-2 text-sm"
        />
      </div>

      {/* Colors */}
      <div className="p-4 grid grid-cols-5 gap-2">
        {COLORS.map((color, index) => (
          <div
            key={index}
            onClick={() => onSelectColor(color)}
            className={`h-8 rounded cursor-pointer flex items-center justify-center ${
              selectedColor === color ? "ring-2 ring-blue-500" : ""
            }`}
            style={{ background: color }}
          >
            {selectedColor === color && (
              <Check size={14} className="text-white" />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
