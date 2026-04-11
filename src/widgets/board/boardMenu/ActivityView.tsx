import React, { useState } from "react";
import { X, ChevronLeft, Smile } from "lucide-react";

interface ActivityItem {
  id: number;
  userInitials: string;
  userName: string;
  type: "action" | "comment";
  content?: string; // Dành cho bình luận
  actionText?: string; // Dành cho thao tác hệ thống
  targetCard?: string;
  time: string;
  avatarColor: string;
}

const ActivityView: React.FC<{ onClose: () => void; onBack: () => void }> = ({
  onClose,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "comments">("all");


  const data: ActivityItem[] = [
    {
      id: 1,
      userInitials: "TT",
      userName: "Tiên Trần Thị Thúy",
      type: "action",
      actionText: "đã thêm danh sách công việc checklist 2 vào thẻ",
      targetCard: "Gửi ảnh cho BE",
      time: "21:26 23 thg 3, 2026",
      avatarColor: "bg-blue-600",
    },
    {
      id: 2,
      userInitials: "NL",
      userName: "Nguyễn Châu Linh",
      type: "comment",
      content: "get all booking",
      targetCard: "api số lượng xe đăng ký chỗ trước",
      time: "18:05 3 thg 12, 2025",
      avatarColor: "bg-emerald-600",
    },
    {
      id: 3,
      userInitials: "NL",
      userName: "Nguyễn Châu Linh",
      type: "comment",
      content: "revenueYear",
      targetCard: "api doanh thu tháng này",
      time: "18:04 3 thg 12, 2025",
      avatarColor: "bg-emerald-600",
    },
  ];

  const filteredData =
    activeTab === "all" ? data : data.filter((item) => item.type === "comment");

  return (
    <div className="fixed top-0 right-0 w-[340px] h-full bg-white shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between px-4 h-12 border-b border-gray-200">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-100 rounded border border-gray-200 shadow-sm"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="font-semibold text-gray-700 text-sm">Hoạt động</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex px-4 pt-3 border-b border-gray-100 gap-2">
        <button
          onClick={() => setActiveTab("all")}
          className={`pb-2 px-2 text-sm font-medium transition-all relative ${
            activeTab === "all"
              ? "text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Tất cả
          {activeTab === "all" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("comments")}
          className={`pb-2 px-2 text-sm font-medium transition-all relative ${
            activeTab === "comments"
              ? "text-blue-600 border border-blue-600 rounded-md bg-blue-50/50"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Bình luận
          {activeTab === "comments" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {filteredData.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div
              className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold ${item.avatarColor}`}
            >
              {item.userInitials}
            </div>

            <div className="flex-1">
              <div className="text-sm text-gray-800">
                <span className="font-bold hover:underline cursor-pointer">
                  {item.userName}
                </span>{" "}
                {item.type === "action" ? (
                  <>
                    {item.actionText}{" "}
                    <span className="text-blue-600 hover:underline cursor-pointer">
                      {item.targetCard}
                    </span>
                  </>
                ) : (
                  <>
                    ở{" "}
                    <span className="text-blue-600 hover:underline cursor-pointer">
                      {item.targetCard}
                    </span>
                  </>
                )}
              </div>

              <div className="text-[11px] text-gray-500 mt-0.5 hover:underline cursor-pointer">
                {item.time}
              </div>

              {item.type === "comment" && (
                <div className="mt-2">
                  <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm text-sm text-gray-700 break-words">
                    {item.content}
                  </div>
                  <div className="flex items-center gap-2 mt-1 px-1">
                    <Smile className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-600" />
                    <span className="text-[11px] text-gray-400">•</span>
                    <button className="text-[11px] text-gray-500 hover:underline">
                      Xoá
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityView;
