import CardItem from "./CardItem";
import ColumnHeader from "./ColumnHeader";

type Card = {
  id: number;
  title: string;
  description?: string;
  avatarUrl?: string;
};

type BoardListProps = {
  id: number;
  title: string;
  cards: Card[];
  onRename: (id: number, newTitle: string) => void;
};

export default function BoardList({
  id,
  title,
  cards,
  onRename,
}: BoardListProps) {
  return (
    <div className="bg-gray-100 p-3 rounded-md w-64 flex-shrink-0 h-auto">
      <ColumnHeader
        title={title}
        onRename={(newTitle: string) => onRename(id, newTitle)}
      />
      <div className="flex flex-col gap-2">
        {cards.length === 0 ? (
          <p className="text-gray-400 text-sm italic">No cards yet</p>
        ) : (
          cards.map((c) => (
            <CardItem
              key={c.id}
              title={c.title}
              description={c.description}
              avatars={c.avatarUrl ? [c.avatarUrl] : []}
            />
          ))
        )}
      </div>

      <button className="w-full mt-2 text-gray-500 text-sm p-2 hover:text-gray-700 hover:bg-gray-200 cursor-pointer text-left">
        + Add a card
      </button>
    </div>
  );
}
