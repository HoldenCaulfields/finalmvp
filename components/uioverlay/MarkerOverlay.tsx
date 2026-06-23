"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, ChevronRight, Phone, Heart, DollarSign, X } from "lucide-react";
import { useViewStore } from "@/stores/useViewStore";
import { useRouter } from "next/navigation";
import { THEME_CONFIGS } from "./themeConfig";

export default function MarkerOverlay() {
  const selectedCategoryId = useViewStore((s) => s.selectedCategoryId);
  const selectCategory = useViewStore( s => s.selectCategory);
  const router = useRouter();

  const activeConfig = THEME_CONFIGS[selectedCategoryId || "market"];

  return (
    <AnimatePresence>
      {selectedCategoryId && (
        <div className="fixed inset-0 pointer-events-none z-1000 p-4 md:p-6 font-sans flex flex-col justify-between select-none">

          {/* ================= 1. BIÊN TRÊN (TOP HUD HUD) ================= */}
          <div className="w-full flex justify-center items-start">
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="pointer-events-auto flex items-center justify-between w-full max-w-2xl bg-white/95 backdrop-blur-xl border border-slate-100 p-2.5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
            >
              <button
                onClick={() => selectCategory(null)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-800"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="flex flex-col items-center text-center mx-2">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-600 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                  {activeConfig.tagline}
                </span>
                <h1 className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-tight mt-0.5">
                  {activeConfig.title}
                </h1>
              </div>

              <div className="w-9 h-9 bg-rose-600 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-sm">
                {activeConfig.shortName}
              </div>
            </motion.div>
          </div>


          {/* ================= 2. TRUNG TÂM HOÀN TOÀN TRỐNG ĐỂ HỞ MAP VÀ CÁC MARKERS ================= */}
          <div className="flex-1 min-h-[100px] md:min-h-[150px]" />


          {/* ================= 3. BIÊN HÔNG TRÁI & PHẢI (DESKTOP QUICK TOOLKITS) ================= */}
          {/* Hông bên trái: Bộ phím hành động động (Mở quán, tạo CV...) */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2.5 max-w-[280px]">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 px-1">Thanh Công Cụ</span>
            {activeConfig.actions.map((action, idx) => (
              <motion.div
                key={action.id}
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => router.push(action.path)}
                className={`pointer-events-auto group flex items-center gap-3 bg-white/95 backdrop-blur-md p-2.5 pr-4 rounded-xl border cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${
                  action.isPrimary 
                    ? "border-rose-200 bg-rose-50/30 hover:border-rose-400" 
                    : "border-slate-100 hover:border-slate-300"
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm shrink-0 transition-colors ${
                  action.isPrimary ? "bg-rose-600 text-white" : "bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white"
                }`}>
                  <action.icon size={16} />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className={`text-xs font-black tracking-tight truncate ${action.isPrimary ? "text-rose-600" : "text-slate-900"}`}>
                    {action.title}
                  </span>
                  {action.subtitle && (
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide truncate mt-0.5">
                      {action.subtitle}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Hông bên phải: Bộ phím Tiện ích bổ sung (Yêu thích, Gọi điện, Ủng hộ tiền) */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2.5">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 px-1 text-right">Tương Tác</span>
            
            {/* Ghim yêu thích */}
            <button className="pointer-events-auto p-3 bg-white hover:bg-slate-50 text-slate-700 hover:text-rose-600 rounded-xl border border-slate-100 shadow-sm hover:shadow transition-all group flex items-center gap-2">
              <Heart size={16} />
              <span className="text-xs font-black transition-all whitespace-nowrap">Yêu Thích</span>
            </button>

            {/* Gọi điện trao đổi */}
            <a href={`tel:${activeConfig.phoneContact}`} className="pointer-events-auto p-3 bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-600 rounded-xl border border-slate-100 shadow-sm hover:shadow transition-all group flex items-center gap-2">
              <Phone size={16} />
              <span className="text-xs font-black transition-all whitespace-nowrap">Gọi Trao Đổi</span>
            </a>

            {/* Bonus / Ủng hộ kinh doanh */}
            <button onClick={() => router.push(activeConfig.donateInfo)} className="pointer-events-auto p-3 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl border border-rose-100 shadow-sm hover:shadow transition-all group flex items-center gap-2">
              <DollarSign size={16} />
              <span className="text-xs font-black transition-all whitespace-nowrap">Ủng Hộ </span>
            </button>
          </div>


          {/* ================= 4. BIÊN DƯỚI (BOTTOM ACTION DOCK & MOBILE SLIDER) ================= */}
          <div className="w-full flex flex-col items-center gap-2 mb-24 md:mb-0">

            {/* THANH TRƯỢT HÀNH ĐỘNG DÀNH CHO MOBILE & TABLET (< lg) */}
            <div className="w-full max-w-2xl lg:hidden flex gap-2 overflow-x-auto no-scrollbar pointer-events-auto pb-1.5 px-1">
              
              {/* Nút Gọi nhanh Mobile */}
              <a href={`tel:${activeConfig.phoneContact}`} className="flex-none flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-100 shadow-sm text-slate-800">
                <Phone size={14} className="text-emerald-600" />
                <span className="text-xs font-black whitespace-nowrap">Gọi Điện</span>
              </a>

              {/* Nút Ủng hộ Mobile */}
              <button onClick={() => router.push(activeConfig.donateInfo)} className="flex-none flex items-center gap-2 bg-rose-50 px-3.5 py-2.5 rounded-xl border border-rose-100 shadow-sm text-rose-600">
                <DollarSign size={14} />
                <span className="text-xs font-black whitespace-nowrap">Bonus</span>
              </button>

              {/* Danh sách action động bên hông chuyển xuống thanh slider ở mobile */}
              {activeConfig.actions.map((action) => (
                <div
                  key={action.id}
                  onClick={() => router.push(action.path)}
                  className={`flex-none flex items-center gap-2.5 backdrop-blur-md px-3.5 py-2.5 rounded-xl border shadow-sm active:scale-95 transition-transform ${
                    action.isPrimary ? "bg-rose-600 text-white border-rose-600" : "bg-white/95 text-slate-900 border-slate-100"
                  }`}
                >
                  <action.icon size={14} className={action.isPrimary ? "text-white" : "text-slate-500"} />
                  <span className="text-xs font-black whitespace-nowrap">{action.title}</span>
                </div>
              ))}
            </div>

            {/* PANEL ĐÁY CHÍNH: THỐNG KÊ & XEM CHI TIẾT */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="pointer-events-auto w-full max-w-2xl bg-white/95 backdrop-blur-xl border border-slate-100 p-3 md:p-3.5 rounded-[1.75rem] shadow-[0_-15px_35px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center justify-between gap-3"
            >
              {/* Khối Thống Kê Sạch Sẽ */}
              <div className="grid grid-cols-3 gap-1 w-full sm:w-auto px-1">
                {activeConfig.stats.map((stat) => (
                  <div key={stat.id} className="flex items-center gap-2 border-r border-slate-100 last:border-none pr-3 sm:pr-4">
                    <div className="w-6 h-6 rounded-md bg-rose-200 flex items-center justify-center text-rose-500 shrink-0">
                      <stat.icon size={12} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs md:text-sm font-black italic text-slate-900 leading-none">{stat.value}</span>
                      <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-wide mt-0.5 whitespace-nowrap">{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Nút Master Hành Động (Chuyển sang Route chính của Marker) */}
              <button
                onClick={() => router.push(activeConfig.baseRoute)}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-slate-950 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm group whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  <Zap size={13} className="text-rose-400 animate-pulse fill-rose-400" />
                  <span className="text-xs font-black uppercase tracking-wider">Xem Chi Tiết</span>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
              </button>

            </motion.div>
          </div>

        </div>
      )}
    </AnimatePresence>
  );
}