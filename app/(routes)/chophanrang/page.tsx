'use client';
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { CartDrawer } from './components/CartDrawer';
import { CreateStallModal } from './components/CreateStallModal';
import { UserProfileModal } from './components/UserProfileModal';
import { DishDetailsModal } from './components/DishDetailsModal';
import { StallDetailView } from './components/StallDetailView';
import { RegisterDriverModal } from './components/RegisterDriverModal';
import { Stall, Dish, OrderItem } from './types';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { seedPhanRangDatabase } from './data/seedData';
import { useStore } from './store/useStore';
import { Star, MapPin, ArrowRight, Store, Search, Filter, AlertCircle, Sparkles, Check, Plus, Bike } from 'lucide-react';
import './index.css';

const CATEGORIES = [
  'all',
  'Cơm Gà',
  'Bánh Căn',
  'Bánh Xèo',
  'Hải Sản',
  'Ngọt / Giải Khát',
  'Món Ăn Vặt'
];

function MainAppContent() {
  const { user } = useAuth();
  
  // Zustand State hooks
  const {
    stalls,
    setStalls,
    dishes,
    setDishes,
    loading,
    setLoading,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    selectedStall,
    setSelectedStall,
    selectedDish,
    setSelectedDish,
    cartItems,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  } = useStore();

  // Dialog/Drawer toggles
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCreateStallOpen, setIsCreateStallOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRegisterDriverOpen, setIsRegisterDriverOpen] = useState(false);

  // 1. Initial Seeding and Realtime Database Synchronizers
  useEffect(() => {
    const initApp = async () => {
      // Seed initially if the DB is empty
      await seedPhanRangDatabase();
    };
    initApp();

    setLoading(true);
    // Observe stalls collection in real-time
    const unsubscribeStalls = onSnapshot(collection(db, 'stalls'), (snapshot) => {
      const list: Stall[] = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data() as Stall);
      });
      // Sort in memory by name
      list.sort((a, b) => a.name.localeCompare(b.name));
      setStalls(list);
      setLoading(false);
    }, (err) => {
      console.error("Critical error observing stalls collection:", err);
      setLoading(false);
    });

    // Observe dishes collection in real-time
    const unsubscribeDishes = onSnapshot(collection(db, 'dishes'), (snapshot) => {
      const list: Dish[] = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data() as Dish);
      });
      setDishes(list);
    }, (err) => {
      console.error("Critical error observing dishes collection:", err);
    });

    return () => {
      unsubscribeStalls();
      unsubscribeDishes();
    };
  }, [setStalls, setDishes, setLoading]);

  // Searching and Filtering mechanics
  const getDishesForStall = (stallId: string) => {
    return dishes.filter(d => d.stallId === stallId);
  };

  const filteredStalls = stalls.filter(stall => {
    const matchesCategory = categoryFilter === 'all' || 
      stall.category.toLowerCase().includes(categoryFilter.toLowerCase()) ||
      categoryFilter.toLowerCase().includes(stall.category.toLowerCase());

    const query = searchQuery.toLowerCase();
    const matchesSearch = !query || 
      stall.name.toLowerCase().includes(query) || 
      stall.description.toLowerCase().includes(query) ||
      stall.category.toLowerCase().includes(query) ||
      // Or find stalls that contain a dish matching the search term!
      dishes.some(d => d.stallId === stall.id && (
        d.name.toLowerCase().includes(query) || d.description.toLowerCase().includes(query)
      ));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      {/* Dynamic Header */}
      <Header
        onCartClick={() => setIsCartOpen(true)}
        cartCount={cartItems.reduce((acc, c) => acc + c.quantity, 0)}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        onCreateStallClick={() => setIsCreateStallOpen(true)}
        onRegisterDriverClick={() => setIsRegisterDriverOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        onHomeClick={() => {
          setSelectedStall(null);
          setSelectedDish(null);
          setCategoryFilter('all');
        }}
      />

      {/* Main Container Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {selectedStall ? (
          /* SINGLE STALL DETAILED SCROLL view layout */
          <StallDetailView
            stall={selectedStall}
            dishes={getDishesForStall(selectedStall.id)}
            onBack={() => setSelectedStall(null)}
            onDishClick={(dish) => setSelectedDish(dish)}
          />
        ) : (
          /* CORE DISCOVERY MAIN market stall screen dashboard */
          <div className="space-y-8">
            
            {/* Immersive Local Hero Header card */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-rose-500/10">
              <div className="absolute inset-0 bg-gradient-to-r from-charcoalvia-charcoal/80 to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&q=80&w=1200"
                alt="Chợ Phan Rang Ninh Thuận"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="relative z-20 px-6 sm:px-12 py-10 sm:py-16 md:py-20 max-w-2xl text-white space-y-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-brand text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-md leading-none">
                  <Sparkles className="w-3 h-3 text-white" /> Ăn uống ngon hơn, rẻ hơn
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight select-none">
                  Ẩm Thực <span className="font-serif italic font-semibold text-rose-brand"> Phan Rang</span>
                </h2>
                <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-900 max-w-lg">
                  Khám phá những món ăn ngon và rẻ ở Chợ Phan Rang, trao đổi mua bán, đăng ký làm tài xế giao hàng.
                </p>
                <div className="pt-2 flex flex-wrap gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5 bg-rose-500 backdrop-blur-md p-2 px-3 rounded-full text-xs font-semibold select-none border border-white/15">
                    🚲 Giao hàng nhanh nội thành
                  </div>
                  <div className="flex items-center gap-1.5 bg-green-600 backdrop-blur-md p-2 px-3 rounded-full text-xs font-semibold select-none border border-white/15">
                    ⭐ Đánh giá 5 sao uy tín
                  </div>
                </div>
              </div>
            </div>

            {/* General categories section */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-2 border-b border-rose-100 pb-2">
                <Filter className="w-4.5 h-4.5 text-rose-brand" />
                <h3 className="text-sm font-black text-charcoal uppercase tracking-wider">Xem theo đặc sản</h3>
              </div>
              
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                {CATEGORIES.map((catKey) => (
                  <button
                    key={catKey}
                    onClick={() => setCategoryFilter(catKey)}
                    className={`px-4 py-2 font-bold rounded-full border shrink-0 transition-all cursor-pointer ${
                      categoryFilter === catKey
                        ? 'bg-rose-brand text-white border-rose-brand shadow-md shadow-rose-100'
                        : 'bg-white text-gray-400 border-gray-100 hover:text-charcoal'
                    }`}
                  >
                    {catKey === 'all' ? 'Tất cả gian hàng' : catKey}
                  </button>
                ))}
              </div>
            </div>

            {/* List grid view stalls */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-md sm:text-lg font-black text-charcoal flex items-center gap-2">
                  <Store className="w-5 h-5 text-rose-brand" /> Gian hàng đang bán ({filteredStalls.length})
                </h3>
                {searchQuery && (
                  <span className="text-xs font-semibold text-gray-400">
                    Kết quả tìm: <strong className="text-charcoal">"{searchQuery}"</strong>
                  </span>
                )}
              </div>

              {loading ? (
                /* LOADING PLACEHOLDERS */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((idx) => (
                    <div key={idx} className="animate-pulse space-y-4 p-4 rounded-3xl border border-gray-100 bg-white shadow-xs">
                      <div className="aspect-[16/10] bg-gray-200 rounded-2xl w-full" />
                      <div className="space-y-2 py-1">
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                        <div className="h-3 bg-gray-200 rounded w-5/6" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredStalls.length === 0 ? (
                /* EMPTY SEARCH CRITERIA STATE */
                <div className="text-center py-20 px-4 border border-dashed border-rose-200/60 rounded-3xl bg-gray-soft/60">
                  <AlertCircle className="w-12 h-12 text-rose-brand/35 mx-auto mb-3" />
                  <p className="text-sm font-bold text-gray-500">Không tìm thấy gian hàng nào ăn khớp!</p>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1 leading-relaxed">
                    Hãy thử thay đổi từ khóa tìm kiếm (Ví dụ: "cơm gà", "mật nho") hoặc nhấp phục hồi mục lục để ngắm nghía tất cả quán ăn.
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); setCategoryFilter('all'); }}
                    className="mt-4 px-4 py-2 bg-charcoal text-white hover:bg-rose-brand font-bold text-xs rounded-full transition-all cursor-pointer"
                  >
                    Quay lại sảnh chính Chợ
                  </button>
                </div>
              ) : (
                /* GENERAL STALL GRID CARDS CONTAINER */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStalls.map((stall) => {
                    const localDishes = getDishesForStall(stall.id);
                    return (
                      <div
                        key={stall.id}
                        onClick={() => setSelectedStall(stall)}
                        className="group bg-white rounded-3xl border border-rose-100/40 hover:border-rose-100 shadow-xs hover:shadow-xl cursor-pointer overflow-hidden transition-all duration-300 flex flex-col justify-between"
                      >
                        {/* Media Cover */}
                        <div className="relative aspect-[16/10] overflow-hidden shrink-0 bg-gray-100">
                          <img
                            src={stall.banner}
                            alt={stall.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-4 left-4 inline-block bg-charcoal text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow border border-white/10">
                            {stall.category}
                          </div>
                        </div>

                        {/* Text descriptions */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-1.5">
                            <h4 className="text-base font-extrabold text-charcoal tracking-tight group-hover:text-rose-brand transition-colors line-clamp-1">
                              {stall.name}
                            </h4>

                            <div className="flex items-center gap-1 text-xs font-bold text-charcoal">
                              <Star className="w-4 h-4 fill-rose-brand text-rose-brand" />
                              <span>{stall.rating.toFixed(1)}</span>
                              <span className="text-gray-300">|</span>
                              <span className="text-gray-400">{localDishes.length} món đặc sắc</span>
                            </div>

                            <p className="text-xs text-gray-400 font-medium leading-relaxed line-clamp-2">
                              {stall.description}
                            </p>
                          </div>

                          {/* Action Footer info */}
                          <div className="pt-3 border-t border-rose-500/5 flex items-center justify-between text-xs">
                            <span className="text-gray-400 font-semibold truncate max-w-[150px] flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-rose-brand shrink-0" /> {stall.address.split(',')[0]}
                            </span>
                            
                            <span className="font-extrabold text-rose-brand flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                              Vào Quán <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Immersive Driver Recruiting Bento Card CTA */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-6 sm:p-8 md:p-10 shadow-lg border border-emerald-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-xl" />
              <div className="absolute left-1/4 bottom-0 w-48 h-48 bg-teal-500/10 rounded-full -ml-8 -mb-12 blur-2xl" />
              
              <div className="space-y-3 relative z-10 max-w-xl text-center md:text-left animate-fade-in">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-emerald-100 text-[9px] font-black uppercase tracking-widest rounded-full leading-none">
                  🏍️ Nghiệp đoàn giao hàng Chợ Phan Rang
                </span>
                <h3 className="text-lg sm:text-2xl font-black tracking-tight leading-tight">
                  Đăng Ký Làm Tài Xế • Gia Tăng Thu Nhập
                </h3>
                <p className="text-xs text-emerald-100/90 font-medium leading-relaxed">
                  Đưa đón du khách tham quan Tháp Chàm, Đồi Cát, chở đặc sản Ninh Thuận hỏa tốc từ các sập hàng đến khách sạn, homestay lân cận. Hãy tham gia đội ngũ năng động của chúng tôi để kiếm thêm thu nhập 300.000đ - 500.000đ mỗi ngày rảnh rỗi!
                </p>
              </div>

              <div className="shrink-0 relative z-10 w-full md:w-auto">
                <button
                  onClick={() => setIsRegisterDriverOpen(true)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-full font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <Bike className="w-4 h-4 text-emerald-700 animate-bounce" />
                  Đăng ký tài xế ngay 🛵
                </button>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Embedded footer */}
      <footer className="bg-charcoal text-white border-t border-rose-500/10 py-8 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-gray-400 font-medium">
          <div className="space-y-1">
            <p className="text-sm font-black text-white">Chợ Phan Rang - Tháp Chàm</p>
            <p>© 2026.</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="#about" className="hover:text-rose-brand">Giới thiệu Chợ</a>
            <a href="#rules" className="hover:text-rose-brand">Điều khoản an toàn</a>
            <a href="#help" className="hover:text-rose-brand">Zalo hợp tác: 0793784133</a>
          </div>
        </div>
      </footer>

      {/* MODAL / DRAWER WRAPPERS AT CENTRAL STATE */}

      {/* Cart Drawer manager */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
      />

      {/* Create Stall Modal register */}
      <CreateStallModal
        isOpen={isCreateStallOpen}
        onClose={() => setIsCreateStallOpen(false)}
        onStallCreated={(newSt) => {
          setSelectedStall(newSt); // Auto show details of newly created stall!
        }}
        onDishCreated={(newD) => {
          // Toast or sync
        }}
        stallsList={stalls}
      />

      {/* Customer profile modal with integrated billing history */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* Register Driver candidacy modal */}
      <RegisterDriverModal
        isOpen={isRegisterDriverOpen}
        onClose={() => setIsRegisterDriverOpen(false)}
      />

      {/* Selected Dish View / interactive reviews details */}
      {selectedDish && (
        <DishDetailsModal
          dish={selectedDish}
          stallName={stalls.find(s => s.id === selectedDish.stallId)?.name || 'Gian Hàng Chợ'}
          isOpen={true}
          onClose={() => setSelectedDish(null)}
          onAddToCart={addToCart}
        />
      )}

      {/* Floating Action Button for mobile: + Mở Quán */}
      <button
        onClick={() => setIsCreateStallOpen(true)}
        className="sm:hidden fixed bottom-6 right-6 z-45 w-14 h-14 bg-rose-brand text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer border-2 border-white focus:outline-none"
        aria-label="Tạo ki-ốt mới"
      >
        <Plus className="w-6 h-6" />
      </button>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

