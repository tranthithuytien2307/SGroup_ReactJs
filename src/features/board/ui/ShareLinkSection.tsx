import React from "react";
import { Link } from "lucide-react";

interface ShareLinkSectionProps {
  shareLink: string | null;
  onCreateLink: () => void;
  onCopyLink: () => void;
  onDeleteLink: () => void;
}

const ShareLinkSection: React.FC<ShareLinkSectionProps> = ({
  shareLink,
  onCreateLink,
  onCopyLink,
  onDeleteLink,
}) => {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
          <Link className="w-4 h-4" />
        </div>

        {shareLink ? (
          <div className="flex-1">
            <p className="text-sm text-gray-600">
              Bất kỳ ai có liên kết đều có thể tham gia với tư cách thành viên
            </p>
            <div className="text-blue-600 text-sm flex gap-4 mt-1 cursor-pointer underline">
              <span onClick={onCopyLink}>Sao chép liên kết</span>
              <span onClick={onDeleteLink}>Xóa liên kết</span>
            </div>
          </div>
        ) : (
          <div className="flex-1 text-sm cursor-pointer" onClick={onCreateLink}>
            <div>
              <p>Chia sẻ bảng này bằng liên kết</p>
              <p className="text-blue-600 underline hover:text-blue-700">
                Tạo liên kết
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareLinkSection;
