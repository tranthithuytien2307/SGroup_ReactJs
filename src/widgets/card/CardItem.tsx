import { useEffect, useMemo, useRef, useState } from "react";
import { Clock, CheckSquare, GripVertical } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";
import { Pencil, Archive } from "lucide-react";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";

import { useLabelStore } from "../../features/label/model/labelStore";
import { useCardStore } from "../../features/card/model/cardStore";
import { useChecklistItemStore } from "../../features/checklistItem/model/checklistItemStore";
import { useChecklistStore } from "../../features/checklist/model/checklistStore";
import CardMenu from "./CardMenu";

type CardItemProps = {
  cardId: number;
  index: number;
  onClick?: () => void;
};

export default function CardItem({ cardId, index, onClick }: CardItemProps) {
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(
    null,
  );
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuPos(null);
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const card = useCardStore((state) =>
    state.cards.find((c) => c.id === cardId),
  );
  const archiveCard = useCardStore((s) => s.archiveCardOptimistic);
  const undoArchive = useCardStore((s) => s.undoArchive);
  const getMembers = useCardStore((s) => s.getMembers);

  const labels = useLabelStore((s) => s.labelsByCardId[cardId]);
  const getLabelsByCardId = useLabelStore((s) => s.getLabelsByCardId);

  const checklists = useChecklistStore((s) => s.checklistsByCardId[cardId]);
  const fetchChecklistByCardId = useChecklistStore(
    (s) => s.fetchChecklistsByCardId,
  );

  const progress = useChecklistItemStore((s) => s.progressByChecklistId);
  const updateMarkComplete = useCardStore((s) => s.toggleComplete);

  useEffect(() => {
    if (!card?.members) {
      getMembers(cardId);
    }
  }, [cardId, card?.members]);

  useEffect(() => {
    if (!labels) {
      getLabelsByCardId(cardId);
    }
  }, [cardId, labels]);

  useEffect(() => {
    if (!checklists) {
      fetchChecklistByCardId(cardId);
    }
  }, [cardId, checklists]);

  const checklistId = useMemo(() => {
    return checklists?.[0]?.id;
  }, [checklists]);

  const currentProgress = checklistId ? progress[checklistId] : undefined;

  if (!card) return null;

  const members = card.members || [];
  const safeLabels = labels || [];

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

    if (card.is_completed)
      return "bg-green-600 text-white px-2 py-[2px] rounded";

    if (isOverdue(card.deadline_date))
      return "bg-red-100 text-red-600 px-2 py-[2px] rounded";

    if (isDueSoon(card.deadline_date))
      return "bg-yellow-100 text-yellow-700 px-2 py-[2px] rounded";

    return "text-gray-500";
  };

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();

    updateMarkComplete(cardId);
  };

  return (
    <Draggable draggableId={cardId.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          onClick={onClick}
          style={{
            ...provided.draggableProps.style,
            userSelect: "none",
          }}
          className={`group relative rounded-xl p-4 shadow-sm border transition-all
  ${
    card.is_completed
      ? "bg-gray-100 border-gray-200 opacity-80"
      : "bg-white border-gray-100"
  }
  ${
    snapshot.isDragging
      ? "shadow-2xl rotate-2 ring-2 ring-blue-400/50 z-50"
      : "hover:shadow-md cursor-pointer"
  }
`}
        >
          {safeLabels.length > 0 && (
            <div className="flex gap-1 mb-2 flex-wrap">
              {safeLabels.map((l) => (
                <div
                  key={l.id}
                  style={{ background: l.color }}
                  className="h-1.5 w-8 rounded-full"
                />
              ))}
            </div>
          )}
          <div className="flex items-start gap-2">
            <button
              type="button"
              {...provided.dragHandleProps}
              onClick={(e) => e.stopPropagation()}
              className={`mt-0.5 shrink-0 rounded-md p-1 text-gray-300 transition ${
                snapshot.isDragging
                  ? "bg-blue-50 text-blue-500"
                  : "opacity-0 group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-500"
              } cursor-grab active:cursor-grabbing`}
              aria-label="Drag card"
            >
              <GripVertical className="h-4 w-4" />
            </button>

            <div
              onClick={handleToggleComplete}
              className={`flex items-center justify-center rounded-full border cursor-pointer transition-all duration-200
              ${
                card.is_completed
                  ? "w-5 h-5 bg-green-500 border-green-500 mr-2"
                  : "w-0 h-5 border-gray-300 bg-white opacity-0 group-hover:w-5 group-hover:opacity-100 group-hover:mr-2"
              }
            `}
            >
              {card.is_completed && (
                <div className="w-2.5 h-1.5 border-l-2 border-b-2 border-white -rotate-45 mb-0.5"></div>
              )}
            </div>

            <p
              className={`font-semibold flex-1 ${
                card.is_completed
                  ? "line-through text-gray-400"
                  : "text-gray-800"
              }`}
            >
              {card.title}
            </p>
          </div>

          {card.description && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-2">
              {card.description}
            </p>
          )}

          {card.deadline_date && (
            <div className="flex items-center gap-1.5 mt-3 text-[11px] font-medium">
              <Clock
                size={13}
                className={
                  card.is_completed
                    ? "text-white"
                    : isOverdue(card.deadline_date)
                      ? "text-red-500"
                      : "text-gray-400"
                }
              />
              <span className={getDeadlineStyle()}>
                {formatDate(card.deadline_date)}
              </span>
            </div>
          )}

          {members.length > 0 && (
            <div className="flex mt-3">
              <div className="flex -space-x-2">
                {members.slice(0, 3).map((user) => (
                  <div
                    key={user.id}
                    className="w-7 h-7 rounded-full border-2 border-white bg-blue-500 text-white flex items-center justify-center text-xs"
                  >
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.name?.[0]
                    )}
                  </div>
                ))}

                {members.length > 3 && (
                  <div className="w-7 h-7 rounded-full bg-gray-300 text-xs flex items-center justify-center border-2 border-white">
                    +{members.length - 3}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentProgress !== undefined && (
            <div className="flex items-center gap-2 mt-3 text-[11px]">
              <CheckSquare size={14} className="text-gray-400" />

              <div className="flex-1 bg-gray-200 h-1.5 rounded">
                <div
                  className={`h-full ${
                    currentProgress === 100 ? "bg-green-600" : "bg-green-400"
                  }`}
                  style={{ width: `${currentProgress}%` }}
                />
              </div>

              <span className="text-gray-500">{currentProgress}%</span>
            </div>
          )}

          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={(e) => {
                e.stopPropagation();

                const rect = (
                  e.currentTarget as HTMLElement
                ).getBoundingClientRect();

                setMenuPos({
                  top: rect.bottom + 4,
                  left: rect.left,
                });
              }}
              className="p-1 bg-white rounded shadow hover:bg-gray-100"
            >
              <Pencil size={14} className="text-gray-600" />
            </button>
            {menuPos &&
              createPortal(
                <div
                  ref={menuRef}
                  className="fixed z-[9999]"
                  style={{
                    top: menuPos.top,
                    left: menuPos.left,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <CardMenu
                    onClose={() => setMenuPos(null)}
                    onArchive={() => archiveCard(cardId)}
                    card={card}
                  />
                </div>,
                document.body,
              )}

            <button
              onClick={(e) => {
                e.stopPropagation();

                archiveCard(cardId);

                toast(
                  (t) => (
                    <div className="flex items-center justify-between gap-4 min-w-[280px] max-w-[360px] bg-white shadow-lg border border-gray-200 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-100">
                          <Archive size={16} className="text-yellow-600" />
                        </div>

                        <span className="text-sm font-medium text-gray-800">
                          Thẻ đã được lưu trữ
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          undoArchive(cardId);
                          toast.dismiss(t.id);
                        }}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
                      >
                        Hoãn
                      </button>
                    </div>
                  ),
                  {
                    duration: 4000,
                  },
                );
              }}
              className="p-1 bg-white rounded shadow hover:bg-gray-100"
            >
              <Archive size={14} className="text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}
