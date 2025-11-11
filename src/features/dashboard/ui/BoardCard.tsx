import { Ellipsis, Kanban, SquarePen, Trash, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuPortal,
} from "@/shared/ui/dropdown-menu";
type Board = {
  id: number | string;
  name: string;
};

type BoardCardProps = {
  boards: Board[];
};

export default function BoardCard({ boards }: BoardCardProps) {
  return (
    <div className="flex gap-5 flex-wrap">
      {boards.map((board) => (
        <div key={board.id} className="relative">
          <div className="group min-w-70 border rounded-xl shadow-sm bg-white hover:shadow-md transition cursor-pointer p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="absolute top-2 right-2 hidden group-hover:flex items-center justify-center p-2 hover:bg-gray-100 rounded-md">
                  <Ellipsis className="w-5 h-5 text-gray-500" />
                </button>
              </DropdownMenuTrigger>

              {/* KHÔNG thêm `position` nữa */}
              <DropdownMenuContent
                side="bottom"
                align="end"
                sideOffset={6}
                className="z-[9999] w-40 rounded-lg border bg-white shadow-lg"
              >
                <DropdownMenuItem className="flex items-center gap-2 px-3 py-2">
                  <SquarePen className="h-4 w-4" /> Edit Board
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 px-3 py-2">
                  <Trash className="h-4 w-4 text-red-500" />
                  <span className="text-red-500">Delete Board</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* content */}
            <div className="p-3 flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <Kanban className="h-4 w-4" />
                <h3 className="font-medium text-gray-800">{board.name}</h3>
              </div>
              <p className="text-sm text-gray-500">Main</p>
              <div className="flex justify-between">
                <p>1-3 lists</p>
                <div className="flex gap-1 items-center">
                  <User className="w-4 h-4" />
                  <p>1</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
