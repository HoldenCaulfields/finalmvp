import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Send, 
  Share2, 
  CheckCircle, 
  Sparkles,
  Award,
  Pin,
  Flame,
  Globe2,
  Bookmark,
  Reply,
  Code
} from "lucide-react";

interface Club {
  id: string;
  name: string;
  count: number;
  mission: string;
  leader: string;
  category: string;
  badge: string;
}

interface MessagePost {
  id: string;
  author: string;
  role: string | null;
  avatarSeed: string;
  content: string;
  likes: number;
  likedByUser: boolean;
  replies: string[];
  createdAt: string;
  isPinned?: boolean;
}

const SHIFT_CLUBS: Club[] = [
  {
    id: "club_1",
    name: "Hội Khởi Nghiệp Trẻ Ninh Thuận",
    count: 245,
    mission: "Kết nối đỡ đầu nguồn vốn, xúc tiến công thương, chuyển dịch số nông nghiệp & đặc sản.",
    leader: "Anh Nguyễn Đăng Khoa",
    category: "Startups & Tài Trợ",
    badge: "🏆 Đối tác Chiến Lược"
  },
  {
    id: "club_2",
    name: "Đội Tình Nguyện Xanh Vịnh Vĩnh Hy",
    count: 180,
    mission: "Tổ chức hoạt động dọn rác bãi cát rạn san hô, giáo dục bảo vệ vùng vịnh sinh thái biển xanh.",
    leader: "Chị Lê Thị Bích Trâm",
    category: "Môi trường & Sinh thái",
    badge: "🌱 CLB Hoạt Động Tốt"
  },
  {
    id: "club_3",
    name: "IT & Open-Source Phan Rang Club",
    count: 98,
    mission: "Học tập công nghệ mới, hướng dẫn sinh viên quê hương thực hành lập trình ReactJS, Flutter.",
    leader: "Anh Phan Minh Quốc",
    category: "Công nghệ & Giáo dục",
    badge: "💻 CLB Sáng Tạo Trẻ"
  },
  {
    id: "club_4",
    name: "Hợp tác xã Thổ Cẩm Mỹ Nghệ Trẻ",
    count: 56,
    mission: "Cách tân thiết kế khăn tơ tằm cổ điển của nghệ nhân Chăm thích ứng với trang phục đương thời.",
    leader: "Nghệ nhân Đàng Thị Hạnh",
    category: "Bảo tồn văn hóa Chăm",
    badge: "🏺 Di Sản Nghệ Thuật"
  }
];

const PRE_MESSAGES: MessagePost[] = [
  {
    id: "msg_1",
    author: "Bùi Khánh Hòa (Admin)",
    role: "Quản trị viên LovelyNet",
    avatarSeed: "KhanhHoa",
    content: "Chào mừng toàn thể anh chị em và du khách ghé thăm Phan Rang! Hãy sử dụng bảng tin này để giao lưu kết bạn, rủ rê đi phượt đồi cát Nam Cương hoặc tham quan cụm Tháp Chàm cổ kính nha! ✨",
    likes: 42,
    likedByUser: false,
    replies: [
      "Ứng dụng LovelyNet dạo này mượt quá!",
      "Chiều nay rủ đi ăn bánh xèo lề đường đi ad ơi."
    ],
    createdAt: "Được ghim định kỳ",
    isPinned: true
  },
  {
    id: "msg_2",
    author: "Elena Petrova",
    role: "Tourists",
    avatarSeed: "Elena",
    content: "Is anyone planning to visit Ba Moi Vineyard tomorrow morning? I want to join, share cab cost or rent bike together. I am staying near Ninh Chu Beach. 👋",
    likes: 18,
    likedByUser: false,
    replies: [
      "We have a group of 3 people planning to go around 9 AM! Let's connect.",
      "Check out the Drivers Tab, Elena! It estimates fare wonderfully."
    ],
    createdAt: "20 phút trước",
    isPinned: false
  },
  {
    id: "msg_3",
    author: "Nguyễn Trung Nghĩa",
    role: "Sinh viên CNTT",
    avatarSeed: "TrungNghia",
    content: "Tìm đồng đội cùng ôn thi môn Lập trình Web hoặc học chung nhóm ReactJS + Tailwind tối thứ 7 tại Cà phê Sáng Tạo Phan Rang ạ.",
    likes: 9,
    likedByUser: false,
    replies: [],
    createdAt: "1 giờ trước",
    isPinned: false
  }
];

