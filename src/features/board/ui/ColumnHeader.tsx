import { useState } from "react";
import { MoreVertical } from "lucide-react";

type ColumnHeaderProps = {
  title: string;
  onRename: (newTitle: string) => void;
};

export default function ColumnHeader({ title, onRename }: ColumnHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(title);

  const handleBlur = () => {
    setIsEditing(false);
    if (value.trim() !== title) {
      onRename(value.trim());
    }
  };

  return (
    <div className="flex items-center justify-between px-2 py-1">
      {isEditing ? (
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          className="border border-gray-300 rounded-md px-2 py-1 w-full outline-none focus:ring-2 focus:ring-gray-300"
        />
      ) : (
        <span
          className="font-medium cursor-pointer hover:bg-gray-100 px-1 rounded"
          onClick={() => setIsEditing(true)}
        >
          {title}
        </span>
      )}

      <MoreVertical className="w-5 h-5 cursor-pointer text-gray-600 hover:text-black" />
    </div>
  );
}
