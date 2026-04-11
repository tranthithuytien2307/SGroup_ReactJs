import { Plus, Calendar, CheckSquare, Users, Paperclip, X } from "lucide-react";
import { useState, useEffect } from "react";

import CardLabelsSection from "./cardDetail/CardLabelsSection";
import CardMembersSection from "./cardDetail/CardMembersSection";
import CardCommentsSection from "./cardDetail/CardCommentsSection";
import CardDescriptionSection from "./cardDetail/CardDescriptionSection";
import AddToCardPopup from "./cardDetail/AddToCardPopup";
import DateSelectorPopup from "./DateSelectorPopup";
import LabelSelectorPopup from "./LabelSelectorPopup";
import CreateLabelPopup from "./label/CreateLabelPopup";
import EditLabelPopup from "./label/EditLabelPopup";
import CardDeadline from "./cardDetail/CardDeadlineSection";
import ChecklistPopup from "./checklist/ChecklistPopup";
import CardChecklistSection from "./checklist/ChecklistSection";

import { useLabelStore } from "../../features/label/model/labelStore";
import { useCardStore } from "../../features/card/model/cardStore";

import type { Card } from "../../entities/card/model/cardType";
import type { Label } from "../../entities/label/model/labelType";
import CardDetailTitle from "./cardDetail/CardDetailTitle";
import MemberSelectorPopup from "./cardDetail/MemberSelectorPopup";
import { useBoardStore } from "../../features/board/model/boardStore";

