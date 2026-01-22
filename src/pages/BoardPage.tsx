import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import BoardList from "../widgets/board/BoardList";
import BoardHeader from "../widgets/board/BoardHeader";
import InviteModal from "../widgets/board/inviteMember/InviteModal";
import { invitationEmail } from "../features/board/model/invitationEmail";
import { linkShareInvite } from "../features/board/model/linkShareInvite";
import { regenerateLinkShare } from "../features/board/model/regenerateLinkShare";
import { disableLinkShare } from "../features/board/model/disableLinkShare";
import { getBoardById } from "../features/board/model/getBoardById";
import type { Board } from "../entities/board/model/boardType";
import { getListByBoardId } from "../features/list/model/getListByBoardId";
import type { List } from "../entities/list/model/listType";
import { changeBoardName } from "../features/board/model/changeBoardName";
import { Plus } from "lucide-react";
import { renameList } from "../features/list/model/renameList";
import { createCard } from "../features/card/model/createCard";
import type { Card } from "../entities/card/model/cardType";
import AddItemForm from "../shared/ui/AddItemForm";
import { createList } from "../features/list/model/createList";
import { deleteList } from "../features/list/model/deleteList";
import { updateCard } from "../features/card/model/updateCard";
import { deleteCrad } from "../features/card/model/deleteCard";

// const users = [
//   { name: "John Doe", email: "john@example.com", avatar: "/avatars/john.png" },
//   { name: "Jane Smith", email: "jane@example.com" },
//   { name: "Bob Johnson", email: "bob@example.com", avatar: "/avatars/bob.png" },
// ];

