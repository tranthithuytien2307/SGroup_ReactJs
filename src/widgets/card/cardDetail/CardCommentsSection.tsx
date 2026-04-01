import { useEffect, useRef, useState } from "react";
import { useCardStore } from "../../../features/card/model/cardStore";
import { useAuthStore } from "../../../entities/auth/model/auth.store";

type Props = {
  cardId: number;
};

export default function CardCommentsSection({ cardId }: Props) {
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [loadingId, setLoadingId] = useState<number | null>(null); // ✅ (1)

  const bottomRef = useRef<HTMLDivElement | null>(null); // ✅ (4)

  const comments = useCardStore((s) => s.commentsByCardId[cardId]);
  const getComments = useCardStore((s) => s.getComments);
  const addComment = useCardStore((s) => s.addComment);
  const updateComment = useCardStore((s) => s.updateComment);
  const deleteComment = useCardStore((s) => s.deleteComment);

  const currentUser = useAuthStore((s) => s.user);
  const fetchUser = useAuthStore((s) => s.fetchUser);

  const currentUserId = currentUser?.id;

  useEffect(() => {
    if (!currentUser) {
      fetchUser();
    }
  }, [currentUser]);

  useEffect(() => {
    if (!comments || comments.length === 0) {
      getComments(cardId);
    }
  }, [cardId]);

  const sortedComments = [...(comments || [])].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handleAdd = async () => {
    if (!comment.trim()) return;
    await addComment(cardId, comment);
    setComment("");
  };

  const formatTime = (date?: string) => {
    if (!date) return "";
    return new Date(date).toLocaleString("vi-VN");
  };

  const isLink = (text: string) => {
    return text.startsWith("http://") || text.startsWith("https://");
  };

  return (
    <div className="space-y-4">
      {/* INPUT */}
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">
          {currentUser?.name?.[0] || "U"}
        </div>

        <input
          placeholder="Viết bình luận..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
        />

        <button
          onClick={handleAdd}
          disabled={!comment.trim()}
          className="bg-black text-white px-3 py-2 rounded text-sm opacity-70 disabled:opacity-30"
        >
          Post
        </button>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
        {sortedComments.map((c) => {
          const isOwner = Number(c.user?.id) === Number(currentUserId);

          return (
            <div key={c.id} className="flex gap-3 group">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-medium">
                {c.user?.avatar_url ? (
                  <img
                    src={c.user.avatar_url}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  c.user?.name?.[0] || "U"
                )}
              </div>

              <div
                className={`flex-1 ${
                  isOwner ? "bg-blue-50 rounded-lg p-2" : ""
                }`}
              >
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-gray-800">
                    {isOwner ? "Bạn" : c.user?.name || "User"}
                  </span>
                  <span className="text-blue-500 text-xs">
                    {formatTime(c.created_at)}
                  </span>
                </div>

                <div className="bg-gray-100 rounded-xl px-3 py-2 mt-1 text-sm">
                  {editingId === c.id && isOwner ? (
                    <input
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="w-full bg-transparent outline-none"
                    />
                  ) : isLink(c.content) ? (
                    <a
                      href={c.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline break-all"
                    >
                      {c.content}
                    </a>
                  ) : (
                    <span className="break-words">{c.content}</span>
                  )}
                </div>

                {isOwner && (
                  <div className="flex gap-3 text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition">
                    {editingId === c.id ? (
                      <>
                       
                        <button
                          disabled={loadingId === c.id}
                          onClick={async () => {
                            setLoadingId(c.id);
                            await updateComment(c.id, editingContent);
                            setLoadingId(null);
                            setEditingId(null);
                          }}
                          className="text-green-600"
                        >
                          {loadingId === c.id ? "Đang lưu..." : "Lưu"}
                        </button>

                        <button onClick={() => setEditingId(null)}>Hủy</button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(c.id);
                            setEditingContent(c.content);
                          }}
                        >
                          Chỉnh sửa
                        </button>

                        <button
                          onClick={() => deleteComment(cardId, c.id)}
                          className="text-red-500"
                        >
                          Xóa
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
