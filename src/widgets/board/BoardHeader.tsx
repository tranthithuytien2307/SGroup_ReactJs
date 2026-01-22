import { MoreHorizontal, SquarePen } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface BoardHeaderProps {
  boardName: string;
  handleInviteUser: () => void;
  onChangeBoardName?: (name: string) => void;
}

export default function BoardHeader({
  boardName,
  handleInviteUser,
  onChangeBoardName,
}: BoardHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(boardName);
  const inputRef = useRef<HTMLInputElement>(null);

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
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-2">
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
            className="text-lg font-semibold border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <>
            <h1 className="text-lg font-semibold">{boardName}</h1>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => {
                setIsEditing(true);
                setName(boardName);
              }}
            >
              <SquarePen className="w-4 h-4 text-gray-600" />
            </button>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
          onClick={handleInviteUser}
        >
          Invite
        </button>
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
          J
        </div>
        <button className="p-1 rounded-full hover:bg-gray-100 cursor-pointer">
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
}
