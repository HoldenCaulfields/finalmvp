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
    name: "Hội Khởi Nghiệp Ninh Thuận",
    count: 245,
    mission: "Kết nối người làm kinh doanh, nhà đầu tư và cộng đồng để thúc đẩy nông sản, du lịch xanh và chuyển đổi số tại địa phương.",
    leader: "Anh Nguyễn Đăng Khoa",
    category: "Khởi nghiệp & Đầu tư",
    badge: "🏁 Đối tác chiến lược"
  },
  {
    id: "club_2",
    name: "Tìm đồng đội làm phim, quay video nghệ thuật",
    count: 180,
    mission: "Kết nối những dân phê phim yêu thích điện ảnh, nghệ thuật",
    leader: "Trung Thuc",
    category: "Cinema",
    badge: "🌱 Hoạt động tích cực"
  },
  {
    id: "club_3",
    name: "Cộng Đồng Công Nghệ Phan Rang",
    count: 98,
    mission: "Chia sẻ kiến thức lập trình, xây dựng sản phẩm địa phương và mở lớp học kỹ năng số cho sinh viên và người trẻ.",
    leader: "Anh Phan Minh Quốc",
    category: "Công nghệ & Học tập",
    badge: "💻 Sáng tạo mỗi tuần"
  },
  {
    id: "club_4",
    name: "Tổ Hợp Tác Văn Hóa Chăm Mới",
    count: 56,
    mission: "Giữ gìn di sản nghệ thuật Chăm, kết hợp truyền thống với thiết kế hiện đại để lan tỏa vẻ đẹp địa phương.",
    leader: "Nghệ nhân Đàng Thị Hạnh",
    category: "Văn hóa & Nghệ thuật",
    badge: "🏺 Di sản sống động"
  }
];

