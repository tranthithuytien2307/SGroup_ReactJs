import React from "react";
import { User, MoreHorizontal, SquarePen } from "lucide-react";

interface BoardHeaderProps {
  boardName: string;
  handleInviteUser: () => void;
}

export default function BoardHeader({
  boardName,
  handleInviteUser,
}: BoardHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold">{boardName}</h1>
        <button className="text-gray-500 hover:text-gray-700">
          <SquarePen className="w-4 h-4 text-gray-600" />
        </button>
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
