import React from "react";
import { X } from "lucide-react";

interface DeleteLinkModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteLinkModal: React.FC<DeleteLinkModalProps> = ({
  onCancel,
  onConfirm,
}) => {
  return (
    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
      <div className="bg-white p-5 rounded shadow-xl w-[330px]">
        <div className="flex justify-between mb-3">
          <h3 className="text-lg font-medium">Xóa liên kết chia sẻ?</h3>
          <button
            className="text-gray-500 hover:text-black cursor-pointer"
            onClick={onCancel}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Liên kết chia sẻ bảng thông tin hiện có sẽ không hoạt động nữa.
        </p>

        <button
          onClick={onConfirm}
          className="w-full py-2 bg-red-500 text-white rounded cursor-pointer"
        >
          Xóa liên kết chia sẻ
        </button>
      </div>
    </div>
  );
};

export default DeleteLinkModal;
