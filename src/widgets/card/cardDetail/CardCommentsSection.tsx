import { useState } from "react";

export default function CardCommentsSection() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);

  const addComment = () => {
    if (!comment.trim()) return;

    setComments([...comments, comment]);
    setComment("");
  };

  return (
    <div className="space-y-3 flex-1">
      <input
        placeholder="Viết bình luận..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border rounded px-3 py-2 text-sm"
      />

      <button
        onClick={addComment}
        className="bg-black text-white px-3 py-1 rounded text-sm"
      >
        Post
      </button>

      <div className="space-y-2 mt-4">
        {comments.map((c, i) => (
          <div key={i} className="bg-white p-2 rounded border text-sm">
            {c}
          </div>
        ))}
      </div>
    </div>
  );
}
