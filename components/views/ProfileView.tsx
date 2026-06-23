import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Award,
  Sparkles,
  TrendingUp,
  CreditCard,
  CheckCircle,
  PlusCircle,
  X,
  LogOut,
  Tag,
  BarChart2,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useViewStore, SubMarker } from "@/stores/useViewStore";
import { fetchSubMarkersByUser } from "@/services/map.services";
import { updateUserProfile } from "@/services/user.services";

export default function ProfileView() {
  const { user, login, logout } = useAuth();
  const setActiveRoute = useViewStore(s => s.setActiveRoute);

  // States dành cho các trường thông tin hồ sơ
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // State quản lý trạng thái đang đồng bộ dữ liệu
  const [displayName, setDisplayName] = useState(user?.displayName || "Sinh viên ẩn danh");
  const [phone, setPhone] = useState("0909.888.777");
  const [bio, setBio] = useState("Kết nối cộng đồng, tạo địa điểm mới.");
  const [successMsg, setSuccessMsg] = useState("");

  // State quản lý danh sách ghim thực tế từ Firebase
  const [myPins, setMyPins] = useState<SubMarker[]>([]);
  const [loadingPins, setLoadingPins] = useState(false);

  // Premium Modal simulation
  const [isUpgraded, setIsUpgraded] = useState(true);

  // Khởi tạo và fetch dữ liệu từ Firestore dựa theo UID
  useEffect(() => {
    if (!user?.uid) return;

    const loadUserPins = async () => {
      setLoadingPins(true);
      try {
        const pins = await fetchSubMarkersByUser(user.uid);
        setMyPins(pins);
      } catch (error) {
        console.error("Lỗi khi fetch pins của user:", error);
      } finally {
        setLoadingPins(false);
      }
    };

    loadUserPins();
  }, [user?.uid]);

  // Đồng bộ lại displayName khi đối tượng user từ Auth thay đổi trạng thái
  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user]);

  // Xử lý lưu dữ liệu thực tế lên Firestore
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    setIsSaving(true);
    try {
      // Gọi service thực hiện updateDoc một phần dữ liệu
      await updateUserProfile(user.uid, {
        name: displayName,
        bio: bio,
        // Nếu có trường phone trong UserProfile interface gốc, bạn có thể truyền tiếp vào đây
      });

      setSuccessMsg("Đồng bộ thông tin hồ sơ lên hệ thống thành công!");
      setIsEditing(false);
      
      // Ẩn thông báo sau 3 giây
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin hồ sơ:", error);
      alert("Cập nhật thất bại. Vui lòng kiểm tra lại kết nối mạng!");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed inset-0 z-1000 bg-slate-50/98 backdrop-blur-xl p-6 flex items-center justify-center"
        >
          <div className="max-w-md w-full text-center space-y-8">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 bg-rose-200 blur-2xl opacity-40 rounded-full animate-pulse"></div>
              <div className="relative w-24 h-24 bg-white shadow-2xl shadow-rose-100 rounded-[2.5rem] flex items-center justify-center border border-rose-50">
                <LogOut className="w-10 h-10 text-rose-500" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Chào bạn mới!</h2>
              <p className="text-slate-500 font-medium px-8">
                Đăng nhập nhanh chóng để khám phá hồ sơ và kết nối cùng bạn bè
              </p>
            </div>

            <button
              onClick={login}
              className="group relative w-full flex items-center justify-center gap-3 py-4 bg-white text-slate-700 font-bold rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-rose-100 hover:text-rose-600 transition-all duration-300 active:scale-[0.98]"
            >
              <svg className="w-6 h-6" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              <span>Tiếp tục với Google</span>
              <div className="absolute inset-0 rounded-2xl bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <p className="text-xs text-slate-400 font-medium">
              Bằng cách đăng nhập, bạn đồng ý với Điều khoản dịch vụ của chúng tôi.
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="h-full w-full max-h-full overflow-y-auto bg-zinc-50/60 pt-20 lg:pt-28 pb-32 lg:pb-24 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-md relative overflow-hidden text-center"
          >
            <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${isUpgraded ? 'from-amber-400 via-rose-500 to-amber-500' : 'from-zinc-300 to-zinc-400'}`} />

            <div className="relative inline-block mt-4">
              <img
                src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                alt="Avatar"
                referrerPolicy="no-referrer"
                className="w-24 h-24 rounded-full border-4 border-white shadow-xl mx-auto object-cover"
              />
              {isUpgraded && (
                <div className="absolute bottom-0 right-1 bg-amber-400 text-zinc-950 p-1.5 rounded-full border-2 border-white shadow-lg" title="Hội viên Gold Verified">
                  <Award className="w-4 h-4 fill-zinc-950" />
                </div>
              )}
            </div>

            <h3 className="text-lg font-black text-zinc-900 mt-4 tracking-tight flex items-center justify-center gap-1.5">
              {displayName}
              {isUpgraded && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold border border-amber-300">Gold Verified</span>}
            </h3>
            <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-extrabold mt-1">Cộng tác viên Lovelynet</p>

            <p className="text-xs text-zinc-600 italic bg-zinc-50 rounded-2xl p-4 mt-4 border border-zinc-100 line-clamp-3">
              "{bio}"
            </p>

            <div className="mt-6 pt-6 border-t border-zinc-100 flex flex-col gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs py-3 rounded-xl transition cursor-pointer"
              >
                {isEditing ? "Hủy chỉnh sửa" : "Sửa hồ sơ cá nhân"}
              </button>

              <button
                onClick={() => logout()}
                className="w-full flex items-center justify-center gap-2 text-rose-600 bg-rose-50/50 hover:bg-rose-50 font-bold text-xs py-3 rounded-xl transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Thoát tài khoản
              </button>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* Editing Panel */}
          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-md overflow-hidden"
              >
                <div className="flex justify-between items-center pb-4 border-b border-zinc-100 mb-4">
                  <h4 className="text-sm font-black text-zinc-900 uppercase">Chỉnh sửa thông tin cá nhân</h4>
                  <button onClick={() => setIsEditing(false)} className="text-zinc-400 hover:text-zinc-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-zinc-500 font-bold mb-1">Tên hiển thị / Tên thương hiệu</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      className="w-full p-3 border border-zinc-200 rounded-xl outline-none focus:border-rose-500 font-bold text-zinc-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-500 font-bold mb-1">Số điện thoại liên hệ</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full p-3 border border-zinc-200 rounded-xl outline-none focus:border-rose-500 font-mono text-zinc-900"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-500 font-bold mb-1">Email</label>
                      <input
                        type="text"
                        value={user.email || ''}
                        disabled
                        className="w-full p-3 border border-zinc-200 rounded-xl bg-zinc-50 text-zinc-400 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-zinc-500 font-bold mb-1">Mô tả ngắn / Slogan cá nhân</label>
                    <textarea
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      className="w-full p-3 border border-zinc-200 rounded-xl outline-none focus:border-rose-500 h-20 text-zinc-900 font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`w-full sm:w-auto text-white font-bold px-6 py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                      isSaving ? "bg-rose-400 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-700"
                    }`}
                  >
                    {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {isSaving ? "Đang đồng bộ..." : "Lưu thay đổi"}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> {successMsg}
            </div>
          )}

          {/* MONETIZATION STRATEGY */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-amber-250/20 rounded-full blur-2xl pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-amber-600 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider">MVP monetization banner</span>
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                </div>
                <h4 className="text-base font-extrabold text-zinc-900 tracking-tight">Trở thành Đối tác Vàng của LovelyNet</h4>
                <p className="text-xs text-zinc-600 leading-relaxed max-w-lg">
                  Khai thác doanh thu tuyệt đối từ các chức năng ghim tài khoản chính thức. Có ngay nhãn Vàng, hiển thị nút gọi hotline lập tức trên Bản đồ và được xếp ưu tiên tìm kiếm.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-zinc-200/60">
              <div className="flex items-start gap-2.5">
                <div className="p-1 bg-amber-100 rounded-lg text-amber-700 shrink-0">
                  <Tag className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h5 className="font-extrabold text-xs text-zinc-800">Dán nhãn VIP nổi bật</h5>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Hồ sơ điểm ghim và tin tuyển dụng có con dấu Verified sáng bóng.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="p-1 bg-emerald-100 rounded-lg text-emerald-700 shrink-0">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h5 className="font-extrabold text-xs text-zinc-800">Cơ chế Quảng cáo đẩy Top</h5>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Tiếp cận tới hàng nghìn lượt tìm kiếm thực tế của người bản xứ và du khách.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="p-1 bg-rose-100 rounded-lg text-rose-700 shrink-0">
                  <CreditCard className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h5 className="font-extrabold text-xs text-zinc-800">Kết nối cuộc gọi trực tiếp</h5>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Người dùng chỉ cần ấn 1-click là gọi điện đặt bàn, đặt xe Taxi, Book kỹ sư.</p>
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMIC PINS LIST FROM FIRESTORE */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h4 className="text-sm font-black text-zinc-900 uppercase flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500" /> Các Điểm Bạn Đã Ghim ({myPins.length})
                </h4>
                <p className="text-[11px] text-zinc-500">Các điểm đóng góp hữu ích của bạn đã khởi tạo trên hệ thống.</p>
              </div>

              <button
                onClick={() => setActiveRoute("map")}
                className="text-xs text-rose-600 font-extrabold hover:underline flex items-center gap-1 cursor-pointer self-start"
              >
                Ghim điểm mới trên bản đồ <PlusCircle className="w-4 h-4" />
              </button>
            </div>

            {loadingPins ? (
              <div className="py-12 flex flex-col items-center justify-center text-zinc-400 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
                <span className="text-xs font-medium">Đang đồng bộ dữ liệu ghim...</span>
              </div>
            ) : myPins.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 text-xs border border-dashed border-zinc-200 rounded-2xl">
                Bạn chưa đóng góp điểm ghim nào. Nhấp vào nút phía trên để bắt đầu!
              </div>
            ) : (
              <div className="space-y-3.5">
                {myPins.map((pin) => (
                  <div
                    key={pin.id}
                    className="flex items-center justify-between p-4 rounded-2xl border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50/50 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 font-extrabold text-lg shrink-0">
                        {pin.type === "food" || pin.title.toLowerCase().includes("cơm") ? "🍲" : pin.type === "hotel" ? "🏨" : "📍"}
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-zinc-800 group-hover:text-rose-600 transition-colors flex items-center gap-1.5">
                          {pin.title}
                          {isUpgraded && (pin as any).status === "active" && (
                            <span className="inline-flex items-center w-3 h-3 bg-amber-400 text-[8px] justify-center rounded-full text-zinc-950 font-bold" title="Hội viên Vàng">★</span>
                          )}
                        </h5>
                        <div className="flex items-center gap-2.5 text-[10px] text-zinc-500 mt-1">
                          <span className="bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded font-semibold uppercase text-[9px]">{pin.type || "Sub-marker"}</span>
                          <span className="flex items-center gap-1"><BarChart2 className="w-3 h-3" /> {(pin as any).views || 0} lượt xem</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-[10px] px-2 py-1 rounded-full font-bold block ${(pin as any).status === "active" || !(pin as any).status ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                        {(pin as any).status === "active" || !(pin as any).status ? "Đã duyệt" : "Chờ duyệt"}
                      </span>
                      <span className="text-[10px] text-zinc-500 block mt-1">Doanh thu tháng: <strong className="text-zinc-800 font-bold">{(pin as any).revenue || "0đ"}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}