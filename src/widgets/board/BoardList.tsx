// import { useEffect, useState } from "react";
// import CardItem from "../card/CardItem";
// import ColumnHeader from "./ColumnHeader";
// import type { Card } from "../../entities/card/model/cardType";
// import { Plus } from "lucide-react";
// import AddItemForm from "../../shared/ui/AddItemForm";
// import CardDetailModal from "../card/CardDetailModal";
// import { useCardStore } from "../../features/card/model/cardStore";
// import { Droppable } from "@hello-pangea/dnd";

// type BoardListProps = {
//   id: number;
//   title: string;
//   cards: Card[];
//   onRename: (id: number, newTitle: string) => void;
//   onAddCard?: (listId: number, title: string) => void;
//   onDeleteList: (listId: number) => void;
//   onUpdateCard: (
//     cardId: number,
//     data: { title?: string; description?: string },
//   ) => void;
//   onDeleteCard: (cardId: number) => void;
// };

// export default function BoardList({
//   id,
//   title,
//   cards = [],
//   onRename,
//   onAddCard,
//   onDeleteList,
//   onUpdateCard,
//   onDeleteCard,
// }: BoardListProps) {
//   const [isAdding, setIsAdding] = useState(false);
//   const [cardTitle, setCardTitle] = useState("");
//   const [openCardDetailId, setOpenCardDetailId] = useState<number | null>(null);
//   const cardsFromStore = useCardStore((state) => state.cards);
//   const currentCard = cardsFromStore.find((c) => c.id === openCardDetailId);

//   const cardsInThisList = cardsFromStore.filter((c) => c.list_id === id);

//   const handleAddCard = () => {
//     if (!cardTitle.trim()) return;
//     onAddCard?.(id, cardTitle.trim());
//     setCardTitle("");
//     setIsAdding(false);
//   };

//   const handleCancel = () => {
//     setCardTitle("");
//     setIsAdding(false);
//   };

//   return (
//     <div className="flex flex-col w-72 flex-shrink-0 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm  max-h-[calc(100vh-8rem)]">
//       <ColumnHeader
//         title={title}
//         onRename={(newTitle) => onRename(id, newTitle)}
//         onDelete={() => onDeleteList(id)}
//       />

//       <div className="mt-3 mb-3 flex flex-col overflow-y-auto flex-1 pb-3">
//         {cardsInThisList.length === 0 ? (
//           <p className="px-2 text-sm italic text-gray-400">No cards yet</p>
//         ) : (
//           cardsInThisList.map((card) => (
//             <CardItem
//               key={card.id}
//               cardId={card.id}
//               avatars={[]}
//               onClick={() => setOpenCardDetailId(card.id)}
//             />
//           ))
//         )}
//       </div>
//       <div className="mt-3">
//         {isAdding ? (
//           <AddItemForm
//             value={cardTitle}
//             placeholder="Enter card title..."
//             submitLabel="Add Card"
//             onChange={setCardTitle}
//             onSubmit={handleAddCard}
//             onCancel={handleCancel}
//           />
//         ) : (
//           <button
//             onClick={() => setIsAdding(true)}
//             className="
//               flex w-full items-center gap-2
//               rounded-xl px-3 py-2 text-sm
//               text-gray-500 hover:bg-gray-100 hover:text-gray-700
//             "
//           >
//             <Plus className="h-4 w-4" />
//             Add a card
//           </button>
//         )}
//       </div>
//       {openCardDetailId && currentCard && (
//         <CardDetailModal
//           card={currentCard}
//           onClose={() => setOpenCardDetailId(null)}
//           listTitle={title}
//           onUpdateCard={onUpdateCard}
//           onDeleteCard={onDeleteCard}
//           boardId={id}
//         />
//       )}
//     </div>
//   );
// }
import { useState } from "react";
import { Plus } from "lucide-react";
import { Droppable } from "@hello-pangea/dnd";

import CardItem from "../card/CardItem";
import ColumnHeader from "./ColumnHeader";
import AddItemForm from "../../shared/ui/AddItemForm";
import CardDetailModal from "../card/CardDetailModal";

import { useCardStore } from "../../features/card/model/cardStore";
import type { Card } from "../../entities/card/model/cardType";

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
  onRename,
  onAddCard,
  onDeleteList,
  onUpdateCard,
  onDeleteCard,
}: BoardListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [cardTitle, setCardTitle] = useState("");
  const [openCardDetailId, setOpenCardDetailId] = useState<number | null>(null);

  // Lấy dữ liệu từ Store để đảm bảo UI đồng bộ sau khi Drag & Drop
  const cardsFromStore = useCardStore((state) => state.cards);
  const currentCard = cardsFromStore.find((c) => c.id === openCardDetailId);

  // Lọc ra các thẻ thuộc danh sách này
  const cardsInThisList = cardsFromStore.filter((c) => c.list_id === id);

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
    <div className="flex flex-col w-72 flex-shrink-0 rounded-2xl border border-gray-200 bg-[#f1f2f4] p-3 shadow-sm max-h-[calc(100vh-8rem)]">
      <ColumnHeader
        title={title}
        onRename={(newTitle) => onRename(id, newTitle)}
        onDelete={() => onDeleteList(id)}
      />

      {/* Vùng thả thẻ (Droppable) */}
      <Droppable droppableId={id.toString()} type="CARD">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`mt-2 flex flex-col overflow-y-auto flex-1 pb-2 min-h-[50px] transition-colors duration-200 ${
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
                  index={index} // Quan trọng: Truyền index để DnD định vị
                  avatars={[]}
                  onClick={() => setOpenCardDetailId(card.id)}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Footer: Thêm thẻ mới */}
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

      {/* Modal chi tiết thẻ */}
      {openCardDetailId && currentCard && (
        <CardDetailModal
          card={currentCard}
          onClose={() => setOpenCardDetailId(null)}
          listTitle={title}
          onUpdateCard={onUpdateCard}
          onDeleteCard={onDeleteCard}
          boardId={id}
        />
      )}
    </div>
  );
}
