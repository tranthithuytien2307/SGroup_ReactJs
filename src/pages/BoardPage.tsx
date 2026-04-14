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
import { renameList } from "../features/list/model/renameList";
import AddItemForm from "../shared/ui/AddItemForm";
import { createList } from "../features/list/model/createList";
import { deleteList } from "../features/list/model/deleteList";
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
import { socket } from "../shared/lib/socket";

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
  const currentBoard = useBoardStore((state) => state.currentBoard);
  const setCurrentBoard = useBoardStore((state) => state.setCurrentBoard);

  const applyBoardState = (boardData: Board, listData: List[]) => {
    const normalizedLists: List[] = listData.map((list: List) => ({
      ...list,
      cards: Array.isArray(list.cards) ? list.cards : [],
    }));

    setLists(normalizedLists);
    setBoard(boardData);
    setCurrentBoard(boardData);
  };

  const refreshBoardState = async () => {
    if (!boardId) return;

    const [boardData, listData, members] = await Promise.all([
      getBoardById(boardId),
      getListByBoardId(boardId),
      getBoardMember(boardId),
    ]);

    if (!boardData || !listData) return;

    setBoardMember(members || []);
    applyBoardState(boardData, listData);
  };

  useEffect(() => {
    void refreshBoardState();
  }, [boardId]);
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    const boardVersion = currentBoard?.version ?? board?.version;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

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
        if (board?.id && boardVersion !== undefined) {
          await moveListStore(
            listId,
            board.id,
            destination.index,
            boardVersion,
          );
        }
      } catch (error) {
        console.error("Rollback LIST");
        setLists(oldLists);
        await refreshBoardState();
      }

      return;
    }

    const cardId = parseInt(draggableId);
    const sourceListId = parseInt(source.droppableId);
    const toListId = parseInt(destination.droppableId);

    const oldCards = [...cards];
    const movedCard = oldCards.find((card) => card.id === cardId);
    if (!movedCard) return;

    const sourceCards = oldCards
      .filter((card) => card.list_id === sourceListId)
      .sort((a, b) => a.position - b.position);

    const targetCards =
      sourceListId === toListId
        ? sourceCards
        : oldCards
            .filter((card) => card.list_id === toListId)
            .sort((a, b) => a.position - b.position);

    const nextSourceCards = sourceCards.filter((card) => card.id !== cardId);
    const nextTargetCards =
      sourceListId === toListId ? nextSourceCards : [...targetCards];

    const movedCardNext = { ...movedCard, list_id: toListId };
    nextTargetCards.splice(destination.index, 0, movedCardNext);

    const reindexedSourceCards =
      sourceListId === toListId
        ? nextTargetCards.map((card, index) => ({
            ...card,
            position: (index + 1) * 100,
          }))
        : nextSourceCards.map((card, index) => ({
            ...card,
            position: (index + 1) * 100,
          }));

    const reindexedTargetCards =
      sourceListId === toListId
        ? reindexedSourceCards
        : nextTargetCards.map((card, index) => ({
            ...card,
            position: (index + 1) * 100,
          }));

    const updatedCards = oldCards
      .filter(
        (card) =>
          card.list_id !== sourceListId &&
          card.list_id !== toListId &&
          card.id !== cardId,
      )
      .concat(reindexedSourceCards)
      .concat(sourceListId === toListId ? [] : reindexedTargetCards);

    setCards(updatedCards);

    try {
      if (board?.id && boardVersion !== undefined) {
        await moveCardStore(
          cardId,
          board.id,
          toListId,
          destination.index,
          boardVersion,
        );
      }
    } catch (error) {
      console.error("Rollback CARD");
      setCards(oldCards);
      await refreshBoardState();
    }
  };

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
    if (!boardId) return;

    const handleBoardStateUpdated = (payload: {
      boardId: number;
      boardVersion: number;
      lists: List[];
    }) => {
      if (payload.boardId !== boardId) return;

      const nextBoard = {
        ...(useBoardStore.getState().currentBoard ?? board ?? { id: boardId }),
        version: payload.boardVersion,
      } as Board;

      setBoard(nextBoard);
      setCurrentBoard(nextBoard);
      setLists(payload.lists);
      setCards(payload.lists.flatMap((list) => list.cards || []));
    };

    socket.emit("join-board", boardId);
    socket.on("board:state-updated", handleBoardStateUpdated);

    return () => {
      socket.emit("leave-board", boardId);
      socket.off("board:state-updated", handleBoardStateUpdated);
    };
  }, [boardId, board, setCards, setLists, setCurrentBoard]);

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
    const currentList = prevLists.find((list) => list.id === listId);
    if (!currentList) return;

    const updated = prevLists.map((list) =>
      list.id === listId ? { ...list, name: newTitle } : list,
    );

    setLists(updated);

    try {
      await renameList(listId, newTitle, currentList.version);
    } catch (error) {
      setLists(prevLists);
      console.error("Failed to rename list: ", error);
      await refreshBoardState();
    }
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
      version: 0,
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
                flex items-start p-4
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
                        className="w-72 flex-shrink-0 pr-4"
                      >
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
                          dragHandleProps={provided.dragHandleProps}
                        />
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
