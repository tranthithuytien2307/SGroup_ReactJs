import React, { useEffect, useState } from "react";
import {
  X,
  UserPlus,
  Info,
  Eye,
  Settings,
  Image,
  Zap,
  Tag,
  Smile,
  Activity,
  Archive,
  Radio,
  Copy,
  LogOut,
} from "lucide-react";
import AboutBoard from "./boardMenu/AboutBoard";
import BoardVisibility from "./boardMenu/BoardVisibility";
import BoardSettings from "./boardMenu/BoardSettings";
import ChangeBackground from "./boardMenu/ChangeBackground";
import BackgroundColors from "./boardMenu/BackgroundColors";
import BackgroundPhotos from "./boardMenu/BackgroundPhotos";
import LabelSelectorPopup from "../card/LabelSelectorPopup";
import StickerSelector from "./boardMenu/StickerSelector";
import ActivityView from "./boardMenu/ActivityView";
import ArchivedItems from "./boardMenu/ArchivedItems";
import CopyBoard from "./boardMenu/CopyBoard";
import CloseBoardConfirmation from "./boardMenu/CloseBoardConfirmation";
import { useBoardStore } from "../../features/board/model/boardStore";
import CreateLabelPopup from "../card/label/CreateLabelPopup";
import { useLabelStore } from "../../features/label/model/labelStore";
import toast from "react-hot-toast";

interface BoardMenuProps {
  onClose: () => void;
  boardMember: any[];
  boardId: number;
}

