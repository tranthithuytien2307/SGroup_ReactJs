import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useCardStore } from "../../../features/card/model/cardStore";
import MemberSelectorPopup from "./MemberSelectorPopup";
import { useBoardStore } from "../../../features/board/model/boardStore";

export default function CardMembersSection({ cardId }: { cardId: number }) {
  const [open, setOpen] = useState(false);

  const { cards, getMembers, addMember, removeMember } = useCardStore();
  const boardMembers = useBoardStore((s) => s.boardMembers);

  const card = cards.find((c) => c.id === cardId);

  useEffect(() => {
    getMembers(cardId);
  }, [cardId]);

  const members = card?.members || [];

  return (
    <div className="space-y-2">
      <p className="font-medium">Thành viên</p>

      <div className="flex gap-2 flex-wrap items-center">
        {members.map((m) => (
          <div key={m.id} title={m.name}>
            {m.avatar_url ? (
              <img src={m.avatar_url} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">
                {m.name[0]}
              </div>
            )}

            <button onClick={() => removeMember(cardId, m.id)}>×</button>
          </div>
        ))}

        {/* Add member */}
        <button
          onClick={() => setOpen(true)}
          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Popup chọn member */}
      {open && (
        <MemberSelectorPopup
          members={boardMembers}
          onClose={() => setOpen(false)}
          onSelect={(userId) => {
            addMember(cardId, userId);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}