export default function GroupsView() {
  const [messages, setMessages] = useState<MessagePost[]>(PRE_MESSAGES);
  const [authorName, setAuthorName] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  
  // Quick reply drawer state
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState("");

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !newPostContent) return;

    const newPost: MessagePost = {
      id: `msg_${Date.now()}`,
      author: authorName,
      role: "Thành viên Cộng đồng",
      avatarSeed: authorName.trim().replace(/\s/g, ""),
      content: newPostContent,
      likes: 0,
      likedByUser: false,
      replies: [],
      createdAt: "Vừa xong"
    };

    setMessages([newPost, ...messages]);
    setAuthorName("");
    setNewPostContent("");
  };

  const handleLikePost = (id: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === id) {
        return {
          ...msg,
          likes: msg.likedByUser ? msg.likes - 1 : msg.likes + 1,
          likedByUser: !msg.likedByUser
        };
      }
      return msg;
    }));
  };

  const handleAddReply = (msgId: string) => {
    if (!replyInput.trim()) return;
    setMessages(messages.map(msg => {
      if (msg.id === msgId) {
        return {
          ...msg,
          replies: [...msg.replies, replyInput.trim()]
        };
      }
      return msg;
    }));
    setReplyInput("");
    setActiveReplyId(null);
  };

  return (
    <div className="pt-20 lg:pt-28 pb-32 lg:pb-24 px-3 md:px-6 w-full max-w-7xl mx-auto overflow-y-auto h-full max-h-[100vh]">
      
      {/* Intro section */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-[10px] font-black tracking-[0.25em] text-pink-600 uppercase flex items-center justify-center gap-2 mb-2">
          <Globe2 className="w-4 h-4 animate-spin text-pink-500" />
          LovelyNet Social Wall
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight uppercase">
          Ban Đội Nhóm & Diễn Đàn Giao Lưu
        </h2>
        <p className="text-xs md:text-sm text-zinc-500 font-medium mt-2">
          Gặp gỡ những bạn trẻ dũng cảm khởi nghiệp, tham gia giữ xanh bờ biển Ninh Chữ và đăng tin tìm bạn đồng hành phượt quanh các cung đường Phan Rang hoang dã.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-6xl mx-auto">
        
        {/* LEFT COLUMN: ACTIVE CLUBS INDEX (Lg: 5cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-4 flex items-center justify-between shadow-sm">
            <span className="text-xs font-black text-zinc-900 uppercase tracking-tight flex items-center gap-2">
              <Users className="w-4 h-4 text-rose-500 animate-pulse" />
              Danh bạ Câu lạc bộ xuất sắc
            </span>
            <span className="text-[10px] font-black bg-rose-50 text-rose-700 px-2.5 py-1 rounded-md">
              4 Tổ chức chính
            </span>
          </div>

          <div className="space-y-4">
            {SHIFT_CLUBS.map((club, idx) => (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-zinc-200/80 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{club.category}</span>
                    <span className="text-[10px] font-black text-zinc-800 bg-zinc-100 px-2.5 py-0.5 rounded-lg">
                      {club.badge}
                    </span>
                  </div>

                  <h4 className="text-xs md:text-sm font-extrabold text-zinc-900 leading-none">
                    {club.name}
                  </h4>
                  <p className="text-xs text-zinc-500 leading-relaxed font-semibold">
                    {club.mission}
                  </p>
                </div>

                <div className="border-t border-zinc-100/60 pt-3 flex items-center justify-between text-[10px] text-zinc-400 font-bold">
                  <span>Trưởng nhóm: <span className="text-zinc-800 font-extrabold">{club.leader}</span></span>
                  <button
                    onClick={() => alert(`Cám ơn bạn! Hãy liên hệ Ban quản trị để gia nhập CLB: ${club.name}`)}
                    className="px-3 py-1 bg-zinc-950 hover:bg-zinc-900 text-white rounded-lg cursor-pointer"
                  >
                    Gia nhập +{club.count} thành viên
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: LOVELY MESSAGE WALL (Lg: 7cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Write post card */}
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-1.5 pb-2.5 border-b border-zinc-100">
              <Sparkles className="w-4 h-4 text-pink-500 animate-spin" style={{ animationDuration: "5s" }} />
              <span className="text-xs font-black text-zinc-900 uppercase tracking-tight">Viết tin cộng đồng mới</span>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Điền tên bạn (Ví dụ: Khánh Ly)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-bold text-zinc-800 outline-none focus:border-zinc-900 focus:bg-white"
                />
              </div>

              <textarea
                required
                rows={3}
                placeholder="Nội dung bản tin: Rủ đi đồi cát, hỏi đường đi Tháp Chàm, hay để lại một lời cảm ơn LovelyNet..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-bold text-zinc-800 outline-none focus:border-zinc-900 focus:bg-white resize-none"
              />

              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] text-zinc-400 font-semibold leading-relaxed hidden sm:inline">
                  🔒 Tin nhắn lịch sự, tôn trọng cộng đồng.
                </span>
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-zinc-950 hover:bg-zinc-900 font-black text-white rounded-xl text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all w-full sm:w-auto"
                >
                  <Send size={11} /> Đăng Bản Tin
                </button>
              </div>
            </form>
          </div>

          {/* Social feed list */}
          <div className="space-y-4">
            {messages.map((ms) => (
              <motion.div
                key={ms.id}
                layout
                className={`bg-white border rounded-3xl p-5 shadow-sm space-y-3 relative
                  ${ms.isPinned ? "border-amber-200 shadow-md shadow-amber-500/[0.02]" : "border-zinc-200/80"}`}
              >
                {/* Pin Badge */}
                {ms.isPinned && (
                  <span className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100 uppercase tracking-widest">
                    <Pin size={10} className="fill-amber-600 text-amber-600 rotate-45" /> Tin Nổi Bật
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ms.avatarSeed}`}
                    alt={ms.author}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-100 object-cover"
                  />
                  <div>
                    <h5 className="text-xs font-black text-zinc-900 flex items-center gap-1.5 leading-none">
                      {ms.author}
                      {ms.role && (
                        <span className="text-[8px] px-1.5 py-0.5 bg-rose-50 text-rose-600 border border-rose-100 rounded">
                          {ms.role}
                        </span>
                      )}
                    </h5>
                    <span className="text-[10px] text-zinc-400 font-semibold mt-1 block">{ms.createdAt}</span>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-zinc-700 leading-relaxed font-semibold">
                  {ms.content}
                </p>

                {/* Internal dynamic replies of the post */}
                {ms.replies.length > 0 && (
                  <div className="p-3 bg-zinc-50 border border-zinc-100/60 rounded-2xl space-y-2 mt-2">
                    <span className="text-[9px] font-black uppercase tracking-wider text-rose-500 block">
                      Phản hồi ({ms.replies.length})
                    </span>
                    {ms.replies.map((rep, rk) => (
                      <p key={rk} className="text-[11px] text-zinc-600 leading-relaxed font-semibold flex items-start gap-1">
                        <span className="text-rose-500 font-extrabold">•</span> {rep}
                      </p>
                    ))}
                  </div>
                )}

                {/* Quick Interactive Tool Actions */}
                <div className="border-t border-zinc-100/60 pt-3.5 flex items-center gap-4 text-xs font-extrabold text-zinc-500">
                  <button
                    onClick={() => handleLikePost(ms.id)}
                    className={`flex items-center gap-1 cursor-pointer transition-colors
                      ${ms.likedByUser ? "text-rose-600" : "hover:text-rose-600"}`}
                  >
                    <Heart size={13} className={ms.likedByUser ? "fill-rose-600 text-rose-600 animate-ping absolute" : ""} />
                    <Heart size={13} className={ms.likedByUser ? "fill-rose-600 text-rose-600" : ""} />
                    <span>Thích ({ms.likes})</span>
                  </button>

                  <button
                    onClick={() => {
                      if (activeReplyId === ms.id) {
                        setActiveReplyId(null);
                      } else {
                        setActiveReplyId(ms.id);
                      }
                    }}
                    className="flex items-center gap-1 hover:text-zinc-900 cursor-pointer"
                  >
                    <MessageSquare size={13} />
                    <span>Trả lời</span>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Đã sao chép liên kết bảng tin này!");
                    }}
                    className="flex items-center gap-1 hover:text-zinc-900 cursor-pointer p-0 bg-transparent text-zinc-500 shrink-0"
                  >
                    <Share2 size={13} />
                    <span>Chia sẻ</span>
                  </button>
                </div>

                {/* Add inline response */}
                <AnimatePresence>
                  {activeReplyId === ms.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-3 pt-3 border-t border-zinc-100/60 flex items-center gap-2"
                    >
                      <input
                        type="text"
                        placeholder="Nhập phản hồi nhanh..."
                        value={replyInput}
                        onChange={(e) => setReplyInput(e.target.value)}
                        className="flex-1 p-2 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold outline-none text-zinc-800"
                        autoFocus
                      />
                      <button
                        onClick={() => handleAddReply(ms.id)}
                        className="py-2 px-3.5 bg-zinc-950 text-white font-black text-xs rounded-xl cursor-pointer"
                      >
                        Gửi
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
