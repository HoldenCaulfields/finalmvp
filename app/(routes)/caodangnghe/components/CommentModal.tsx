import React, { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";
import { Post } from "../types";
import { useAuthStore } from "@/stores/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";

interface CommentModalProps {
  post: Post;
  onClose: () => void;
  onAddComment: (postId: number, commentText: string) => Promise<void> | void;
}

export default function CommentModal({ post, onClose, onAddComment }: CommentModalProps) {
  const { profile } = useAuthStore();
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto scroll to bottom when comments list loads/updates
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [post.comments?.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(post.id, text.trim());
      setText("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-end overflow-hidden" id="comments-drawer-overlay">
      
      {/* Dark backdrop blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm"
      />

      {/* Slide-out Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col justify-between overflow-hidden"
        id="comments-drawer-container"
      >
        {/* Header bar */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-neutral-100 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
            <h3 className="font-sans font-extrabold text-sm text-neutral-900 uppercase tracking-wide">
              Bình luận ({post.comments?.length || 0})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors border-none cursor-pointer"
            title="Đóng bảng bình luận"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body Scroll */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Post contextual card */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 mb-2">
            <div className="flex items-center gap-2.5 mb-2 select-none">
              <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 bg-rose-100 border border-neutral-100 flex items-center justify-center text-rose-700 text-[10px] font-black">
                {post.avatar && (post.avatar.startsWith("http://") || post.avatar.startsWith("https://")) ? (
                  <img
                    src={post.avatar}
                    alt={post.author}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{post.avatar || post.author.substring(0, 2).toUpperCase()}</span>
                )}
              </div>
              <span className="text-xs font-bold text-neutral-900">{post.author}</span>
            </div>
            <p className="text-[11px] text-neutral-600 leading-relaxed font-light line-clamp-3">
              {post.caption}
            </p>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {!post.comments || post.comments.length === 0 ? (
              <div className="text-center py-12 select-none flex flex-col items-center">
                <div className="text-2xl mb-1.5 opacity-80">💬</div>
                <p className="text-xs text-neutral-400 font-medium">Chưa có bình luận nào</p>
                <p className="text-[10px] text-neutral-400 font-light mt-0.5">Hãy là người đầu tiên chia sẻ cảm nghĩ!</p>
              </div>
            ) : (
              post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 text-xs">
                  {/* Avatar bubble */}
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 select-none flex items-center justify-center font-bold text-neutral-700 font-mono text-[10px] shrink-0">
                    {comment.avatar && (comment.avatar.startsWith("http://") || comment.avatar.startsWith("https://")) ? (
                      <img
                        src={comment.avatar}
                        alt={comment.author}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{comment.avatar || comment.author.substring(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  
                  {/* Context and narrative content bubble */}
                  <div className="flex-1 bg-neutral-50 rounded-2xl p-3.5 border border-neutral-100/60">
                    <div className="flex items-center justify-between gap-2 mb-1 select-none">
                      <span className="font-extrabold text-neutral-900 text-[11px]">{comment.author}</span>
                      <span className="text-[9px] text-neutral-400 font-light">{comment.time || "Vừa xong"}</span>
                    </div>
                    <p className="text-neutral-700 leading-relaxed font-light break-words text-[11px]">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Form Write comment box */}
        <div className="p-4 bg-white border-t border-neutral-100">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder={profile ? "Viết bình luận công khai..." : "Bạn cần đăng nhập để bình luận"}
              disabled={!profile || isSubmitting}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 bg-neutral-50/70 border border-neutral-200/80 rounded-xl px-4 py-3 text-xs outline-none focus:border-rose-600 transition-all placeholder:text-neutral-400 disabled:opacity-60 shadow-inner"
            />
            <button
              type="submit"
              disabled={!profile || !text.trim() || isSubmitting}
              className="w-10 h-10 rounded-xl bg-neutral-950 hover:bg-rose-950 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:bg-neutral-200 disabled:cursor-not-allowed cursor-pointer shadow-md"
              title="Gửi bình luận"
            >
              <Send size={14} />
            </button>
          </form>
          {!profile && (
            <p className="text-[10px] text-rose-600/80 font-medium text-center mt-2.5">
              💡 Hãy nhấn nút đăng nhập ở thanh công cụ để chia sẻ bình luận của bạn!
            </p>
          )}
        </div>

      </motion.div>
    </div>
  );
}
