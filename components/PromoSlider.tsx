'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

const SLIDES = [
  {
    id: 1,
    title: "Cộng đồng Kết nối",
    description: "Tìm kiếm đội nhóm cùng chí hướng ngay trên bản đồ.",
    image: "/creative.jpg",
    tag: "Đội nhóm"
  },
  {
    id: 2,
    title: "Đối tác Tài xế",
    description: "Giao nhận nhanh chóng với mạng lưới tài xế tin cậy.",
    image: "/mvvp.jpg",
    tag: "Di chuyển"
  },
  {
    id: 3,
    title: "Việc làm Quanh đây",
    description: "Khám phá cơ hội nghề nghiệp tại địa phương của bạn.",
    image: "/cinema.jpeg",
    tag: "Sự nghiệp"
  },
  {
    id: 4,
    title: "Dịch vụ Uy tín",
    description: "Kết nối với những chuyên gia hàng đầu khu vực.",
    image: "/teams.png",
    tag: "Dịch vụ"
  },
  {
    id: 5,
    title: "LovelyNet Global",
    description: "Hệ sinh thái thông minh phục vụ cuộc sống hằng ngày.",
    image: "/yt.jpg",
    tag: "Công nghệ"
  }
];

export default function PromoSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % SLIDES.length);
  const prev = () => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  return (
    <div className="relative w-full h-full group overflow-hidden rounded-2xl border border-zinc-200/50 ">
      <div className="relative w-full h-full overflow-hidden rounded-2xl border border-zinc-200/50">
        <motion.div
          className="flex h-full"
          animate={{ x: `-${current * 100}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {SLIDES.map((slide) => (
            <div key={slide.id} className="w-full h-full flex-shrink-0 relative">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover grayscale-[20%] brightness-[0.7]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 via-transparent to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-start gap-1">
                <span className="px-2 py-0.5 rounded bg-rose-600 text-[10px] font-bold text-white uppercase tracking-widest mb-1.5">
                  {slide.tag}
                </span>

                <h3 className="text-xl font-display font-bold text-white leading-tight tracking-tight">
                  {slide.title}
                </h3>

                <p className="text-zinc-300 text-xs font-medium leading-relaxed max-w-[200px]">
                  {slide.description}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 flex justify-between pointer-events-none">
        <button
          onClick={prev}
          className="p-1.5 rounded-full glass-black text-white pointer-events-auto hover:bg-rose-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={next}
          className="p-1.5 rounded-full glass-black text-white pointer-events-auto hover:bg-rose-600 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute top-4 right-4 flex gap-1.5">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-all duration-300",
              i === current ? "bg-rose-500 w-4" : "bg-white/30"
            )}
          />
        ))}
      </div>
    </div>
  );
}
