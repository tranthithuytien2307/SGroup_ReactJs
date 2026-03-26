import React, { useRef } from "react";
import { X, ChevronLeft, Search, Plus } from "lucide-react";
import { useBoardStore } from "../../../features/board/model/boardStore";

const BackgroundPhotos: React.FC<{
  onClose: () => void;
  onBack: () => void;
  boardId: number;
}> = ({ onClose, onBack, boardId }) => {
  const { updateBackgroundFile, loading } = useBoardStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await updateBackgroundFile(boardId, file);
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
        <h2 className="font-semibold text-gray-700 text-sm">Ảnh</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div
        className={`p-3 flex-1 overflow-y-auto ${loading ? "opacity-50 pointer-events-none" : ""}`}
      >
        {/* Nút tải ảnh lên từ máy tính */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full mb-4 flex items-center justify-center gap-2 p-3 bg-gray-100 hover:bg-gray-200 rounded-md border-2 border-dashed border-gray-300 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Tải ảnh lên</span>
        </button>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
            placeholder="Tìm ảnh..."
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {Array(6)
            .fill(
              "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=150",
            )
            .map((url, i) => (
              <div
                key={i}
                className="h-20 bg-gray-200 rounded-md bg-cover bg-center cursor-pointer"
                style={{ backgroundImage: `url(${url})` }}
              ></div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BackgroundPhotos;
