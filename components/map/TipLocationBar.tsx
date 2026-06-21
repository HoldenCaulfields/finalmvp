// @/components/map/TipLocationBar.tsx
'use client';

import { useViewStore } from "@/stores/useViewStore";
import { MapPin, CheckCircle2 } from "lucide-react";

export default function TipLocationBar() {
  const { isSelectingLocation, confirmLocation, cancelSelection } = useViewStore();

  if (!isSelectingLocation) return null;

  return (
    <div className="absolute bottom-26 md:bottom-6 left-1/2 -translate-x-1/2 z-1000 w-[calc(100%-2rem)] max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-[0_15px_40px_rgba(0,0,0,0.1)] flex flex-col gap-3">
        
        {/* Dòng hướng dẫn trực quan cho người mới */}
        <div className="flex gap-2.5 items-start">
          <div className="w-7 h-7 rounded-full bg-rose-50 flex items-center justify-center border border-rose-100 shrink-0 mt-0.5">
            <MapPin className="w-4 h-4 text-rose-600 animate-bounce" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase text-zinc-900 tracking-wider">Chọn vị trí điểm ghim</h4>
            <p className="text-[11px] text-zinc-500 leading-normal mt-0.5">
              Chạm giữ và kéo marker màu hồng, hoặc click vào điểm bất kỳ trên bản đồ để chọn chính xác nơi bạn muốn đặt vị trí.
            </p>
          </div>
        </div>

        {/* Cụm nút hành động */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          <button
            onClick={cancelSelection}
            className="py-2 text-[11px] font-bold uppercase tracking-wider rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={confirmLocation}
            className="py-2 text-[11px] font-black uppercase tracking-wider rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/10 flex items-center justify-center gap-1.5 transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Xác nhận vị trí
          </button>
        </div>

      </div>
    </div>
  );
}