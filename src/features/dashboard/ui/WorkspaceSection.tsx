import { Button } from "@/shared/ui/button";
import { Kanban, User } from "lucide-react";
import { WorkspaceIcon } from "@/shared/ui/icon/WorkspaceIcon";

type Board = {
  id: number | string;
  name: string;
};

type WorkspaceSectionProps = {
  id: number | string;
  name: string;
  description?: string;
  boards: Board[];
  countBoard: number;
  onAddBoard?: (workspaceId: number | string) => void;
};

export default function WorkspaceSection({
  id,
  name,
  description,
  boards,
  countBoard,
  onAddBoard,
}: WorkspaceSectionProps) {
  return (
    <div className="md-10 pt-7 pb-5">
      <div className="flex justify-between items-start mb-4 w-full">
        <div>
          <div className="flex gap-2">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <WorkspaceIcon />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
          </div>
          <p className="text-gray-500 text-sm">{description}</p>
          <p className="text-xs text-gray-400 mt-1">{countBoard} boards</p>
        </div>
        <Button onClick={() => onAddBoard?.(id)} className="cursor-pointer">
          + Add Moard
        </Button>
      </div>

      <div className="flex gap-5">
        {boards.map((board) => (
          <div
            key={board.id}
            className="min-w-70 border rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-md transition cursor-pointer p-4"
          >
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
        ))}
      </div>
    </div>
  );
}
