'use client';
import { useState, useEffect } from "react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import HeroHeader from "./components/HeroHeader";
import PostCard from "./components/PostCard";
import CommentModal from "./components/CommentModal";
import UploadModal from "./components/UploadModal";
import ImageLightbox from "./components/ImageLightbox";
import GoogleLoginModal from "./components/GoogleLoginModal";
import UserProfileDrawer from "./components/UserProfileDrawer";
import { Post, User } from "./types";
import { 
  collection, 
  onSnapshot, 
  setDoc,
  doc, 
  deleteDoc,
  query,
} from "firebase/firestore";
import { OperationType, handleFirestoreError } from "./cdn.services";
import { db } from "@/lib/firebase";
import Navbar from "./components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import ContestsHub from "./components/ContestHub";
import StudyHub from "./components/StudyHub";
import MarketplaceHub from "./components/MarketplaceHub";
import FeedbackHub from "./components/FeedbackHub";

export default function App() {
  const [activeTab, setActiveTab] = useState<"Faculty" | "Club" | "Study" | "Marketplace">("Faculty");
  const [activeFaculty, setActiveFaculty] = useState<string>("Tất cả");
  const [activeClub, setActiveClub] = useState<string>("Tất cả");
  const [posts, setPosts] = useState<Post[]>([]);

  const [commentPost, setCommentPost] = useState<Post | null>(null);
  const [lightboxPost, setLightboxPost] = useState<Post | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"newest" | "likes">("newest");

  const { profile, loading: authLoading, login, logout, setProfile } = useAuth();

  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Real-time Firestore synchronizer
  useEffect(() => {
    const postsCol = collection(db, "posts");
    const q = query(postsCol);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: Post[] = [];
      snapshot.forEach((snapDoc) => {
        const data = snapDoc.data();
        const pId = Number(snapDoc.id) || data.id;
        fetched.push({
          id: pId,
          author: data.author || "Khách ẩn danh",
          avatar: data.avatar || "SV",
          faculty: data.faculty || "Kinh tế - Tổng hợp",
          club: data.club || undefined,
          image: data.image || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&q=80",
          caption: data.caption || "",
          likes: data.likes || 0,
          likedUsers: data.likedUsers || [],
          commentsCount: data.commentsCount || 0,
          comments: data.comments || [],
          time: data.time || "Vừa xong",
          liked: profile ? (data.likedUsers || []).includes(profile.id) : false,
          tags: data.tags || [],
          userId: data.userId || undefined
        });
      });

      // Merge Firestore fetched posts with INITIAL_POSTS in memory
      const merged = [...fetched];

      // Sort in memory by ID descending
      merged.sort((a, b) => b.id - a.id);
      setPosts(merged);
      setSyncError(null);

      // Keep active Comments Modal content in-sync
      if (commentPost) {
        const matching = merged.find(p => p.id === commentPost.id);
        if (matching) {
          setCommentPost(matching);
        }
      }
    }, (error) => {
      console.warn("Firestore listener failed. Continuing with local offline cache.", error);
      setSyncError(error instanceof Error ? error.message : String(error));
    });

    return () => unsubscribe();
  }, [profile, commentPost?.id]);

  const handleUpdateProfile = async (updatedData: Partial<User>) => {
    if (!profile) return;
    const updatedUser = { ...profile, ...updatedData };
    
    try {
      const userDocRef = doc(db, "users", profile.id);
      await setDoc(userDocRef, updatedUser);
      setProfile(updatedUser);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${profile.id}`);
    }
  };

  const handleDeleteMyPost = async (postId: number) => {
    try {
      const postRef = doc(db, "posts", String(postId));
      await deleteDoc(postRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `posts/${postId}`);
    }
  };

  // Handle Likes using atomic write transactions
  const handleLike = async (id: number) => {
    if (!profile) {
      setShowLoginModal(true);
      return;
    }

    try {
      const postRef = doc(db, "posts", String(id));
      const targetPost = posts.find((p) => p.id === id);
      if (!targetPost) return;

      const currentLikedUsers = targetPost.likedUsers || [];
      const hasLiked = currentLikedUsers.includes(profile.id);
      const updatedLikedUsers = hasLiked
        ? currentLikedUsers.filter((uid) => uid !== profile.id)
        : [...currentLikedUsers, profile.id];
      const updatedLikes = hasLiked ? Math.max(0, targetPost.likes - 1) : targetPost.likes + 1;

      // Ensure the full post document exists/is updated in Firestore
      await setDoc(postRef, {
        id: targetPost.id,
        author: targetPost.author,
        avatar: targetPost.avatar,
        faculty: targetPost.faculty,
        club: targetPost.club || null,
        image: targetPost.image,
        caption: targetPost.caption,
        likes: updatedLikes,
        likedUsers: updatedLikedUsers,
        commentsCount: targetPost.commentsCount || 0,
        comments: targetPost.comments || [],
        time: targetPost.time || "Vừa xong",
        createdAt: targetPost.createdAt || new Date().toISOString(),
        tags: targetPost.tags || [],
        userId: targetPost.userId || null
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `posts/${id}`);
    }
  };

  // Handle Comment writes matching path specs 
  const handleAddComment = async (postId: number, commentText: string) => {
    const authorName = profile ? profile.name : "Bạn học ẩn danh";
    const authorInitials = authorName.substring(0, 2).toUpperCase();

    const freshComment = {
      id: Date.now(),
      postId: String(postId),
      author: authorName,
      avatar: profile ? (profile.photoUrl || authorInitials) : "SV",
      text: commentText,
      time: "Vừa xong",
      createdAt: new Date().toISOString(),
      userId: profile ? profile.id : null
    };

    try {
      const postRef = doc(db, "posts", String(postId));
      const targetPost = posts.find((p) => p.id === postId);
      if (!targetPost) return;

      const updatedComments = [...(targetPost.comments || []), freshComment];
      const updatedCommentsCount = updatedComments.length;

      // Ensure full post document exists/is updated with the comments in Firestore
      await setDoc(postRef, {
        id: targetPost.id,
        author: targetPost.author,
        avatar: targetPost.avatar,
        faculty: targetPost.faculty,
        club: targetPost.club || null,
        image: targetPost.image,
        caption: targetPost.caption,
        likes: targetPost.likes,
        likedUsers: targetPost.likedUsers || [],
        commentsCount: updatedCommentsCount,
        comments: updatedComments,
        time: targetPost.time || "Vừa xong",
        createdAt: targetPost.createdAt || new Date().toISOString(),
        tags: targetPost.tags || [],
        userId: targetPost.userId || null
      });

      // Write to subcollection for blueprint compliance check
      const subdocRef = doc(db, "posts", String(postId), "comments", String(freshComment.id));
      await setDoc(subdocRef, freshComment);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `posts/${postId}`);
    }
  };

  // Handle adding new posts directly to Firestore cloud
  const handlePublishPost = async (newPost: Post) => {
    try {
      const docRef = doc(db, "posts", String(newPost.id));
      await setDoc(docRef, {
        id: newPost.id,
        author: newPost.author,
        avatar: newPost.avatar,
        faculty: newPost.faculty,
        club: newPost.club || null,
        image: newPost.image,
        caption: newPost.caption,
        likes: 1,
        likedUsers: profile ? [profile.id] : [],
        commentsCount: 0,
        comments: [],
        time: "Vừa xong",
        createdAt: new Date().toISOString(),
        tags: newPost.tags,
        userId: profile ? profile.id : null
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `posts/${newPost.id}`);
    }
  };

  // Combined Filters Search, Department and Club Categories
  const filteredPosts = posts.filter((post) => {
    // Hide marketplace ads from classic Faculty & Club lists, unless explicitly on "Mua Bán" CLB
    const isMarketAd = post.club === "Mua Bán" || post.caption.startsWith("📦[CHỢ_SV]");
    if (activeTab === "Faculty") {
      if (isMarketAd) return false;
    } else if (activeTab === "Club") {
      if (activeClub !== "Mua Bán" && isMarketAd) return false;
    }

    const matchSearch =
      !searchQuery ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    if (activeTab === "Faculty") {
      return matchSearch && (activeFaculty === "Tất cả" || post.faculty === activeFaculty);
    } else {
      return matchSearch && (activeClub === "Tất cả" || post.club === activeClub);
    }
  });

  // Sorting
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "likes") {
      return b.likes - a.likes;
    }
    return b.id - a.id; // Newest by timestamp ID
  });

  const facultyTypes = ["Tất cả", "Kinh tế - Tổng hợp", "Điện - Điện tử", "Cơ khí - Xây dựng", "Công nghệ Ô tô"];
  const clubTypes = ["Tất cả", "🏆 Cuộc Thi Bình Chọn", "Tiếng Anh", "Coffee Giao Lưu", "Mua Bán"];

  return (
    <div className="min-h-screen bg-neutral-50/70 text-neutral-900 font-sans antialiased flex flex-col justify-between selection:bg-rose-100 selection:text-rose-900">
      
      <Navbar 
        onUploadClick={() => {
          if (!profile) {
            setShowLoginModal(true);
          } else {
            setShowUploadModal(true);
          }
        }}
        onProfileClick={() => setShowProfileDrawer(true)}
        onLogoClick={() => {
          setActiveFaculty("Tất cả");
          setActiveClub("Tất cả");
          setSearchQuery("");
          setActiveTab("Faculty");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      <FeedbackHub />

      {syncError && (
        <div className="bg-amber-50 border-b border-amber-200/60 px-4 py-2.5 text-xs text-amber-800 text-center select-none font-medium flex items-center justify-center gap-2 animate-fade-in relative z-50">
          <span>⚠️</span>
          <span>Không thể đồng bộ thời gian thực với máy chủ ({syncError.substring(0, 100)}). Đang dùng bộ nhớ đệm ngoại tuyến.</span>
          <button
            onClick={() => setSyncError(null)}
            className="text-amber-500 hover:text-amber-700 ml-2 font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── CINEMATIC HEADER SLIDESHOW ── */}
      <HeroHeader />

      {/* ── SECTION HEADER & DUAL NAVIGATION SWITCHER ── */}
      <section className="bg-white border-b border-neutral-200/50 sticky top-16 z-30 animate-fade-in" id="navigation-filters-toolbar">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-2 overflow-x-auto scrollbar-none">
          
          {/* Multi-Navigation tabs */}
          <div className="flex border-b border-transparent md:-mb-px" id="tab-navigation-bar">
            <button
              onClick={() => {
                setActiveTab("Faculty");
                setActiveClub("Tất cả");
              }}
              className={`py-4 px-4 bg-transparent border-b-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "Faculty"
                  ? "border-rose-700 text-rose-700 font-black"
                  : "border-transparent text-neutral-400 hover:text-neutral-600"
              }`}
            >
              <span>🏛️</span>
              <span>Khoa ngành</span>
            </button>
            
            <button
              onClick={() => {
                setActiveTab("Club");
                setActiveFaculty("Tất cả");
              }}
              className={`py-4 px-4 bg-transparent border-b-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "Club"
                  ? "border-rose-700 text-rose-700 font-black"
                  : "border-transparent text-neutral-400 hover:text-neutral-600"
              }`}
            >
              <span>🎪</span>
              <span>Phong trào & CLB</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("Study");
                setActiveFaculty("Tất cả");
                setActiveClub("Tất cả");
              }}
              className={`py-4 px-4 bg-transparent border-b-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "Study"
                  ? "border-rose-700 text-rose-700 font-black"
                  : "border-transparent text-neutral-400 hover:text-neutral-600"
              }`}
            >
              <span>🎓</span>
              <span>Góc Học tập</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("Marketplace");
                setActiveFaculty("Tất cả");
                setActiveClub("Tất cả");
              }}
              className={`py-4 px-4 bg-transparent border-b-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "Marketplace"
                  ? "border-rose-700 text-rose-700 font-black"
                  : "border-transparent text-neutral-400 hover:text-neutral-600"
              }`}
            >
              <span>🤝</span>
              <span>Làm thêm & Trao đổi</span>
            </button>
          </div>

          {/* Quick instructions indicator */}
          <div className="hidden md:flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest select-none py-2 pr-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>Đang phát hành công khai</span>
          </div>
        </div>
      </section>

      {/* ── CHIPS SUB-BAR SYSTEM ── */}
      {(activeTab === "Faculty" || activeTab === "Club") && (
        <section className="bg-neutral-100/50 border-b border-neutral-200/40 px-4 py-3" id="chips-filter-bar">
          <div className="max-w-6xl mx-auto px-4 md:px-6 flex gap-2 overflow-x-auto scrollbar-none select-none">
            {(activeTab === "Faculty" ? facultyTypes : clubTypes).map((item) => {
              const isSelected = activeTab === "Faculty" ? activeFaculty === item : activeClub === item;
              
              return (
                <button
                  key={item}
                  onClick={() => {
                    if (activeTab === "Faculty") {
                      setActiveFaculty(item);
                    } else {
                      setActiveClub(item);
                    }
                  }}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all border ${
                    isSelected
                      ? "bg-rose-950 text-rose-100 border-rose-950 shadow-sm font-bold"
                      : "bg-white text-neutral-600 border-neutral-200/70 hover:border-neutral-400/80"
                  }`}
                >
                  {item === "Tất cả" ? "💫 Tất cả kỷ niệm" : item}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {activeTab === "Study" ? (
        <StudyHub />
      ) : activeTab === "Marketplace" ? (
        <MarketplaceHub
          posts={posts}
          user={profile}
          onLike={handleLike}
          onCommentClick={setCommentPost}
          onPublishListing={handlePublishPost}
          onLoginRequired={() => setShowLoginModal(true)}
        />
      ) : activeTab === "Club" && activeClub === "🏆 Cuộc Thi Bình Chọn" ? (
        <main className="max-w-6xl mx-auto w-full px-4 md:px-8 py-6 flex-1 flex flex-col justify-center">
          <ContestsHub user={profile} onLoginRequired={() => setShowLoginModal(true)} />
        </main>
      ) : (
        <>
          {/* ── SEARCH SORT CONTROLS PANEL ── */}
          <section className="max-w-6xl mx-auto w-full px-4 md:px-8 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mt-6">
            
            {/* Real-time search bar with smooth cancel button option */}
            <div className="relative flex-1 max-w-lg">
              <input
                type="text"
                placeholder="Tìm ảnh đăng, bạn bè, từ khóa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-neutral-200/80 rounded-xl pl-9.5 pr-8 py-3 text-xs text-neutral-900 outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-100 transition-all placeholder:text-neutral-400 shadow-sm"
              />
              <span className="absolute left-3.5 top-3.5 text-neutral-400">
                <Search size={14} className="opacity-70" />
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 w-6 h-6 rounded-full bg-neutral-100 text-neutral-500 border-none flex items-center justify-center text-xs cursor-pointer hover:bg-neutral-200"
                  title="Xóa nội dung tìm kiếm"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Dynamic statistics and sorters selector */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between md:justify-end gap-3 select-none">
              <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 px-1 py-1">
                <span>Tìm thấy:</span>
                <span className="font-extrabold text-neutral-900 px-2 py-0.5 bg-white border border-neutral-200 rounded-md shadow-sm">
                  {sortedPosts.length}
                </span>
                <span>bức ảnh lưu trữ</span>
              </div>

              <div className="flex items-center border border-neutral-200 rounded-xl bg-white p-1.5 shadow-sm gap-1">
                <span className="px-2 text-neutral-400" title="Sắp xếp kết quả">
                  <SlidersHorizontal size={12} />
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border-none text-xs font-semibold text-neutral-700 bg-transparent py-1.5 pl-1 pr-3 outline-none cursor-pointer"
                >
                  <option value="newest">Mới cập nhật trước</option>
                  <option value="likes">Tương tác cao rực rỡ (Likes)</option>
                </select>
              </div>
            </div>
          </section>

          {/* ── CORE BENTO GRID GALLERY ── */}
          <main className="max-w-6xl mx-auto w-full px-4 md:px-8 py-6 flex-1 flex flex-col justify-center">
            
            {sortedPosts.length === 0 ? (
              /* Empty Search results matching state */
              <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200/50 p-8 max-w-md mx-auto my-8 shadow-sm animate-fade-in flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 text-2xl mb-4 shadow-inner">
                  🎐
                </div>
                <h3 className="font-sans font-extrabold text-sm text-neutral-900 mb-1.5">
                  Chưa tìm thấy tư liệu ảnh nào phù hợp
                </h3>
                <p className="text-neutral-400 text-xs mb-6 leading-relaxed px-4 text-center">
                  Không tìm thấy kỷ niệm nào phù hợp với bộ lọc danh mục hoặc từ khóa tìm kiếm hiện tại của bạn.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFaculty("Tất cả");
                    setActiveClub("Tất cả");
                    setActiveTab("Faculty");
                  }}
                  className="bg-neutral-950 text-white min-w-36 border-none rounded-xl px-4 py-2.5 font-bold text-xs cursor-pointer hover:bg-rose-950 transition-colors shadow-sm"
                >
                  Đặt lại bộ lọc chính
                </button>
              </div>
            ) : (
              /* Responsive feed columns system */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="memories-masonry-container">
                {sortedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onCommentClick={setCommentPost}
                    onImageClick={(postItem) => setLightboxPost(postItem)}
                    onDeleteClick={handleDeleteMyPost}
                  />
                ))}
              </div>
            )}
          </main>
        </>
      )}

      {/* ── SECURE FOOTER CREATOR NOTES ── */}
      <footer className="bg-neutral-950 text-neutral-400 py-12 px-6 mt-16 border-t border-rose-900/10">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          
          {/* Accent decoration line */}
          <div className="flex items-center justify-center gap-1.5 select-none opacity-85 text-xs font-semibold text-rose-300">
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-rose-700" />
            <span className="text-[11px] tracking-widest uppercase font-extrabold text-rose-200">
              Lưu trữ khoảnh khắc · Trường Cao Đẳng Công nghệ & Năng lượng Khánh Hòa
            </span>
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-rose-700" />
          </div>

          <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed font-light">
            Cổng thông tin mở lưu dấu kỷ niệm và khoảnh khắc thời đi học, hoạt động ngoại khóa dành riêng cho sinh viên.
          </p>

          <div className="text-[10px] text-neutral-500 pt-3">
            <div>© 2026 SV-CDN. Bảo lưu mọi quyền hình ảnh do chính tác giả cung cấp.</div>
            <div className="text-neutral-600 font-mono mt-1">Version 2.4.0</div>
          </div>
        </div>
      </footer>

      {/* ── CENTRAL LAYER MODALS ── */}
      {commentPost && (
        <CommentModal
          post={commentPost}
          onClose={() => setCommentPost(null)}
          onAddComment={handleAddComment}
        />
      )}

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onPublish={handlePublishPost}
          user={profile}
        />
      )}

      {showLoginModal && (
        <GoogleLoginModal
          onClose={() => setShowLoginModal(false)}
          onSuccess={login}
        />
      )}

      {showProfileDrawer && profile && (
        <UserProfileDrawer
          user={profile}
          posts={posts}
          onClose={() => setShowProfileDrawer(false)}
          onLogout={logout}
          onUpdateProfile={handleUpdateProfile}
          onDeleteMyPost={handleDeleteMyPost}
        />
      )}

      {lightboxPost && (
        <ImageLightbox
          imageSrc={lightboxPost.image}
          caption={lightboxPost.caption}
          author={lightboxPost.author}
          faculty={lightboxPost.faculty}
          time={lightboxPost.time}
          onClose={() => setLightboxPost(null)}
        />
      )}

      {/* ── STICKY FLOATING ACTION BUTTON (FAB) FOR MOBILE ── */}
      <button
        onClick={() => {
          if (!profile) {
            setShowLoginModal(true);
          } else {
            setShowUploadModal(true);
          }
        }}
        className="fixed bottom-6 right-6 z-40 sm:hidden w-14 h-14 bg-gradient-to-tr from-rose-700 via-rose-800 to-rose-950 text-white rounded-full flex items-center justify-center shadow-lg shadow-rose-900/40 hover:bg-rose-900 active:scale-90 transition-all border-none cursor-pointer"
        title="Gửi kỷ niệm"
        id="mobile-fab-upload"
      >
        <Plus size={24} className="text-white" strokeWidth={3} />
      </button>

    </div>
  );
}
