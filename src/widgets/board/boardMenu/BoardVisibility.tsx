import React from "react";
import {
  X,
  ChevronLeft,
  Lock,
  Users,
  Building2,
  Globe,
  Check,
} from "lucide-react";
import { useBoardStore } from "../../../features/board/model/boardStore";

type Visibility = "private" | "workspace" | "public";

interface BoardVisibilityProps {
  onClose: () => void;
  onBack: () => void;
  currentVisibility: Visibility;
}

const BoardVisibility: React.FC<BoardVisibilityProps> = ({
  onClose,
  onBack,
  currentVisibility,
}) => {
  const { currentBoard, updateBoardVisibility, loading } = useBoardStore();

  const options = [
    {
      id: "private",
      title: "Riêng tư",
      description:
        "Chỉ thành viên bảng thông tin mới có quyền xem bảng thông tin này. Quản trị viên của Không gian làm việc có thể đóng bảng thông tin hoặc xóa thành viên.",
      icon: <Lock className="w-4 h-4 text-red-500" />,
    },
    {
      id: "workspace",
      title: "Không gian làm việc",
      description:
        "Tất cả thành viên của Không gian làm việc Trello Không gian làm việc có thể xem và sửa bảng thông tin này.",
      icon: <Users className="w-4 h-4 text-gray-600" />,
    },
    {
      id: "org",
      title: "Tổ chức",
      description:
        "Tất cả thành viên của tổ chức có thể xem bảng thông tin này. Phải thêm bảng thông tin vào Không gian làm việc doanh nghiệp thì mới có thể kích hoạt chức năng này.",
      icon: <Building2 className="w-4 h-4 text-gray-400" />,
      disabled: true,
    },
    {
      id: "public",
      title: "Công khai",
      description:
        "Bất kỳ ai trên mạng internet đều có thể xem bảng thông tin này. Chỉ thành viên bảng thông tin mới có quyền sửa.",
      icon: <Globe className="w-4 h-4 text-green-600" />,
    },
  ];

  return (
    <div className="fixed top-0 right-0 w-[340px] h-full bg-white shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between px-4 h-12 border-b border-gray-200">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-100 rounded text-gray-500"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="font-semibold text-gray-700 text-sm">Khả năng xem</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {options.map((opt) => (
            <button
              key={opt.id}
              disabled={opt.disabled || loading}
              onClick={() => {
                if (opt.disabled || !currentBoard) return;

                updateBoardVisibility(currentBoard.id, opt.id as Visibility);
              }}
              className={`w-full text-left p-3 rounded-md transition-colors relative ${
                opt.disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">{opt.icon}</div>
                <div className="pr-6">
                  <div className="font-medium text-sm text-gray-800 flex items-center gap-2">
                    {opt.title}
                    {currentVisibility === opt.id && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoardVisibility;
