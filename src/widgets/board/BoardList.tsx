import { useState } from "react";
import { Plus } from "lucide-react";
import { Droppable, type DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";

import CardItem from "../card/CardItem";
import ColumnHeader from "./ColumnHeader";
import AddItemForm from "../../shared/ui/AddItemForm";
import CardDetailModal from "../card/CardDetailModal";

import { useCardStore } from "../../features/card/model/cardStore";
import type { Card } from "../../entities/card/model/cardType";

type BoardListProps = {
  boardId: number;
  id: number;
  title: string;
  cards: Card[];
  onRename: (id: number, newTitle: string) => void;
  onAddCard?: (listId: number, title: string) => void;
  onDeleteList: (_listId: number) => void;
  onUpdateCard: (
    cardId: number,
    data: { title?: string; description?: string },
  ) => void;
  onDeleteCard: (cardId: number) => void;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
};

export default function BoardList({
  boardId,
  id,
  title,
  onRename,
  onAddCard,
  onDeleteList: _onDeleteList,
  onUpdateCard,
  onDeleteCard,
  dragHandleProps,
}: BoardListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [cardTitle, setCardTitle] = useState("");
  const [openCardDetailId, setOpenCardDetailId] = useState<number | null>(null);

  const cardsFromStore = useCardStore((state) => state.cards);
  const currentCard = cardsFromStore.find((c) => c.id === openCardDetailId);

  const cardsInThisList = cardsFromStore
    .filter((c) => c.list_id === id)
    .sort((a, b) => a.position - b.position);

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
    <div className="flex h-full w-full flex-col rounded-2xl border border-gray-200 bg-[#f1f2f4] p-3 shadow-sm max-h-[calc(100vh-8rem)]">
      <ColumnHeader
        title={title}
        onRename={(newTitle) => onRename(id, newTitle)}
        onAddCard={() => setIsAdding(true)}
        listId={id}
        dragHandleProps={dragHandleProps}
      />
      <Droppable
        droppableId={id.toString()}
        type="CARD"
        key={id + "-" + cardsInThisList.length}
      >
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`mt-2 flex min-h-[50px] flex-1 flex-col gap-3 overflow-y-auto pb-2 transition-colors duration-200 ${
              snapshot.isDraggingOver ? "bg-gray-200/50 rounded-lg" : ""
            }`}
          >
            {cardsInThisList.length === 0 && !snapshot.isDraggingOver ? (
              <p className="px-2 py-4 text-sm italic text-gray-400 text-center">
                Chưa có thẻ nào
              </p>
            ) : (
              cardsInThisList.map((card, index) => (
                <CardItem
                  key={card.id}
                  cardId={card.id}
                  index={index}
                  onClick={() => setOpenCardDetailId(card.id)}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="mt-2">
        {isAdding ? (
          <AddItemForm
            value={cardTitle}
            placeholder="Nhập tiêu đề thẻ..."
            submitLabel="Thêm thẻ"
            onChange={setCardTitle}
            onSubmit={handleAddCard}
            onCancel={handleCancel}
          />
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-all"
          >
            <Plus className="h-4 w-4" />
            Thêm thẻ mới
          </button>
        )}
      </div>

      {openCardDetailId && currentCard && (
        <CardDetailModal
          card={currentCard}
          onClose={() => setOpenCardDetailId(null)}
          listTitle={title}
          onUpdateCard={onUpdateCard}
          onDeleteCard={onDeleteCard}
          boardId={boardId}
        />
      )}
    </div>
  );
}
