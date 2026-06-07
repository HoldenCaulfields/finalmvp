import React, { useState, useEffect } from "react";
import { 
  Trophy, 
  Sparkles, 
  User as UserIcon, 
  Heart, 
  Upload, 
  Loader2, 
  Trash2, 
  Search, 
  Bookmark, 
  TrendingUp, 
  Megaphone,
  School,
  X,
  Camera,
  Check
} from "lucide-react";
import { 
  collection, 
  onSnapshot, 
  setDoc, 
  updateDoc,
  doc, 
  deleteDoc, 
  query, 
  where 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ContestEntry, User as AppUser } from "../types";
import { uploadImage } from "@/services/uploadimage.services";
import { OperationType, handleFirestoreError } from "../cdn.services";
import { motion, AnimatePresence } from "framer-motion";

interface ContestsHubProps {
  user: AppUser | null;
  onLoginRequired: () => void;
}

const FACULTY_LIST = ["Kinh tế - Tổng hợp", "Điện - Điện tử", "Cơ khí - Xây dựng", "Công nghệ Ô tô"];

export default function ContestsHub({ user, onLoginRequired }: ContestsHubProps) {
  // Contest tabs: "handsome_talented" | "cheerful_classroom"
  const [activeContest, setActiveContest] = useState<"handsome_talented" | "cheerful_classroom">("handsome_talented");
  
  // Real-time synced entries for BOTH contests
  const [entries, setEntries] = useState<ContestEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Filters & searches
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFaculty, setSelectedFaculty] = useState<string>("Tất cả");

  // Registration/Submission Modal state
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [candidateName, setCandidateName] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [faculty, setFaculty] = useState<string>(FACULTY_LIST[0]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Sync contest entries from Firestore
  useEffect(() => {
    setIsLoading(true);
    const entriesCol = collection(db, "contest_entries");
    const q = query(entriesCol, where("contestId", "==", activeContest));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: ContestEntry[] = [];
      snapshot.forEach((snapDoc) => {
        const data = snapDoc.data();
        fetched.push({
          id: snapDoc.id,
          contestId: data.contestId || activeContest,
          candidateName: data.candidateName || "",
          caption: data.caption || "",
          imageUrl: data.imageUrl || "",
          votes: data.votes || 0,
          votedUserIds: data.votedUserIds || [],
          userId: data.userId || "",
          author: data.author || "Thí sinh ẩn danh",
          authorAvatar: data.authorAvatar || undefined,
          faculty: data.faculty || undefined,
          createdAt: data.createdAt || undefined,
        });
      });
      
      // Sort primarily by votes descending, then by creation date / ID descending
      fetched.sort((a, b) => {
        if (b.votes !== a.votes) {
          return b.votes - a.votes;
        }
        return b.id.localeCompare(a.id);
      });

      setEntries(fetched);
      setIsLoading(false);
      setSyncError(null);
    }, (error) => {
      console.error("Failed to sync contest entries:", error);
      setSyncError("Không thể tải bảng xếp hạng trực tiếp. Vui lòng kết nối Internet.");
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [activeContest]);

  // Handle Drag Events for fast upload
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
      alert("Vui lòng chọn tệp hình ảnh hợp lệ!");
      return;
    }
    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
    } catch (err) {
      console.error("Cloudinary Contest upload failed:", err);
      alert("Tải lên hình ảnh thất bại. Hãy thử lại!");
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

  // Submit contest photo
  const handlePublishEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onLoginRequired();
      return;
    }

    if (!candidateName.trim()) {
      alert(activeContest === "handsome_talented" ? "Vui lòng nhập tên thí sinh!" : "Vui lòng nhập tên lớp đại diện!");
      return;
    }

    if (!imageUrl) {
      alert("Vui lòng đăng tải hình ảnh dự thi!");
      return;
    }

    setIsSubmitting(true);
    const entryId = `entry_${Date.now()}`;
    const newEntry: ContestEntry = {
      id: entryId,
      contestId: activeContest,
      candidateName: candidateName.trim(),
      caption: caption.trim(),
      imageUrl: imageUrl,
      votes: 0,
      votedUserIds: [],
      userId: user.id,
      author: user.name,
      authorAvatar: user.photoUrl || "",
      faculty: faculty,
      createdAt: new Date().toISOString()
    };

    try {
      const docRef = doc(db, "contest_entries", entryId);
      await setDoc(docRef, newEntry);
      
      // Reset form & close modal
      setCandidateName("");
      setCaption("");
      setImageUrl("");
      setShowSubmitModal(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `contest_entries/${entryId}`);
      alert("Đăng ký dự thi thất bại. Hãy kiểm tra kết nối mạng!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Vote or retract vote logic
  const handleVoteToggle = async (entry: ContestEntry) => {
    if (!user) {
      onLoginRequired();
      return;
    }

    const hasVoted = entry.votedUserIds.includes(user.id);
    let updatedVotedUserIds: string[];
    let updatedVotes: number;

    if (hasVoted) {
      updatedVotedUserIds = entry.votedUserIds.filter(id => id !== user.id);
      updatedVotes = Math.max(0, entry.votes - 1);
    } else {
      updatedVotedUserIds = [...entry.votedUserIds, user.id];
      updatedVotes = entry.votes + 1;
    }

    try {
      const docRef = doc(db, "contest_entries", entry.id);
      // Rules allow toggling 'votes' and 'votedUserIds' fields
      await updateDoc(docRef, {
        votes: updatedVotes,
        votedUserIds: updatedVotedUserIds
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `contest_entries/${entry.id}`);
      alert("Bình chọn xảy ra lỗi. Vui lòng kết nối Internet!");
    }
  };

  // Delete option for owner
  const handleDeleteEntry = async (entryId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn rút tác phẩm hình ảnh dự thi này xuống?")) return;

    try {
      const docRef = doc(db, "contest_entries", entryId);
      await deleteDoc(docRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `contest_entries/${entryId}`);
      alert("Xóa tác phẩm thất bại. Hãy thử lại!");
    }
  };

  // Filter entry matches
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = !searchQuery || 
      entry.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.caption.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesFaculty = selectedFaculty === "Tất cả" || entry.faculty === selectedFaculty;
    return matchesSearch && matchesFaculty;
  });

  // Podium (Leaderboard top 3) calculation
  const podium = entries.slice(0, 3);
  // Reorder so 2nd is left, 1st is middle, 3rd is right for typical graphical podium representation
  const graphicalPodium = [];
  if (podium[1]) graphicalPodium.push({ ...podium[1], rank: 2 });
  if (podium[0]) graphicalPodium.push({ ...podium[0], rank: 1 });
  if (podium[2]) graphicalPodium.push({ ...podium[2], rank: 3 });

  return (
    <div className="w-full space-y-8 select-none py-2" id="campus-contests-container">
      {/* Contest Banner Introduction Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-rose-950 via-neutral-900 to-rose-900 text-white shadow-xl p-6 md:p-8 animate-fade-in border border-rose-900/20">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-0 bottom-0 -translate-x-12 translate-y-12 w-48 h-48 bg-rose-700/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase tracking-wider border border-rose-500/30">
              <Sparkles size={11} className="animate-spin text-rose-300" /> Cổng Bình Chọn Thực Tế 2026
            </span>
            
            <h2 className="text-xl md:text-2xl font-black tracking-tight leading-tight">
              Sân Chơi Kết Nối Kỷ Niệm Khánh Hòa
            </h2>
            <p className="text-xs text-neutral-300 leading-relaxed max-w-2xl font-light">
              Nơi vinh danh những cá nhân nổi bật đầy tài sắc cùng các tập thể lớp học tràn ngập nụ cười rạng rỡ của trường chúng ta. Gửi ảnh dự thi, tích lũy điểm bình chọn trực tiếp và săn phần thưởng vô cùng xinh xắn!
            </p>
            
            {/* Contest Selector Bar */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => {
                  setActiveContest("handsome_talented");
                  setSearchQuery("");
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                  activeContest === "handsome_talented"
                    ? "bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-950/40"
                    : "bg-neutral-800/60 hover:bg-neutral-800 text-neutral-300 border-neutral-700/50"
                }`}
              >
                <span>🕺</span> Nam sinh ưu tú & tài năng
              </button>
              
              <button
                onClick={() => {
                  setActiveContest("cheerful_classroom");
                  setSearchQuery("");
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                  activeContest === "cheerful_classroom"
                    ? "bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-950/40"
                    : "bg-neutral-800/60 hover:bg-neutral-800 text-neutral-300 border-neutral-700/50"
                }`}
              >
                <span>🏫</span> Lớp học vui nhộn
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-stretch sm:items-center lg:items-end justify-center w-full gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-6">
            <div className="text-center lg:text-right">
              <div className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Thời gian diễn ra</div>
              <div className="text-sm font-black text-rose-300">01/06 - 30/06/2026</div>
              <div className="text-[9px] text-neutral-400 font-medium">Bình chọn tự động cập nhật tích hợp Firestore</div>
            </div>
            
            <button
              onClick={() => {
                if (!user) {
                  onLoginRequired();
                } else {
                  setShowSubmitModal(true);
                }
              }}
              className="bg-white hover:bg-rose-50 text-rose-950 font-black text-xs px-5 py-3 rounded-2xl shadow-lg border-none flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all w-full cursor-pointer cursor-interactive"
            >
              <Upload size={14} strokeWidth={2.5} />
              <span>Đăng ảnh dự thi ngay</span>
            </button>
          </div>
        </div>
      </div>

      {syncError && (
        <div className="p-3 bg-red-100 hover:bg-neutral-50 rounded-2xl border border-red-200 text-xs text-red-950 flex items-center gap-2">
          <span>⚠️</span> {syncError}
        </div>
      )}

      {/* ── BẢNG XẾP HẠNG THẬT ĐẸP (LEADERBOARD PODIUM) ── */}
      <AnimatePresence mode="wait">
        {!isLoading && entries.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-4"
            key={`podium-${activeContest}`}
          >
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-50 border border-amber-200 text-amber-600 rounded-xl">
                <Trophy size={16} />
              </div>
              <div>
                <h3 className="text-sm font-black text-neutral-900 leading-none">Bảng xếp hạng tài hoa</h3>
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">Top 3 đang dẫn đầu lượt bình chọn</p>
              </div>
            </div>

            {/* Podium Visual Board */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4 bg-white rounded-3xl border border-neutral-100 p-6 shadow-sm">
              {/* If entries.length < 3, we just map whatever we have */}
              {graphicalPodium.map((candidate) => {
                const colors = {
                  1: {
                    border: "border-amber-400",
                    bgBadge: "bg-amber-400 text-amber-950",
                    glow: "shadow-amber-500/10",
                    accent: "text-amber-500",
                    rankName: "Quán Quân 🥇",
                    order: "order-2",
                    height: "h-auto py-8 bg-amber-50/10"
                  },
                  2: {
                    border: "border-slate-300",
                    bgBadge: "bg-slate-300 text-slate-900",
                    glow: "shadow-slate-400/5",
                    accent: "text-slate-500",
                    rankName: "Á Quân 🥈",
                    order: "order-1",
                    height: "h-auto py-6 bg-slate-50/10"
                  },
                  3: {
                    border: "border-amber-700/30",
                    bgBadge: "bg-amber-700/20 text-amber-900",
                    glow: "shadow-amber-600/5",
                    accent: "text-amber-700",
                    rankName: "Giải Ba 🥉",
                    order: "order-3",
                    height: "h-auto py-4 bg-amber-50/5"
                  }
                }[candidate.rank as 1 | 2 | 3]!;

                const isVoted = user && candidate.votedUserIds.includes(user.id);

                return (
                  <div 
                    key={candidate.id} 
                    className={`flex flex-col items-center text-center p-4 rounded-2xl border border-neutral-100 shadow-sm relative transition-all hover:shadow-md cursor-pointer ${colors.order} ${colors.glow} ${colors.height} bg-neutral-50/30 w-full`}
                  >
                    {/* Floating Rank Badge */}
                    <div className={`absolute -top-3 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${colors.bgBadge} border-2 border-white shadow-sm`}>
                      {colors.rankName}
                    </div>

                    {/* Styled Avatar/Room Image Container */}
                    <div className="relative mt-2 mb-3">
                      <div className={`w-20 h-20 rounded-full overflow-hidden border-4 ${colors.border} shadow-md`}>
                        <img 
                          src={candidate.imageUrl} 
                          alt={candidate.candidateName} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-rose-600 border-2 border-white text-white flex items-center justify-center text-[10px] font-bold">
                        {candidate.rank}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-neutral-900 line-clamp-1 mb-0.5">{candidate.candidateName}</h4>
                    <span className="text-[10px] font-bold text-neutral-400 block mb-2">{candidate.faculty || "Khoa thành viên"}</span>
                    
                    <p className="text-[11px] text-neutral-500 line-clamp-2 max-w-xs mb-3 italic">
                      "{candidate.caption || "Chưa có lời tự sự..."}"
                    </p>

                    {/* High intensity votes tracker */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 rounded-xl text-rose-700 font-extrabold text-xs mb-2">
                      <Heart size={12} fill="currentColor" className="text-rose-500" />
                      <span>{candidate.votes} lượt vote</span>
                    </div>

                    {/* Quick vote toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVoteToggle(candidate);
                      }}
                      className={`w-full py-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border cursor-pointer border-none shadow-sm flex items-center justify-center gap-1 ${
                        isVoted 
                          ? "bg-rose-600 text-white shadow-inner" 
                          : "bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-200/80"
                      }`}
                    >
                      <Heart size={10} fill={isVoted ? "currentColor" : "none"} className={isVoted ? "text-white" : "text-rose-500"} />
                      <span>{isVoted ? "Đã bình chọn" : "Bình chọn ngay"}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CORE SEARCH, COMBINED FILTERS AND CONTEST LIST GRID ── */}
      <div className="space-y-4" id="all-candidates-contest-list">
        
        {/* Controls and filters bar */}
        <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center bg-white p-4 rounded-2xl border border-neutral-200/50 shadow-sm">
          <div className="relative flex-1 max-w-md">
            <input 
              type="text" 
              placeholder={activeContest === "handsome_talented" ? "Tìm họ tên nam sinh, tác giả..." : "Tìm tên lớp học, chi đoàn..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200/70 rounded-xl pl-9 pr-8 py-2.5 text-xs text-neutral-900 outline-none focus:bg-white focus:border-rose-600 transition-all placeholder:text-neutral-400"
            />
            <span className="absolute left-3.5 top-3 text-neutral-400">
              <Search size={13} className="opacity-75" />
            </span>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 w-5 h-5 rounded-full bg-neutral-200 text-neutral-500 flex items-center justify-center text-[10px] border-none font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 md:pb-0">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider hidden sm:block">Khoa:</span>
            {["Tất cả", ...FACULTY_LIST].map((fac) => (
              <button
                key={fac}
                onClick={() => setSelectedFaculty(fac)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border cursor-pointer ${
                  selectedFaculty === fac 
                    ? "bg-neutral-900 text-white border-neutral-950 font-bold shadow-sm" 
                    : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
                }`}
              >
                {fac}
              </button>
            ))}
          </div>
        </div>

        {/* Results indicator */}
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
            Danh sách dự thi ({filteredEntries.length} bài thi)
          </span>
          <span className="text-[10px] font-md text-neutral-400">
            {activeContest === "handsome_talented" ? "Thí sinh tự do hoặc Khoa giới thiệu" : "Hình ảnh tập thể hoặc lớp học vui vẻ"}
          </span>
        </div>

        {/* Entries Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 min-h-48 text-center text-neutral-400">
            <Loader2 className="animate-spin text-rose-600 mb-2" size={32} />
            <p className="text-xs font-semibold">Đang chuẩn bị danh sách bình chọn...</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="py-16 text-center bg-white border border-neutral-100 rounded-3xl shadow-sm text-neutral-400 flex flex-col items-center max-w-sm mx-auto">
            <span className="text-3xl mb-3">💫</span>
            <h4 className="text-xs font-black text-neutral-900 mb-1">Chưa tìm thấy tác phẩm phù hợp</h4>
            <p className="text-[10px] text-neutral-400 px-6 leading-relaxed mb-4">
              Không tìm thấy thí sinh hay chi đoàn nào khớp bộ lọc. Trở thành người đăng bức ảnh dự thi đầu tiên để chiếm ngôi đầu nào!
            </p>
            <button 
              onClick={() => {
                if(!user) onLoginRequired();
                else setShowSubmitModal(true);
              }}
              className="bg-neutral-950 text-white text-[10px] font-bold px-4 py-2 rounded-xl"
            >
              Đăng ảnh dự thi
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntries.map((entry) => {
              const isVoted = user && entry.votedUserIds.includes(user.id);
              const isMyEntry = user && entry.userId === user.id;

              return (
                <div 
                  key={entry.id}
                  className="bg-white rounded-2xl border border-neutral-200/50 p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group select-none"
                >
                  <div>
                    {/* Contest Image Wrapper */}
                    <div className="relative w-full h-48 rounded-xl overflow-hidden mb-3.5 bg-neutral-100">
                      <img 
                        src={entry.imageUrl} 
                        alt={entry.candidateName} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Interactive Faculty Label tag */}
                      {entry.faculty && (
                        <span className="absolute top-2.5 left-2.5 bg-black/55 backdrop-blur-md text-[9px] font-black text-white px-2.5 py-1 rounded-lg border border-white/10 select-none tracking-wider uppercase">
                          {entry.faculty}
                        </span>
                      )}

                      {/* Float Vote Count Badge */}
                      <span className="absolute bottom-2.5 right-2.5 bg-rose-900/90 text-rose-50 text-[10px] font-black px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1.5 select-none">
                        <Heart size={10} fill="currentColor" className="text-rose-300" />
                        <span>{entry.votes} vote</span>
                      </span>

                      {/* Owner Delete Option */}
                      {isMyEntry && (
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="absolute top-2.5 right-2.5 bg-neutral-950/80 hover:bg-red-600 text-white p-2 rounded-lg border-none hover:scale-105 transition-all cursor-pointer shadow-sm"
                          title="Gỡ ảnh dự thi của bạn"
                        >
                          <Trash2 size={13} className="text-white" />
                        </button>
                      )}
                    </div>

                    {/* Candidate descriptive info */}
                    <div className="space-y-1 mb-3">
                      <h4 className="text-xs font-black text-neutral-900 group-hover:text-rose-950 transition-colors line-clamp-1">
                        {entry.candidateName}
                      </h4>
                      <p className="text-[11px] text-neutral-500 line-clamp-3 leading-relaxed min-h-[3rem]">
                        "{entry.caption || "Tác phẩm gửi gắm khoảnh khắc rực rỡ học tập, năng lực chi đoàn xuất sắc của sinh viên."}"
                      </p>
                    </div>
                  </div>

                  {/* Attachment card footer */}
                  <div className="border-t border-neutral-100/80 pt-3 flex items-center justify-between mt-1">
                    {/* Submitter attribution */}
                    <div className="flex items-center gap-2 select-none">
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-rose-50 border border-neutral-100 shrink-0 flex items-center justify-center font-black text-[9px] text-rose-700">
                        {entry.authorAvatar ? (
                          <img src={entry.authorAvatar} alt={entry.author} className="w-full h-full object-cover" />
                        ) : (
                          <span>{entry.author.substring(0, 2).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="leading-none select-none">
                        <span className="text-[9px] text-neutral-400 block font-semibold uppercase tracking-wider">Gửi bởi</span>
                        <span className="text-[10px] font-bold text-neutral-800 block truncate max-w-[90px]">{entry.author}</span>
                      </div>
                    </div>

                    {/* Highly clickable button vote */}
                    <button
                      onClick={() => handleVoteToggle(entry)}
                      className={`py-2 px-3.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border cursor-pointer border-none shadow-sm flex items-center gap-1.5 ${
                        isVoted 
                          ? "bg-rose-600 text-white" 
                          : "bg-rose-50 hover:bg-rose-100 text-rose-700 hover:scale-105 active:scale-95"
                      }`}
                    >
                      <Heart size={11} fill={isVoted ? "currentColor" : "none"} className={isVoted ? "text-white animate-pulse" : "text-rose-600"} />
                      <span>{isVoted ? "Đã bình chọn" : "Bình chọn"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── SUBMISSION / REGISTER CONTEST MODAL FORM ── */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-lg p-5 md:p-6 shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto scrollbar-none"
            >
              {/* Close button */}
              <button 
                onClick={() => setShowSubmitModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 border-none text-neutral-500 cursor-pointer flex items-center justify-center"
              >
                <X size={15} />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600">
                    <Camera size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-neutral-900">
                      Gửi ảnh dự cuộc thi
                    </h3>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                      {activeContest === "handsome_talented" ? "Nam sinh ưu tú & tài sắc" : "Tập thể lớp học vui nhộn"}
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePublishEntry} className="space-y-4">
                  {/* Candidate Name input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                      {activeContest === "handsome_talented" ? "Họ tên thí sinh đăng ký" : "Tên lớp học / Chi đoàn tiêu biểu"}
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder={activeContest === "handsome_talented" ? "Ví dụ: Trần Minh Châu" : "Ví dụ: K20 Công nghệ Ô tô A"}
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200/80 rounded-xl px-3.5 py-3 text-xs text-neutral-900 outline-none focus:bg-white focus:border-rose-600 transition-all placeholder:text-neutral-400"
                    />
                  </div>

                  {/* Slogan / Self introduction input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                      Slogan hoặc Lời giới thiệu dự thi
                    </label>
                    <textarea 
                      required
                      rows={3}
                      placeholder={activeContest === "handsome_talented" ? "Hãy chia sẻ về tài năng, sở thích hoặc một châm ngôn sống của bạn..." : "Slogan hay hoặc những kỷ niệm đáng nhớ của tập thể lớp chúng mình..."}
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200/80 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:bg-white focus:border-rose-600 transition-all placeholder:text-neutral-400"
                    />
                  </div>

                  {/* Faculty Selector and Select Club options */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                      Khoa đang học / Khoa sinh hoạt
                    </label>
                    <select
                      value={faculty}
                      onChange={(e) => setFaculty(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200/80 rounded-xl px-3.5 py-3 text-xs text-neutral-900 outline-none focus:bg-white focus:border-rose-600 transition-all cursor-pointer"
                    >
                      {FACULTY_LIST.map((fac) => (
                        <option key={fac} value={fac}>{fac}</option>
                      ))}
                    </select>
                  </div>

                  {/* Drag and Drop Cloudinary Uploader */}
                  <div className="space-y-2 select-none">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                      Ảnh tác phẩm tham gia
                    </label>
                    
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`w-full border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center transition-all ${
                        dragActive
                          ? "border-rose-500 bg-rose-50/40"
                          : imageUrl
                          ? "border-green-400 bg-green-50/10"
                          : "border-neutral-200 bg-neutral-50/30 hover:bg-neutral-50/60"
                      }`}
                    >
                      <input
                        type="file"
                        id="contest-image-input"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isUploading}
                        className="hidden"
                      />
                      
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-2 py-4">
                          <Loader2 className="animate-spin text-rose-600" size={28} />
                          <p className="text-xs font-semibold text-rose-950">Đang lưu ảnh an toàn lên Cloudinary...</p>
                        </div>
                      ) : imageUrl ? (
                        <div className="flex flex-col items-center gap-2 py-1 w-full relative">
                          <img 
                            src={imageUrl} 
                            alt="Pre-uploaded candidate picture" 
                            className="w-24 h-24 rounded-xl object-cover border shadow-sm"
                          />
                          <div className="flex items-center gap-1.5 text-green-700 text-[10px] font-bold uppercase tracking-wider">
                            <Check size={12} className="text-green-600" /> Tải lên thành công!
                          </div>
                          <button
                            type="button"
                            onClick={() => setImageUrl("")}
                            className="bg-neutral-900 hover:bg-red-600 text-white text-[10px] px-3.5 py-1.5 rounded-lg border-none cursor-pointer mt-1 font-semibold"
                          >
                            Chọn ảnh khác
                          </button>
                        </div>
                      ) : (
                        <label
                          htmlFor="contest-image-input"
                          className="flex flex-col items-center gap-2 cursor-pointer w-full text-center py-4"
                        >
                          <div className="p-3 bg-rose-50 rounded-full text-rose-600 border border-rose-100 shadow-sm">
                            <Upload size={18} />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-neutral-800 block">Thả tệp ảnh hoặc nhấp để chọn</span>
                            <span className="text-[10px] text-neutral-400 block mt-1">PNG, JPG, WebP tự động xử lý lên máy chủ</span>
                          </div>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="pt-3 flex gap-3 text-xs select-none">
                    <button
                      type="button"
                      onClick={() => setShowSubmitModal(false)}
                      className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold py-3 px-4 rounded-xl cursor-pointer border-none text-center"
                    >
                      Bỏ qua
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isUploading || !imageUrl}
                      className={`flex-1 bg-neutral-950 hover:bg-rose-950 text-white font-black py-3 px-4 rounded-xl text-center cursor-pointer border-none shadow-sm flex items-center justify-center gap-1.5 ${
                        (isSubmitting || isUploading || !imageUrl) ? "opacity-45 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={14} className="animate-spin text-white" />
                          <span>Đang đăng ký...</span>
                        </>
                      ) : (
                        <span>Nộp bài ngay ✨</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
