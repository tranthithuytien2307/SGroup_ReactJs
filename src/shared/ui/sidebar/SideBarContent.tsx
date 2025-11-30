import { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import { ChevronDown, ChevronRight, LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Board {
  id: string | number;
  name: string;
}
interface Props {
  boards: Board[];
}

export default function SideBarContent({ boards }: Props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBoardDetail = (id: number | string) => {
    navigate(`/dashboard/board/${id}`);
  };

  return (
    <div className="flex flex-col gap-4 p-2">
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
          Navigation
        </p>
        <button className="flex items-center gap-2 text-sm font-medium bg-muted px-2 py-1.5 rounded-md w-full cursor-pointer">
          <LayoutGrid className="w-4 h-4" />
          Dashboard
        </button>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
          Boards
        </p>

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-sm font-medium px-2 py-1.5 rounded-md hover:bg-muted w-full transition-colors"
        >
          {open ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          All Boards
        </button>

        {open && (
          <div className="ml-6 mt-1 flex flex-col gap-1">
            {loading && <LoadingSpinner />}
            {error && <p className="text-xs text-red-500 italic">{error}</p>}
            {!loading && !error && boards.length === 0 && (
              <p className="text-xs text-muted-foreground italic">
                Chưa có board nào
              </p>
            )}
            {Array.isArray(boards) &&
              boards.map((board) => (
                <button
                  key={board.id}
                  className="text-sm hover:bg-gray-100 px-2 py-1 rounded-md text-left transition-colors cursor-pointer"
                  onClick={() => handleBoardDetail(board.id)}
                >
                  {board.name}
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
