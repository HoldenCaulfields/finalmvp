import React, { useState } from "react";
import { X, LogOut, Check, Trash2, Edit2, Camera, Loader2 } from "lucide-react";
import { Post, User } from "../types";
import { motion } from "framer-motion";
import { uploadImage } from "@/services/uploadimage.services";

interface UserProfileDrawerProps {
  user: User;
  posts: Post[];
  onClose: () => void;
  onLogout: () => void;
  onUpdateProfile: (updatedData: Partial<User>) => Promise<void> | void;
  onDeleteMyPost: (postId: number) => Promise<void> | void;
}

const FACULTIES = ["Kinh tế - Tổng hợp", "Điện - Điện tử", "Cơ khí - Xây dựng", "Công nghệ Ô tô"];

export default function UserProfileDrawer({ user, posts, onClose, onLogout, onUpdateProfile, onDeleteMyPost }: UserProfileDrawerProps) {
  const [name, setName] = useState(user.name);
  const [faculty, setFaculty] = useState(user.faculty || "Kinh tế - Tổng hợp");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Filter posts authored by this specific user
  const myPosts = posts.filter((p) => p.userId === user.id);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const uploadedUrl = await uploadImage(file);
      await onUpdateProfile({ photoUrl: uploadedUrl });
    } catch (err) {
      console.error("Failed to upload avatar:", err);
      alert("Tải ảnh đại diện lên thất bại. Vui lòng thử lại!");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      await onUpdateProfile({ name: name.trim(), faculty });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoutClick = () => {
    onLogout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-end overflow-hidden" id="profile-drawer-overlay">
      
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
        className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col justify-between overflow-hidden text-neutral-900"
        id="profile-drawer-container"
      >
        {/* Header bar */}
        <div className="flex justify-between items-center px-6 py-4.5 border-b border-neutral-100 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
            <h3 className="font-sans font-extrabold text-sm text-neutral-900 uppercase tracking-wide">
              Hồ Sơ Sinh Viên
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors border-none cursor-pointer"
            title="Đóng trang cá nhân"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Avatar and Name/Email block */}
          <div className="flex flex-col items-center text-center pb-6 border-b border-neutral-100">
            <div className="relative mb-3.5 select-none hover:scale-105 transition-transform duration-300 group/avatar">
              <label htmlFor="avatar-file-input" className="cursor-pointer block relative">
                <img
                  src={user.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                  alt="Profile Avatar"
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-full object-cover border-2 border-rose-500/10 shadow-lg"
                />
                <div className="absolute inset-0 rounded-full bg-black/45 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center text-white">
                  {isUploadingAvatar ? (
                    <Loader2 size={18} className="animate-spin text-white" />
                  ) : (
                    <Camera size={18} />
                  )}
                </div>
              </label>
              <input
                type="file"
                id="avatar-file-input"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={isUploadingAvatar}
                className="hidden"
              />
              <span className="absolute bottom-1 right-1 w-4.5 h-4.5 bg-rose-600 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white">
                ✨
              </span>
            </div>

            {isEditing ? (
              <div className="w-full space-y-3 px-2">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-center font-bold text-sm bg-neutral-50 px-3 py-2 border border-neutral-200 outline-none rounded-xl focus:border-rose-600"
                  placeholder="Nhập tên của bạn"
                />
                
                <select
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className="w-full text-center text-xs font-semibold bg-neutral-50 px-3 py-2 border border-neutral-200 outline-none rounded-xl"
                >
                  {FACULTIES.map((fac) => (
                    <option key={fac} value={fac}>{fac}</option>
                  ))}
                </select>

                <div className="flex justify-center gap-2 select-none">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-neutral-100 text-neutral-600 border-none rounded-lg px-3.5 py-1.5 text-xs font-bold cursor-pointer hover:bg-neutral-200 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving || !name.trim()}
                    className="bg-rose-950 text-rose-100 border-none rounded-lg px-3.5 py-1.5 text-xs font-bold cursor-pointer hover:bg-rose-900 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    {isSaving ? "Lưu..." : "Lưu lại"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <h4 className="font-sans font-extrabold text-neutral-900 text-base flex items-center justify-center gap-2">
                  <span>{user.name}</span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-6 h-6 rounded-full hover:bg-neutral-100/80 hover:text-rose-600 flex items-center justify-center text-neutral-400 border-none cursor-pointer transition-colors"
                    title="Chỉnh sửa tên và khoa"
                  >
                    <Edit2 size={11} />
                  </button>
                </h4>
                <p className="text-[11px] text-neutral-400 font-light leading-none">{user.email}</p>
                <div className="pt-2 select-none">
                  <span className="inline-block text-[10px] font-bold bg-rose-50 border border-rose-100 text-rose-700 px-3 py-1 rounded-full uppercase tracking-wider">
                    🏛️ {user.faculty || "Khoa trưởng"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Joining log */}
          <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 text-[10px] sm:text-xs text-neutral-400 font-light select-none flex justify-between items-center px-4">
            <span>📅 Ngày tham gia Hội:</span>
            <span className="font-bold text-neutral-700">{user.joinDate || "Gần đây"}</span>
          </div>

          {/* User's uploaded posts */}
          <div className="space-y-3.5 select-none">
            <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
              <span>Ảnh lưu niệm của bạn ({myPosts.length})</span>
            </h4>

            {myPosts.length === 0 ? (
              <div className="text-center py-10 bg-neutral-50 rounded-2xl border border-neutral-100 text-neutral-400 px-4">
                <p className="text-xs font-medium">Chưa đăng tải ảnh nào</p>
                <p className="text-[10px] text-neutral-400/80 mt-1">Những bức ảnh bạn đăng sẽ xuất hiện tại đây!</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[35vh] overflow-y-auto pr-1">
                {myPosts.map((post) => (
                  <div key={post.id} className="flex gap-3.5 items-center p-2.5 bg-neutral-50 hover:bg-neutral-100/50 rounded-2xl border border-neutral-100 transition-colors">
                    <img
                      src={post.image}
                      alt={post.caption}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-xl object-cover shrink-0 border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&q=80";
                      }}
                    />
                    <div className="flex-1 min-w-0 pr-1">
                      <p className="text-[11px] font-medium text-neutral-800 line-clamp-1 break-all">
                        {post.caption}
                      </p>
                      <p className="text-[9px] text-neutral-400 font-light mt-0.5">
                        ❤️ {post.likes} lượt thích · {post.comments?.length || 0} bình luận
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm("Bạn có chắc chắn muốn xóa kỷ niệm đáng quý này không?")) {
                          onDeleteMyPost(post.id);
                        }
                      }}
                      className="w-8 h-8 rounded-full hover:bg-rose-100/50 hover:text-rose-600 flex items-center justify-center text-neutral-400 border-none cursor-pointer shrink-0 transition-all"
                      title="Xóa kỷ niệm"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer Logout elements */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-100 select-none">
          <button
            onClick={handleLogoutClick}
            className="w-full h-11 flex items-center justify-center gap-2.5 bg-white hover:bg-rose-50 text-rose-600 border border-neutral-200 hover:border-rose-200 rounded-xl font-bold text-xs cursor-pointer shadow-sm transition-all active:scale-95"
            title="Đăng xuất tài khoản"
          >
            <LogOut size={14} />
            <span>Đăng xuất Google</span>
          </button>
        </div>

      </motion.div>
    </div>
  );
}
