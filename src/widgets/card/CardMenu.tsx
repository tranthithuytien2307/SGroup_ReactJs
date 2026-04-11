import {
  ExternalLink,
  Tag,
  Users,
  Image,
  Clock,
  MoveRight,
  Copy,
  Link as LinkIcon,
  Archive,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import CardDetailModal from "./CardDetailModal";
import { useCardStore } from "../../features/card/model/cardStore";
import type { Card } from "../../entities/card/model/cardType";
import { useParams } from "react-router-dom";
import LabelSelectorPopup from "./LabelSelectorPopup";
import CreateLabelPopup from "./label/CreateLabelPopup";
import toast from "react-hot-toast";
import { useLabelStore } from "../../features/label/model/labelStore";
import MemberSelectorPopup from "./cardDetail/MemberSelectorPopup";
import { useBoardStore } from "../../features/board/model/boardStore";
import ChangeBackground from "../board/boardMenu/ChangeBackground";
import BackgroundPhotos from "../board/boardMenu/BackgroundPhotos";
import BackgroundColors from "../board/boardMenu/BackgroundColors";
import DateSelectorPopup from "./DateSelectorPopup";
import EditLabelPopup from "./label/EditLabelPopup";

type CardMenuProps = {
  onClose: () => void;
  onOpen?: () => void;
  onEditLabel?: () => void;
  onMember?: () => void;
  onCover?: () => void;
  onDate?: () => void;
  onMove?: () => void;
  onCopy?: () => void;
  onCopyLink?: () => void;
  onMirror?: () => void;
  onArchive?: () => void;
  card: Card;
};

export default function CardMenu({
  onClose,
  onEditLabel,
  onMember,
  onCover,
  onDate,
  onMove,
  onCopy,
  onCopyLink,
  onMirror,
  onArchive,
  card,
}: CardMenuProps) {
  const Item = ({
    icon,
    label,
    onClick,
    danger,
  }: {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    danger?: boolean;
  }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-all
        ${
          danger
            ? "text-red-600 hover:bg-red-50"
            : "text-gray-700 hover:bg-gray-100"
        }`}
    >
      <span className="w-4 h-4 flex items-center justify-center">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
    </button>
  );
  const { id } = useParams();
  const boardId = Number(id);
  const [openCreateLabel, setOpenCreateLabel] = useState(false);
  const [openEditLabel, setOpenEditLabel] = useState(false);
  const [editingLabel, setEditingLabel] = useState<{
    id: number;
    name: string | null;
    color: string;
  } | null>(null);
  const [titleLabel, setTitleLabel] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const cardsFromStore = useCardStore((state) => state.cards);
  const currentCard = cardsFromStore.find((c) => c.id === card.id);
  const updateCardStore = useCardStore((state) => state.updateCardDetail);
  const deleteCardStore = useCardStore((state) => state.deleteCard);
  const createLabel = useLabelStore((s) => s.createLabel);
  const boardMembers = useBoardStore((s) => s.boardMembers);
  const getBoardMembers = useBoardStore((s) => s.getBoardMembers);
  const addMember = useCardStore((s) => s.addMember);
  const updateLabelStore = useLabelStore((s) => s.updateLabel);
  const deleteLabelStore = useLabelStore((s) => s.deleteLabel);

  const [view, setView] = useState<
    | "main"
    | "labels"
    | "members"
    | "dates"
    | "move"
    | "copy"
    | "link"
    | "bg_main"
    | "bg_photos"
    | "bg_colors"
    | "openDetail"
  >("main");

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
    if (boardId) {
      getBoardMembers(boardId);
    }
  }, [boardId]);

  if (view === "openDetail") {
    return (
      <CardDetailModal
        card={currentCard!}
        onClose={() => setView("main")}
        listTitle={card.title}
        onUpdateCard={updateCardStore}
        onDeleteCard={deleteCardStore}
        boardId={boardId}
      />
    );
  }
  if (view === "labels") {
    return (
      <div
        className="w-72 bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <LabelSelectorPopup
          boardId={boardId}
          cardId={-1} // Không dùng cardId trong ngữ cảnh này
          onBack={() => setView("main")}
          onClose={onClose}
          onCreateLabel={() => {
            setOpenCreateLabel(true);
            setOpenEditLabel(false);
          }}
          onEditLabel={(label) => {
            setEditingLabel(label);
            setOpenEditLabel(true);
            setOpenCreateLabel(false);
          }}
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
        {openEditLabel && editingLabel && (
          <div className="absolute inset-0 bg-white z-10">
            <EditLabelPopup
              onBack={() => {
                setOpenEditLabel(false);
              }}
              onClose={() => setOpenEditLabel(false)}
              titleLabel={editingLabel.name || ""}
              setTitleLabel={(val) =>
                setEditingLabel({ ...editingLabel, name: val })
              }
              selectedColor={editingLabel.color}
              setSelectedColor={(color) =>
                setEditingLabel({ ...editingLabel, color })
              }
              onUpdateLabel={async () => {
                await updateLabelStore(
                  editingLabel.id,
                  card.id,
                  editingLabel.name,
                  editingLabel.color,
                );
                setOpenEditLabel(false);
              }}
              onDeleteLabel={async () => {
                await deleteLabelStore(editingLabel.id, card.id);
                setOpenEditLabel(false);
              }}
            />
          </div>
        )}
      </div>
    );
  }

  if (view === "members") {
    return (
      <MemberSelectorPopup
        members={boardMembers}
        onClose={() => setView("main")}
        onSelect={(userId) => {
          addMember(currentCard!.id, userId);
        }}
      />
    );
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
  if (view === "dates") {
    return (
      <DateSelectorPopup
        cardId={currentCard!.id}
        onBack={() => setView("main")}
        onClose={onClose}
      />
    );
  }
  return (
    <div
      className="w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <span className="text-sm font-semibold text-gray-700">
          Thao tác thẻ
        </span>

        <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
          <X size={16} />
        </button>
      </div>

      <div className="p-2 space-y-1">
        <Item
          icon={<ExternalLink size={16} />}
          label="Mở thẻ"
          onClick={() => setView("openDetail")}
        />
        <Item
          icon={<Tag size={16} />}
          label="Chỉnh sửa nhãn"
          onClick={() => setView("labels")}
        />
        <Item
          icon={<Users size={16} />}
          label="Thành viên"
          onClick={() => setView("members")}
        />
        <Item
          icon={<Image size={16} />}
          label="Thay đổi bìa"
          onClick={() => setView("bg_main")}
        />
        <Item
          icon={<Clock size={16} />}
          label="Chỉnh sửa ngày"
          onClick={() => setView("dates")}
        />

        <div className="border-t my-1" />

        <Item
          icon={<MoveRight size={16} />}
          label="Di chuyển"
          onClick={() => setView("move")}
        />
        <Item
          icon={<Copy size={16} />}
          label="Sao chép thẻ"
          onClick={() => setView("copy")}
        />
        <div className="border-t my-1" />

        <Item
          icon={<Archive size={16} />}
          label="Lưu trữ"
          onClick={onArchive}
          danger
        />
      </div>
    </div>
  );
}
