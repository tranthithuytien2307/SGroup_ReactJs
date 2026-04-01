import { X } from "lucide-react";
import { useState } from "react";
import type { BoardMember } from "../../../entities/users/type/types";

export default function MemberSelectorPopup({
  members,
  onClose,
  onSelect,
}: {
  members: BoardMember[];
  onClose: () => void;
  onSelect: (userId: number) => void;
}) {
  const [search, setSearch] = useState("");

  const filteredMembers = members.filter((m) =>
    m.user.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="absolute top-12 left-0 w-80 bg-white rounded-xl shadow-lg border z-50">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <p className="font-semibold">Thành viên</p>
        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      {/* Search */}
      <div className="p-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm các thành viên"
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring"
        />
      </div>

      {/* List */}
      <div className="px-3 pb-3">
        <p className="text-xs text-gray-500 mb-2">Thành viên của bảng</p>

        <div className="space-y-1 max-h-60 overflow-y-auto">
          {filteredMembers.map((member) => {
            const user = member.user;

            return (
              <div
                key={member.id}
                onClick={() => onSelect(user.id)} // ✅ dùng user.id
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer"
              >
                {/* Avatar */}
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
                    {user.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                )}

                <span className="text-sm">{user.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
