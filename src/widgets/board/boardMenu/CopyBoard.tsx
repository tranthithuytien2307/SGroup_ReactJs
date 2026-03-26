import React, { useState } from "react";
import { X, ChevronLeft, Users } from "lucide-react";

const CopyBoard: React.FC<{ onClose: () => void; onBack: () => void }> = ({
  onClose,
  onBack,
}) => {
  const [title, setTitle] = useState("");

  return (
    <div className="fixed top-0 right-0 w-[340px] h-full bg-white shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-gray-200">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-100 rounded border border-gray-200 shadow-sm"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="font-semibold text-gray-700 text-sm">
          Sao chép bảng thông tin
        </h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-4 text-sm">
        {/* Tiêu đề */}
        <div className="space-y-1.5">
          <label className="font-bold text-gray-700">Tiêu đề</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="“Xuất bản lịch” chẳng hạn..."
            className="w-full border-2 border-gray-200 rounded px-3 py-2 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        {/* Không gian làm việc */}
        <div className="space-y-1.5">
          <label className="font-bold text-gray-700">Không gian làm việc</label>
          <select className="w-full border-2 border-gray-200 rounded px-3 py-2 bg-gray-50 outline-none focus:border-blue-500">
            <option>Trello Không gian làm việc</option>
          </select>
        </div>

        {/* Thông báo chế độ hiển thị */}
        <div className="flex gap-3 py-2">
          <Users className="w-5 h-5 text-gray-500 mt-1" />
          <div className="text-gray-700 leading-snug">
            Bảng mới này sẽ{" "}
            <span className="font-bold">
              hiển thị trong Không gian làm việc.
            </span>{" "}
            <button className="text-blue-600 underline block mt-1">
              Thay đổi chế độ hiển thị bảng
            </button>
          </div>
        </div>

        {/* Checkbox Options */}
        <div className="space-y-3 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 accent-blue-600"
            />
            <span className="text-gray-700 font-medium">Giữ các thẻ</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 accent-blue-600"
            />
            <span className="text-gray-700 font-medium">Giữ các thẻ mẫu</span>
          </label>
        </div>

        {/* Ghi chú */}
        <p className="text-gray-600 leading-relaxed pt-2">
          Hoạt động, nhận xét và các thành viên sẽ không được sao chép sang bảng
          thông tin mới.
        </p>

        {/* Nút Tạo mới */}
        <button
          disabled={!title}
          className={`w-24 py-2 rounded font-medium transition-colors ${
            title
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Tạo mới
        </button>
      </div>
    </div>
  );
};

export default CopyBoard;
