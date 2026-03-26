import React from "react";
import { X, ChevronLeft, Check } from "lucide-react";

interface BoardSettingsProps {
  onClose: () => void;
  onBack: () => void;
}

const BoardSettings: React.FC<BoardSettingsProps> = ({ onClose, onBack }) => {
  return (
    <div className="fixed top-0 right-0 w-[340px] h-full bg-white shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-gray-200">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-100 rounded text-gray-500 border border-black shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="font-semibold text-gray-700 text-sm">Cài đặt</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Không gian làm việc */}
        <section className="space-y-1">
          <h3 className="font-bold text-gray-800 text-sm">
            Không gian làm việc
          </h3>
          <p className="text-sm text-gray-600">Trello Không gian làm việc</p>
        </section>

        {/* Quyền hạn */}
        <section className="space-y-4">
          <h3 className="font-bold text-gray-800 text-sm">Quyền</h3>

          <SettingItem title="Nhận xét" subtitle="Thành viên" isHighlight />

          <SettingItem title="Thêm và xóa thành viên" subtitle="Thành viên" />

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">
                Chỉnh sửa Không gian làm việc
              </span>
              <Check className="w-4 h-4 text-gray-700" />
            </div>
            <p className="text-xs text-gray-500">
              Mọi thành viên của Không gian làm việc đều có thể chỉnh sửa và
              tham gia vào bảng này.
            </p>
          </div>
        </section>

        {/* Trạng thái hoàn tất */}
        <section className="space-y-2">
          <h3 className="font-bold text-gray-800 text-sm">
            Trạng thái hoàn tất
          </h3>
          <div className="space-y-1">
            <p className="text-sm text-gray-700">
              Hiển thị trạng thái hoàn tất ở mặt trước thẻ
            </p>
            <Check className="w-4 h-4 text-gray-700" />
          </div>
        </section>

        {/* Ảnh bìa */}
        <section className="space-y-2">
          <h3 className="font-bold text-gray-800 text-sm">Ảnh bìa</h3>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-700 font-medium">
                Đã bật ảnh bìa thẻ
              </span>
              <Check className="w-4 h-4 text-gray-700" />
            </div>
            <p className="text-xs text-gray-500">
              Hiển thị tệp đính kèm hình ảnh và màu sắc ở mặt trước của thẻ.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

const SettingItem = ({ title, subtitle, isHighlight }: any) => (
  <div
    className={`p-2 rounded-md transition-colors cursor-pointer ${isHighlight ? "bg-gray-100/80" : "hover:bg-gray-50"}`}
  >
    <div className="text-sm font-medium text-gray-800">{title}</div>
    <div className="text-xs text-gray-500 mt-0.5">{subtitle}</div>
  </div>
);

export default BoardSettings;
