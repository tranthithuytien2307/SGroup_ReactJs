import { useState, useEffect } from "react";
import { AlignLeft } from "lucide-react";

interface Props {
  cardId: number;
  initialDescription: string;
  onUpdate: (description: string) => Promise<void> | void;
}

export default function CardDescriptionSection({
  cardId,
  initialDescription,
  onUpdate,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempDesc, setTempDesc] = useState(initialDescription);
  const [isSaving, setIsSaving] = useState(false);

  // Cập nhật lại tempDesc nếu initialDescription thay đổi từ bên ngoài (ví dụ card khác được chọn)
  useEffect(() => {
    setTempDesc(initialDescription);
  }, [initialDescription, cardId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(tempDesc);
      setIsEditing(false);
    } catch (error) {
      // Nếu lỗi, bạn có thể giữ nguyên text để người dùng không mất công gõ lại
      console.error("Lỗi cập nhật mô tả:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempDesc(initialDescription);
    setIsEditing(false);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-3">
        <AlignLeft size={20} className="text-gray-600" />
        <h3 className="font-semibold text-gray-800 text-base">Mô tả</h3>
        {!isEditing && initialDescription && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md transition-colors font-medium"
          >
            Chỉnh sửa
          </button>
        )}
      </div>

      {/* Content */}
      <div className="ml-8">
        {isEditing ? (
          <div className="space-y-3 animate-in fade-in duration-200">
            <textarea
              autoFocus
              placeholder="Thêm mô tả chi tiết hơn..."
              value={tempDesc}
              onChange={(e) => setTempDesc(e.target.value)}
              className="w-full border-2 border-blue-500 rounded-lg p-3 text-sm min-h-[120px] shadow-sm focus:outline-none bg-white transition-all resize-none text-gray-700"
              disabled={isSaving}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-sm active:scale-95"
              >
                {isSaving ? "Đang lưu..." : "Lưu lại"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="text-gray-600 hover:bg-gray-100 disabled:opacity-50 px-4 py-2 rounded-md text-sm font-medium transition-all"
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className={`w-full rounded-lg p-3 text-sm cursor-pointer transition-all border border-transparent ${
              initialDescription
                ? "hover:bg-gray-50 text-gray-700 leading-relaxed whitespace-pre-wrap"
                : "bg-gray-100/70 hover:bg-gray-200/70 text-gray-500 min-h-[50px] flex items-center"
            }`}
          >
            {initialDescription || "Thêm mô tả chi tiết cho thẻ này..."}
          </div>
        )}
      </div>
    </div>
  );
}
