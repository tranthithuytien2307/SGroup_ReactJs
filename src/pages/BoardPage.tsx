import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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
import { getBoardMember } from "../features/board/model/getBoardMember";
import type {
  BoardMember,
  WorkspaceMember,
} from "../entities/users/type/types";
import { getWorkspaceMembers } from "../features/workspace/model/getWorkspaceMembers";
import { useCardStore } from "../features/card/model/cardStore";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { useBoardStore } from "../features/board/model/boardStore";
import { useListStore } from "../features/list/model/listStore";

export default function BoardPage() {
  const { id } = useParams();
  const boardId = Number(id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [board, setBoard] = useState<Board | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [listTitle, setListTitle] = useState("");
  const [boardMember, setBoardMember] = useState<BoardMember[]>([]);
  const [workspaceMembers, setWorkspaceMembers] = useState<WorkspaceMember[]>(
    [],
  );

  const moveCardStore = useCardStore((state) => state.moveCard);
  const cards = useCardStore((state) => state.cards);
  const setCards = useCardStore((state) => state.setCards);
  const addCardStore = useCardStore((state) => state.addCard);
  const updateCardStore = useCardStore((state) => state.updateCardDetail);
  const deleteCardStore = useCardStore((state) => state.deleteCard);
  const lists = useListStore((state) => state.lists);
  const setLists = useListStore((state) => state.setLists);
  const moveListStore = useListStore((state) => state.moveList);
  useEffect(() => {
    const fetchLink = async () => {
      if (!boardId) return;
      const boardData = await getBoardById(boardId);
      const listData = await getListByBoardId(boardId);
      const members = await getBoardMember(boardId);
      setBoardMember(members);

      const normalizedLists: List[] = listData.map((list: List) => ({
        ...list,
        Cards: Array.isArray(list.cards) ? list.cards : [],
      }));

      setLists(normalizedLists);

      setBoard(boardData);
      setCurrentBoard(boardData);
    };

    fetchLink();
  }, [boardId]);
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (type === "LIST") {
      const listId = parseInt(draggableId);

      const oldLists = [...lists];
      const newLists = [...lists];

      const [movedList] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, movedList);

      const updatedLists = newLists.map((l, index) => ({
        ...l,
        position: (index + 1) * 100,
      }));

      setLists(updatedLists);

      try {
        if (board?.id) {
          await moveListStore(listId, board.id, destination.index);
        }
      } catch (error) {
        console.error("Rollback LIST");
        setLists(oldLists);
      }

      return;
    }

    const cardId = parseInt(draggableId);
    const toListId = parseInt(destination.droppableId);

    const oldCards = [...cards];
    const newCards = [...cards];

    const movedIndex = newCards.findIndex((c) => c.id === cardId);
    if (movedIndex === -1) return;

    const [movedCard] = newCards.splice(movedIndex, 1);

    movedCard.list_id = toListId;

    const targetCards = newCards.filter((c) => c.list_id === toListId);

    targetCards.splice(destination.index, 0, movedCard);

    targetCards.forEach((c, index) => {
      c.position = (index + 1) * 100;
    });

    const updatedCards = newCards.map((c) => {
      if (c.list_id === toListId) {
        return targetCards.find((t) => t.id === c.id) || c;
      }
      return c;
    });

    if (!updatedCards.find((c) => c.id === movedCard.id)) {
      updatedCards.push(movedCard);
    }

    setCards(updatedCards);

    try {
      if (board?.id) {
        await moveCardStore(cardId, board.id, toListId, destination.index);
      }
    } catch (error) {
      console.error("Rollback CARD");
      setCards(oldCards);
    }
  };

  const currentBoard = useBoardStore((state) => state.currentBoard);
  const setCurrentBoard = useBoardStore((state) => state.setCurrentBoard);

  const backgroundStyle = currentBoard?.cover_url
    ? {
        backgroundImage: `url(${currentBoard.cover_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : currentBoard?.theme
      ? {
          background: currentBoard.theme,
        }
      : { backgroundColor: "#f1f2f4" };

  useEffect(() => {
    const allCards = lists.flatMap((list) => list.cards || []);
    setCards(allCards);
  }, [lists]);

  useEffect(() => {
    const fetchWorkspaceMembers = async () => {
      if (!board?.workspace_id) return;

      const members = await getWorkspaceMembers(board.workspace_id);

      setWorkspaceMembers(members);

      console.log("workspaceMembers:", members);
    };

    fetchWorkspaceMembers();
  }, [board]);

  useEffect(() => {
    if (!isModalOpen || !boardId || !board) return;

    const fetchInviteLink = async () => {
      if (board.invite_enabled) {
        try {
          const link = await linkShareInvite(boardId);
          setShareLink(link);
        } catch {
          setShareLink(null);
        }
      } else {
        setShareLink(null);
      }
    };

    fetchInviteLink();
  }, [isModalOpen, boardId, board?.invite_enabled]);

  const onrenameList = async (listId: number, newTitle: string) => {
    const prevLists = lists;

    const updated = prevLists.map((list) =>
      list.id === listId ? { ...list, name: newTitle } : list,
    );

    setLists(updated);

    try {
      await renameList(listId, newTitle);
    } catch (error) {
      setLists(prevLists);
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
    if (!boardId) return;

    await regenerateLinkShare(boardId);

    const link = await linkShareInvite(boardId);
    setShareLink(link);

    setBoard((prev) => (prev ? { ...prev, invite_enabled: true } : prev));
  };

  const handleDeleteLink = async () => {
    if (!boardId) return;

    await disableLinkShare(boardId);

    setShareLink(null);

    setBoard((prev) => (prev ? { ...prev, invite_enabled: false } : prev));
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
    try {
      await addCardStore(listId, title);
    } catch (error) {
      console.error("Failed to add card:", error);
    }
  };

  const onAddList = async (boardId: number, name: string) => {
    if (!name.trim()) return;

    const prevLists = lists;

    const tempList: List = {
      id: Date.now(),
      board_id: boardId,
      name,
      position: prevLists.length + 1,
      cover_url: null,
      is_archived: false,
      archived_at: null,
      cards: [],
    };

    setLists([...prevLists, tempList]);

    try {
      await createList(boardId, name);
      const listData = await getListByBoardId(boardId);
      setLists(listData);
    } catch (error) {
      setLists(prevLists);
      console.error("Failed to add list:", error);
    }
  };

  const handleAddList = () => {
    if (!listTitle.trim()) return;
    onAddList?.(boardId, listTitle.trim());
    setListTitle("");
    setIsAdding(false);
  };

  const onUpdateCard = async (cardId: number, data: any) => {
    try {
      await updateCardStore(cardId, data);
    } catch (error) {
      alert("Cập nhật thất bại!");
    }
  };

  const onDeleteCard = async (cardId: number) => {
    try {
      await deleteCardStore(cardId);
    } catch (error) {
      alert("Xóa thất bại!");
    }
  };

  const handleCancel = () => {
    setListTitle("");
    setIsAdding(false);
  };

  const onDeleteList = async (listId: number) => {
    if (!listId) return;

    const prevLists = lists;

    const updated = prevLists.filter((list) => list.id !== listId);

    setLists(updated);

    try {
      await deleteList(listId);
    } catch (error) {
      setLists(prevLists);
      console.error("Failed to delete list: ", error);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="h-screen flex flex-col" style={backgroundStyle}>
        <div className="flex-shrink-0">
          <BoardHeader
            boardName={board?.name || ""}
            handleInviteUser={() => setIsModalOpen(true)}
            onChangeBoardName={onChangeBoardName}
            boardMember={boardMember}
            boardId={boardId}
          />
        </div>

        <div className="flex-1 overflow-hidden">
          <Droppable droppableId="board" direction="horizontal" type="LIST">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="
                flex items-start gap-4 p-4
                h-full
                overflow-x-auto overflow-y-hidden
              "
              >
                {lists.map((list, index) => (
                  <Draggable
                    key={list.id}
                    draggableId={list.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex-shrink-0"
                      >
                        <div {...provided.dragHandleProps}>
                          <BoardList
                            boardId={boardId}
                            id={list.id}
                            title={list.name}
                            cards={Array.isArray(list.cards) ? list.cards : []}
                            onRename={onrenameList}
                            onAddCard={onAddCard}
                            onDeleteList={onDeleteList}
                            onUpdateCard={onUpdateCard}
                            onDeleteCard={onDeleteCard}
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}

                <div className="w-72 flex-shrink-0">
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
                      w-full rounded-2xl border border-dashed border-gray-300
                      bg-gray-50 px-4 py-3
                      text-sm text-gray-500 hover:text-gray-700
                    "
                    >
                      + Add a list
                    </button>
                  )}
                </div>
              </div>
            )}
          </Droppable>
        </div>

        {isModalOpen && (
          <InviteModal
            boardMembers={boardMember}
            workspaceMembers={workspaceMembers}
            shareLink={shareLink}
            setShareLink={setShareLink}
            onClose={() => setIsModalOpen(false)}
            onSendInvitation={handleSendInvitation}
            onCreateLink={handleCreateLink}
            onDeleteLink={handleDeleteLink}
          />
        )}
      </div>
    </DragDropContext>
  );
}
