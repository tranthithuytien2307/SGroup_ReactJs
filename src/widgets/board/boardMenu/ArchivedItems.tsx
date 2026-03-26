import React from "react";
import { X, ChevronLeft, Archive as ArchiveIcon } from "lucide-react";

interface ArchivedItemsProps {
  onClose: () => void;
  onBack: () => void;
}

const ArchivedItems: React.FC<ArchivedItemsProps> = ({ onClose, onBack }) => {
  const archivedData = [
    { id: 1, title: "thêm theo dõi ca trực", timeGroup: "Cũ hơn 14 ngày" },
    {
      id: 2,
      title:
        "gửi frame liên tục 3-5 lần liên tục thì dừng ko lấy nữa, thanh toán trực, 2 cam",
      completed: true,
    },
  ];

  return (
    <div className="fixed top-0 right-0 w-[340px] h-full bg-white shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-gray-200">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-100 rounded border border-gray-200"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="font-semibold text-gray-700 text-sm">Mục đã lưu trữ</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
        {/* Search Bar & Switcher */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded text-sm font-medium">
            Danh sách
          </button>
        </div>

        {/* List Items */}
        <div className="space-y-6">
          <div className="text-xs font-bold text-gray-600">Cũ hơn 14 ngày</div>

          {archivedData.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:border-blue-400 cursor-pointer group">
                <div className="flex items-start gap-2">
                  {item.completed && (
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-1 border-l-2 border-b-2 border-white -rotate-45 mb-0.5"></div>
                    </div>
                  )}
                  <span className="text-sm text-gray-700 leading-tight flex-1">
                    {item.title}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-3 text-gray-500">
                  <ArchiveIcon className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Đã lưu trữ</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-1 text-xs text-gray-600">
                <button className="hover:underline">Khôi phục</button>
                <span>•</span>
                <button className="hover:underline text-red-600">Xoá</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArchivedItems;