const BoardMenu: React.FC<BoardMenuProps> = ({
  onClose,
  boardMember,
  boardId,
}) => {
  const { boardCreator, getBoardCreator, currentBoard, getBoardDetail } =
    useBoardStore();
  const [openCreateLabel, setOpenCreateLabel] = useState(false);
  const [titleLabel, setTitleLabel] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  useEffect(() => {
    if (boardId) {
      getBoardCreator(boardId);
      getBoardDetail(boardId);
    }
  }, [boardId]);
  const [view, setView] = useState<
    | "main"
    | "about"
    | "visibility"
    | "settings"
    | "bg_main"
    | "bg_photos"
    | "bg_colors"
    | "labels"
    | "stickers"
    | "activity"
    | "archived"
    | "copy"
    | "close_board"
  >("main");
  const createLabel = useLabelStore((s) => s.createLabel);
  const getLabelsByBoardId = useLabelStore((s) => s.getLabelsByBoardId);

  const handleCreateLabel = async () => {
    if (!selectedColor) {
      toast.error("Vui lòng chọn màu");
      return;
    }
    try {
      await createLabel(boardId, titleLabel || null, selectedColor);
      setOpenCreateLabel(false);
      setTitleLabel("");
      setSelectedColor(null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getLabelsByBoardId(boardId);
  }, [boardId]);

  if (view === "about") {
    return (
      <AboutBoard
        onClose={onClose}
        onBack={() => setView("main")}
        adminName={boardCreator?.name || "Unknown"}
      />
    );
  }
  if (view === "visibility") {
    return (
      <BoardVisibility
        onClose={onClose}
        onBack={() => setView("main")}
        currentVisibility={currentBoard?.visibility || "private"}
      />
    );
  }
  if (view === "settings") {
    return <BoardSettings onClose={onClose} onBack={() => setView("main")} />;
  }
  if (view === "bg_main")
    return (
      <ChangeBackground
        onClose={onClose}
        onBack={() => setView("main")}
        onSelectView={(v) =>
          setView(v === "photos" ? "bg_photos" : "bg_colors")
        }
      />
    );
  if (view === "bg_photos")
    return (
      <BackgroundPhotos
        onClose={onClose}
        onBack={() => setView("bg_main")}
        boardId={boardId}
      />
    );
  if (view === "bg_colors")
    return (
      <BackgroundColors
        onClose={onClose}
        onBack={() => setView("bg_main")}
        boardId={boardId}
      />
    );
  if (view === "labels") {
    return (
      <div className="fixed top-0 right-0 w-[340px] h-full bg-white shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right duration-300">
        <LabelSelectorPopup
          boardId={boardId}
          cardId={-1} // Không dùng cardId trong ngữ cảnh này
          onBack={() => setView("main")}
          onClose={onClose}
          onCreateLabel={() => setOpenCreateLabel(true)}
          onEditLabel={(label) => console.log("Mở màn hình sửa nhãn", label)}
        />
        {openCreateLabel && (
          <CreateLabelPopup
            onBack={() => {
              setOpenCreateLabel(false);
            }}
            onClose={() => setOpenCreateLabel(false)}
            setTitleLabel={setTitleLabel}
            titleLabel={titleLabel}
            setSelectedColor={setSelectedColor}
            selectedColor={selectedColor}
            onCreateLabel={handleCreateLabel}
          />
        )}
      </div>
    );
  }
  if (view === "stickers") {
    return <StickerSelector onClose={onClose} onBack={() => setView("main")} />;
  }
  if (view === "activity") {
    return <ActivityView onClose={onClose} onBack={() => setView("main")} />;
  }
  if (view === "archived") {
    return (
      <ArchivedItems
        onClose={onClose}
        onBack={() => setView("main")}
        boardId={boardId}
      />
    );
  }
  if (view === "copy") {
    return <CopyBoard onClose={onClose} onBack={() => setView("main")} />;
  }
  if (view === "close_board") {
    return (
      <CloseBoardConfirmation
        onClose={onClose}
        onBack={() => setView("main")}
      />
    );
  }

  return (
    <div className="fixed top-0 right-0 w-[340px] h-full bg-[#f1f2f4] shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between px-4 h-12 border-b border-gray-200 bg-white text-sm">
        <div className="w-5" />
        <h2 className="font-semibold text-gray-700">Menu</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-3 space-y-4">
        <div className="px-3">
          <button className="w-full flex items-center justify-between p-2 hover:bg-gray-200 rounded-lg transition-colors text-sm text-gray-700">
            <div className="flex items-center gap-3">
              <UserPlus className="w-4 h-4" />
              <span>Chia sẻ</span>
            </div>
            <div className="flex -space-x-1">
              {boardMember.slice(0, 3).map((m, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white text-[10px] text-white flex items-center justify-center font-bold"
                >
                  {m.user?.name?.charAt(0) || "U"}
                </div>
              ))}
            </div>
          </button>
        </div>
        <hr className="mx-4 border-gray-200" />{" "}
        <div className="px-3 space-y-1">
          <MenuItem
            icon={<Info />}
            title="Về bảng này"
            subtitle="Thêm mô tả vào bảng của bạn"
            onClick={() => setView("about")}
          />
          <MenuItem
            icon={<Eye />}
            title="Khả năng hiển thị"
            subtitle="Không gian làm việc"
            onClick={() => setView("visibility")}
          />
        </div>
        <hr className="mx-4 border-gray-200" />
        <div className="px-3 space-y-1">
          <MenuItem
            icon={<Settings />}
            title="Cài đặt"
            onClick={() => setView("settings")}
          />
          <MenuItem
            icon={<Image className="text-blue-500 fill-blue-500" />}
            title="Thay đổi hình nền"
            onClick={() => setView("bg_main")}
          />
        </div>
        <hr className="mx-4 border-gray-200" />
        <div className="px-3 space-y-1">
          <MenuItem
            icon={<Tag />}
            title="Nhãn"
            onClick={() => setView("labels")}
          />
          <MenuItem
            icon={<Smile />}
            title="Các nhãn dán"
            onClick={() => setView("stickers")}
          />
          <MenuItem
            icon={<Activity />}
            title="Hoạt động"
            onClick={() => {
              setView("activity");
            }}
          />
          <MenuItem
            icon={<Archive />}
            title="Mục đã lưu trữ"
            onClick={() => setView("archived")}
          />
        </div>
        <hr className="mx-4 border-gray-200" />
        <div className="px-3 pb-6 space-y-1">
          <MenuItem icon={<Radio />} title="Theo dõi" />
          <MenuItem
            icon={<Copy />}
            title="Sao chép bảng thông tin"
            onClick={() => setView("copy")}
          />
          <MenuItem
            icon={<LogOut />}
            title="Đóng bảng thông tin"
            onClick={() => setView("close_board")}
          />
        </div>
      </div>
    </div>
  );
};

const MenuItem = ({ icon, title, subtitle, active, badge, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors text-sm ${
      active ? "bg-blue-50 text-blue-700" : "hover:bg-gray-200 text-gray-700"
    }`}
  >
    <div className="flex items-center gap-3">
      <span className="w-4 h-4 text-gray-500">
        {React.cloneElement(icon, { className: "w-4 h-4" })}
      </span>
      <div className="text-left">
        <div className="font-medium">{title}</div>
        {subtitle && (
          <div className="text-[11px] text-gray-500">{subtitle}</div>
        )}
      </div>
    </div>
    {badge && (
      <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
        <Zap className="w-2 h-2 fill-purple-700" /> {badge}
      </span>
    )}
  </button>
);

export default BoardMenu;
