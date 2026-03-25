import { use, useEffect, useRef, useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

type ColumnHeaderProps = {
  title: string;
  onRename: (newTitle: string) => void;
  onDelete?: () => void;
};

export default function ColumnHeader({
  title,
  onRename,
  onDelete,
}: ColumnHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [titleList, setTitleList] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hanldeClickOutSide = (event: MouseEvent) => {
      if (
        showMenu &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", hanldeClickOutSide);
    return () => {
      document.removeEventListener("mousedown", hanldeClickOutSide);
    };
  });

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (titleList.trim() && titleList !== title) {
      onRename(titleList.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="relative flex items-center justify-between gap-2 px-2 py-1 min-w-0">
      {isEditing ? (
        <input
          ref={inputRef}
          value={titleList}
          onChange={(e) => setTitleList(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setTitleList(title);
              setIsEditing(false);
            }
          }}
          className="
          w-full min-w-0
          rounded-md border border-gray-300
          px-2 py-1 text-sm
          outline-none focus:ring-2 focus:ring-gray-300
        "
        />
      ) : (
        <div className="relative flex-1 min-w-0 group">
          <span
            className="block truncate font-medium cursor-pointer px-1 rounded hover:bg-gray-100"
            onClick={() => setIsEditing(true)}
          >
            {title}
          </span>

          <div
            className="
      pointer-events-none
      absolute left-0 top-full mt-1
      hidden group-hover:block
      z-20
      max-w-xs
      rounded-md
      bg-gray-900 text-white text-xs
      px-2 py-1
      shadow-lg
      break-words
    "
          >
            {title}
          </div>
        </div>
      )}

      <button
        onClick={() => setShowMenu((v) => !v)}
        className="shrink-0 rounded-md p-1 hover:bg-gray-100"
      >
        <MoreVertical className="h-5 w-5 text-gray-600" />
      </button>

      {showMenu && (
        <div
          ref={menuRef}
          className="absolute right-2 top-9 z-10 w-32 rounded-lg border bg-white shadow-md"
        >
          <button
            onClick={() => {
              setIsEditing(true);
              setShowMenu(false);
            }}
            className="
              flex w-full items-center gap-2
              px-3 py-2 text-sm
              hover:bg-gray-100
            "
          >
            <Pencil className="h-4 w-4" />
            Rename
          </button>

          <button
            onClick={() => {
              setShowMenu(false);
              onDelete?.();
            }}
            className="
              flex w-full items-center gap-2
              px-3 py-2 text-sm text-red-600
              hover:bg-red-50
            "
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
