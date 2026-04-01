import { useEffect, useMemo } from "react";
import { Clock, CheckSquare } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";

import { useLabelStore } from "../../features/label/model/labelStore";
import { useCardStore } from "../../features/card/model/cardStore";
import { useChecklistItemStore } from "../../features/checklistItem/model/checklistItemStore";
import { useChecklistStore } from "../../features/checklist/model/checklistStore";

type CardItemProps = {
  cardId: number;
  index: number;
  onClick?: () => void;
};

export default function CardItem({ cardId, index, onClick }: CardItemProps) {
  const card = useCardStore((state) =>
    state.cards.find((c) => c.id === cardId),
  );

  const getMembers = useCardStore((s) => s.getMembers);

  const labels = useLabelStore((s) => s.labelsByCardId[cardId]);
  const getLabelsByCardId = useLabelStore((s) => s.getLabelsByCardId);

  const checklists = useChecklistStore((s) => s.checklistsByCardId[cardId]);
  const fetchChecklistByCardId = useChecklistStore(
    (s) => s.fetchChecklistsByCardId,
  );

  const progress = useChecklistItemStore((s) => s.progressByChecklistId);

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

  console.log("checklists:", checklists);
  console.log("checklistId:", checklistId);
  console.log("progress:", progress);
  console.log("currentProgress:", currentProgress);

  /** ================= UI HELPER ================= */

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

  /** ================= RENDER ================= */

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
            userSelect: "none",
          }}
          className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-all mb-3 ${
            snapshot.isDragging
              ? "shadow-2xl rotate-2 ring-2 ring-blue-400/50 z-50"
              : "hover:shadow-md hover:-translate-y-1 cursor-pointer"
          }`}
        >
          {/* LABEL */}
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

          {/* TITLE */}
          <p className="font-semibold text-gray-800">{card.title}</p>

          {/* DESCRIPTION */}
          {card.description && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-2">
              {card.description}
            </p>
          )}

          {/* DEADLINE */}
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

          {/* MEMBERS */}
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

          {/* ✅ PROGRESS */}
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
        </div>
      )}
    </Draggable>
  );
}
