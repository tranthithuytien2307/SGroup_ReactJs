import { ArrowLeft, X } from "lucide-react";
import { useState } from "react";
import { useCardStore } from "../../features/card/model/cardStore";

export default function DateSelectorPopup({
  onBack,
  onClose,
  cardId,
}: {
  onBack: () => void;
  onClose: () => void;
  cardId: number;
}) {
  const { updateCardDates, removeDeadline } = useCardStore();

  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  const [hasStartDate, setHasStartDate] = useState(false);

  const [startDate, setStartDate] = useState(getCurrentDate());
  const [startTime, setStartTime] = useState(getCurrentTime());
  const [dueDate, setDueDate] = useState(getCurrentDate());
  const [dueTime, setDueTime] = useState(getCurrentTime());

  const combineDateTimeToISO = (date: string, time: string) => {
    return new Date(`${date}T${time}:00`).toISOString();
  };
  const handleToggleStartDate = () => {
    setHasStartDate((prev) => {
      const newValue = !prev;

      if (newValue) {
        setStartDate(getCurrentDate());
        setStartTime(getCurrentTime());
      }

      return newValue;
    });
  };

  const handleSave = async () => {
    try {
      const deadlineISO = combineDateTimeToISO(dueDate, dueTime);

      const startISO = hasStartDate
        ? combineDateTimeToISO(startDate, startTime)
        : undefined;

      await updateCardDates(cardId, startISO, deadlineISO);

      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async () => {
    try {
      await removeDeadline(cardId);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="absolute top-12 left-0 w-[340px] bg-white shadow-2xl rounded-lg border z-[1000] max-h-[70vh] flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <button onClick={onBack}>
          <ArrowLeft size={18} />
        </button>

        <p className="font-semibold">Ngày</p>

        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border rounded-md p-2"
        />

        <div>
          <p className="text-sm text-gray-600 mb-1">Ngày bắt đầu</p>

          <div className="flex gap-2">
            <input
              type="checkbox"
              checked={hasStartDate}
              onChange={handleToggleStartDate}
            />

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              readOnly={!hasStartDate}
              className={`border rounded-md p-2 flex-1 
    ${!hasStartDate ? "bg-gray-100 cursor-not-allowed" : ""}
  `}
            />

            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              readOnly={!hasStartDate}
              className={`border rounded-md p-2 w-[110px] 
    ${!hasStartDate ? "bg-gray-100 cursor-not-allowed" : ""}
  `}
            />
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">Ngày hết hạn</p>

          <div className="flex gap-2">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border rounded-md p-2 flex-1"
            />

            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="border rounded-md p-2 w-[110px]"
            />
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-1">Định kỳ</p>

          <select className="w-full border rounded-md p-2">
            <option>Không bao giờ</option>
            <option>Mỗi ngày</option>
            <option>Mỗi tuần</option>
          </select>
        </div>

        {/* Reminder */}
        <div>
          <p className="text-sm text-gray-600 mb-1">Thiết lập Nhắc nhở</p>

          <select className="w-full border rounded-md p-2">
            <option>1 Ngày trước</option>
            <option>2 Ngày trước</option>
            <option>1 Tuần trước</option>
          </select>

          <p className="text-xs text-gray-500 mt-1">
            Nhắc nhở sẽ được gửi đến tất cả các thành viên và người theo dõi thẻ
            này.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white py-2 rounded-md"
          >
            Lưu
          </button>

          <button
            onClick={handleRemove}
            className="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-md transition"
          >
            Gỡ bỏ
          </button>
        </div>
      </div>
    </div>
  );
}
