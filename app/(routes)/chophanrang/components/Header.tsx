import React, { useState } from 'react';
import { ShoppingBag, Search, User, LogOut, PlusCircle, Store, Bike, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onCartClick: () => void;
  cartCount: number;
  onSearchChange: (query: string) => void;
  searchQuery: string;
  onCreateStallClick: () => void;
  onRegisterDriverClick: () => void;
  onProfileClick: () => void;
  onHomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onCartClick,
  cartCount,
  onSearchChange,
  searchQuery,
  onCreateStallClick,
  onRegisterDriverClick,
  onProfileClick,
  onHomeClick,
}) => {
  const { user, logout, isSimulated } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-0 sm:h-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        
        {/* Top Row: Logo & Action Items on Mobile View */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-2 shrink-0">
          
          {/* Logo */}
          <div 
            onClick={onHomeClick} 
            className="flex items-center gap-2 cursor-pointer select-none group shrink-0"
          >
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-tr from-rose-500 to-rose-400 rounded-full flex items-center justify-center text-white shadow-md shadow-rose-200 transition-transform group-hover:scale-105">
              <Store className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-base sm:text-2xl font-extrabold tracking-tight text-charcoal flex items-center gap-1 leading-none">
                Chợ <span className="text-rose-brand font-serif italic font-semibold text-rose-600">Phan Rang</span>
              </h1>
              <p className="hidden xs:block text-[8px] sm:text-[9px] font-bold tracking-widest text-gray-400 uppercase mt-1">Nắng & Gió Ninh Thuận</p>
            </div>
          </div>

          {/* Action Buttons for Mobile View - Hides on Desktop sm breakpoint */}
          <div className="flex sm:hidden items-center gap-1.5 shrink-0">
            
            {/* Recruit Driver Mobile inline icon button */}
            <button
              onClick={onRegisterDriverClick}
              className="p-2 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100 transition-all cursor-pointer active:scale-95"
              title="Đăng ký tài xế"
            >
              <Bike className="w-4 h-4 animate-pulse" />
            </button>

            {/* Shopping Cart button with Badge indicator */}
            <button
              onClick={onCartClick}
              className="relative p-2 rounded-full bg-rose-brand-light text-rose-brand hover:bg-rose-brand hover:text-white transition-all cursor-pointer active:scale-95"
              aria-label="Khảo giỏ hàng"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 bg-charcoal text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Authentication Section Mobile */}
            <div className="relative shrink-0">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center cursor-pointer p-0.5 rounded-full border border-rose-100 hover:border-rose-300 transition-all focus:outline-none"
                  >
                    <img
                      referrerPolicy="no-referrer"
                      src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || 'User'}`}
                      alt={user.displayName || "User Profile"}
                      className="w-7 h-7 rounded-full border border-rose-400 object-cover"
                    />
                  </button>

                  {showDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowDropdown(false)} 
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-rose-100 rounded-xl shadow-xl z-20 overflow-hidden py-1 animate-scale-up">
                        <div className="px-3 py-2 bg-rose-brand-light">
                          <p className="text-[8px] text-rose-brand font-black uppercase tracking-widest">Tài khoản</p>
                          <p className="text-xs font-extrabold text-charcoal truncate mt-0.5">{user.displayName}</p>
                          {isSimulated && (
                            <span className="inline-block mt-0.5 text-[7px] bg-charcoal text-white px-1 rounded font-black uppercase">
                              Tài khoản Demo
                            </span>
                          )}
                        </div>
                        
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            onProfileClick();
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs font-bold text-charcoal hover:bg-rose-brand-light hover:text-rose-brand flex items-center gap-1.5"
                        >
                          <User className="w-3.5 h-3.5" />
                          Trang cá nhân
                        </button>

                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            onRegisterDriverClick();
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs font-black text-emerald-600 hover:bg-emerald-50 flex items-center gap-1.5"
                        >
                          <Bike className="w-3.5 h-3.5" />
                          Đăng ký tài xế 🛵
                        </button>

                        <div className="border-t border-rose-500/10 my-1" />

                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            logout();
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-1.5"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Đăng xuất
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={onProfileClick}
                  className="flex items-center justify-center p-1.5 rounded-full bg-gray-soft text-charcoal hover:bg-rose-brand hover:text-white border border-gray-200 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Search Bar - wide and centered/extended */}
        <div className="w-full sm:flex-1 sm:max-w-xs md:max-w-md relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm cơm gà, bánh căn..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-gray-soft border border-gray-200 rounded-full focus:outline-none focus:border-rose-brand transition-all placeholder:text-gray-400 font-semibold"
          />
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
        </div>

        {/* Desktop-only Action Row Portion */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Become a Driver desktop CTA - Elegant badge icon */}
          <button
            onClick={onRegisterDriverClick}
            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-black rounded-full border border-emerald-200 transition-all active:scale-95 cursor-pointer shrink-0"
            title="Tuyển dụng tài xế giao món / vận chuyển"
          >
            <Bike className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
            <span>Tuyển Tài Xế 🛵</span>
          </button>

          {/* Create Stall Button */}
          <button
            onClick={onCreateStallClick}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-charcoal text-white hover:bg-rose-brand text-xs font-bold rounded-full shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Mở Quán</span>
          </button>

          {/* Shopping Cart button with Badge indicator */}
          <button
            onClick={onCartClick}
            className="relative p-2 rounded-full bg-rose-brand-light text-rose-brand hover:bg-rose-brand hover:text-white transition-all cursor-pointer active:scale-95 shrink-0"
            aria-label="Khảo giỏ hàng"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 bg-charcoal text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          {/* Authentication Section */}
          <div className="relative shrink-0">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1 cursor-pointer p-0.5 rounded-full border border-rose-100 hover:border-rose-300 transition-all focus:outline-none"
                >
                  <img
                    referrerPolicy="no-referrer"
                    src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || 'User'}`}
                    alt={user.displayName || "User Profile"}
                    className="w-8 h-8 rounded-full border border-rose-400 object-cover"
                  />
                </button>

                {showDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowDropdown(false)} 
                    />
                    <div className="absolute right-0 mt-2.5 w-52 bg-white border border-rose-100 rounded-2xl shadow-xl z-20 overflow-hidden py-1 animate-scale-up">
                      <div className="px-4 py-3 bg-rose-brand-light">
                        <p className="text-[10px] text-rose-brand font-black uppercase tracking-widest">Tài khoản</p>
                        <p className="text-xs font-extrabold text-charcoal truncate mt-0.5">{user.displayName}</p>
                        <p className="text-[10px] text-gray-400 truncate font-semibold">{user.email}</p>
                        {isSimulated && (
                          <span className="inline-block mt-1 text-[8px] bg-charcoal text-white px-1 py-0.5 rounded font-black uppercase">
                            Tài khoản Demo
                          </span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          onProfileClick();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-charcoal hover:bg-rose-brand-light hover:text-rose-brand flex items-center gap-2 transition-all"
                      >
                        <User className="w-3.5 h-3.5" />
                        Trang cá nhân của bạn
                      </button>

                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          onRegisterDriverClick();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-black text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 transition-all"
                      >
                        <Bike className="w-3.5 h-3.5 animate-pulse" />
                        Đăng ký tài xế 🛵
                      </button>

                      <div className="border-t border-rose-500/10 my-1" />

                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-2 transition-all"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Đăng xuất tài khoản
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onProfileClick}
                className="flex items-center justify-center p-2 rounded-full bg-gray-soft text-charcoal hover:bg-rose-brand hover:text-white transition-all cursor-pointer border border-gray-200"
              >
                <User className="w-4.5 h-4.5" />
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
