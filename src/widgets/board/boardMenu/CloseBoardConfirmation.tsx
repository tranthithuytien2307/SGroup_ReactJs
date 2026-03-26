import React from "react";
import { X, ChevronLeft } from "lucide-react";

const CloseBoardConfirmation: React.FC<{
  onClose: () => void;
  onBack: () => void;
}> = ({ onClose, onBack }) => {
  return (
    <div className="fixed top-0 right-0 w-[340px] h-full bg-[#f1f2f4] shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header tương tự các màn hình khác */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-gray-200 bg-white">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-100 rounded border border-gray-200 shadow-sm"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="font-semibold text-gray-700 text-sm">Đóng bảng?</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-3">
        {/* Khung nội dung màu trắng giống ảnh mẫu */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Bạn có thể tìm và mở lại các bảng đã đóng ở cuối{" "}
            <a href="#" className="text-blue-600 underline hover:text-blue-800">
              trang các bảng của bạn
            </a>
            .
          </p>

          <button
            className="w-full bg-[#ae2e24] hover:bg-[#c9372c] text-white font-medium py-2 rounded transition-colors"
            onClick={() => {
              console.log("Xử lý đóng bảng tại đây...");
              // Thường sẽ gọi API xong rồi điều hướng về trang chủ
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloseBoardConfirmation;