export default function BoardPage() {
  const { id } = useParams();
  const boardId = Number(id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lists, setLists] = useState<List[]>([]);
  const [board, setBoard] = useState<Board | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [listTitle, setListTitle] = useState("");

  useEffect(() => {
    const fetchLink = async () => {
      if (!boardId) return;
      const boardData = await getBoardById(boardId);
      const listData = await getListByBoardId(boardId);

      const normalizedLists: List[] = listData.map((list: List) => ({
        ...list,
        Cards: Array.isArray(list.cards) ? list.cards : [],
      }));

      setLists(normalizedLists);

      setBoard(boardData);
    };
    fetchLink();
  }, [boardId]);

  const onrenameList = async (listId: number, newTitle: string) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId ? { ...list, name: newTitle } : list,
      ),
    );
    try {
      await renameList(listId, newTitle);
    } catch (error) {
      setLists(lists);
      console.error("Failed to rename list: ", error);
    }
  };

  const hanldeGetLink = async () => {
    if (!boardId) return;
    const link = await linkShareInvite(boardId);
    setShareLink(link);
  };

  const handleSendInvitation = async (email: string) => {
    if (!boardId) return;
    await invitationEmail(boardId, email);
  };

  const handleCreateLink = async () => {
    regenerateLinkShare(boardId);
    const link = await linkShareInvite(boardId);
    setShareLink(link);
  };

  const handleDeleteLink = async () => {
    disableLinkShare(boardId);
  };

  const onChangeBoardName = async (name: string) => {
    setBoard((prev) => (prev ? { ...prev, name } : prev));
    try {
      await changeBoardName(boardId, name);
    } catch (error) {
      setBoard(board);
      console.error("Failed to change board name:", error);
    }
  };

  const onAddCard = async (listId: number, title: string) => {
    if (!title.trim()) return;

    const tempCard: Card = {
      id: Date.now(),
      list_id: listId,
      title,
      position: 9999,
      is_archived: false,
      archived_at: null,
      description: null,
      strat_date: null,
      deadline_date: null,
      is_completed: false,
      cover_color: null,
      cover_image_url: null,
      cover_url: null,
    };

    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              Cards: [
                ...(Array.isArray(list.cards) ? list.cards : []),
                tempCard,
              ],
            }
          : list,
      ),
    );

    try {
      await createCard(listId, title);
      const listData = await getListByBoardId(boardId);
      setLists(listData);
    } catch (error) {
      setLists((prev) =>
        prev.map((list) =>
          list.id === listId
            ? {
                ...list,
                Cards: list.cards.filter((c) => c.id !== tempCard.id),
              }
            : list,
        ),
      );
      console.error("Failed to add card: ", error);
    }
  };

  const onAddList = async (boardId: number, name: string) => {
    if (!name.trim()) return;

    const tempList: List = {
      id: Date.now(),
      board_id: boardId,
      name,
      position: lists.length + 1,
      cover_url: null,
      is_archived: false,
      archived_at: null,
      cards: [],
    };

    setLists((prev) => [...prev, tempList]);

    try {
      await createList(boardId, name);
      const listData = await getListByBoardId(boardId);
      setLists(listData);
    } catch (error) {
      setLists((prev) => prev.filter((l) => l.id !== tempList.id));
      console.error("Failed to add list:", error);
    }
  };

  const handleAddList = () => {
    if (!listTitle.trim()) return;
    onAddList?.(boardId, listTitle.trim());
    setListTitle("");
    setIsAdding(false);
  };

  const onUpdateCard = async (
    cardId: number,
    data: { title?: string; description?: string },
  ) => {
    if (!cardId) return;
    try {
      await updateCard(cardId, data);
      const listData = await getListByBoardId(boardId);
      setLists(listData);
    } catch (error) {
      console.error("Failed to update card: ", error);
      setLists(lists);
    }
  };

  const onDeleteCard = async (cardId: number) => {
    if (!cardId) return;
    try {
      await deleteCrad(cardId);
      const listData = await getListByBoardId(boardId);
      setLists(listData);
    } catch (error) {
      console.error("Failed to delete card: ", error);
      setLists(lists);
    }
  };

  const handleCancel = () => {
    setListTitle("");
    setIsAdding(false);
  };

  const onDeleteList = async (listId: number) => {
    if (!listId) return;
    setLists((prev) => prev.filter((list) => list.id !== listId));
    try {
      await deleteList(listId);
    } catch (error) {
      console.error("Failed to delete list: ", error);
      setLists(lists);
    }
  };

  return (
    <div className="flex-1 flex-col h-screen">
      <BoardHeader
        boardName={board?.name || ""}
        handleInviteUser={() => setIsModalOpen(true)}
        onChangeBoardName={onChangeBoardName}
      />

      <div className="flex-1 overflow-x-auto">
        <div className="flex items-start space-x-4 p-4">
          {lists &&
            lists.map((list) => (
              <BoardList
                key={list.id}
                id={list.id}
                title={list.name}
                cards={Array.isArray(list.cards) ? list.cards : []}
                onRename={onrenameList}
                onAddCard={onAddCard}
                onDeleteList={onDeleteList}
                onUpdateCard={onUpdateCard}
                onDeleteCard={onDeleteCard}
              />
            ))}

          <div
            className="
              w-72 flex-shrink-0
              rounded-2xl border border-dashed border-gray-300
              bg-gray-50 px-4 py-3
            "
          >
            {isAdding ? (
              <AddItemForm
                value={listTitle}
                placeholder="Enter list title..."
                submitLabel="Add List"
                onChange={setListTitle}
                onSubmit={handleAddList}
                onCancel={handleCancel}
              />
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                className="
                  flex w-full items-center gap-2
                  text-sm font-medium text-gray-500
                  hover:text-gray-700
                  transition-colors duration-150
                "
              >
                <Plus className="h-4 w-4" />
                Add a list
              </button>
            )}
          </div>
        </div>
      </div>

      {/* <div onBlur={() => hanldeGetLink()}>
        {isModalOpen && (
          <InviteModal
            users={users}
            shareLink={shareLink}
            setShareLink={setShareLink}
            onClose={() => setIsModalOpen(false)}
            onSendInvitation={handleSendInvitation}
            onCreateLink={handleCreateLink}
            onDeleteLink={handleDeleteLink}
          />
        )}
      </div> */}
    </div>
  );
}
