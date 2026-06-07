import { useEffect } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface ImageLightboxProps {
  imageSrc: string;
  caption: string;
  author: string;
  faculty: string;
  time: string;
  onClose: () => void;
}

export default function ImageLightbox({ imageSrc, caption, author, faculty, time, onClose }: ImageLightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-2000 flex flex-col justify-between overflow-hidden bg-neutral-950 select-none animate-fade-in" id="lightbox-backdrop">
      
      {/* Absolute Header Panel */}
      <div className="relative z-20 w-full flex justify-between items-center px-6 py-4.5 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-white text-xs font-black">
            {author.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="text-white text-xs font-bold leading-none mb-1">{author}</h4>
            <p className="text-neutral-400 text-[10px] uppercase font-semibold tracking-wider">🎓 {faculty}</p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border-none cursor-pointer shadow-lg"
          title="Đóng rạp ảnh"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Full Scale Viewer */}
      <div className="flex-1 w-full flex items-center justify-center p-4 cursor-zoom-out" onClick={onClose}>
        <motion.img
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          src={imageSrc}
          alt={caption}
          referrerPolicy="no-referrer"
          onClick={(e) => e.stopPropagation()}
          className="max-w-full max-h-[72vh] md:max-h-[78vh] object-contain rounded-2xl shadow-2xl select-none"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&q=80";
          }}
        />
      </div>

      {/* Narrative Footer Panel */}
      <div className="relative z-20 w-full px-6 py-6 md:py-8 bg-gradient-to-t from-black/85 via-black/60 to-transparent text-white" onClick={(e) => e.stopPropagation()}>
        <div className="max-w-3xl mx-auto space-y-2 text-center md:text-left">
          <p className="text-[10px] text-rose-400 font-extrabold uppercase tracking-widest">{time || "Vừa xong"}</p>
          <p className="text-neutral-200 text-xs sm:text-sm leading-relaxed max-h-[16vh] overflow-y-auto break-words font-light pr-2 border-l border-rose-500/30 pl-4">
            {caption}
          </p>
        </div>
      </div>

    </div>
  );
}
