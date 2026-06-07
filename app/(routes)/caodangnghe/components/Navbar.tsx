import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Plus
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface NavbarProps {
  onUploadClick?: () => void;
  onProfileClick?: () => void;
  onLogoClick?: () => void;
}

export default function Navbar({ onUploadClick, onProfileClick, onLogoClick }: NavbarProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, profile, loading, login, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 left-0 right-0 w-full bg-white/95 z-50 transition-all duration-300 border-b border-neutral-200/50">
      <div className="w-full md:px-20 mx-auto">
        <div className={cn(
          "flex justify-between items-center h-16 transition-all px-4 md:px-8",
          scrolled ? "backdrop-blur-md bg-white/80" : "bg-white"
        )}>

          {/* Logo Section */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer group" onClick={handleLogoClick}>
            <div className="w-9 h-9 bg-rose-600 rounded-3xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-zinc-900/10 border border-white/10 group-hover:bg-rose-700 group-hover:scale-105 transition-all duration-300">
              CD
            </div>
            <div className="min-w-0">
              <h1 className="font-sans font-extrabold text-xs sm:text-sm tracking-tight text-neutral-950 truncate flex items-center gap-1">
                <span>Hội Sinh Viên</span>
                <span className="text-[10px] bg-rose-50 border border-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-medium">CDN</span>
              </h1>
              <p className="text-[9px] text-neutral-400 hidden sm:block font-light tracking-wide truncate mt-0.5">
                Trường Cao Đẳng Công nghệ & Năng lượng Khánh Hòa
              </p>
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={onUploadClick}
                className="hidden sm:flex items-center gap-1.5 bg-neutral-900 hover:bg-rose-950 text-white border-none rounded-xl px-3 py-2 md:px-4.5 font-bold text-xs tracking-wide cursor-pointer shadow-md shadow-neutral-950/15 hover:shadow-rose-950/20 active:scale-95 transition-all flex-shrink-0"
                id="write-button"
              >
                <Plus size={14} strokeWidth={3} />
                <span>Gửi kỷ niệm</span>
              </button>
            </div>

            {loading ? (
              <div className="w-10 h-10 flex items-center justify-center bg-zinc-50 rounded-full border border-zinc-100">
                <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
              </div>
            ) : profile ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className={cn(
                    "flex items-center gap-2.5 p-1.5 pr-3 bg-zinc-50 rounded-full border transition-all active:scale-95",
                    open ? "border-zinc-900 bg-white" : "border-zinc-100 hover:border-zinc-200 hover:bg-zinc-100"
                  )}
                >
                  <img
                    src={profile.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`}
                    alt="avatar"
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover border border-zinc-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.name)}`;
                    }}
                  />
                  <ChevronDown className={cn("w-3.5 h-3.5 text-zinc-400 transition-transform", open && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-64 bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                        <p className="text-xs font-medium text-zinc-400 mb-1">Tài khoản hiện tại</p>
                        <p className="text-sm font-bold text-zinc-900">{profile.name}</p>
                        <p className="text-xs text-zinc-500 truncate">{profile.email}</p>
                        <p className="text-[10px] text-rose-600 font-semibold uppercase mt-1 tracking-wide">{profile.faculty}</p>
                      </div>

                      <div className="p-2">
                        <button 
                          onClick={() => {
                            setOpen(false);
                            if (onProfileClick) onProfileClick();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 rounded-xl transition-colors text-left"
                        >
                          <UserIcon className="w-4 h-4" /> Hồ sơ cá nhân
                        </button>
                        <button
                          onClick={() => {
                            logout();
                            setOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-50 rounded-xl transition-colors mt-0.5 text-left"
                        >
                          <LogOut className="w-4 h-4" /> Đăng xuất
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={login}
                className="flex items-center gap-1.5 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 rounded-xl px-2.5 py-1.5 sm:px-3.5 sm:py-2 font-extrabold text-[11px] cursor-pointer shadow-sm active:scale-95 transition-all"
                id="google-login-trigger"
                title="Đăng nhập tài khoản Google"
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.19-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-xs">Đăng nhập</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
