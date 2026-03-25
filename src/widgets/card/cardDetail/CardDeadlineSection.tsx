import { Clock } from "lucide-react";

type Props = {
  deadline?: string | null;
  onClick?: () => void;
};

const formatDateTime = (iso?: string) => {
  if (!iso) return "";

  const d = new Date(iso);
  const time = d.toTimeString().slice(0, 5);
  const day = d.getDate();
  const month = d.getMonth() + 1;

  return `${time} ${day} thg ${month}`;
};

const getStatusColor = (iso?: string) => {
  if (!iso) return "bg-gray-100 text-gray-800";

  const now = new Date();
  const due = new Date(iso);
  const diff = due.getTime() - now.getTime();

  if (diff < 0) return "bg-red-500 text-white";
  if (diff < 24 * 60 * 60 * 1000) return "bg-yellow-300 text-yellow-900";

  return "bg-gray-100 text-gray-800";
};

export default function CardDeadline({ deadline, onClick }: Props) {
  if (!deadline) return null;

  return (
    <div>
      <p className="font-medium mb-2 text-gray-700">Ngày hết hạn</p>

      <div
        onClick={onClick}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer transition hover:opacity-80 ${getStatusColor(
          deadline,
        )}`}
      >
        <Clock size={14} />

        <span className="text-sm font-medium">{formatDateTime(deadline)}</span>
      </div>
    </div>
  );
}
