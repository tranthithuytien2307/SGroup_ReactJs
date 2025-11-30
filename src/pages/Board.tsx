import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import BoardList from "@/features/board/ui/BoardList";
import BoardHeader from "@/features/board/ui/BoardHeader";
import InviteModal from "@/features/board/ui/InviteModal";
import { invitationEmail } from "@/features/board/model/invitationEmail";
import { linkShareInvite } from "@/features/board/model/linkShareInvite";
import { regenerateLinkShare } from "@/features/board/model/regenerateLinkShare";
import { disableLinkShare } from "@/features/board/model/disableLinkShare";

const mockBoard = {
  name: "Project Alpha",
  lists: [
    {
      id: 1,
      title: "To Do",
      cards: [
        {
          id: 1,
          title: "Setup project repository",
          description: "Initialize folder structure",
        },
        {
          id: 2,
          title: "Design system components",
          description: "Create reusable UI components",
        },
      ],
    },
    {
      id: 2,
      title: "In Progress",
      cards: [
        { id: 3, title: "Implement auth", description: "Login + register" },
      ],
    },
    {
      id: 3,
      title: "Done",
      cards: [
        { id: 4, title: "Project planning", description: "Define timeline" },
      ],
    },
  ],
};

const users = [
  { name: "John Doe", email: "john@example.com", avatar: "/avatars/john.png" },
  { name: "Jane Smith", email: "jane@example.com" },
  { name: "Bob Johnson", email: "bob@example.com", avatar: "/avatars/bob.png" },
];

export default function BoardPage() {
  const { id } = useParams();
  const boardId = Number(id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lists, setLists] = useState(mockBoard.lists);
  const [shareLink, setShareLink] = useState<string | null>(null);

  useEffect(() => {
    const fetchLink = async () => {
      if (!boardId) return;
      const link = await linkShareInvite(boardId);
      setShareLink(link);
    };
    fetchLink();
  }, [boardId]);

  function renameList(listId: number, newTitle: string) {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId ? { ...list, title: newTitle } : list
      )
    );
  }

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

  return (
    <div className="flex-1 flex-col h-screen">
      <BoardHeader
        boardName={mockBoard.name}
        handleInviteUser={() => setIsModalOpen(true)}
      />

      <div className="flex-1 overflow-x-auto">
        <div className="flex items-start space-x-4 p-4">
          {lists.map((list) => (
            <BoardList
              key={list.id}
              id={list.id}
              title={list.title}
              cards={list.cards}
              onRename={renameList}
            />
          ))}

          <button className="w-64 flex-shrink-0 bg-gray-100 rounded-md p-3 text-left text-gray-500 hover:text-gray-700 hover:bg-gray-200 cursor-pointer">
            + Add a list
          </button>
        </div>
      </div>

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
    </div>
  );
}
