import { X, Tag, CheckSquare, UserPlus, Trash2 } from "lucide-react";
import { useState } from "react";
import ActionChip from "./ActionChip";
import UserChip from "./UserChip";
import type { Card } from "../../entities/card/model/cardType";

type Props = {
  card: Card;
  listTitle?: string;
  onClose: () => void;
  onUpdateCard: (
    cardId: number,
    data: { title?: string; description?: string },
  ) => void;
  onDeleteCard: (cardId: number) => void;
};

export default function CardDetailModal({
  card,
  listTitle,
  onClose,
  onUpdateCard,
  onDeleteCard,
}: Props) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");

  const onSave = () => {
    onDeleteCard(card.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 flex w-full max-w-2xl max-h-[90vh] flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">{listTitle}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 px-6 py-4">
          <div className="flex flex-wrap gap-2">
            <ActionChip icon={<Tag size={16} />} label="Add tags" />
            <ActionChip icon={<CheckSquare size={16} />} label="Add todo" />
            <ActionChip icon={<UserPlus size={16} />} label="Add member" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Title</label>

            {isEditingTitle ? (
              <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => {
                  if (title.trim() && title !== card.title) {
                    onUpdateCard(card.id, { title: title.trim() });
                  }
                  setIsEditingTitle(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                  if (e.key === "Escape") {
                    setTitle(card.title);
                    setIsEditingTitle(false);
                  }
                }}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-black"
              />
            ) : (
              <div
                onClick={() => {
                  setIsEditingTitle(true);
                  setTitle(card.title);
                }}
                className="cursor-pointer rounded px-2 py-1 hover:bg-gray-100 border border-dashed border-gray-300 hover:border-gray-500"
              >
                {card.title}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Description</label>

            {isEditingDesc ? (
              <textarea
                autoFocus
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => {
                  if (description !== card.description) {
                    onUpdateCard(card.id, { description: description.trim() });
                  }
                  setIsEditingDesc(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setDescription(card.description || "");
                    setIsEditingDesc(false);
                  }
                }}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-black"
              />
            ) : (
              <div
                onClick={() => {
                  setIsEditingDesc(true);
                  setDescription(card.description || "");
                }}
                className="min-h-[60px] cursor-pointer rounded px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 border border-dashed border-gray-300 hover:border-gray-500"
              >
                {card.description || "Add a description..."}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Assigned Users</p>
            <div className="flex flex-wrap gap-2">
              <UserChip name="John Doe" removable />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Available users:</p>
            <div className="flex flex-wrap gap-2">
              <UserChip name="Jane Smith" />
              <UserChip name="Bob Johnson" />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Comments</p>
            <input
              placeholder="Write a comment..."
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t px-6 py-4">
          <button
            className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
            onClick={() => onSave()}
          >
            <Trash2 size={16} />
            Delete Card
          </button>

          <button
            onClick={onClose}
            className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
