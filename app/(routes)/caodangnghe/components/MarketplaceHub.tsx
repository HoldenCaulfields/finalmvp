import React, { useState } from "react";
import { Post, User } from "../types";
import { Plus, Search, Tag, MessageSquare, Heart, Clock, Phone, MapPin, Briefcase, ShoppingBag, Utensils, X, Sparkles, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MarketplaceHubProps {
  posts: Post[];
  user: User | null;
  onLike: (id: number) => Promise<void> | void;
  onCommentClick: (post: Post) => void;
  onPublishListing: (newPost: Post) => Promise<void> | void;
  onLoginRequired: () => void;
}

const MARKETPLACE_PRESETS = [
  {
    name: "Điện thoại cũ 📱",
    category: "item",
    url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80"
  },
  {
    name: "Sạc dự phòng cũ 🔋",
    category: "item",
    url: "https://images.unsplash.com/photo-1609592424109-dd77348bf638?w=800&q=80"
  },
  {
    name: "Phục vụ quán cafe ☕",
    category: "job",
    url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80"
  },
  {
    name: "Quán ăn sinh viên 🍲",
    category: "food",
    url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
  },
  {
    name: "Gia sư / Phát tờ rơi 📚",
    category: "job",
    url: "https://images.unsplash.com/photo-1521898284481-a5ec348cb555?w=800&q=80"
  },
  {
    name: "Shipper giao hàng",
    category: "job",
    url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80"
  }
];

// Helper to parse the structured caption
interface ParsedListing {
  title: string;
  price: string;
  contact: string;
  category: "job" | "item" | "food" | "other";
  details: string;
}

function parseListingCaption(caption: string): ParsedListing {
  try {
    if (caption.startsWith("📦[CHỢ_SV]")) {
      const parts = caption.split("||");
      if (parts.length >= 5) {
        return {
          category: parts[1] as any,
          title: parts[2],
          price: parts[3],
          contact: parts[4],
          details: parts[5] || ""
        };
      }
    }
  } catch (err) {
    console.warn("Failed parsing listing raw format. Falling back.", err);
  }

  // Fallback if not matching the special syntax
  let category: "job" | "item" | "food" | "other" = "other";
  if (caption.toLowerCase().includes("làm thêm") || caption.toLowerCase().includes("tuyển dụng") || caption.toLowerCase().includes("lương")) {
    category = "job";
  } else if (caption.toLowerCase().includes("bán") || caption.toLowerCase().includes("điện thoại") || caption.toLowerCase().includes("sạc dự phòng")) {
    category = "item";
  } else if (caption.toLowerCase().includes("quán ăn") || caption.toLowerCase().includes("bánh tráng") || caption.toLowerCase().includes("trà sữa") || caption.toLowerCase().includes("đồ ăn")) {
    category = "food";
  }

  // Slice caption into readable lines
  return {
    category,
    title: caption.split("\n")[0] || "Tin rao vặt sinh viên",
    price: "Thỏa thuận",
    contact: "Hỏi trong bình luận",
    details: caption
  };
}

export default function MarketplaceHub({
  posts,
  user,
  onLike,
  onCommentClick,
  onPublishListing,
  onLoginRequired,
}: MarketplaceHubProps) {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<"all" | "job" | "item" | "food">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for new classifieds post
  const [adTitle, setAdTitle] = useState("");
  const [adCategory, setAdCategory] = useState<"job" | "item" | "food">("item");
  const [adPrice, setAdPrice] = useState("");
  const [adContact, setAdContact] = useState("");
  const [adDetails, setAdDetails] = useState("");
  const [adImage, setAdImage] = useState(MARKETPLACE_PRESETS[0].url);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter ONLY posts that belong to Marketplace
  // A post belongs to Marketplace if:
  // - its `club` is "Mua Bán" or it contains specific tag or meets structured caption schema
  const marketplacePosts = posts.filter(post => 
    post.club === "Mua Bán" || 
    post.tags.includes("#muaban") || 
    post.tags.includes("#lamthem") ||
    post.caption.startsWith("📦[CHỢ_SV]")
  );

  // Process and parse all posts
  const processedPosts = marketplacePosts.map(post => {
    return {
      post,
      listing: parseListingCaption(post.caption)
    };
  });

  // Filter listings based on tab and searching
  const filteredListings = processedPosts.filter(({ post, listing }) => {
    const matchesCategory = activeCategoryFilter === "all" || listing.category === activeCategoryFilter;
    
    const text = (listing.title + " " + listing.details + " " + post.author + " " + listing.price + " " + post.tags.join(" ")).toLowerCase();
    const matchesSearch = !searchQuery || text.includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleOpenPublish = () => {
    if (!user) {
      onLoginRequired();
    } else {
      setShowAddModal(true);
    }
  };

  const handleSelectPreset = (url: string, category: "job" | "item" | "food") => {
    setAdImage(url);
    setAdCategory(category);
  };

  const handleSubmitAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle.trim() || !adPrice.trim() || !adContact.trim() || !adDetails.trim()) return;

    setIsSubmitting(true);

    // Build structured caption payload
    // Structured format: 📦[CHỢ_SV]||category||title||price||contact||details
    const structuredCaption = `📦[CHỢ_SV]||${adCategory}||${adTitle.trim()}||${adPrice.trim()}||${adContact.trim()}||${adDetails.trim()}`;

    // Auto-generate tags based on category
    const tags = ["#chomangcdn", `#${adCategory === "job" ? "lamthem" : adCategory === "item" ? "muaban" : "quanan"}`];
    if (adTitle.toLowerCase().includes("điện thoại")) tags.push("#dienthoai");
    if (adTitle.toLowerCase().includes("sạc")) tags.push("#sacduphong");

    const newPost: Post = {
      id: Date.now(),
      author: user ? user.name : "Sinh viên CDN",
      avatar: user ? (user.photoUrl || user.name.substring(0, 2).toUpperCase()) : "SV",
      faculty: user?.faculty || "Kinh tế - Tổng hợp",
      club: "Mua Bán", // Strict routing
      image: adImage,
      caption: structuredCaption,
      likes: 1,
      commentsCount: 0,
      comments: [],
      time: "Vừa xong",
      tags: tags,
      userId: user?.id || "anonymous"
    };

    try {
      await onPublishListing(newPost);
      // Reset form & close
      setAdTitle("");
      setAdPrice("");
      setAdContact("");
      setAdDetails("");
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-8 animate-fade-in min-h-[70vh]">
      
      {/* ── BANNER HEADER ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-gradient-to-tr from-neutral-900 to-rose-950 p-6 md:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden select-none">
        
        {/* Subtle glowing elements */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl" />
        <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl" />

        <div className="md:col-span-8 space-y-3 z-10">
          <span className="inline-block px-3 py-1 bg-rose-600/20 border border-rose-500/20 text-xs font-black uppercase text-rose-300 rounded-full tracking-wider">
            🤝 Kết nối & Việc làm
          </span>
          <h2 className="font-sans font-black text-2xl tracking-tight leading-tight">
            Chợ Sinh Viên - Việc Làm Thêm & Trao Đổi Cũ
          </h2>
          <p className="text-xs text-neutral-300 font-light leading-relaxed max-w-xl">
            Không gian độc quyền dành riêng cho sinh viên trao đổi mua bán đồ cũ, tìm việc làm thêm, hỗ trỡ lẫn nhau về trang trải cuộc sống.
          </p>
        </div>

        <div className="md:col-span-4 z-10 flex items-center md:justify-end">
          <button
            onClick={handleOpenPublish}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-white hover:bg-neutral-50 text-neutral-900 font-black text-xs uppercase px-6 py-4 rounded-2xl shadow-lg hover:shadow-white/10 active:scale-95 cursor-pointer transition-all border-none"
          >
            <Plus size={16} strokeWidth={3} />
            <span>Đăng tin rao vặt 🚀</span>
          </button>
        </div>
      </div>

      {/* ── SEARCH & CATEGORY CHIPS CONTROLS ── */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-4 rounded-2xl border border-neutral-200/50 shadow-sm select-none">
        {/* Sub Category selectors */}
        <div className="flex gap-2.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveCategoryFilter("all")}
            className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              activeCategoryFilter === "all"
                ? "bg-rose-950 text-rose-100 border-rose-950 shadow-sm"
                : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-300"
            }`}
          >
            🌟 Tất cả bảng tin ({processedPosts.length})
          </button>

          <button
            onClick={() => setActiveCategoryFilter("job")}
            className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
              activeCategoryFilter === "job"
                ? "bg-rose-950 text-rose-100 border-rose-950 shadow-sm"
                : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-300"
            }`}
          >
            <Briefcase size={12} />
            <span>Việc làm thêm</span>
          </button>

          <button
            onClick={() => setActiveCategoryFilter("item")}
            className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
              activeCategoryFilter === "item"
                ? "bg-rose-950 text-rose-100 border-rose-950 shadow-sm"
                : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-300"
            }`}
          >
            <ShoppingBag size={12} />
            <span>Đồ cũ giá rẻ</span>
          </button>

          <button
            onClick={() => setActiveCategoryFilter("food")}
            className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
              activeCategoryFilter === "food"
                ? "bg-rose-950 text-rose-100 border-rose-950 shadow-sm"
                : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-300"
            }`}
          >
            <Utensils size={12} />
            <span>Quán ăn sinh viên</span>
          </button>
        </div>

        {/* Searching bar */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, mặt hàng, số liên hệ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-neutral-950 outline-none focus:border-rose-600 transition-colors"
          />
          <span className="absolute left-3 top-3 text-neutral-400">
            <Search size={14} />
          </span>
        </div>
      </div>

      {/* ── BENTO FEED GRID OF POSTS ── */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-neutral-200/50 p-8 max-w-sm mx-auto shadow-sm select-none">
          <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 text-2xl mb-4 mx-auto shadow-inner">
            📭
          </div>
          <h3 className="font-sans font-extrabold text-sm text-neutral-900 mb-1">
            Không tìm thấy tin đăng nào
          </h3>
          <p className="text-neutral-400 text-xs mb-6">
            Thử tinh chỉnh lại bộ lọc danh mục hoặc từ khóa tìm kiếm của bạn nhé.
          </p>
          <button
            onClick={() => {
              setActiveCategoryFilter("all");
              setSearchQuery("");
            }}
            className="bg-neutral-950 text-white border-none rounded-xl px-4 py-2 font-bold text-xs cursor-pointer hover:bg-rose-950 transition-colors"
          >
            Nhìn lại tất cả tin
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map(({ post, listing }) => (
            <motion.div
              layout
              key={`ad-${post.id}`}
              className="bg-white rounded-3xl border border-neutral-200/50 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
            >
              {/* Card visual banner & categories tags */}
              <div className="aspect-[5/3] relative overflow-hidden bg-neutral-950 select-none">
                <img
                  src={post.image}
                  alt={listing.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase text-white shadow-md flex items-center gap-1 ${
                    listing.category === "job"
                      ? "bg-blue-600"
                      : listing.category === "item"
                      ? "bg-amber-600"
                      : listing.category === "food"
                      ? "bg-emerald-600"
                      : "bg-neutral-600"
                  }`}>
                    {listing.category === "job" && <Briefcase size={10} />}
                    {listing.category === "item" && <ShoppingBag size={10} />}
                    {listing.category === "food" && <Utensils size={10} />}
                    <span>
                      {listing.category === "job" && "Tìm việc làm"}
                      {listing.category === "item" && "Bán đồ cũ"}
                      {listing.category === "food" && "Ẩn thực quán"}
                      {listing.category === "other" && "Khác"}
                    </span>
                  </span>
                </div>

                {/* Highly visual Price/Salary Badge */}
                <div className="absolute bottom-3 right-3 bg-neutral-950/80 backdrop-blur-sm border border-white/10 text-white rounded-xl px-3 py-1.5 text-xs font-black select-all">
                  💰 {listing.price}
                </div>
              </div>

              {/* Card Contents body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 select-none">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userId}`}
                      alt="avatar"
                      className="w-5.5 h-5.5 rounded-full border border-neutral-100 object-cover"
                    />
                    <p className="text-[10px] font-bold text-neutral-500 truncate max-w-[120px]" title={post.author}>
                      {post.author}
                    </p>
                    <span className="text-[9px] text-neutral-300">•</span>
                    <p className="text-[9px] text-rose-700 font-bold uppercase truncate max-w-[100px]">
                      {post.faculty}
                    </p>
                  </div>

                  <h4 className="font-sans font-extrabold text-sm text-neutral-950 leading-snug tracking-tight hover:text-rose-950 transition-colors">
                    {listing.title}
                  </h4>

                  <p className="text-xs text-neutral-500 font-light leading-relaxed line-clamp-3 select-text">
                    {listing.details}
                  </p>
                </div>

                {/* Contact and timing indicator */}
                <div className="space-y-3 pt-3 border-t border-neutral-100">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 select-all">
                    <span className="flex items-center gap-1 font-semibold text-neutral-700 bg-neutral-100 border border-neutral-200/50 p-2 rounded-xl w-full">
                      <Phone size={12} className="text-rose-600 flex-shrink-0" />
                      <span className="truncate">LH: {listing.contact}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-neutral-400 select-none">
                    <div className="flex items-center gap-1">
                      <Clock size={11} />
                      <span>{post.time}</span>
                    </div>

                    {/* Likes & Comments Quick interactions */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onLike(post.id)}
                        className={`flex items-center gap-1 bg-transparent border-none cursor-pointer transition-colors ${
                          post.liked ? "text-rose-600 font-extrabold" : "text-neutral-400 hover:text-neutral-600"
                        }`}
                      >
                        <Heart size={12} fill={post.liked ? "currentColor" : "none"} />
                        <span>{post.likes}</span>
                      </button>

                      <button
                        onClick={() => onCommentClick(post)}
                        className="flex items-center gap-1 bg-transparent border-none cursor-pointer text-neutral-400 hover:text-neutral-600"
                      >
                        <MessageSquare size={12} />
                        <span>{post.commentsCount} bình luận</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── INTERNAL SUBMIT MODAL DIALOG ── */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto" id="ad-submit-dialog">
            
            {/* Blurry dim backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-neutral-950/40 backdrop-blur-sm"
            />

            {/* Modal Box wrapper */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col justify-between"
            >
              {/* Header selection */}
              <div className="flex justify-between items-center px-6 py-4.5 border-b border-neutral-100 bg-white sticky top-0 z-10 select-none">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
                  <h3 className="font-sans font-extrabold text-sm text-neutral-900 uppercase tracking-wide">
                    Đăng tin rao vặt 🚀
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 border-none cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <form onSubmit={handleSubmitAd} className="flex-1 overflow-y-auto p-6 space-y-4">
                
                {/* Visual guidelines alert */}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3 text-[11px] text-amber-800 leading-normal select-none">
                  <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
                  <p>
                    <strong>Quy định:</strong> Nghiêm cấm bán hàng trái pháp luật hoặc đăng tin ảo gây phiền hà. Mọi bài viết của bạn sẽ hiển thị công khai.
                  </p>
                </div>

                {/* Category chooser */}
                <div className="space-y-1.5 select-none">
                  <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wide">Danh mục rao vặt</label>
                  <select
                    value={adCategory}
                    onChange={(e) => setAdCategory(e.target.value as any)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-800 outline-none focus:border-rose-600 font-bold transition-colors cursor-pointer"
                  >
                    <option value="item">🛍️ Trao đổi mua bán cũ (điện thoại, sạc dự phòng...)</option>
                    <option value="job">💼 Việc làm thêm cho sinh viên (phục vụ, gia sư, ctv...)</option>
                    <option value="food">🍲 Quán ăn ngon & Vui chơi (quán ruột sinh viên ghé chơi...)</option>
                  </select>
                </div>

                {/* Title and details */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wide">Tiêu đề tin đăng ngắn gọn</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Bán lại sạc dự phòng Anker 10000mAh còn mới / Tuyển ctv bán cà phê..."
                    value={adTitle}
                    onChange={(e) => setAdTitle(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-rose-600 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wide">Lương / Giá bán / Phí</label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: 120,000đ / 25k/giờ / Thỏa thuận..."
                      value={adPrice}
                      onChange={(e) => setAdPrice(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-rose-600 transition-colors"
                    />
                  </div>

                  {/* Contact info code */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wide">Thông tin liên lạc (Zalo/SĐT)</label>
                    <input
                      type="text"
                      required
                      placeholder="SĐT hoặc Facebook link..."
                      value={adContact}
                      onChange={(e) => setAdContact(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-rose-600 transition-colors"
                    />
                  </div>
                </div>

                {/* Details text area */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wide">Mô tả chi tiết:</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Mô tả cụ thể tình trạng hàng hóa, yêu cầu công việc, địa điểm hoặc ưu đãi dành riêng cho đồng môn trường CDN nhé..."
                    value={adDetails}
                    onChange={(e) => setAdDetails(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-rose-600 transition-colors"
                  />
                </div>

                {/* Illustrative image picker presets */}
                <div className="space-y-2 select-none">
                  <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wide block">
                    Bước cuối: Chọn hình ảnh minh họa cho tin rao
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {MARKETPLACE_PRESETS.map((preset) => {
                      const isSelected = adImage === preset.url;
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => handleSelectPreset(preset.url, preset.category as any)}
                          className={`p-2 rounded-xl text-[10px] font-bold border transition-all text-center flex flex-col justify-center items-center gap-1 cursor-pointer truncate ${
                            isSelected
                              ? "bg-rose-50 border-rose-500 text-rose-700 shadow-sm"
                              : "bg-neutral-50 border-neutral-200 hover:bg-neutral-50/80"
                          }`}
                        >
                          <span>{preset.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wide block">Hoặc dán trực tiếp link ảnh tùy chỉnh</label>
                  <input
                    type="url"
                    value={adImage}
                    onChange={(e) => setAdImage(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-rose-600 transition-colors"
                  />
                </div>

                {/* Confirm actions */}
                <div className="pt-4 border-t border-neutral-100 flex gap-3 select-none">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    disabled={isSubmitting}
                    className="flex-1 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 rounded-xl py-3 text-xs font-bold cursor-pointer transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !adTitle.trim() || !adPrice.trim() || !adContact.trim() || !adDetails.trim()}
                    className="flex-1 bg-neutral-950 hover:bg-rose-950 text-white border-none rounded-xl py-3 text-xs font-bold cursor-pointer transition-colors shadow-lg active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Đang phát hành..." : "🚀 Đăng ngay"}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
