import { X } from "lucide-react";
import DeleteLinkModal from "./DeleteLinkModal";
import { QuickInviteItem } from "./QuickInviteItem";
import ShareLinkSection from "./ShareLinkSection";
import { useState } from "react";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface InviteModalProps {
  users: User[];
  shareLink: string | null;
  setShareLink: React.Dispatch<React.SetStateAction<string | null>>;
  onClose: () => void;
  onSendInvitation: (email: string) => void;
  onCreateLink: () => void;
  onDeleteLink: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({
  users,
  shareLink,
  setShareLink,
  onClose,
  onSendInvitation,
  onCreateLink,
  onDeleteLink,
}) => {
  const [email, setEmail] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSend = () => {
    if (email) {
      onSendInvitation(email);
      setEmail("");
    }
  };

  const handleCopyLink = () => {
    if (!shareLink) return;
    navigator.clipboard
      .writeText(shareLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => alert("Không thể sao chép liên kết!"));
  };

  const hanldeDeleteLink = async () => {
    onDeleteLink();
    setShowDeleteConfirm(false);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] shadow-xl relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Chia sẻ bảng</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Địa chỉ email hoặc tên"
            className="flex-1 border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleSend}
            disabled={!email}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
          >
            Chia sẻ
          </button>
        </div>

        <ShareLinkSection
          shareLink={shareLink}
          onCreateLink={onCreateLink}
          onCopyLink={handleCopyLink}
          onDeleteLink={() => setShowDeleteConfirm(true)}
        />

        <div className="mb-2 font-semibold">
          Thành viên của bảng thông tin{" "}
          <span className="text-gray-500">{users.length}</span>
        </div>

        <div className="max-h-52 overflow-y-auto mb-4">
          {users.map((u) => (
            <QuickInviteItem
              key={u.email}
              name={u.name}
              email={u.email}
              avatar={u.avatar}
              onInvite={() => onSendInvitation(u.email)}
            />
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-3 w-full border rounded py-2 hover:bg-gray-100 cursor-pointer"
        >
          Đóng
        </button>

        {showDeleteConfirm && (
          <DeleteLinkModal
            onCancel={() => setShowDeleteConfirm(false)}
            onConfirm={() => hanldeDeleteLink}
          />
        )}

        {copied && (
          <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded shadow">
            Đã sao chép liên kết!
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteModal;
