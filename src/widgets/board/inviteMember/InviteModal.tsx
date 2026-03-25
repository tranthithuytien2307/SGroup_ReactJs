import { X } from "lucide-react";
import DeleteLinkModal from "./DeleteLinkModal";
import { QuickInviteItem } from "./QuickInviteItem";
import ShareLinkSection from "./ShareLinkSection";
import { useState } from "react";
import type {
  BoardMember,
  WorkspaceMember,
} from "../../../entities/users/type/types";

interface InviteModalProps {
  boardMembers: BoardMember[];
  workspaceMembers: WorkspaceMember[];
  shareLink: string | null;
  setShareLink: React.Dispatch<React.SetStateAction<string | null>>;
  onClose: () => void;
  onSendInvitation: (email: string) => void;
  onCreateLink: () => void;
  onDeleteLink: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({
  boardMembers,
  shareLink,
  workspaceMembers,
  setShareLink,
  onClose,
  onSendInvitation,
  onCreateLink,
  onDeleteLink,
}) => {
  const [email, setEmail] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [filteredMembers, setFilteredMembers] = useState<WorkspaceMember[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSend = () => {
    if (email.trim()) {
      onSendInvitation(email.trim());
      setEmail("");
    }
  };

  const handleChange = (value: string) => {
    setEmail(value);

    if (!value.trim()) {
      setFilteredMembers([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = workspaceMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(value.toLowerCase()) ||
        member.email.toLowerCase().includes(value.toLowerCase()),
    );

    setFilteredMembers(filtered);
    setShowSuggestions(true);
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

  const handleDeleteLink = () => {
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

        <div className="relative flex gap-2 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Địa chỉ email hoặc tên"
              className="w-full border rounded px-3 py-2"
              value={email}
              onChange={(e) => handleChange(e.target.value)}
              onFocus={() => email && setShowSuggestions(true)}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 150);
              }}
            />

            {showSuggestions && filteredMembers.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-52 overflow-y-auto">
                {filteredMembers.map((member) => {
                  const isBoardMember = boardMembers.some(
                    (m) => m.user.email === member.email,
                  );

                  return (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setEmail(member.email);
                        setShowSuggestions(false);
                      }}
                    >
                      <img
                        src={member.avatar_url || "/avatar.png"}
                        className="w-7 h-7 rounded-full"
                      />

                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {member.name}
                        </span>

                        <span className="text-xs text-gray-500">
                          {member.email}
                        </span>
                      </div>

                      {isBoardMember && (
                        <span className="ml-auto text-xs text-gray-400">
                          Already member
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={handleSend}
            disabled={!email.trim()}
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
          <span className="text-gray-500">{boardMembers.length}</span>
        </div>

        <div className="max-h-52 overflow-y-auto mb-4">
          {boardMembers.map((member) => (
            <QuickInviteItem
              key={member.id}
              name={member.user.name}
              email={member.user.email}
              avatar={member.user.avatar_url || ""}
              onInvite={() => onSendInvitation(member.user.email)}
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
            onConfirm={handleDeleteLink}
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
