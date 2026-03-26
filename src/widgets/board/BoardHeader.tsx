import { MoreHorizontal, SquarePen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { BoardMember } from "../../entities/users/type/types";
import BoardMenu from "./BoardMenu";

interface BoardHeaderProps {
  boardName: string;
  handleInviteUser: () => void;
  onChangeBoardName?: (name: string) => void;
  boardMember: BoardMember[];
  boardId: number;
}

export default function BoardHeader({
  boardName,
  handleInviteUser,
  onChangeBoardName,
  boardMember,
  boardId,
}: BoardHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(boardName);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (name.trim() && name !== boardName) {
      onChangeBoardName?.(name.trim());
    }
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between h-16 shrink-0 px-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2 flex-1 min-w-0 max-w-[600px] overflow-hidden">
          {isEditing ? (
            <input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") {
                  setName(boardName);
                  setIsEditing(false);
                }
              }}
              className="w-full min-w-0 text-lg font-semibold border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
              <h1 className="flex-1 min-w-0 truncate text-lg font-semibold">
                {boardName}
              </h1>

              <button
                className="shrink-0 text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setIsEditing(true);
                  setName(boardName);
                }}
              >
                <SquarePen className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={handleInviteUser}
          >
            Invite
          </button>

          <div className="flex -space-x-2">
            {boardMember.slice(0, 3).map((member) => (
              <img
                key={member.id}
                src={member.user.avatar_url || ""}
                alt={member.user.name}
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
              />
            ))}

            {boardMember.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs border-2 border-white">
                +{boardMember.length - 3}
              </div>
            )}
          </div>

          <button
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={() => {
              setIsMenuOpen(true);
            }}
          >
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/10 z-[90]"
            onClick={() => setIsMenuOpen(false)}
          />
          <BoardMenu
            onClose={() => setIsMenuOpen(false)}
            boardMember={boardMember}
            boardId={boardId}
          />
        </>
      )}
    </div>
  );
}
