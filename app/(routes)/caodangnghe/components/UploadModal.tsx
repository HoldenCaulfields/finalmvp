import React, { useState } from "react";
import { X, Image as ImageIcon, Sparkles, Upload, Loader2 } from "lucide-react";
import { Post, User } from "../types";
import { motion } from "framer-motion";
import { uploadImage } from "@/services/uploadimage.services";

interface UploadModalProps {
  onClose: () => void;
  onPublish: (post: Post) => Promise<void> | void;
  user: User | null;
}

export default function UploadModal({ onClose, onPublish, user }: UploadModalProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [faculty, setFaculty] = useState("Điện - Điện tử");
  const [club, setClub] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn hoặc thả tệp hình ảnh!");
      return;
    }
    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
    } catch (err) {
      console.error(err);
      alert("Đăng tải hình ảnh lên Cloudinary thất bại. Hãy thử lại!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl || !caption.trim()) return;

    setIsSubmitting(true);

    const titleTags = tagInput
      .split(/[\s,]+/)
      .filter((t) => t.trim().length > 0)
      .map((t) => (t.startsWith("#") ? t : `#${t}`));

    // Assemble new post item
    const newPost: Post = {
      id: Date.now(),
      author: user ? user.name : "Sinh viên ẩn danh",
      avatar: user ? (user.photoUrl || user.name.substring(0, 2).toUpperCase()) : "SV",
      faculty: faculty,
      club: club || undefined,
      image: imageUrl.trim(),
      caption: caption.trim(),
      likes: 1,
      commentsCount: 0,
      comments: [],
      time: "Vừa xong",
      liked: true,
      tags: titleTags,
      userId: user?.id || "anonymous"
    };

    try {
      await onPublish(newPost);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto" id="upload-dialog-overlay">
      
      {/* Dark blurry backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-neutral-950/40 backdrop-blur-sm"
      />

      {/* Dialog box wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col justify-between"
        id="upload-dialog-box"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4.5 border-b border-neutral-100 sticky top-0 bg-white z-10 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
            <h3 className="font-sans font-extrabold text-sm text-neutral-900 uppercase tracking-wide">
              Gửi Ảnh Kỷ Niệm Mới 📸
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-all border-none cursor-pointer"
            title="Đóng bảng gửi ảnh"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Post Owner Prompt if Guest */}
          {!user && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex gap-3 text-xs text-rose-800 leading-normal mb-1 select-none">
              <span className="text-sm">⚠️</span>
              <p>
                Bạn chưa đăng nhập. Kỷ niệm này sẽ được gửi dưới danh nghĩa <strong>Sinh viên ẩn danh</strong>. Bạn nên đăng nhập để quản lý bài viết cá nhân sau này!
              </p>
            </div>
          )}

          {/* Drag and Drop Zone */}
          <div className="space-y-2 select-none">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
              Bước 1: Chọn ảnh từ thiết bị của bạn hoặc dùng ảnh mẫu
            </label>
            
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all ${
                dragActive
                  ? "border-rose-500 bg-rose-50/40"
                  : imageUrl
                  ? "border-green-400 bg-green-50/10"
                  : "border-neutral-200 bg-neutral-50/30 hover:bg-neutral-50/60"
              }`}
            >
              <input
                type="file"
                id="memory-image-input"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
              />
              
              {isUploading ? (
                <div className="flex flex-col items-center gap-2 py-4">
                  <Loader2 className="animate-spin text-rose-600" size={28} />
                  <p className="text-xs font-semibold text-rose-950">Đang tải ảnh lên Cloudinary...</p>
                </div>
              ) : (
                <label
                  htmlFor="memory-image-input"
                  className="flex flex-col items-center gap-2 cursor-pointer w-full h-full text-center py-2"
                >
                  <div className="p-3 bg-rose-50 rounded-full text-rose-600 shadow-sm border border-rose-100">
                    <Upload size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-neutral-800 block">Thả ảnh kỷ niệm vào đây hoặc nhấp để chọn</span>
                    <span className="text-[10px] text-neutral-400 block mt-1">Hỗ trợ PNG, JPG, WebP tự động lưu lên Cloudinary</span>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Custom image URL string */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1 select-none">
              <ImageIcon size={11} /> Hoặc nhập trực tiếp link ảnh của bạn
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-50/70 transition-all placeholder:text-neutral-400/80 shadow-inner"
            />
          </div>

          {/* Thumbnail preview */}
          {imageUrl && (
            <div className="aspect-video relative rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-950 select-none">
              <img
                src={imageUrl}
                alt="Post Preview"
                onError={() => {}}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2.5 right-2.5 text-[8px] font-bold bg-neutral-950/80 text-white px-2 py-0.5 rounded uppercase">
                Xem trước ảnh
              </span>
            </div>
          )}

          {/* Caption text area */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block select-none">
              Bước 2: Cảm nghĩ của bạn về bức ảnh
            </label>
            <textarea
              placeholder="Bạn chụp bức hình này lúc nào? Ghi lại cảm nghĩ và kỉ niệm thật ý nghĩa nhé..."
              required
              rows={4}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-3 text-xs text-neutral-900 outline-none focus:border-rose-600 transition-all placeholder:text-neutral-400/80 shadow-inner"
            />
          </div>

          {/* Faculty Select and Club Filter selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block select-none">
                Khoa ngành của bạn:
              </label>
              <select
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-800 outline-none focus:border-rose-600 transition-all font-semibold"
              >
                <option value="Điện - Điện tử">⚡ Điện - Điện tử</option>
                <option value="Kinh tế - Tổng hợp">🏛️ Kinh tế - Tổng hợp</option>
                <option value="Cơ khí - Xây dựng">⚙️ Cơ khí - Xây dựng</option>
                <option value="Công nghệ Ô tô">🚗 Công nghệ Ô tô</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block select-none">
                Phong trào / CLB:
              </label>
              <select
                value={club}
                onChange={(e) => setClub(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-800 outline-none focus:border-rose-600 transition-all font-semibold"
              >
                <option value="">Không có</option>
                <option value="Tiếng Anh">🇬🇧 CLB Tiếng Anh</option>
                <option value="Coffee Giao Lưu">☕ Coffee Giao Lưu</option>
                <option value="Mua Bán">🤝 CLB Mua Bán - làm thêm</option>
              </select>
            </div>
          </div>

          {/* Tags list */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block select-none">
              Từ khóa tìm kiếm (Cách nhau bởi dấu cách hoặc phẩy)
            </label>
            <input
              type="text"
              placeholder="kyniem, totnghiep, khoacokhi, lamthem, nghihe"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-rose-600 transition-all placeholder:text-neutral-400 shadow-inner"
            />
          </div>

          {/* Confirm submit actions */}
          <div className="pt-4 border-t border-neutral-100 flex gap-3 select-none">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 rounded-xl py-3 text-xs font-bold cursor-pointer transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !imageUrl || !caption.trim()}
              className="flex-1 bg-neutral-950 hover:bg-rose-950 text-white border-none rounded-xl py-3 text-xs font-bold cursor-pointer transition-colors shadow-lg active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Đang gửi đi..." : "🚀 Đăng bài"}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
