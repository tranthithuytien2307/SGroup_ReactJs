import { Button } from "@/shared/ui/button";
import { WorkspaceIcon } from "@/shared/ui/icon/WorkspaceIcon";
import BoardCard from "./BoardCard";

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

      <BoardCard boards={boards} />
    </div>
  );
}