export default function CardDetailModal({
  card,
  onClose,
  listTitle,
  onUpdateCard,
  onDeleteCard,
  boardId,
}: {
  card: Card;
  onClose: () => void;
  listTitle: string;
  onUpdateCard: (
    cardId: number,
    data: { title?: string; description?: string },
  ) => void;
  onDeleteCard: (cardId: number) => void;
  boardId: number;
}) {
  const [openAddPopup, setOpenAddPopup] = useState(false);
  const [openLabelPopup, setOpenLabelPopup] = useState(false);
  const [openDatePopup, setOpenDatePopup] = useState(false);
  const [openCreateLabel, setOpenCreateLabel] = useState(false);
  const [titleLabel, setTitleLabel] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [openEditLabel, setOpenEditLabel] = useState(false);
  const [editingLabel, setEditingLabel] = useState<Label | null>(null);
  const [openChecklistPopup, setOpenChecklistPopup] = useState(false);
  const [openMemberPopup, setOpenMemberPopup] = useState(false);

  const createLabel = useLabelStore((s) => s.createLabel);
  const getLabelsByCardId = useLabelStore((s) => s.getLabelsByCardId);
  const getLabelsByBoardId = useLabelStore((s) => s.getLabelsByBoardId);
  const updateLabelStore = useLabelStore((s) => s.updateLabel);
  const deleteLabelStore = useLabelStore((s) => s.deleteLabel);

  const currentCard =
    useCardStore((state) => state.cards.find((c) => c.id === card.id)) || card;
  const addMember = useCardStore((s) => s.addMember);
  const boardMembers = useBoardStore((s) => s.boardMembers);
  const getBoardMembers = useBoardStore((s) => s.getBoardMembers);

  const labels = useLabelStore((state) => state.labelsByCardId[card.id] || []);
  useEffect(() => {
    getLabelsByBoardId(boardId);
    getLabelsByCardId(card.id);
  }, [boardId, card.id]);

  useEffect(() => {
    if (boardId) {
      getBoardMembers(boardId);
    }
  }, [boardId]);

  const closeAllPopups = () => {
    setOpenAddPopup(false);
    setOpenLabelPopup(false);
    setOpenDatePopup(false);
    setOpenCreateLabel(false);
    setOpenEditLabel(false);
    setOpenChecklistPopup(false);
  };

  const handleCreateLabel = async () => {
    if (!selectedColor) {
      alert("Vui lòng chọn màu");
      return;
    }
    try {
      await createLabel(boardId, titleLabel || null, selectedColor);
      setOpenCreateLabel(false);
      setTitleLabel("");
      setSelectedColor(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-[#f4f5f7] w-full max-w-[1000px] max-h-[90vh] rounded-lg shadow-xl flex flex-col relative overflow-hidden">
        <div className="bg-white p-6 pb-4 shrink-0 z-10 border-b">
          <div className="flex justify-between items-start pr-10">
            <div className="w-full">
              <CardDetailTitle
                card={currentCard}
                onUpdate={(newTitle) =>
                  onUpdateCard(currentCard.id, { title: newTitle })
                }
              />
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-black p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row min-h-0">
          <div className="flex-1 p-6 space-y-6 bg-white overflow-y-auto custom-scrollbar">
            <div className="flex gap-2 flex-wrap shrink-0">
              <div className="relative">
                <button
                  onClick={() => {
                    const currentState = openAddPopup;
                    closeAllPopups();
                    setOpenAddPopup(!currentState);
                  }}
                  className="btn flex items-center gap-2"
                >
                  <Plus size={16} /> Thêm
                </button>

                {openAddPopup && (
                  <AddToCardPopup
                    onClose={() => setOpenAddPopup(false)}
                    onOpenLabels={() => setOpenLabelPopup(true)}
                    onOpenDate={() => setOpenDatePopup(true)}
                    onOpenChecklist={() => setOpenChecklistPopup(true)}
                  />
                )}

                {openLabelPopup && (
                  <LabelSelectorPopup
                    cardId={card.id}
                    boardId={boardId}
                    onBack={() => {
                      setOpenLabelPopup(false);
                      setOpenAddPopup(true);
                    }}
                    onClose={() => setOpenLabelPopup(false)}
                    onCreateLabel={() => {
                      setOpenLabelPopup(false);
                      setOpenCreateLabel(true);
                    }}
                    onEditLabel={(label) => {
                      setEditingLabel(label);
                      setOpenLabelPopup(false);
                      setOpenEditLabel(true);
                    }}
                  />
                )}

                {openCreateLabel && (
                  <CreateLabelPopup
                    onBack={() => {
                      setOpenCreateLabel(false);
                      setOpenLabelPopup(true);
                    }}
                    onClose={() => setOpenCreateLabel(false)}
                    setTitleLabel={setTitleLabel}
                    titleLabel={titleLabel}
                    setSelectedColor={setSelectedColor}
                    selectedColor={selectedColor}
                    onCreateLabel={handleCreateLabel}
                  />
                )}

                {openEditLabel && editingLabel && (
                  <EditLabelPopup
                    onBack={() => {
                      setOpenEditLabel(false);
                      setOpenLabelPopup(true);
                    }}
                    onClose={() => setOpenEditLabel(false)}
                    titleLabel={editingLabel.name || ""}
                    setTitleLabel={(val) =>
                      setEditingLabel({ ...editingLabel, name: val })
                    }
                    selectedColor={editingLabel.color}
                    setSelectedColor={(color) =>
                      setEditingLabel({ ...editingLabel, color })
                    }
                    onUpdateLabel={async () => {
                      await updateLabelStore(
                        editingLabel.id,
                        card.id,
                        editingLabel.name,
                        editingLabel.color,
                      );
                      setOpenEditLabel(false);
                    }}
                    onDeleteLabel={async () => {
                      await deleteLabelStore(editingLabel.id, card.id);
                      setOpenEditLabel(false);
                    }}
                  />
                )}

                {openChecklistPopup && (
                  <ChecklistPopup
                    card={currentCard}
                    onClose={() => setOpenChecklistPopup(false)}
                    onBack={() => {
                      setOpenChecklistPopup(false);
                      setOpenAddPopup(true);
                    }}
                  />
                )}

                {openDatePopup && (
                  <DateSelectorPopup
                    cardId={card.id}
                    onBack={() => {
                      setOpenDatePopup(false);
                      setOpenAddPopup(true);
                    }}
                    onClose={() => setOpenDatePopup(false)}
                  />
                )}
              </div>

              <button
                onClick={() => {
                  closeAllPopups();
                  setOpenDatePopup(true);
                }}
                className="btn flex items-center gap-2"
              >
                <Calendar size={16} /> Ngày
              </button>

              <button
                onClick={() => {
                  closeAllPopups();
                  setOpenChecklistPopup(true);
                }}
                className="btn flex items-center gap-2"
              >
                <CheckSquare size={16} /> Việc cần làm
              </button>

              <div className="relative">
                <button
                  onClick={() => {
                    closeAllPopups();
                    setOpenMemberPopup(true);
                  }}
                  className="btn flex items-center gap-2"
                >
                  <Users size={16} /> Thành viên
                </button>

                {openMemberPopup && (
                  <MemberSelectorPopup
                    members={boardMembers}
                    onClose={() => setOpenMemberPopup(false)}
                    onSelect={(userId) => {
                      addMember(currentCard.id, userId);
                      setOpenMemberPopup(false);
                    }}
                  />
                )}
              </div>

              <button className="btn flex items-center gap-2">
                <Paperclip size={16} /> Đính kèm
              </button>
            </div>

            {/* Sections */}
            <div className="flex flex-wrap gap-6">
              <CardLabelsSection
                labels={labels}
                onEditLabel={(label) => {
                  setEditingLabel(label);
                  setOpenEditLabel(true);
                }}
                onAddLabel={() => setOpenCreateLabel(true)}
              />

              <CardDeadline
                deadline={currentCard.deadline_date}
                onClick={() => setOpenDatePopup(true)}
              />
            </div>

            <CardMembersSection cardId={currentCard.id} />
            <CardDescriptionSection
              cardId={currentCard.id}
              initialDescription={currentCard.description || ""}
              onUpdate={(desc) =>
                onUpdateCard(currentCard.id, { description: desc })
              }
            />

            <CardChecklistSection cardId={currentCard.id} />
          </div>

          <div className="w-full md:w-[320px] border-l bg-gray-50 flex flex-col shrink-0 overflow-hidden">
            <div className="p-4 border-b shrink-0 bg-gray-50 z-10">
              <p className="font-bold text-gray-700 uppercase text-xs tracking-wider">
                Nhận xét và hoạt động
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <CardCommentsSection cardId={currentCard.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
