import { useState, useEffect } from "react";
import type { Card } from "../../../entities/card/model/cardType";
import { useCardStore } from "../../../features/card/model/cardStore";

interface Props {
  card: Card;
  onUpdate: (title: string) => Promise<void> | void;
}

export default function CardDetailTitle({ card, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const { toggleComplete } = useCardStore();

  useEffect(() => {
    setTitle(card.title);
  }, [card.title, card.id]);

  const handleSave = async () => {
    if (!title.trim() || title === card.title) {
      setTitle(card.title);
      setEditing(false);
      return;
    }

    try {
      await onUpdate(title);
      setEditing(false);
    } catch (error) {
      console.error("Lỗi cập nhật tiêu đề:", error);
      setTitle(card.title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setTitle(card.title);
      setEditing(false);
    }
  };

  return (
    <div className="w-full flex items-start gap-2">
      <div
        onClick={(e) => {
          e.stopPropagation();
          toggleComplete(card.id);
        }}
        className={`w-6 h-6 mt-1 flex items-center justify-center rounded-full border cursor-pointer transition
          ${
            card.is_completed
              ? "bg-green-500 border-green-500"
              : "border-gray-300 bg-white hover:bg-gray-100"
          }
        `}
      >
        {card.is_completed && (
          <div className="w-3 h-2 border-l-2 border-b-2 border-white -rotate-45 mb-0.5"></div>
        )}
      </div>

      <div className="flex-1">
        {editing ? (
          <input
            value={title}
            autoFocus
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xl font-bold border-2 border-blue-500 rounded px-2 py-1 focus:outline-none bg-white shadow-sm transition-all"
          />
        ) : (
          <h2
            onClick={() => setEditing(true)}
            className={`text-xl font-bold px-2 py-1 rounded border border-transparent transition-all cursor-pointer
              ${
                card.is_completed
                  ? "text-gray-300 line-through"
                  : "text-black hover:bg-gray-100"
              }
            `}
          >
            {card.title}
          </h2>
        )}
      </div>
    </div>
  );
}
