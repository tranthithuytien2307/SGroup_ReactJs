import { useEffect } from "react";
import { Clock } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";
import { useLabelStore } from "../../features/label/model/labelStore";
import { useCardStore } from "../../features/card/model/cardStore";

type CardItemProps = {
  cardId: number;
  index: number;
  avatars?: string[];
  onClick?: () => void;
};

export default function CardItem({ cardId, index, onClick }: CardItemProps) {
  // --- LOGIC LẤY DỮ LIỆU ---
  const labels = useLabelStore((state) => state.labelsByCardId[cardId]);
  const getLabelsByCardId = useLabelStore((state) => state.getLabelsByCardId);

  const card = useCardStore((state) =>
    state.cards.find((c) => c.id === cardId),
  );

  useEffect(() => {
    if (!labels) {
      getLabelsByCardId(cardId);
    }
  }, [cardId, labels]);

  if (!card) return null;

  const safeLabels = labels || [];

  // --- LOGIC XỬ LÝ DEADLINE ---
  const formatDate = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    return `${d.getDate()} thg ${d.getMonth() + 1}`;
  };

  const isOverdue = (iso?: string) => {
    if (!iso) return false;
    return new Date(iso) < new Date();
  };

  const isDueSoon = (iso?: string) => {
    if (!iso) return false;
    const diff = new Date(iso).getTime() - new Date().getTime();
    return diff > 0 && diff < 24 * 60 * 60 * 1000;
  };

  const getDeadlineStyle = () => {
    if (!card.deadline_date) return "text-gray-500";
    if (isOverdue(card.deadline_date))
      return "bg-red-100 text-red-600 px-2 py-[2px] rounded";
    if (isDueSoon(card.deadline_date))
      return "bg-yellow-100 text-yellow-700 px-2 py-[2px] rounded";
    return "text-gray-500";
  };

  return (
    <Draggable draggableId={cardId.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          style={{
            ...provided.draggableProps.style,
            // Đảm bảo card không bị lệch khi kéo
            userSelect: "none",
          }}
          className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-all mb-3 select-none ${
            snapshot.isDragging
              ? "shadow-2xl rotate-2 ring-2 ring-blue-400/50 z-50 cursor-grabbing"
              : "hover:shadow-md hover:translate-y-[-2px] cursor-pointer"
          }`}
        >
          {/* LABEL AREA */}
          {safeLabels.length > 0 && (
            <div className="flex gap-1 mb-2 flex-wrap">
              {safeLabels.map((l) => (
                <div
                  key={l.id}
                  style={{ background: l.color }}
                  className="h-1.5 w-8 rounded-full shadow-sm"
                  title={l.name || ""}
                />
              ))}
            </div>
          )}

          {/* CONTENT AREA */}
          <p className="font-semibold text-gray-800 leading-tight">
            {card.title}
          </p>

          {card.description && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
              {card.description}
            </p>
          )}

          {/* BOTTOM METADATA */}
          {card.deadline_date && (
            <div className="flex items-center gap-1.5 mt-3 text-[11px] font-medium">
              <Clock
                size={13}
                className={
                  isOverdue(card.deadline_date)
                    ? "text-red-500"
                    : "text-gray-400"
                }
              />
              <span className={getDeadlineStyle()}>
                {formatDate(card.deadline_date)}
              </span>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}
