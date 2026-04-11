import { useEffect, useRef, useState } from "react";
import CopyListModal from "../list/CopyListModal";
import MoveListModal from "../list/MoveListModal";
import { useListStore } from "../../features/list/model/listStore";

type ColumnHeaderProps = {
  title: string;
  onRename: (newTitle: string) => void;
  onDelete?: () => void;
  onAddCard?: () => void;
  listId: number;
};

export default function ColumnHeader({
  title,
  onRename,
  onDelete,
  onAddCard,
  listId,
}: ColumnHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [titleList, setTitleList] = useState(title);

  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const archiveList = useListStore((s) => s.archiveList);

  const [view, setView] = useState<
    "main" | "copy" | "move" | "watch" | "archive"
  >("main");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showMenu &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
        setView("main");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

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

  const handleCloseMenu = () => {
    setShowMenu(false);
    setView("main");
  };

  const handleArchive = async () => {
    await archiveList(listId);
    handleCloseMenu();
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
          className="w-full min-w-0 rounded-md border border-gray-300 px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-gray-300"
        />
      ) : (
        <div className="relative flex-1 min-w-0 group">
          <span
            className="block truncate font-medium cursor-pointer px-1 rounded hover:bg-gray-100"
            onClick={() => setIsEditing(true)}
          >
            {title}
          </span>

          <div className="pointer-events-none absolute left-0 top-full mt-1 hidden group-hover:block z-20 max-w-xs rounded-md bg-gray-900 text-white text-xs px-2 py-1 shadow-lg break-words">
            {title}
          </div>
        </div>
      )}

      <button
        onClick={() => setShowMenu((v) => !v)}
        className="shrink-0 rounded-md p-1 hover:bg-gray-100"
      >
        ...
      </button>

      {showMenu && view === "main" && (
        <div
          ref={menuRef}
          className="absolute right-0 top-10 z-50 w-72 translate-x-full ml-2 rounded-xl border bg-white shadow-xl"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <span className="text-sm font-semibold text-gray-700">
              Thao tác
            </span>
            <button
              onClick={handleCloseMenu}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100"
            >
              ✕
            </button>
          </div>

          <div className="py-2 text-sm text-gray-700">
            <button
              onClick={() => {
                onAddCard?.();
                handleCloseMenu();
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Thêm thẻ
            </button>

            <button
              onClick={() => setView("copy")}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Sao chép danh sách
            </button>

            <button
              onClick={() => setView("move")}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Di chuyển danh sách
            </button>

            <button
              onClick={() => setView("watch")}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Theo dõi
            </button>

            <div className="border-t my-2" />

            <button
              onClick={handleArchive}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
            >
              Lưu trữ danh sách này
            </button>
          </div>
        </div>
      )}

      {showMenu && view === "copy" && (
        <CopyListModal
          initialTitle={title}
          onClose={handleCloseMenu}
          listId={listId}
        />
      )}

      {showMenu && view === "move" && (
        <MoveListModal
          onClose={handleCloseMenu}
          onBack={() => setView("main")}
          listId={listId}
        />
      )}
    </div>
  );
}
