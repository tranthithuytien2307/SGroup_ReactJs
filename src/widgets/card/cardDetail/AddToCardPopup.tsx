import { Tag, Clock, CheckSquare, User, X } from "lucide-react";

export default function AddToCardPopup({
  onClose,
  onOpenLabels,
  onOpenDate,
  onOpenChecklist,
}: {
  onClose: () => void;
  onOpenLabels: () => void;
  onOpenDate: () => void;
  onOpenChecklist: () => void;
}) {
  return (
    <div className="absolute top-12 left-0 w-[320px] bg-white shadow-xl rounded-lg border z-50">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <p className="font-medium">Thêm vào thẻ</p>

        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      {/* ITEMS */}
      <div className="py-2">
        <button
          className="popup-item"
          onClick={() => {
            onClose();
            onOpenLabels();
          }}
        >
          <Tag size={18} />

          <div className="text-left">
            <p className="font-medium text-sm">Nhãn</p>
            <p className="text-xs text-gray-500">
              Sắp xếp, phân loại và ưu tiên
            </p>
          </div>
        </button>

        <button
          className="popup-item"
          onClick={() => {
            onClose();
            onOpenDate();
          }}
        >
          <Clock size={18} />

          <div className="text-left">
            <p className="font-medium text-sm">Ngày</p>
            <p className="text-xs text-gray-500">
              Ngày bắt đầu, ngày hết hạn và lời nhắc
            </p>
          </div>
        </button>

        <button
          className="popup-item"
          onClick={() => {
            onClose();
            onOpenChecklist();
          }}
        >
          <CheckSquare size={18} />
          <div className="text-left">
            <p className="font-medium text-sm">Việc cần làm</p>
            <p className="text-xs text-gray-500">Thêm tác vụ con</p>
          </div>
        </button>

        <button className="popup-item">
          <User size={18} />

          <div className="text-left">
            <p className="font-medium text-sm">Thành viên</p>
            <p className="text-xs text-gray-500">Chỉ định thành viên</p>
          </div>
        </button>
      </div>
    </div>
  );
}
