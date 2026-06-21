'use client';

import dynamic from 'next/dynamic';
import { useViewStore } from "@/stores/useViewStore";
import { mapCategoriesData } from '@/components/map/markerData';
import { Compass, Lightbulb, Users, Rocket, Map as MapIcon, PlusCircle, Layers, CheckCircle2 } from "lucide-react";

// Tải động Component Map để tránh lỗi window is not defined của Leaflet trên Server
const MapComponent = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center text-zinc-400">
      <div className="w-8 h-8 border-2 border-rose-600 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-xs uppercase tracking-widest font-mono">Đang khởi tạo bản đồ điện ảnh...</p>
    </div>
  )
});

// Định nghĩa cấu trúc Nav chuẩn theo thứ tự ưu tiên của bạn
const NAV_LINKS = [
  { id: 'home', label: 'Home', icon: Compass },
  { id: 'ideas', label: 'Ideas', icon: Lightbulb },
  { id: 'teams', label: 'Teams', icon: Users },
  { id: 'launched', label: 'Launched', icon: Rocket },
  { id: 'map', label: 'Map', icon: MapIcon },
  { id: 'create', label: 'Create', icon: PlusCircle },
];

export default function MapPage() {
  const { selectedCategoryId, selectCategory } = useViewStore();

  return (
    <div className="relative w-screen h-screen bg-black text-white flex flex-col overflow-hidden font-sans select-none">
      
      {/* ==========================================
          1. CINEMATIC NAVBAR (TOP)
         ========================================== */}
      <nav className="z-[9999] h-16 w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/60 px-6 flex items-center justify-between">
        {/* Brand/Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white rounded flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            <span className="text-black font-black text-xs tracking-tighter">C</span>
          </div>
          <span className="font-mono font-black text-sm uppercase tracking-widest bg-gradient-to-r from-white via-zinc-200 to-rose-500 bg-clip-text text-transparent">
            SinhVienNet
          </span>
        </div>

        {/* Cấu trúc Navigation điều hướng chuẩn */}
        <div className="flex items-center gap-1 sm:gap-2">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isMapActive = link.id === 'map';
            return (
              <button
                key={link.id}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium tracking-wide transition-all duration-300
                  ${isMapActive 
                    ? 'bg-white text-black font-semibold shadow-md' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{link.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Corner (Profile/Status Placeholder) */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[10px] uppercase font-mono tracking-wider text-rose-500">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            Ninh Thuận
          </div>
        </div>
      </nav>

      {/* ==========================================
          2. MAP CONTAINER (CENTER-FILL)
         ========================================== */}
      <div className="relative flex-1 w-full h-full z-10">
        <MapComponent />
      </div>

      {/* ==========================================
          3. GLASSMORPHISM FILTERBAR (FLOATING CONTROL)
         ========================================== */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[999] w-[calc(100%-2rem)] max-w-3xl">
        <div className="bg-zinc-950/70 backdrop-blur-xl border border-white/10 p-2.5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Tiêu đề thanh lọc */}
          <div className="flex items-center gap-2 px-2 text-zinc-400 font-mono text-[11px] uppercase tracking-wider border-b md:border-b-0 md:border-r border-zinc-800 pb-2 md:pb-0 md:pr-4">
            <Layers className="w-3.5 h-3.5 text-rose-500" />
            <span>Lĩnh vực</span>
          </div>

          {/* Danh sách các nút Filter Lĩnh vực lớn */}
          <div className="flex-1 flex flex-wrap items-center gap-1.5 overflow-x-auto scrollbar-none">
            {/* Nút hiển thị "Tất cả" */}
            <button
              onClick={() => selectCategory(null)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap flex items-center gap-1.5
                ${selectedCategoryId === null 
                  ? 'bg-rose-600 text-white shadow-[0_0_12px_rgba(225,29,72,0.4)] border border-rose-500' 
                  : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800/50 hover:text-white hover:bg-zinc-800'
                }`}
            >
              Toàn bộ mạng lưới
            </button>

            {/* Các lĩnh vực động lấy trực tiếp từ Mock Data */}
            {mapCategoriesData.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              
              // Map icon nhỏ đi kèm nút filter
              const emojis: Record<string, string> = {
                market: '🏪', startup: '🚀', jobs: '💼', cinema: '🎬', driver: '🚗', study: '🎓'
              };

              return (
                <button
                  key={cat.id}
                  onClick={() => selectCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap flex items-center gap-1.5
                    ${isSelected 
                      ? 'bg-white text-black shadow-lg border border-white' 
                      : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800/50 hover:text-white hover:bg-zinc-800'
                    }`}
                >
                  <span>{emojis[cat.iconType] || '📍'}</span>
                  <span>{cat.title}</span>
                  {isSelected && <CheckCircle2 className="w-3 h-3 text-rose-600 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}