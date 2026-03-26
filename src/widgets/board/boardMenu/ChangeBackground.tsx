import React from "react";
import { X, ChevronLeft, Plus } from "lucide-react";

interface ChangeBackgroundProps {
  onClose: () => void;
  onBack: () => void;
  onSelectView: (view: "photos" | "colors") => void;
}

const ChangeBackground: React.FC<ChangeBackgroundProps> = ({
  onClose,
  onBack,
  onSelectView,
}) => {
  return (
    <div className="fixed top-0 right-0 w-[340px] h-full bg-white shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between px-4 h-12 border-b border-gray-200">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-100 rounded text-gray-500"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="font-semibold text-gray-700 text-sm">
          Thay đổi hình nền
        </h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {/* Lựa chọn Ảnh */}
          <div
            className="space-y-2 cursor-pointer group"
            onClick={() => onSelectView("photos")}
          >
            <div
              className="h-24 bg-cover bg-center rounded-lg shadow-sm group-hover:opacity-80 transition-opacity"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=200')",
              }}
            ></div>
            <p className="text-center text-sm text-gray-700">Ảnh</p>
          </div>
          {/* Lựa chọn Màu */}
          <div
            className="space-y-2 cursor-pointer group"
            onClick={() => onSelectView("colors")}
          >
            <div className="h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg shadow-sm group-hover:opacity-80 transition-opacity"></div>
            <p className="text-center text-sm text-gray-700">Màu</p>
          </div>
        </div>

        <hr className="border-gray-100" />

        <div>
          <h3 className="font-semibold text-gray-700 text-sm mb-3">Tuỳ chọn</h3>
          <label className="flex flex-col items-center justify-center h-32 w-full border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors group">
            <Plus className="w-8 h-8 text-gray-400 group-hover:text-gray-600" />
            <input type="file" className="hidden" accept="image/*" />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ChangeBackground;
