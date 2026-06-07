import { useState, useEffect } from "react";
import { Users, Image as ImageIcon, GraduationCap, Trophy, ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    url: "/bgcdn.jpg",
    tagline: "Kỷ Niệm Đẹp Dưới Mái Trường",
    contrast: "brightness-75"
  },
  {
    url: "/mdt.jpg",
    tagline: "Năng Động - Sáng Tạo - Nhiệt Huyết",
    contrast: "brightness-[0.70]"
  },
  {
    url: "/ktdn.jpg",
    tagline: "Vững Tay Nghề - Khởi Tương Lai",
    contrast: "brightness-75"
  },
  {
    url: "/dtcn.jpg",
    tagline: "Đoàn Kết - Kết Nối Đam Mê",
    contrast: "brightness-[0.70]"
  },
  {
    url: "/mm.jpg",
    tagline: "Hội Tụ Tinh Hoa Đất Khánh Hòa",
    contrast: "brightness-75"
  }
];

const FALLBACK_SLIDES = [
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80",
  "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=1600&q=80"
];

const STATS = [
  { n: "1,200+", l: "Sinh viên", i: Users, d: "Thành viên tích cực" },
  { n: "85+", l: "Ảnh kỷ niệm", i: ImageIcon, d: "Lưu bút thời gian" },
  { n: "04", l: "Khoa ngành", i: GraduationCap, d: "Ngành nghề trọng điểm" },
  { n: "10+", l: "CLB hoạt động", i: Trophy, d: "Kiến tạo phong trào" }
];

export default function HeroHeader() {
  const [index, setIndex] = useState(0);
  const [loadingError, setLoadingError] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000); // đổi ảnh mỗi 5 giây cho thêm phần thư thả và sang trọng
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  return (
    <div className="relative text-white min-h-[65vh] md:min-h-100 max-h-[75vh] md:max-h-none flex flex-col justify-center items-center pb-10 md:pb-16 px-4 md:px-8 overflow-hidden bg-neutral-950 font-sans" id="hero-header-section">

      {/* Cinematic Slide System */}
      <div className="absolute inset-0 z-0">
        {SLIDES.map((slide, i) => {
          const isActive = i === index;
          return (
            <div
              key={i}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${isActive
                  ? "opacity-100 scale-100 visible"
                  : "opacity-0 scale-105 invisible pointer-events-none"
                }`}
            >
              {/* Image element với hiệu ứng Ken Burns (phóng to nhẹ khi active) */}
              <img
                src={loadingError[i] ? FALLBACK_SLIDES[i] : slide.url}
                alt={slide.tagline}
                onError={() => setLoadingError(prev => ({ ...prev, [i]: true }))}
                className={`w-full h-full object-cover transition-transform duration-[5000ms] ease-out ${slide.contrast} ${isActive ? "scale-105" : "scale-100"
                  }`}
                referrerPolicy="no-referrer"
              />

              {/* Mẹo nhỏ: Thêm một lớp phủ tối (Overlay) để text bên trên luôn rõ ràng */}
              <div className="absolute inset-0 bg-neutral-950/20" />
            </div>
          );
        })}
      </div>

      {/* CONTENT INNER CONTAINER */}
      <div className="relative z-20 max-w-4xl mx-auto text-center px-4 md:px-8 mt-6">

        {/* Glowing Badge Area */}
        <div className="inline-flex items-center gap-2 bg-rose-950/65 border border-rose-700/40 px-4 py-1.5 rounded-full text-[10px] md:text-xs uppercase tracking-widest text-rose-200 mb-6 backdrop-blur-2xl shadow-lg shadow-rose-950/40 animate-fade-in" id="college-tagline-badge">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="font-semibold select-none">Hội Sinh Viên Cao Đẳng Nghề</span>
        </div>

        {/* Nostalgic Playfair Heading */}
        <h1 className="font-serif font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight mb-4 leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-300 drop-shadow-xl" id="hero-main-title">
          Lưu Giữ Những Khoảnh Khắc
        </h1>

        {/* Dynamic localized subtitle corresponding to the active slide */}
        <p className="text-neutral-300 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed font-sans font-light px-2" id="hero-main-description">
          Nơi dành riêng cho những kỷ niệm của cộng đồng sinh viên trường{" "}
          <span className="text-white font-medium border-b border-rose-500/20 pb-0.5 whitespace-nowrap">
            Cao đẳng Công nghệ - Năng lượng Khánh Hòa
          </span>
          . Kết nối, chia sẻ, cùng học - chơi - làm.
        </p>

        {/* Navigation Handlers */}
        <div className="flex justify-center items-center gap-6 mb-12" id="slideshow-navigation">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full border border-white/10 bg-black/30 hover:bg-white/10 text-white flex items-center justify-center transition-all active:scale-90 hover:border-white/30 cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Custom Dots indicators */}
          <div className="flex gap-2.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2.5 rounded-full transition-all duration-500 ${i === index ? "w-8 bg-rose-500 shadow-md shadow-rose-900/30" : "w-2.5 bg-white/20 hover:bg-white/40"
                  }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full border border-white/10 bg-black/30 hover:bg-white/10 text-white flex items-center justify-center transition-all active:scale-90 hover:border-white/30 cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* REFINED STATS BANNER */}
        <div className="hidden md:grid grid-cols-4 gap-4 max-w-3xl mx-auto pt-8" id="statistics-grid">
          {STATS.map((s, idx) => (
            <div
              key={idx}
              className="group p-4 bg-black/45 border border-white/5 rounded-2xl backdrop-blur-xl hover:bg-white/[0.04] hover:border-rose-500/20 transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 mb-2.5 group-hover:scale-110 transition-transform duration-300">
                  <s.i size={16} />
                </div>

                <div className="text-xl md:text-2xl font-sans font-extrabold text-white tracking-tight">
                  {s.n}
                </div>

                <div className="text-[11px] font-semibold text-rose-300/90 mt-1 uppercase tracking-wider">
                  {s.l}
                </div>

                <div className="text-[9px] text-neutral-400 mt-0.5 line-clamp-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  {s.d}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
