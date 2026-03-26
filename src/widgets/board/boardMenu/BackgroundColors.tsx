import React from "react";
import { Check, ChevronLeft, X } from "lucide-react";
import { useBoardStore } from "../../../features/board/model/boardStore";

const BackgroundColors: React.FC<{
  onClose: () => void;
  onBack: () => void;
  boardId: number;
}> = ({ onClose, onBack, boardId }) => {
  const { currentBoard, updateBackgroundTheme, loading } = useBoardStore();

  const gradients = [
    "linear-gradient(to bottom right, #0079bf, #519839)",
    "linear-gradient(to bottom right, #d29034, #b04632)",
    "linear-gradient(to bottom right, #89609e, #cd5a91)",
    "linear-gradient(to bottom right, #4bbf6b, #00aecc)",
    "linear-gradient(to bottom right, #61bd4f, #f2d600)",
    "linear-gradient(to bottom right, #ff78cb, #ffeb3b)",
  ];

  const solidColors = [
    "#0079bf",
    "#d29034",
    "#519839",
    "#b04632",
    "#89609e",
    "#cd5a91",
    "#4bbf6b",
    "#00aecc",
    "#838c91",
  ];

  const handleSelectColor = async (color: string) => {
    try {
      await updateBackgroundTheme(boardId, color);
    } catch (error) {
      alert("Cập nhật màu nền thất bại");
    }
  };

  return (
    <div className="fixed top-0 right-0 w-[340px] h-full bg-white shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between px-4 h-12 border-b border-gray-200">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-100 rounded text-gray-500"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="font-semibold text-gray-700 text-sm">Màu sắc</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div
        className={`p-3 flex-1 overflow-y-auto space-y-4 ${loading ? "opacity-70 pointer-events-none" : ""}`}
      >
        <div className="grid grid-cols-2 gap-2">
          {gradients.map((grad, i) => (
            <div
              key={i}
              style={{ background: grad }}
              className="h-20 rounded-md cursor-pointer flex items-center justify-center text-white hover:opacity-90"
              onClick={() => handleSelectColor(grad)}
            >
              {currentBoard?.theme === grad && (
                <Check className="w-6 h-6 drop-shadow-md" />
              )}
            </div>
          ))}
        </div>

        <hr className="border-gray-100" />

        <div className="grid grid-cols-3 gap-2 pb-4">
          {solidColors.map((color, i) => (
            <div
              key={i}
              style={{ backgroundColor: color }}
              className="h-10 rounded-md cursor-pointer flex items-center justify-center text-white border border-black/5"
              onClick={() => handleSelectColor(color)}
            >
              {currentBoard?.theme === color && <Check className="w-4 h-4" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BackgroundColors;
