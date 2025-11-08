import { Kanban, User } from "lucide-react";
type Board = {
  id: number | string;
  name: string;
};

type BoardCardProps = {
  boards: Board[];
};

export default function BoardCard({ boards }: BoardCardProps) {
  return (
    <div className="flex gap-5">
      {boards.map((board: Board) => (
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
  );
}
