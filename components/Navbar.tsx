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
  X,
  Search,
  ChevronDown
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useViewStore } from '../stores/useViewStore';

const NAV_LINKS = [
  { id: 'map', label: 'Bản đồ', icon: <MapIcon className="w-4 h-4" /> },
  { id: 'teams', label: 'Dịch vụ', icon: <Handshake className="w-4 h-4" /> },
  { id: 'launched', label: 'Tài xế', icon: <Car className="w-4 h-4" /> },
  { id: 'developer', label: 'IT / Dev', icon: <Code className="w-4 h-4" /> },
  { id: 'home', label: 'Đội nhóm', icon: <Users className="w-4 h-4" /> },
];

export default function Navbar() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading, login, logout } = useAuth();
  
  const activeRoute = useViewStore(s => s.activeRoute);
  const setActiveRoute = useViewStore(s => s.setActiveRoute);

  const selectedCategoryId = useViewStore(s => s.selectedCategoryId);
  const selectCategory = useViewStore(s => s.selectCategory);
  const { isSelectingLocation, startSelectingLocation, cancelSelection } = useViewStore();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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

  const handleStartGhim = () => {
    if (isSelectingLocation) {
      cancelSelection();
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          startSelectingLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          startSelectingLocation();
        }
      );
    } else {
      startSelectingLocation();
    }
  };

  const handleLogoClick = () => {
    selectCategory(null);
    setActiveRoute('map');
  };

  if (selectedCategoryId !== null && activeRoute === 'map') return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1200] p-0 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col gap-2">
        
        {/* Main Nav Wrapper */}
        <div className={cn(
          "flex justify-between items-center transition-all px-4 md:px-8",
          "h-14 md:h-16 border-b border-zinc-200/60 md:border rounded-none md:rounded-3xl lg:rounded-[2.5rem]",
          scrolled || activeRoute !== 'map'
            ? "bg-white/95 border-zinc-200/80 shadow-lg shadow-zinc-200/20 backdrop-blur-md"
            : "bg-white border-zinc-100 shadow-sm"
        )}>

          {/* Logo Section */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer group" onClick={handleLogoClick}>
            <div className="w-9 h-9 bg-rose-600 rounded-full flex items-center justify-center text-white font-black text-sm shadow-lg shadow-zinc-900/10 border border-white/10 group-hover:bg-rose-700 group-hover:scale-105 transition-all duration-300">
              LN
            </div>
            <h1 className="font-sans font-extrabold text-lg md:text-xl tracking-tight text-zinc-900">
              Lovely<span className="text-rose-600">Net</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = activeRoute === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveRoute(link.id);
                    selectCategory(null);
                  }}
                  className={cn(
                    "relative px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all flex items-center gap-2 group cursor-pointer",
                    isActive ? "text-zinc-950 font-black" : "text-zinc-500 hover:text-zinc-900"
                  )}
                >
                  <span className={cn("transition-transform duration-300 text-zinc-700", isActive && "scale-110 !text-rose-600")}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navPill"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-rose-600 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              );
            })}
            
            <div className="w-px h-4 bg-zinc-200 mx-2" />
            
            <button
              onClick={handleStartGhim}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md active:scale-95 z-50 cursor-pointer",
                isSelectingLocation
                  ? "bg-zinc-900 text-white hover:bg-zinc-800"
                  : "bg-rose-600 text-white hover:bg-rose-700"
              )}
            >
              {isSelectingLocation ? <X className="w-3.5 h-3.5 text-rose-500" /> : <Plus className="w-3.5 h-3.5" />}
              {isSelectingLocation ? "Hủy chọn" : "Ghim vị trí"}
            </button>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-2">
              
              {/* Notification Button */}
              <div className="relative">
                <button 
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors relative cursor-pointer"
                >
                  <Bell className="w-4 h-4 md:w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 border border-white rounded-full" />
                </button>

                <AnimatePresence>
                  {notificationOpen && (
                    <>
                      {/* Backdrop mờ phía sau */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setNotificationOpen(false)}
                        className="fixed inset-0 bg-white/10 z-[1999]"
                      />

                      {/* Bảng thông báo tối ưu mobile */}
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 sm:right-0 -mr-24 sm:mr-0 mt-3 w-[calc(100vw-2rem)] sm:w-72 max-w-sm bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden z-[2000]"
                      >
                        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                          <span className="text-xs font-black uppercase text-zinc-400">Thông báo mới</span>
                          <button onClick={() => setNotificationOpen(false)} className="text-zinc-400 hover:text-zinc-600 cursor-pointer">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
                          <div className="p-2 hover:bg-zinc-50 rounded-lg text-xs transition">
                            <p className="font-bold text-zinc-900">🚀 Ý tưởng mới được đăng ký</p>
                            <p className="text-zinc-500 mt-0.5">Xưởng Ý Tưởng Khởi Nghiệp vừa tiếp nhận một đề án nông nghệ sạch.</p>
                          </div>
                          <div className="p-2 hover:bg-zinc-50 rounded-lg text-xs transition">
                            <p className="font-bold text-zinc-900">🍲 Điểm ăn uống Phan Rang cập nhật</p>
                            <p className="text-zinc-500 mt-0.5">Hàng cơm gà lân cận được găm lên danh mục Chợ Phan Rang.</p>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Search Button */}
              <div className="relative">
                <button 
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
                >
                  <Search className="w-4 h-4 md:w-5 h-5" />
                </button>

                <AnimatePresence>
                  {searchOpen && (
                    <>
                      {/* Backdrop mờ phía sau */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSearchOpen(false)}
                        className="fixed inset-0 bg-white/10 z-[1999]"
                      />

                      {/* Thanh tìm kiếm tối ưu mobile */}
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 sm:right-0 -mr-14 sm:mr-0 mt-3 w-[calc(100vw-2rem)] sm:w-64 max-w-sm bg-white p-2.5 rounded-2xl border border-zinc-200 shadow-xl z-[2000]"
                      >
                        <div className="flex items-center gap-1.5 px-2 bg-zinc-50 border rounded-xl">
                          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
                          <input 
                            type="text" 
                            placeholder="Tìm địa điểm, dịch vụ..."
                            className="w-full bg-transparent border-none text-xs py-2 outline-none text-zinc-900" 
                            autoFocus
                          />
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

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
                    "flex items-center gap-1.5 p-1 bg-zinc-50 rounded-full border transition-all active:scale-95 pr-2 cursor-pointer",
                    open ? "border-zinc-900 bg-white" : "border-zinc-100 hover:border-zinc-200 hover:bg-zinc-100"
                  )}
                >
                  <img
                    src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`}
                    alt="avatar"
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover border border-zinc-200"
                  />
                  <ChevronDown className={cn("w-3 h-3 text-zinc-400 transition-transform", open && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-64 bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden z-[2000]"
                    >
                      <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Tài khoản hiện tại</p>
                        <p className="text-xs font-black text-zinc-900">{user.displayName}</p>
                        <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
                      </div>

                      <div className="p-2">
                        <button 
                          onClick={() => {
                            setOpen(false);
                            setActiveRoute("profile");
                            selectCategory(null);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-50 rounded-xl transition-colors cursor-pointer"
                        >
                          <UserIcon className="w-3.5 h-3.5" /> Hồ sơ cá nhân
                        </button>
                        <button
                          onClick={() => {
                            logout();
                            setOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-colors mt-0.5 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Đăng xuất
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={login}
                className="h-9 px-4 md:px-5 bg-zinc-900 text-white text-xs font-bold rounded-full hover:bg-zinc-800 transition-all active:scale-95 cursor-pointer"
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