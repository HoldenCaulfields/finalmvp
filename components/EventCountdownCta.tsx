'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const EVENT_START = new Date("2026-06-26T00:00:00");
const EVENT_END = new Date("2026-06-28T23:59:59");

const formatCountdown = (milliseconds: number) => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Rút ngắn tối đa format để không phá layout w-36
  if (days > 0) return `${days}d${hours}h`;
  if (hours > 0) return `${hours}h${minutes}m`;
  return `${minutes}m${seconds}s`;
};

export default function EventCountdownCta() {
  const router = useRouter();
  const [countdownLabel, setCountdownLabel] = useState("00m00s");
  const [isLive, setIsLive] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      if (now < EVENT_START.getTime()) {
        setIsLive(false);
        setCountdownLabel(formatCountdown(EVENT_START.getTime() - now));
      } else if (now <= EVENT_END.getTime()) {
        setIsLive(true);
        setCountdownLabel(formatCountdown(EVENT_END.getTime() - now));
      } else {
        setIsLive(false);
        setCountdownLabel("Hết hạn");
      }
    };

    updateCountdown();
    const intervalId = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed left-3 top-40 z-2100 w-36 select-none">
      <div className="relative rounded-xl bg-rose-600 text-white shadow-[0_4px_20px_rgba(225,29,72,0.35)] transition-all hover:scale-[1.02]">
        
        {/* Nút đóng tối giản, tăng padding vùng bấm nhưng icon nhỏ */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setVisible(false);
          }}
          className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900/80 text-white/85 shadow backdrop-blur-sm transition hover:bg-zinc-950 text-[8px]"
          aria-label="Đóng"
        >
          ✕
        </button>

        <button
          type="button"
          onClick={() => router.push("/langnghecham")}
          className="w-full rounded-xl p-2 text-left focus:outline-none"
        >
          {/* Header tinh gọn: Đưa Badge ngày lên ngang hàng với Tiêu đề */}
          <div className="flex items-center justify-between gap-1">
            <h2 className="text-[11px] font-black tracking-tight truncate text-white uppercase drop-shadow-sm">
              Văn Hóa Chăm
            </h2>
            <span className="shrink-0 rounded bg-yellow-400 px-1 py-0.5 text-[8px] font-black text-rose-950 leading-none">
              26.6
            </span>
          </div>

          {/* Vùng hiển thị Countdown: Trực quan & Có trọng tâm */}
          <div className="mt-1.5 flex items-center gap-1.5 rounded-lg bg-black/20 px-1.5 py-1 text-[10px] font-bold">
            {/* Đèn báo trạng thái Live/Sắp diễn ra */}
            <span className="relative flex h-2 w-2 shrink-0">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLive ? 'bg-green-400' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? 'bg-green-500' : 'bg-amber-500'}`}></span>
            </span>
            
            {/* Nhãn đếm ngược */}
            <span className="font-mono text-[10px] tracking-wide truncate text-rose-50/90">
              {isLive ? `Live: ${countdownLabel}` : countdownLabel}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}