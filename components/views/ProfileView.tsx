import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Award, 
  Sparkles, 
  TrendingUp, 
  CreditCard, 
  CheckCircle, 
  PlusCircle, 
  X, 
  LogOut, 
  Coins, 
  ArrowRight,
  ShieldAlert,
  Tag,
  BarChart2,
  Lock,
  ExternalLink
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useViewStore } from "../../stores/useViewStore";

export default function ProfileView() {
  const { user, login, logout, loading } = useAuth();
  const activeRoute = useViewStore(s => s.activeRoute);
  const setActiveRoute = useViewStore(s => s.setActiveRoute);
  const categories = useViewStore(s => s.categories);

  // Profile fields state
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "Admin Phan Rang");
  const [phone, setPhone] = useState("0909.888.777");
  const [bio, setBio] = useState("Kết nối cộng đồng, nâng tầm dịch vụ bản địa Ninh Thuận.");
  const [successMsg, setSuccessMsg] = useState("");

  // Premium Modal simulation
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isUpgraded, setIsUpgraded] = useState(true); // Default to upgraded for demonstration of Premium features
  const [showAddAdsModal, setShowAddAdsModal] = useState(false);
  const [adBudget, setAdBudget] = useState(150000); // 150k VNĐ default
  const [qrCodeAmount, setQrCodeAmount] = useState<number | null>(null);
  const [qrSuccess, setQrSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("Lưu thông tin hồ sơ thành công!");
    setIsEditing(false);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleQrPayment = (amount: number) => {
    setQrCodeAmount(amount);
    setQrSuccess(false);
    setTimeout(() => {
      // Simulate real-time payment success hook
      setQrSuccess(true);
      if (amount === 99000) {
        setIsUpgraded(true);
      } else {
        setAdBudget(prev => prev + amount);
      }
      setTimeout(() => {
        setQrCodeAmount(null);
        setQrSuccess(false);
        setShowUpgradeModal(false);
        setShowAddAdsModal(false);
      }, 2000);
    }, 4000);
  };

  // Mock list of user's contributed positions on the map
  const myPins = [
    { id: "pin_1", title: "Cơm Gà Khánh Kỳ (Chi nhánh 2)", category: "Ẩn thực", views: 1840, status: "active", revenue: "420.000đ" },
    { id: "pin_2", title: "Khách Sạn Hữu Nghị", category: "Lưu trú", views: 924, status: "pending", revenue: "0đ" },
    { id: "pin_3", title: "Wifi Free Quảng Trường 16/4", category: "Cộng đồng", views: 4210, status: "active", revenue: "Sponsor" },
  ];

  if (!user) {
    return (
      <div className="h-full w-full overflow-y-auto px-4 pt-20 lg:pt-28 pb-32 lg:pb-24 max-w-lg mx-auto flex flex-col justify-center items-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-[2.5rem] border border-zinc-200/80 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-6 shadow-md shadow-rose-100">
            <User className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-extrabold text-zinc-900 tracking-tight">Khu vực Hồ sơ & Quản trị Doanh thu</h3>
          <p className="text-xs text-zinc-500 mt-3 leading-relaxed max-w-sm mx-auto">
            Đăng nhập để xem thống kê tiếp cận khách hàng, nạp quỹ quảng bá địa điểm, quản lý dịch vụ và kích hoạt doanh thu của bạn.
          </p>

          <button
            onClick={() => login()}
            className="w-full mt-8 bg-zinc-950 text-white hover:bg-zinc-800 font-bold text-xs py-4 rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            Đăng nhập nhanh với Mock Auth <ArrowRight className="w-4 h-4 text-rose-500" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full w-full max-h-full overflow-y-auto bg-zinc-50/60 pt-20 lg:pt-28 pb-32 lg:pb-24 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Avatar & Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-md relative overflow-hidden text-center"
          >
            {/* Header premium backdrop banner */}
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
            <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-extrabold mt-1">Cộng tác viên Phan Rang</p>
            
            <p className="text-xs text-zinc-600 italic bg-zinc-50 rounded-2xl p-4 mt-4 border border-zinc-100 line-clamp-3">
              "{bio}"
            </p>

            <div className="mt-6 pt-6 border-t border-zinc-100 flex flex-col gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs py-3 rounded-xl transition cursor-pointer"
              >
                {isEditing ? "Hủy chỉnh sửa" : "Sửa hồ sơ doanh nghiệp"}
              </button>

              <button
                onClick={() => logout()}
                className="w-full flex items-center justify-center gap-2 text-rose-600 bg-rose-50/50 hover:bg-rose-50 font-bold text-xs py-3 rounded-xl transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Thoát tài khoản
              </button>
            </div>
          </motion.div>

          {/* Quick Business Wallet Overview */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/20 rounded-full blur-2xl" />
            <h4 className="text-xs font-extrabold uppercase text-zinc-400 tracking-wider flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" /> Ngân khố quảng bá
            </h4>
            <div className="mt-4">
              <span className="text-2xl font-black">{adBudget.toLocaleString()}đ</span>
              <span className="text-[10px] text-emerald-400 block mt-1 font-bold">● Tài khoản hoạt động ổn định</span>
            </div>

            <p className="text-[11px] text-zinc-400 mt-3 leading-relaxed">
              Dùng để đẩy từ khóa tìm kiếm lên Top bản đồ Ninh Thuận và làm nổi bật các dịch vụ/điểm ghim.
            </p>

            <button
              onClick={() => setShowAddAdsModal(true)}
              className="w-full mt-6 bg-gradient-to-r from-amber-400 to-rose-500 hover:opacity-90 text-zinc-950 font-black text-xs py-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-rose-950/20"
            >
              Nạp quỹ quảng cáo <Sparkles className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Business details, upgrade section & statistical performance */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Editing Panel (AnimatePresence) */}
          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-md overflow-hidden"
              >
                <div className="flex justify-between items-center pb-4 border-b border-zinc-100 mb-4">
                  <h4 className="text-sm font-black text-zinc-900 uppercase">Chỉnh sửa thông tin doanh nhân</h4>
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
                        value={user.email || 'th@gm.com'} 
                        disabled
                        className="w-full p-3 border border-zinc-200 rounded-xl bg-zinc-50 text-zinc-400 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-zinc-500 font-bold mb-1">Mô tả ngắn / Slogan doanh nghiệp</label>
                    <textarea 
                      value={bio} 
                      onChange={e => setBio(e.target.value)}
                      className="w-full p-3 border border-zinc-200 rounded-xl outline-none focus:border-rose-500 h-20 text-zinc-900 font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-3 rounded-xl transition cursor-pointer"
                  >
                    Lưu thay đổi
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

          {/* MONETIZATION STRATEGY & PREMIUM PLANS BAR */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-amber-250/20 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-amber-600 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider">MVP monetization banner</span>
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                </div>
                <h4 className="text-base font-extrabold text-zinc-900 tracking-tight">Trở thành Đối tác Vàng Ninh Thuận</h4>
                <p className="text-xs text-zinc-600 leading-relaxed max-w-lg">
                  Khai thác doanh thu tuyệt đối từ các chức năng ghim tài khoản chính thức. Có ngay nhãn Vàng, hiển thị nút gọi hotline lập tức trên Bản đồ và được xếp ưu tiên tìm kiếm.
                </p>
              </div>

              <div className="shrink-0">
                {isUpgraded ? (
                  <div className="bg-amber-100 border border-amber-300 text-amber-800 font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-amber-600" /> Bạn đã kích hoạt Gold
                  </div>
                ) : (
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs px-5 py-3 rounded-xl transition shadow-lg shrink-0 cursor-pointer"
                  >
                    Nâng cấp 99.000đ/tháng
                  </button>
                )}
              </div>
            </div>

            {/* Visual grid benefits list */}
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

          {/* MY PINNED POINTS ON MAP & ANALYTICS STATED */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h4 className="text-sm font-black text-zinc-900 uppercase flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500" /> Các Điểm Bạn Đã Ghim ({myPins.length})
                </h4>
                <p className="text-[11px] text-zinc-500">Các điểm đóng góp hữu ích của doanh nhân được phát triển thành điểm thương mại.</p>
              </div>

              <button
                onClick={() => setActiveRoute("map")}
                className="text-xs text-rose-600 font-extrabold hover:underline flex items-center gap-1 cursor-pointer self-start"
              >
                Ghim điểm mới trên bản đồ <PlusCircle className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              {myPins.map((pin) => (
                <div 
                  key={pin.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50/50 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 font-extrabold text-xs shrink-0">
                      {pin.category === "Ẩn thực" ? "🍲" : pin.category === "Lưu trú" ? "🏨" : "📶"}
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-zinc-800 group-hover:text-rose-600 transition-colors flex items-center gap-1.5">
                        {pin.title}
                        {isUpgraded && pin.status === "active" && (
                          <span className="inline-flex items-center w-3 h-3 bg-amber-400 text-[8px] justify-center rounded-full text-zinc-950 font-bold" title="Hội viên Vàng">★</span>
                        )}
                      </h5>
                      <div className="flex items-center gap-2.5 text-[10px] text-zinc-500 mt-1">
                        <span className="bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded font-semibold">{pin.category}</span>
                        <span className="flex items-center gap-1"><BarChart2 className="w-3 h-3" /> {pin.views} lượt xem</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold block ${
                      pin.status === "active" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      {pin.status === "active" ? "Đã duyệt" : "Chờ duyệt"}
                    </span>
                    <span className="text-[10px] text-zinc-500 block mt-1">Doanh thu háng: <strong className="text-zinc-800 font-bold">{pin.revenue}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MONETIZATION ROADMAP & SYSTEM HEALTH STATS */}
          <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-md">
            <h4 className="text-sm font-black text-zinc-900 uppercase mb-4 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-rose-500" /> Chiến lược tạo Doanh thu cho Nhà phát triển MVP
            </h4>
            
            <p className="text-xs text-zinc-650 leading-relaxed mb-4">
              Ninh Thuận LovelyNet cung cấp một mô hình kinh doanh siêu cục bộ (Hyper-local) rất khả thi, không phụ thuộc vào nguồn tài trợ lớn mà tập trung kết nối cung-cầu ngay tại TP Phan Rang Tháp Chàm:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl">
                <div className="flex items-center gap-2 text-zinc-900 font-bold text-xs mb-1.5">
                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                  Gói Doanh Nghiệp & Đơn vị Bán lẻ
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Thu phí hàng tháng 99k/Đối tác Vàng để họ hiển thị số hotline trực tiếp trên bản đồ và đăng các mặt hàng ẩm thực đặc sản, nhà hàng, lưu trú.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl">
                <div className="flex items-center gap-2 text-zinc-900 font-bold text-xs mb-1.5">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                  Tin Tuyển Dụng & Đối Tác Kỹ Sư
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Cộng đồng IT / Dev / Dịch vụ lắp Internet Ninh Thuận đăng tin tuyển dụng trả phí để được đẩy quảng bá, kết nối nhanh doanh nghiệp địa phương với thợ kỹ thuật.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl">
                <div className="flex items-center gap-2 text-zinc-900 font-bold text-xs mb-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  Tài Xế Taxi Xe Máy & Ô tô Phan Rang
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Tài xế công nghệ/ngoại tỉnh tự do đăng ký lên bản đồ với mức phí nhỏ (hoặc 1000đ/lượt người dùng bấm gọi khách nhờ tổng đài nội địa).
                </p>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl">
                <div className="flex items-center gap-2 text-zinc-900 font-bold text-xs mb-1.5">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                  Gói Quảng cáo Banner & Điểm Quảng Trường
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Nhà tài trợ lớn (các đơn vị du lịch Ninh Chữ, Ninh Thuận Trip) đăng banner quảng cáo nổi bật trên ứng dụng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: PREMIUM UPGRADE SIMULATOR */}
      <AnimatePresence>
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-[3000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] w-full max-w-sm p-6 shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-4 right-4 p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 rounded-full cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mt-4">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                  <Award className="w-6 h-6 fill-amber-600" />
                </div>
                <h3 className="text-base font-black text-zinc-900">Nâng Cấp Hội Viên Gold Verified</h3>
                <p className="text-xs text-zinc-500 mt-2">Duy trì quyền lợi tối cao trên bản đồ Ninh Thuận</p>

                {qrCodeAmount ? (
                  <div className="mt-6 border-2 border-dashed border-zinc-200 p-4 rounded-2xl bg-zinc-50 relative">
                    {qrSuccess ? (
                      <div className="py-8 flex flex-col items-center justify-center animate-bounce text-emerald-600 font-extrabold text-xs gap-2">
                        <CheckCircle className="w-12 h-12 text-emerald-500" />
                        Giao dịch thành công! Đã lên đời GOLD
                      </div>
                    ) : (
                      <>
                        <div className="w-40 h-40 bg-zinc-900 mx-auto rounded-lg flex flex-col justify-center items-center text-white relative p-2 shadow-inner">
                          <div className="w-36 h-36 bg-white rounded flex justify-center items-center font-mono text-[9px] text-zinc-500 text-center flex-col p-1.5">
                            {/* Visual QR Simulator */}
                            <span className="font-extrabold text-zinc-950 text-[11px] mb-1">CỔNG THANH TOÁN</span>
                            <span className="text-[10px] text-rose-600 font-bold">LOVELYNET VIETQR</span>
                            <div className="w-20 h-20 bg-zinc-100 border-2 border-zinc-800 my-1 grid grid-cols-4 p-1">
                              <span className="bg-zinc-900"></span><span className="bg-white"></span><span className="bg-zinc-900"></span><span className="bg-zinc-900"></span>
                              <span className="bg-white"></span><span className="bg-zinc-900"></span><span className="bg-white"></span><span className="bg-zinc-900"></span>
                              <span className="bg-zinc-900"></span><span className="bg-white"></span><span className="bg-zinc-900"></span><span className="bg-white"></span>
                              <span className="bg-zinc-900"></span><span className="bg-zinc-900"></span><span className="bg-white"></span><span className="bg-zinc-900"></span>
                            </div>
                            <span className="text-[8px] text-zinc-400">99,000 VNĐ</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-3 flex items-center justify-center gap-1">
                          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                          Hệ thống đang quét tín hiệu chuyển khoản tự động...
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="mt-6 space-y-3.5 text-left text-xs bg-zinc-50 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 text-zinc-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500" /> Ghim không giới hạn vị trí (Mặc định: loại 1)
                    </div>
                    <div className="flex items-center gap-2 text-zinc-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500" /> Ưu tiên đẩy hạng tìm kiếm lên Trang bìa
                    </div>
                    <div className="flex items-center gap-2 text-zinc-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500" /> Tích hợp sđt gọi diện thoại ngay lập tức
                    </div>
                    
                    <button
                      onClick={() => handleQrPayment(99000)}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3.5 rounded-xl transition mt-4 cursor-pointer"
                    >
                      Bắt đầu Thanh toán 99.000đ/tháng
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD BUDGET ADVERTISING */}
      <AnimatePresence>
        {showAddAdsModal && (
          <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-[3000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] w-full max-w-sm p-6 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowAddAdsModal(false)}
                className="absolute top-4 right-4 p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 rounded-full cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mt-4">
                <div className="w-12 h-12 bg-zinc-900 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                  <Coins className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-zinc-900">Nạp Ngân Khố Quảng Cáo</h3>
                <p className="text-xs text-zinc-500 mt-1">Đồng hành đưa dịch vụ của bạn tiếp cận 100% người Ninh Thuận</p>

                {qrCodeAmount ? (
                  <div className="mt-6 border-2 border-dashed border-zinc-200 p-4 rounded-2xl bg-zinc-50">
                    {qrSuccess ? (
                      <div className="py-8 flex flex-col items-center justify-center animate-bounce text-emerald-600 font-extrabold text-xs gap-2">
                        <CheckCircle className="w-12 h-12 text-emerald-500" />
                        Nạp quỹ thành công! +{(qrCodeAmount).toLocaleString()}đ
                      </div>
                    ) : (
                      <>
                        <div className="w-40 h-40 bg-zinc-900 mx-auto rounded-lg flex flex-col justify-center items-center text-white relative p-2 shadow-inner">
                          <div className="w-36 h-36 bg-white rounded flex justify-center items-center font-mono text-[9px] text-zinc-500 text-center flex-col p-1.5">
                            <span className="font-extrabold text-zinc-900 text-[11px] mb-1">HỆ THỐNG NẠP QUỸ</span>
                            <span className="text-[10px] text-rose-600 font-bold">VIETQR BANKING</span>
                            <div className="w-20 h-20 bg-zinc-100 border-2 border-zinc-800 my-1 grid grid-cols-4 p-1">
                              <span className="bg-zinc-900"></span><span className="bg-white"></span><span className="bg-zinc-900"></span><span className="bg-zinc-900"></span>
                              <span className="bg-white"></span><span className="bg-zinc-900"></span><span className="bg-white"></span><span className="bg-zinc-900"></span>
                            </div>
                            <span className="text-[8px] text-zinc-500">{(qrCodeAmount).toLocaleString()}đ</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-3 flex items-center justify-center gap-1">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                          Tiến hành khớp lệnh tự động trên cổng Ngân hàng...
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="mt-6 space-y-2.5 text-left text-xs">
                    <button
                      onClick={() => handleQrPayment(100000)}
                      className="w-full bg-zinc-50 hover:bg-zinc-100 text-zinc-800 font-bold p-3 rounded-xl border border-zinc-200 transition text-left flex justify-between items-center cursor-pointer"
                    >
                      <span>Nạp +100.000 VNĐ</span>
                      <ArrowRight className="w-4 h-4 text-rose-500" />
                    </button>
                    <button
                      onClick={() => handleQrPayment(200000)}
                      className="w-full bg-zinc-50 hover:bg-zinc-100 text-zinc-800 font-bold p-3 rounded-xl border border-zinc-200 transition text-left flex justify-between items-center cursor-pointer"
                    >
                      <span>Nạp +200.000 VNĐ</span>
                      <ArrowRight className="w-4 h-4 text-rose-500" />
                    </button>
                    <button
                      onClick={() => handleQrPayment(500000)}
                      className="w-full bg-zinc-50 hover:bg-zinc-100 text-zinc-800 font-bold p-3 rounded-xl border border-zinc-200 transition text-left flex justify-between items-center cursor-pointer"
                    >
                      <span>Nạp +500.050 VNĐ (Khuyến mại tết)</span>
                      <ArrowRight className="w-4 h-4 text-rose-500" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
