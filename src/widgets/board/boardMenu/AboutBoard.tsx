import React from "react";
import { X, ChevronLeft, User, AlignLeft, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../shared/config/PATH";

interface AboutBoardProps {
  onClose: () => void;
  onBack: () => void;
  adminName: string;
}

const AboutBoard: React.FC<AboutBoardProps> = ({
  onClose,
  onBack,
  adminName,
}) => {
  const navigate = useNavigate();
  const handleUpdateProfile = () => {
    navigate(PATH.UPDATE_PROFILE);
  };
  return (
    <div className="fixed top-0 right-0 w-[340px] h-full bg-white shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-gray-200">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-100 rounded text-gray-500"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="font-semibold text-gray-700 text-sm">Về bảng này</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nội dung chi tiết */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Quản trị viên */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
            <User className="w-4 h-4" />
            <h3>Quản trị viên của bảng</h3>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm">
              TT
            </div>
            <div>
              <div className="font-medium text-gray-800 underline cursor-pointer hover:text-blue-700">
                {adminName}
              </div>
              <div className="text-xs text-gray-500">@tientrnththuy</div>
              <button
                className="text-xs text-gray-600 underline mt-1 block hover:text-black transition-colors"
                onClick={handleUpdateProfile}
              >
                Sửa thông tin hồ sơ
              </button>
            </div>
          </div>
        </section>

        {/* Mô tả */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
            <AlignLeft className="w-4 h-4" />
            <h3>Mô tả</h3>
          </div>
          <div className="bg-gray-100/80 p-3 rounded-lg text-sm text-gray-600 leading-relaxed border border-transparent hover:bg-gray-200/60 cursor-pointer transition-all">
            Thêm mô tả để cho đồng đội của bạn biết bảng này được sử dụng để làm
            gì. Bạn sẽ nhận được điểm thưởng nếu thêm hướng dẫn về cách cộng
            tác!
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* Quyền hạn */}
        <section className="space-y-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Các thành viên có thể...
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <MessageSquare className="w-4 h-4 text-gray-500" />
            <span>Bình luận trên các thẻ</span>
          </div>
          <button className="w-fit px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium text-gray-700 transition-all border border-gray-200 shadow-sm">
            Thay đổi quyền...
          </button>
        </section>
      </div>
    </div>
  );
};

export default AboutBoard;
