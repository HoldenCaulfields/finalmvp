import { Heart, MessageSquare, Trash2, ShieldAlert } from "lucide-react";
import { Post } from "../types";
import { useAuthStore } from "@/stores/useAuthStore";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface PostCardProps {
  key?: string | number;
  post: Post;
  onLike: (id: number) => void;
  onCommentClick: (post: Post) => void;
  onImageClick: (post: Post) => void;
  onDeleteClick?: (id: number) => void;
}

export default function PostCard({ post, onLike, onCommentClick, onImageClick, onDeleteClick }: PostCardProps) {
  const { profile } = useAuthStore();
  const isPostOwner = profile && post.userId === profile.id;
  const hasLiked = profile && post.likedUsers?.includes(profile.id);
  const displayedAvatar = isPostOwner && profile?.photoUrl ? profile.photoUrl : post.avatar;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-3xl border border-neutral-200/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full group"
      id={`memory-card-${post.id}`}
    >
      {/* Visual Image Section */}
      <div className="relative aspect-4/3 overflow-hidden bg-neutral-900 cursor-pointer" onClick={() => onImageClick(post)}>
        <img
          src={post.image}
          alt={post.caption}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
        
        {/* Dynamic Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[90%]">
          <span className="text-[10px] font-bold bg-neutral-950/85 backdrop-blur-md text-white border border-white/10 px-2.5 py-1 rounded-lg tracking-wide uppercase shadow-sm">
            🎓 {post.faculty}
          </span>
          {post.club && (
            <span className="text-[10px] font-bold bg-rose-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded-lg tracking-wide uppercase shadow-sm">
              🎪 {post.club}
            </span>
          )}
        </div>

        {/* Delete Trigger - visible overlay to post owners */}
        {isPostOwner && onDeleteClick && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick(post.id);
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
            title="Xóa kỷ niệm này"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Narrative Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Author info row */}
          <div className="flex items-center gap-3 mb-3.5 select-none">
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-700 text-xs font-black select-none">
              {displayedAvatar && (displayedAvatar.startsWith("http://") || displayedAvatar.startsWith("https://")) ? (
                <img
                  src={displayedAvatar}
                  alt={post.author}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{displayedAvatar || post.author.substring(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-900 leading-none mb-1 flex items-center gap-1">
                <span>{post.author}</span>
                {isPostOwner && (
                  <span className="text-[9px] bg-neutral-100 border border-neutral-200 text-neutral-500 px-1 py-0.2 rounded">Bạn</span>
                )}
              </h4>
              <p className="text-[10px] text-neutral-400 font-light">{post.time || "Vừa xong"}</p>
            </div>
          </div>

          <p className="text-neutral-700 text-xs leading-relaxed font-light mb-4 whitespace-pre-wrap break-words line-clamp-4">
            {post.caption}
          </p>

          {/* Tag row */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-medium text-rose-700 bg-rose-50/50 hover:bg-rose-50 px-2 py-0.5 rounded-md cursor-pointer transition-colors border border-rose-100/30"
                >
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Triggers Footer */}
        <div className="flex items-center gap-4 pt-3.5 border-t border-neutral-100">
          <button
            onClick={() => onLike(post.id)}
            className={cn(
              "flex items-center gap-1.5 text-xs font-semibold px-2 py-1.5 rounded-lg transition-all cursor-pointer",
              hasLiked 
                ? "text-rose-600 bg-rose-50/70" 
                : "text-neutral-500 hover:text-rose-600 hover:bg-neutral-50"
            )}
            title={hasLiked ? "Bỏ thích" : "Bày tỏ yêu thích"}
          >
            <Heart size={14} fill={hasLiked ? "currentColor" : "none"} strokeWidth={hasLiked ? 2.5 : 2} />
            <span>{post.likes}</span>
          </button>

          <button
            onClick={() => onCommentClick(post)}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-rose-600 hover:bg-neutral-50 px-2 py-1.5 rounded-lg transition-all cursor-pointer"
            title="Xem & Thêm bình luận"
          >
            <MessageSquare size={14} strokeWidth={2} />
            <span>{post.commentsCount || 0}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