const PRE_MESSAGES: MessagePost[] = [
  {
    id: "msg_1",
    author: "Bùi Khánh Hòa (Admin)",
    role: "Quản trị viên LovelyNet",
    avatarSeed: "KhanhHoa",
    content: "Chào mừng bạn đến với không gian cộng đồng Phan Rang! Hãy dùng bảng tin này để kết nối bạn bè, cùng đi ngắm nắng đồi cát Nam Cương hoặc bàn chuyện khám phá Tháp Chàm và ẩm thực địa phương. ✨",
    likes: 42,
    likedByUser: false,
    replies: [
      "LovelyNet mượt và dễ dùng quá, cảm ơn team nhé!",
      "Chiều nay ai rủ nhau đi ăn bánh xèo lề đường không ạ?"
    ],
    createdAt: "Được ghim định kỳ",
    isPinned: true
  },
  {
    id: "msg_2",
    author: "Elena Petrova",
    role: "Du khách",
    avatarSeed: "Elena",
    content: "Mai sáng mình muốn đi tham quan Ba Mọi Vineyard, ai có nhu cầu đi chung thì cứ phản hồi giúp mình nhé. Mình ở gần bãi biển Ninh Chữ. 👋",
    likes: 18,
    likedByUser: false,
    replies: [
      "Nhóm 3 người sẽ đi khoảng 9 giờ sáng, mình kết nối với bạn nhé.",
      "Bạn có thể xem tab Drivers để ước tính chi phí đi lại dễ hơn."
    ],
    createdAt: "20 phút trước",
    isPinned: false
  },
  {
    id: "msg_3",
    author: "Nguyễn Trung Nghĩa",
    role: "Sinh viên CNTT",
    avatarSeed: "TrungNghia",
    content: "Tìm bạn cùng học React + Tailwind vào tối thứ 7 tại quán cà phê Sáng Tạo Phan Rang, vừa học vừa trao đổi ý tưởng sản phẩm nho nhỏ.",
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

  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState("");

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !newPostContent.trim()) return;

    const newPost: MessagePost = {
      id: `msg_${Date.now()}`,
      author: authorName.trim(),
      role: "Thành viên cộng đồng",
      avatarSeed: authorName.trim().replace(/\s/g, ""),
      content: newPostContent.trim(),
      likes: 0,
      likedByUser: false,
      replies: [],
      createdAt: "Vừa xong"
    };

    setMessages((prev) => [newPost, ...prev]);
    setAuthorName("");
    setNewPostContent("");
  };

  const handleLikePost = (id: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === id) {
          return {
            ...msg,
            likes: msg.likedByUser ? msg.likes - 1 : msg.likes + 1,
            likedByUser: !msg.likedByUser
          };
        }
        return msg;
      })
    );
  };

  const handleAddReply = (msgId: string) => {
    if (!replyInput.trim()) return;

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === msgId) {
          return {
            ...msg,
            replies: [...msg.replies, replyInput.trim()]
          };
        }
        return msg;
      })
    );
    setReplyInput("");
    setActiveReplyId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 px-3 pb-28 pt-20 md:px-6 lg:pt-24">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[32px] border border-zinc-200/80 bg-white/90 p-5 shadow-[0_24px_90px_-40px_rgba(15,23,42,0.35)] backdrop-blur md:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-rose-600">
                <Globe2 className="h-4 w-4 animate-spin text-rose-500" />
                LovelyNet Social Wall
              </span>
              <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900 sm:text-3xl">
                Cộng đồng Phan Rang kết nối điều đẹp và điều hữu ích
              </h2>
              <p className="text-sm leading-6 text-zinc-600 md:text-[15px]">
                Từ các câu lạc bộ khởi nghiệp, hoạt động bảo vệ môi trường đến những buổi học kỹ năng số, đây là nơi mọi người cùng lan tỏa năng lượng tích cực và tìm thấy đồng hành phù hợp.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-zinc-900 px-3 py-1 text-[10px] font-bold text-white">🌿 Sống xanh</span>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold text-amber-700">🚲 Chia sẻ chuyến đi</span>
                <span className="rounded-full bg-rose-100 px-3 py-1 text-[10px] font-bold text-rose-700">💡 Học hỏi cùng nhau</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[280px]">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Hoạt động mới</p>
                <p className="mt-1 text-xl font-black text-zinc-900">12+</p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Người tham gia</p>
                <p className="mt-1 text-xl font-black text-zinc-900">1.2k</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <div className="rounded-[28px] border border-zinc-200/80 bg-white p-4 shadow-sm md:p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-rose-500" />
                  <span className="text-xs font-black uppercase tracking-tight text-zinc-900">
                    Cộng đồng nổi bật
                  </span>
                </div>
                <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-black text-rose-700">
                  4 nhóm chính
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Mỗi nhóm đều mang một mục tiêu riêng nhưng cùng hướng tới một thành phố Phan Rang ngày càng kết nối và phát triển bền vững.
              </p>
            </div>

            <div className="space-y-3">
              {SHIFT_CLUBS.map((club, idx) => (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-[24px] border border-zinc-200/80 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-400">{club.category}</span>
                    <span className="rounded-lg bg-zinc-100 px-2.5 py-0.5 text-[10px] font-black text-zinc-800">
                      {club.badge}
                    </span>
                  </div>

                  <h4 className="mt-3 text-sm font-extrabold leading-5 text-zinc-900">
                    {club.name}
                  </h4>
                  <p className="mt-2 text-xs leading-5 text-zinc-500">
                    {club.mission}
                  </p>

                  <div className="mt-4 flex flex-col gap-3 border-t border-zinc-100 pt-3 text-[10px] font-bold text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
                    <span>
                      Trưởng nhóm: <span className="text-zinc-800">{club.leader}</span>
                    </span>
                    <button
                      onClick={() => alert(`Cảm ơn bạn! Hãy liên hệ Ban quản trị để tham gia nhóm: ${club.name}`)}
                      className="rounded-xl bg-zinc-950 px-3 py-2 text-[10px] font-black text-white transition hover:bg-zinc-800"
                    >
                      Gia nhập +{club.count}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </aside>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-zinc-200/80 bg-white p-4 shadow-sm md:p-5">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                <Sparkles className="h-4 w-4 animate-spin text-pink-500" style={{ animationDuration: "5s" }} />
                <span className="text-xs font-black uppercase tracking-tight text-zinc-900">
                  Đăng tin cho cộng đồng
                </span>
              </div>

              <form onSubmit={handleCreatePost} className="mt-4 space-y-3.5">
                <input
                  type="text"
                  required
                  placeholder="Tên bạn (ví dụ: Khánh Ly)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-xs font-bold text-zinc-800 outline-none transition focus:border-zinc-900 focus:bg-white"
                />

                <textarea
                  required
                  rows={3}
                  placeholder="Bạn muốn chia sẻ điều gì? Gợi ý: rủ nhau đi xem nắng, tìm người học chung, hoặc đăng một lời cảm ơn tới cộng đồng..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="min-h-[96px] w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 p-3.5 text-xs font-bold text-zinc-800 outline-none transition focus:border-zinc-900 focus:bg-white"
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-[10px] font-semibold leading-relaxed text-zinc-400">
                    🔒 Hãy giữ nội dung lịch sự, tử tế và hữu ích cho cộng đồng.
                  </span>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-zinc-950 px-5 py-2.5 text-xs font-black text-white transition hover:bg-zinc-800 active:scale-[0.98] sm:w-auto"
                  >
                    <Send size={11} /> Đăng bản tin
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-3">
              {messages.map((ms) => (
                <motion.div
                  key={ms.id}
                  layout
                  className={`rounded-[24px] border bg-white p-4 shadow-sm sm:p-5 ${ms.isPinned ? "border-amber-200 shadow-md shadow-amber-500/[0.03]" : "border-zinc-200/80"}`}
                >
                  {ms.isPinned && (
                    <span className="absolute right-4 top-4 flex items-center gap-1 rounded-lg border border-amber-100 bg-amber-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">
                      <Pin size={10} className="rotate-45 fill-amber-600 text-amber-600" /> Tin nổi bật
                    </span>
                  )}

                  <div className="flex items-start gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ms.avatarSeed}`}
                      alt={ms.author}
                      referrerPolicy="no-referrer"
                      className="h-11 w-11 rounded-2xl border border-zinc-100 bg-zinc-100 object-cover"
                    />
                    <div className="min-w-0">
                      <h5 className="flex flex-wrap items-center gap-1.5 text-xs font-black text-zinc-900">
                        {ms.author}
                        {ms.role && (
                          <span className="rounded border border-rose-100 bg-rose-50 px-1.5 py-0.5 text-[8px] text-rose-600">
                            {ms.role}
                          </span>
                        )}
                      </h5>
                      <span className="mt-1 block text-[10px] font-semibold text-zinc-400">{ms.createdAt}</span>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 font-semibold text-zinc-700">
                    {ms.content}
                  </p>

                  {ms.replies.length > 0 && (
                    <div className="mt-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-3">
                      <span className="mb-2 block text-[9px] font-black uppercase tracking-[0.25em] text-rose-500">
                        Phản hồi ({ms.replies.length})
                      </span>
                      {ms.replies.map((rep, rk) => (
                        <p key={rk} className="flex items-start gap-1 text-[11px] font-semibold leading-5 text-zinc-600">
                          <span className="pt-1 text-rose-500">•</span>
                          <span>{rep}</span>
                        </p>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-3.5 text-xs font-extrabold text-zinc-500">
                    <button
                      onClick={() => handleLikePost(ms.id)}
                      className={`flex items-center gap-1 transition-colors ${ms.likedByUser ? "text-rose-600" : "hover:text-rose-600"}`}
                    >
                      <Heart size={13} className={ms.likedByUser ? "fill-rose-600 text-rose-600" : ""} />
                      <span>Thích ({ms.likes})</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveReplyId((prev) => (prev === ms.id ? null : ms.id));
                      }}
                      className="flex items-center gap-1 transition hover:text-zinc-900"
                    >
                      <MessageSquare size={13} />
                      <span>Trả lời</span>
                    </button>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Đã sao chép liên kết bảng tin này!");
                      }}
                      className="flex items-center gap-1 bg-transparent p-0 text-zinc-500 transition hover:text-zinc-900"
                    >
                      <Share2 size={13} />
                      <span>Chia sẻ</span>
                    </button>
                  </div>

                  <AnimatePresence>
                    {activeReplyId === ms.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 flex flex-col gap-2 overflow-hidden border-t border-zinc-100 pt-3 sm:flex-row"
                      >
                        <input
                          type="text"
                          placeholder="Nhập phản hồi nhanh..."
                          value={replyInput}
                          onChange={(e) => setReplyInput(e.target.value)}
                          className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 px-3 text-xs font-bold text-zinc-800 outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleAddReply(ms.id)}
                          className="rounded-xl bg-zinc-950 px-3.5 py-2 text-xs font-black text-white"
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
    </div>
  );
}
