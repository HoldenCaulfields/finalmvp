"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, ChevronRight, Plus } from "lucide-react";
import { useViewStore } from "@/stores/useViewStore";
import { useRouter } from "next/navigation";
import { THEME_CONFIGS } from "./themeConfig";

export default function MarkerOverlay() {
  const selectedMarkerType = useViewStore((s) => s.selectedMarkerType);
  const closeMarker = useViewStore((s) => s.closeMarker);
  const router = useRouter();

  // Lấy toàn bộ cấu hình UI động dựa trên Type của Marker hiện tại
  const activeConfig = THEME_CONFIGS[selectedMarkerType || "market"];
  const { themeClasses, stats, quickServices } = activeConfig;

  return (
    <AnimatePresence>
      {selectedMarkerType && (
        <div className="fixed inset-0 pointer-events-none z-[1000] p-4 md:p-6 font-sans flex flex-col justify-between select-none">

          {/* ================= 1. BIÊN TRÊN (TOP HUD) ================= */}
          <div className="w-full flex justify-center items-start">
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className={`pointer-events-auto flex items-center justify-between w-full max-w-2xl bg-white/90 backdrop-blur-xl border ${themeClasses.borderAccent} p-2 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.05)]`}
            >
              <button
                onClick={closeMarker}
                className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-700"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="flex flex-col items-center text-center mx-2">
                <span className={`text-[9px] font-black uppercase tracking-[0.25em] ${themeClasses.badgeText} flex items-center gap-1`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${themeClasses.badgePulse} animate-pulse`} />
                  {activeConfig.tagline}
                </span>
                <h1 className="text-xs md:text-sm font-black text-black uppercase tracking-tight mt-0.5">
                  {activeConfig.title}
                </h1>
              </div>

              <div className={`w-9 h-9 ${themeClasses.avatarBg} text-white rounded-xl flex items-center justify-center font-black text-xs`}>
                {activeConfig.shortName}
              </div>
            </motion.div>
          </div>

          {/* TRUNG TÂM HOÀN TOÀN TRỐNG ĐỂ HIỂN THỊ MAP VÀ MARKERS */}
          <div className="flex-1 min-h-[150px] md:min-h-[200px]" />

          {/* ================= 2. BIÊN GIỮA - HAI BÊN (MID SIDEBARS - DESKTOP) ================= */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3">
            <div
              onClick={() => router.push(`${activeConfig.baseRoute}/join`)}
              className={`pointer-events-auto group flex items-center gap-3 bg-white/95 backdrop-blur-md p-2 pr-4 rounded-xl border border-slate-100 shadow-md cursor-pointer ${themeClasses.hoverBorder} hover:shadow-lg transition-all duration-300`}
            >
              {/* Hộp chứa Icon - Giúp căn chỉnh bằng vặn với các nút quickServices phía dưới */}
              <div className={`w-10 h-10 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-sm shrink-0`}>
                <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              </div>

              <div className="flex flex-col">
                <span className={`text-xs font-black text-rose-600 tracking-tight ${themeClasses.hoverText} transition-colors`}>
                  Tham Gia Cộng Đồng
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Kết nối ngay
                </span>
              </div>
            </div>
            {quickServices.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => router.push(service.path)}
                className={`pointer-events-auto group flex items-center gap-3 bg-white/95 backdrop-blur-md p-2 pr-4 rounded-xl border border-slate-100 shadow-md cursor-pointer ${themeClasses.hoverBorder} hover:shadow-lg transition-all duration-300`}
              >
                <div className={`w-10 h-10 rounded-lg ${service.color} flex items-center justify-center text-white shadow-sm`}>
                  <service.icon size={18} />
                </div>
                <div className="flex flex-col">
                  <span className={`text-xs font-black text-black tracking-tight ${themeClasses.hoverText} transition-colors`}>
                    {service.title}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Truy cập nhanh</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ================= 3. BIÊN DƯỚI (BOTTOM SECTION) ================= */}
          <div className="w-full flex flex-col items-center gap-2 mb-22 md:mb-0">

            {/* THẺ DỊCH VỤ DẠNG SLIDER/GRID (MOBILE) */}
            <div className="w-full max-w-4xl lg:hidden sm:justify-center flex gap-2.5 overflow-x-auto no-scrollbar pointer-events-auto pb-1">
              <div
                onClick={() => router.push(`${activeConfig.baseRoute}/join`)}
                className={`flex-none flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border ${themeClasses.borderAccent} shadow-sm active:scale-95 transition-transform`}
              >
                {/* Hộp chứa Icon - Giúp căn chỉnh bằng vặn với các nút quickServices phía dưới */}
                <div className={`w-10 h-10 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-sm shrink-0`}>
                  <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                </div>

                <div className="flex flex-col">
                  <span className={`text-xs font-black text-rose-600 tracking-tight ${themeClasses.hoverText} transition-colors`}>
                    Tham Gia Ngay
                  </span>
                </div>
              </div>

              {quickServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => router.push(service.path)}
                  className={`flex-none flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border ${themeClasses.borderAccent} shadow-sm active:scale-95 transition-transform`}
                >
                  <div className={`w-7 h-7 rounded-lg ${service.color} flex items-center justify-center text-white`}>
                    <service.icon size={14} />
                  </div>
                  <span className="text-xs font-black text-black whitespace-nowrap">{service.title}</span>
                </div>
              ))}
            </div>

            {/* PANEL ĐÁY CHÍNH */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className={`pointer-events-auto w-full max-w-2xl bg-white/90 backdrop-blur-xl border ${themeClasses.borderAccent} p-3 md:p-4 rounded-[2rem] shadow-[0_-15px_35px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center justify-between gap-4`}
            >
              {/* Vùng Thống Kê */}
              <div className="grid grid-cols-3 gap-2 md:gap-4 w-full md:w-auto px-2">
                {stats.map((stat) => (
                  <div key={stat.id} className="flex items-center gap-2 border-r border-slate-100 last:border-none pr-2 md:pr-4">
                    <div className={`w-7 h-7 rounded-lg ${themeClasses.iconBoxBg} flex items-center justify-center ${themeClasses.iconBoxText} shrink-0`}>
                      <stat.icon size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs md:text-sm font-black italic text-black leading-none">{stat.value}</span>
                      <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 whitespace-nowrap">{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Nút Master Hành Động */}
              <button
                onClick={() => router.push(activeConfig.baseRoute)}
                className={`w-full md:w-auto flex items-center justify-center gap-4 ${themeClasses.primaryBtnBg} ${themeClasses.primaryBtnHover} text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-md group whitespace-nowrap`}
              >
                <div className="flex items-center gap-2">
                  <Zap size={14} className={`${themeClasses.pulseColor} animate-pulse`} fill="currentColor" />
                  <span className="text-xs font-black uppercase tracking-[0.15em]">Xem Chi Tiết</span>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-white transition-colors" />
              </button>

            </motion.div>
          </div>

        </div>
      )}
    </AnimatePresence>
  );
}