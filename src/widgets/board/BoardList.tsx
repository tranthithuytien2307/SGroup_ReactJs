import { useState } from "react";
import CardItem from "../card/CardItem";
import ColumnHeader from "./ColumnHeader";
import type { Card } from "../../entities/card/model/cardType";
import { Plus } from "lucide-react";
import AddItemForm from "../../shared/ui/AddItemForm";
import CardDetailModal from "../card/CardDetailModal";

type BoardListProps = {
  id: number;
  title: string;
  cards: Card[];
  onRename: (id: number, newTitle: string) => void;
  onAddCard?: (listId: number, title: string) => void;
  onDeleteList: (listId: number) => void;
  onUpdateCard: (
    cardId: number,
    data: { title?: string; description?: string },
  ) => void;
  onDeleteCard: (cardId: number) => void;
};

export default function BoardList({
  id,
  title,
  cards = [],
  onRename,
  onAddCard,
  onDeleteList,
  onUpdateCard,
  onDeleteCard,
}: BoardListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [cardTitle, setCardTitle] = useState("");
  const [openCardDetail, setOpenCardDetail] = useState<Card | null>(null);

  const handleAddCard = () => {
    if (!cardTitle.trim()) return;
    onAddCard?.(id, cardTitle.trim());
    setCardTitle("");
    setIsAdding(false);
  };

  const handleCancel = () => {
    setCardTitle("");
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col w-72 flex-shrink-0 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm  max-h-[calc(100vh-8rem)]">
      <ColumnHeader
        title={title}
        onRename={(newTitle) => onRename(id, newTitle)}
        onDelete={() => onDeleteList(id)}
      />

      <div className="mt-3 mb-3 flex flex-col overflow-y-auto flex-1 pb-3">
        {cards.length === 0 ? (
          <p className="px-2 text-sm italic text-gray-400">No cards yet</p>
        ) : (
          cards.map((card) => (
            <CardItem
              key={card.id}
              title={card.title}
              description={card.description || ""}
              avatars={[]}
              onClick={() => setOpenCardDetail(card)}
            />
          ))
        )}
      </div>

      <div className="mt-3">
        {isAdding ? (
          <AddItemForm
            value={cardTitle}
            placeholder="Enter card title..."
            submitLabel="Add Card"
            onChange={setCardTitle}
            onSubmit={handleAddCard}
            onCancel={handleCancel}
          />
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="
              flex w-full items-center gap-2
              rounded-xl px-3 py-2 text-sm
              text-gray-500 hover:bg-gray-100 hover:text-gray-700
            "
          >
            <Plus className="h-4 w-4" />
            Add a card
          </button>
        )}
      </div>
      {openCardDetail && (
        <CardDetailModal
          card={openCardDetail}
          onClose={() => setOpenCardDetail(null)}
          listTitle={title}
          onUpdateCard={onUpdateCard}
          onDeleteCard={onDeleteCard}
        />
      )}
    </div>
  );
}
