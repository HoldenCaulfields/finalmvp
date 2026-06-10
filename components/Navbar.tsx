'use client'
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  User as UserIcon, 
  LogOut, 
  Map as MapIcon, 
  Users, 
  Handshake, 
  Car, 
  Code, 
  Plus, 
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useViewStore } from '@/stores/useViewStore';
import { useRouter } from 'next/navigation';

const NAV_LINKS = [
  { id: 'map', label: 'Bản đồ', icon: <MapIcon className="w-4 h-4" />, path: '/' },
  { id: 'teams', label: 'Dịch vụ', icon: <Handshake className="w-4 h-4" />, path: '/teams' },
  { id: 'launched', label: 'Tài xế', icon: <Car className="w-4 h-4" />, path: '/products' },
  { id: 'developer', label: 'IT/ Dev', icon: <Code className="w-4 h-4" />, path: '/products' },
  { id: 'home', label: 'Đội nhóm', icon: <Users className="w-4 h-4" />, path: '/groups' },
];

export default function Navbar() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('map');
  const viewMode = useViewStore( s => s.viewMode);

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if ( viewMode === 'members') return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-1200 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <div className={cn(
          "flex justify-between items-center h-16 transition-all border rounded-2xl md:rounded-[2.5rem] px-4 md:px-8",
          scrolled 
            ? "glass-nav border-zinc-200/80 shadow-lg shadow-zinc-200/20" 
            : "bg-white/95 border-transparent shadow-sm"
        )}>

          {/* Logo Section */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer group" onClick={() => router.push('/')}>
            <div className="w-9 h-9 bg-rose-600 rounded-3xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-zinc-900/10 border border-white/10 group-hover:bg-rose-600 group-hover:scale-105 transition-all duration-300">
              LN
            </div>
            <h1 className="font-display font-extrabold text-xl tracking-tight text-zinc-900">
              Lovely<span className="text-rose-600">Net</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={cn(
                    "relative px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all flex items-center gap-2 group",
                    isActive ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900"
                  )}
                >
                  <span className={cn("transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navPill"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-rose-600 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              );
            })}
            <div className="w-px h-4 bg-zinc-200 mx-2" />
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-zinc-900 hover:bg-rose-600 transition-all shadow-md shadow-zinc-900/10 active:scale-95">
              <Plus className="w-3.5 h-3.5" />
              Ghim vị trí
            </button>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
               <button className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors relative">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full" />
               </button>
               <button className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors">
                 <Search className="w-5 h-5" />
               </button>
            </div>

            {loading ? (
              <div className="w-10 h-10 flex items-center justify-center bg-zinc-50 rounded-full border border-zinc-100">
                <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
              </div>
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className={cn(
                    "flex items-center gap-2.5 p-1.5 pr-3 bg-zinc-50 rounded-full border transition-all active:scale-95",
                    open ? "border-zinc-900 bg-white" : "border-zinc-100 hover:border-zinc-200 hover:bg-zinc-100"
                  )}
                >
                  <img
                    src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                    alt="avatar"
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover border border-zinc-200"
                  />
                  <ChevronDown className={cn("w-3.5 h-3.5 text-zinc-400 transition-transform", open && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-64 bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden z-2000"
                    >
                      <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                        <p className="text-xs font-medium text-zinc-400 mb-1">Tài khoản hiện tại</p>
                        <p className="text-sm font-bold text-zinc-900">{user.displayName}</p>
                        <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                      </div>

                      <div className="p-2">
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 rounded-xl transition-colors">
                          <UserIcon className="w-4 h-4" /> Hồ sơ cá nhân
                        </button>
                        <button
                          onClick={() => {
                            logout();
                            setOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-50 rounded-xl transition-colors mt-0.5"
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
                className="h-10 px-6 bg-zinc-900 text-white text-sm font-bold rounded-full hover:bg-zinc-800 transition-all active:scale-95"
              >
                Đăng Nhập
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
