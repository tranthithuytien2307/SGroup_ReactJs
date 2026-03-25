import { useState, useEffect } from "react";
import type { Card } from "../../../entities/card/model/cardType";

interface Props {
  card: Card;
  onUpdate: (title: string) => Promise<void> | void;
}

export default function CardDetailTitle({ card, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(card.title);

  // Đồng bộ khi dữ liệu Card thay đổi (ví dụ: card khác được chọn hoặc store update)
  useEffect(() => {
    setTitle(card.title);
  }, [card.title, card.id]);

  const handleSave = async () => {
    // Nếu title trống hoặc không đổi thì không làm gì
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
      setTitle(card.title); // Reset về tiêu đề cũ nếu lỗi
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    }
    if (e.key === "Escape") {
      setTitle(card.title);
      setEditing(false);
    }
  };

  return (
    <div className="w-full">
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
          className="text-xl font-bold cursor-pointer hover:bg-gray-100 px-2 py-1 rounded border border-transparent transition-all overflow-hidden text-ellipsis whitespace-nowrap"
          onClick={() => setEditing(true)}
        >
          {card.title}
        </h2>
      )}
    </div>
  );
}
