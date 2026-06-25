
import { Calendar, MapPin, Sparkles, Heart, ShoppingCart } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCart: () => void;
  cartCount: number;
}

export default function Header({ activeTab, setActiveTab, onOpenCart, cartCount }: HeaderProps) {
  const navItems = [
    { id: 'home', label: 'Trang Chủ' },
    { id: 'schedule', label: 'Lịch Trình' },
    { id: 'checkin', label: 'Khoảnh Khắc' },
    { id: 'stalls', label: 'Gian Hàng Chăm' },
    { id: 'artisans', label: 'Nghệ Nhân' },
  ];


  return (
    <header className="w-full bg-white border-b border-rose-100 sticky top-0 z-50 shadow-xs">
      <div className="max-w-8xl mx-auto px-4 ">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center shadow-md border-2 border-white ring-2 ring-rose-200">
              <svg
                viewBox="0 0 100 100"
                className="w-8 h-8"
                fill="none"
              >
                <path
                  d="M20 20 L40 80 L50 50 L60 80 L80 20"
                  stroke="white"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M55 20 V80 M55 50 H80"
                  stroke="#fda4af"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="text-xs font-semibold tracking-wider text-rose-600 uppercase font-display flex items-center gap-0.5">
                  Lần thứ VI <Sparkles className="w-3 h-3 animate-pulse" />
                </span>
                <span className="h-1 w-1 bg-zinc-300 rounded-full"></span>
                <span className="text-xs text-zinc-500 font-medium">Khánh Hòa 2026</span>
              </div>
              <h1 className="text-sm sm:text-xl font-bold text-zinc-950 font-serif leading-tight">
                Ngày Hội Văn Hóa <span className="text-rose-600">Dân Tộc Chăm</span>
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${isActive
                      ? 'bg-rose-600 text-white shadow-sm shadow-rose-100'
                      : 'text-zinc-600 hover:text-rose-600 hover:bg-rose-50'
                    }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Info Section & Shopping Cart Trigger */}
          <div className="flex items-center space-x-4">
            {/* Live countdown or banner on desktop */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex flex-col text-right">
                <span className="text-xs text-zinc-500 font-medium tracking-wider">Diễn ra từ</span>
                <span className="text-sm font-bold text-zinc-900 flex items-center justify-end gap-1 font-display">
                  26/06 - 28/06/2026
                </span>
              </div>
              <div className="h-8 w-[1px] bg-zinc-200"></div>
              <div className="flex items-center space-x-1 bg-rose-50 text-rose-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-rose-100">
                <MapPin className="w-3.5 h-3.5 text-rose-600" /> Khánh Hòa
              </div>
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-all cursor-pointer relative border border-rose-100/60 flex items-center justify-center active:scale-95 shadow-3xs"
              title="Xem giỏ hàng"
            >
              <ShoppingCart className="w-5 h-5 text-rose-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white font-extrabold text-[9px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
