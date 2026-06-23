// MarkerOverlay.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Zap, ChevronRight, Phone, Heart, DollarSign,
  Navigation, Share2, Star, X, MapPin, Clock, Award,
  ExternalLink, Info, Sparkles, Copy, Check, Banknote,
  QrCode, Wallet, Gift
} from "lucide-react";
import { useViewStore } from "@/stores/useViewStore";
import { useRouter } from "next/navigation";
import { THEME_CONFIGS } from "./themeConfig";
import { useState } from "react";

// Component Bonus Modal
function BonusModal({
  isOpen,
  onClose,
  config
}: {
  isOpen: boolean;
  onClose: () => void;
  config: any;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-2000 flex items-center justify-center scrollbar-hidden p-2 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-200/50">
              <Gift size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Ủng hộ {config.title}</h3>
              <p className="text-sm text-slate-500">Cảm ơn bạn đã đồng hành!</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* QR Code */}
          <div className="flex flex-col items-center bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <div className="relative w-48 h-48 bg-white rounded-xl shadow-md p-3">
              {/* QR Code placeholder - bạn có thể thay bằng QR thật */}
              <div className="w-full h-full rounded-lg overflow-hidden">
                <img
                  src="/qr.jpg" // <-- thay bằng link QR của bạn
                  alt="QR Code"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Thêm logo nhỏ vào giữa QR */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-200">
                <span className="text-rose-500 font-black text-xs">{config.shortName}</span>
              </div>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-3">
              Quét mã QR để chuyển khoản
            </p>
          </div>

          {/* Bank Info */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4 border border-rose-100">
            <div className="flex items-center gap-2 mb-3">
              <Banknote size={16} className="text-rose-600" />
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                Thông tin chuyển khoản
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between bg-white/60 rounded-xl px-3 py-2.5">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Số tài khoản</span>
                  <p className="text-sm font-black text-slate-900">0381000602207</p>
                </div>
                <button
                  onClick={() => handleCopy("0793784133")}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-rose-600"
                >
                  {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                </button>
              </div>

              <div className="flex items-center justify-between bg-white/60 rounded-xl px-3 py-2.5">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Ngân hàng</span>
                  <p className="text-sm font-black text-slate-900">Vietcombank</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <span className="text-[8px] font-black text-blue-600">VCB</span>
                </div>
              </div>

              <div className="bg-white/60 rounded-xl px-3 py-2.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Chủ tài khoản</span>
                <p className="text-sm font-black text-slate-900">TRUNG THUC</p>
              </div>

              <div className="bg-rose-600/10 rounded-xl px-3 py-2.5 border border-rose-200/50">
                <span className="text-[10px] font-bold text-rose-600 uppercase">Nội dung chuyển khoản</span>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">UNG HO {config.shortName.toUpperCase()} - [TÊN CỦA BẠN]</p>
              </div>
            </div>
          </div>

          {/* Thank you message */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              🙏 Cảm ơn bạn đã ủng hộ! Mỗi đóng góp đều rất ý nghĩa.
            </p>
          </div>
        </div>

        {/* Footer Action */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-900 hover:bg-rose-600 text-white rounded-2xl font-bold text-sm transition-all duration-300 active:scale-95 shadow-lg"
          >
            Đóng
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Component chính
export default function MarkerOverlay() {
  const selectedCategoryId = useViewStore((s) => s.selectedCategoryId);
  const selectCategory = useViewStore(s => s.selectCategory);
  const router = useRouter();
  const [showNotification, setShowNotification] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [showBonusModal, setShowBonusModal] = useState(false);

  const activeConfig = selectedCategoryId ? THEME_CONFIGS[selectedCategoryId] : null;

  if (!activeConfig) return null;

  const handleAction = (path: string) => {
    if (path.startsWith('http')) {
      window.open(path, '_blank');
    } else {
      router.push(path);
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    setNotificationMsg(isFavorite ? 'Đã bỏ yêu thích' : 'Đã thêm vào yêu thích ❤️');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: activeConfig.title,
        text: `Khám phá ${activeConfig.title} tại Phan Rang`,
        url: window.location.href,
      });
    }
  };

  const handleDirection = () => {
    window.open('https://maps.google.com?q=Phan+Rang+Thap+Cham', '_blank');
  };

  const handleBonus = () => {
    setShowBonusModal(true);
  };

  return (
    <>
      <AnimatePresence>
        {selectedCategoryId && (
          <>
            {/* Desktop Layout - 4 bên */}
            <div className="hidden lg:block fixed inset-0 pointer-events-none z-2000 p-4">
              {/* TOP - Header */}
              <div className="pointer-events-auto flex justify-center w-full">
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="bg-white/95 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-2xl p-3 max-w-2xl w-full flex items-center justify-between"
                >
                  <button
                    onClick={() => selectCategory(null)}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-700 hover:scale-95 active:scale-90"
                  >
                    <ArrowLeft size={18} />
                  </button>

                  <div className="flex-1 text-center mx-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-rose-500 flex items-center justify-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                      {activeConfig.tagline}
                    </span>
                    <h1 className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-tight mt-0.5">
                      {activeConfig.title}
                    </h1>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShare}
                      className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
                    >
                      <Share2 size={16} />
                    </button>
                    <button
                      onClick={handleFavorite}
                      className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      <Heart size={16} className={isFavorite ? 'text-rose-500 fill-rose-500' : 'text-slate-600'} />
                    </button>
                    <div className="w-9 h-9 bg-rose-600 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-sm">
                      {activeConfig.shortName}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* LEFT - Quick Actions */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-auto">
                <motion.div
                  initial={{ x: -60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                  className="bg-white/95 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-2xl p-2 space-y-1"
                >
                  <button
                    onClick={handleDirection}
                    className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-slate-50 rounded-xl transition-colors w-full group"
                  >
                    <Navigation size={16} className="text-slate-600 group-hover:text-slate-900" />
                    <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 whitespace-nowrap">
                      Chỉ đường
                    </span>
                  </button>
                  <button
                    onClick={handleBonus}
                    className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-slate-50 rounded-xl transition-colors w-full group"
                  >
                    <Gift size={16} className="text-rose-500 group-hover:text-rose-600" />
                    <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 whitespace-nowrap">
                      Ủng hộ
                    </span>
                  </button>
                  <a
                    href={`tel:${activeConfig.phoneContact}`}
                    className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-slate-50 rounded-xl transition-colors w-full group"
                  >
                    <Phone size={16} className="text-emerald-500 group-hover:text-emerald-600" />
                    <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 whitespace-nowrap">
                      Gọi ngay
                    </span>
                  </a>
                </motion.div>
              </div>

              {/* RIGHT - Actions Menu */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-auto max-w-[240px]">
                <motion.div
                  initial={{ x: 60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                  className="bg-white/95 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-2xl p-2 space-y-0.5"
                >
                  {activeConfig.actions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleAction(action.path)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-200 group ${action.isPrimary
                          ? 'bg-rose-600 text-white shadow-lg hover:shadow-rose-200/50'
                          : 'hover:bg-slate-50 text-slate-700'
                        }`}
                    >
                      <action.icon size={16} className={action.isPrimary ? 'text-white/90' : 'text-slate-500 group-hover:text-slate-700'} />
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-bold ${action.isPrimary ? 'text-white' : 'text-slate-800'}`}>
                            {action.title}
                          </span>
                          {action.badge && (
                            <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded ${action.isPrimary ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'
                              }`}>
                              {action.badge}
                            </span>
                          )}
                        </div>
                        {action.subtitle && (
                          <span className="text-[8px] font-medium text-slate-400 block truncate">
                            {action.subtitle}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </motion.div>
              </div>

              {/* BOTTOM - Stats + Main Action */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-2xl pointer-events-auto">
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="bg-white/95 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-2xl p-4"
                >
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 w-full md:w-auto flex-1">
                      {activeConfig.stats.map((stat) => (
                        <div key={stat.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50/50">
                          <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                            <stat.icon size={14} className="text-rose-500" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-black text-slate-900 leading-none">
                                {stat.value}
                              </span>
                              {stat.trend && (
                                <span className="text-[8px] font-bold text-emerald-500">
                                  {stat.trend}
                                </span>
                              )}
                            </div>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wide">
                              {stat.label}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Main Button */}
                    <button
                      onClick={() => handleAction(activeConfig.baseRoute)}
                      className="w-full md:w-auto flex items-center justify-center gap-3 bg-slate-900 hover:bg-rose-600 text-white px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-rose-200/50 group"
                    >
                      <div className="flex items-center gap-2">
                        <Zap size={16} className="text-rose-400 animate-pulse fill-rose-400" />
                        <span className="text-sm font-black uppercase tracking-wider">
                          Xem Chi Tiết
                        </span>
                      </div>
                      <ChevronRight size={18} className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>Hoạt động 24/7</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={12} />
                      <span>Phan Rang - Tháp Chàm</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award size={12} />
                      <span>Được tin cậy</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Space để map hiển thị */}
              <div className="flex-1" />
            </div>

            {/* Mobile Layout - Bottom Sheet */}
            <div className="lg:hidden fixed inset-0 pointer-events-none z-2000 flex flex-col justify-end select-none">
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="pointer-events-auto w-full max-w-2xl mx-auto pb-3 md:px-4 md:pb-4"
              >
                <div className="bg-white/98 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-3xl overflow-hidden">
                  {/* Header */}
                  <div className="relative px-4 pt-3 pb-2 flex items-center gap-3 border-b border-slate-100/80">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-300 rounded-full" />

                    <button
                      onClick={() => selectCategory(null)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 active:scale-90"
                    >
                      <X size={16} />
                    </button>

                    <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                      <span className="text-rose-600 font-black text-xs">{activeConfig.shortName}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-black uppercase tracking-[0.12em] text-rose-500">
                          {activeConfig.tagline}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-rose-400 animate-pulse" />
                      </div>
                      <h2 className="text-sm font-black text-slate-900 truncate leading-tight">
                        {activeConfig.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={handleShare}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 active:scale-90"
                      >
                        <Share2 size={16} />
                      </button>
                      <button
                        onClick={handleFavorite}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors active:scale-90"
                      >
                        <Heart size={16} className={isFavorite ? 'text-rose-500 fill-rose-500' : 'text-slate-600'} />
                      </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-1.5 px-4 py-2.5 bg-slate-50/50">
                    {activeConfig.stats.map((stat) => (
                      <div key={stat.id} className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
                          <stat.icon size={13} className="text-rose-500" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-black text-slate-900 leading-none">
                              {stat.value}
                            </span>
                            {stat.trend && (
                              <span className="text-[7px] font-bold text-emerald-500">
                                {stat.trend}
                              </span>
                            )}
                          </div>
                          <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wide block truncate">
                            {stat.label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="px-4 py-2.5 border-b border-slate-100/80">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                      <button
                        onClick={handleDirection}
                        className="flex-none flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-700 active:scale-95"
                      >
                        <Navigation size={14} />
                        <span className="text-[10px] font-bold whitespace-nowrap">Chỉ đường</span>
                      </button>
                      <a
                        href={`tel:${activeConfig.phoneContact}`}
                        className="flex-none flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors text-emerald-700 active:scale-95"
                      >
                        <Phone size={14} />
                        <span className="text-[10px] font-bold whitespace-nowrap">Gọi ngay</span>
                      </a>
                      <button
                        onClick={handleBonus}
                        className="flex-none flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors text-amber-700 active:scale-95"
                      >
                        <Gift size={14} />
                        <span className="text-[10px] font-bold whitespace-nowrap">Ủng hộ</span>
                      </button>
                      {activeConfig.actions.map((action) => (
                        <button
                          key={action.id}
                          onClick={() => handleAction(action.path)}
                          className={`flex-none flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors active:scale-95 ${action.isPrimary
                              ? 'bg-rose-600 hover:bg-rose-700 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                        >
                          <action.icon size={14} />
                          <span className="text-[10px] font-bold whitespace-nowrap">{action.title}</span>
                          {action.badge && (
                            <span className={`text-[6px] font-black uppercase px-1 py-0.5 rounded ${action.isPrimary ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'
                              }`}>
                              {action.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Main Action */}
                  <div className="p-3">
                    <button
                      onClick={() => handleAction(activeConfig.baseRoute)}
                      className="w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-rose-600 text-white px-4 py-3.5 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-rose-200/50 group active:scale-95"
                    >
                      <div className="flex items-center gap-2">
                        <Zap size={16} className="text-rose-400 animate-pulse fill-rose-400" />
                        <span className="text-xs font-black uppercase tracking-wider">
                          Xem Chi Tiết
                        </span>
                      </div>
                      <ChevronRight size={16} className="text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Notification Toast */}
            <AnimatePresence>
              {showNotification && (
                <motion.div
                  initial={{ y: 20, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 20, opacity: 0, scale: 0.9 }}
                  className="fixed top-10 lg:top-24 left-1/2 -translate-x-1/2 pointer-events-none z-2000"
                >
                  <div className="bg-slate-900/95 backdrop-blur-xl text-white px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-white/10">
                    <Heart size={14} className="text-rose-400 fill-rose-400" />
                    <span className="text-xs font-semibold">{notificationMsg}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </AnimatePresence>

      {/* Bonus Modal */}
      <BonusModal
        isOpen={showBonusModal}
        onClose={() => setShowBonusModal(false)}
        config={activeConfig}
      />
    </>
  );
}