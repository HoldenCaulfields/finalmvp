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
    <>
      {/* Nhúng CSS Animation rung nhẹ định kỳ (Cứ mỗi 4s sẽ rung 1 lần để thu hút ánh nhìn) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gentle-shake {
          0%, 100%, 80% { transform: scale(1) rotate(0deg); }
          82% { transform: scale(1.03) rotate(-2deg); }
          84% { transform: scale(1.03) rotate(2deg); }
          86% { transform: scale(1.03) rotate(-1deg); }
          88% { transform: scale(1.03) rotate(1deg); }
          90% { transform: scale(1.03) rotate(0deg); }
        }
        .animate-gentle-shake {
          animation: gentle-shake 4s infinite ease-in-out;
        }
      `}} />

      <div className="fixed left-3 top-40 z-[2100] w-36 select-none animate-gentle-shake">
        <div className="relative rounded-xl bg-gradient-to-br from-rose-500 via-rose-600 to-red-700 text-white shadow-[0_4px_20px_rgba(225,29,72,0.4)] transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_6px_25px_rgba(225,29,72,0.5)] border border-white/10 overflow-hidden">
          
          {/* Đèn nền phát sáng nhẹ phía sau tạo độ sâu */}
          <div className="absolute -left-4 -top-4 w-12 h-12 bg-yellow-400/20 rounded-full blur-xl pointer-events-none"></div>

          {/* Nút đóng tối giản */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setVisible(false);
            }}
            className="absolute -right-0.5 -top-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-black/50 text-white/80 shadow backdrop-blur-sm transition hover:bg-black/80 text-[7px] z-10"
            aria-label="Đóng"
          >
            ✕
          </button>

          <button
            type="button"
            onClick={() => router.push("/langnghecham")}
            className="w-full rounded-xl p-2 text-left focus:outline-none"
          >
            {/* Tag Xu hướng / Sự kiện Hot */}
            <div className="flex items-center gap-1 mb-1">
              <span className="inline-block animate-pulse text-[9px]">🔥</span>
              <span className="text-[8px] font-black tracking-widest text-yellow-300 uppercase leading-none drop-shadow">
                SỰ KIỆN HOT
              </span>
            </div>

            {/* Tiêu đề chính: Cân chỉnh text nhỏ gọn, xuống hàng đẹp mắt */}
            <h2 className="text-[10px] font-extrabold tracking-tight text-white leading-tight uppercase drop-shadow-sm line-clamp-2 min-h-[24px]">
              Ngày Hội Văn Hóa <span className="text-yellow-200">Dân Tộc Chăm</span>
            </h2>

            {/* Vùng hiển thị Countdown & Trạng thái */}
            <div className="mt-2 flex items-center justify-between gap-1 rounded-lg bg-black/30 border border-white/5 px-1.5 py-1 text-[9px] font-bold backdrop-blur-sm">
              <div className="flex items-center gap-1 truncate">
                {/* Đèn báo Live */}
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLive ? 'bg-green-400' : 'bg-amber-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isLive ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                </span>
                
                {/* Nhãn đếm ngược */}
                <span className="font-mono tracking-wide text-rose-100 truncate">
                  {isLive ? `Live: ${countdownLabel}` : countdownLabel}
                </span>
              </div>

              {/* Tag năm nhỏ góc phải */}
              <span className="shrink-0 text-[7px] font-black px-0.5 py-px bg-white/20 rounded text-white/90">
                2026
              </span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}