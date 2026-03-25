import { useState } from "react";

export default function CardMembersSection() {
  const users = ["Jane", "Bob", "Alex"];

  const [members, setMembers] = useState<string[]>([]);

  return (
    <div className="space-y-2">
      <p className="font-medium">Thành viên</p>

      <div className="flex gap-2 flex-wrap">
        {members.map((m) => (
          <div
            key={m}
            className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full text-sm"
          >
            {m[0]}
          </div>
        ))}

        <button className="w-8 h-8 bg-gray-200 rounded-full">+</button>
      </div>
    </div>
  );
}
