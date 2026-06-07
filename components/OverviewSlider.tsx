'use client';

import { motion, Variants } from 'framer-motion';
import { MapPin, Star, Utensils, Search } from 'lucide-react';

// Data mẫu giữ nguyên gọn gàng
const MOCK_PLACES = [
  { id: 1, name: 'Quán Ăn Sinh Viên Rose', type: 'Ăn vặt, Mì trộn', rating: 4.8, distance: '200m', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80' },
  { id: 2, name: 'Black & White Coffee', type: 'Cà phê, Trà sữa', rating: 4.5, distance: '450m', image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Bánh Tráng Trộn & Ăn Vặt Đêm', type: 'Ăn vặt', rating: 4.2, distance: '700m', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80' },
  { id: 4, name: 'Tiệm Cơm Gà Chiên Mắm', type: 'Cơm trưa', rating: 4.6, distance: '1.2km', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80' },
  { id: 5, name: 'Trà Sữa Trân Châu Hồng Kông', type: 'Trà sữa', rating: 4.4, distance: '900m', image: 'https://images.unsplash.com/photo-1510626176961-4bfa4c0bfb9c?w=600&auto=format&fit=crop&q=80' },
  { id: 6, name: 'Quán Ăn Vặt Rose', type: 'Ăn vặt, Mì trộn', rating: 4.8, distance: '200m', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80' },
];

// Định nghĩa Variants với kiểu dữ liệu chuẩn từ thư viện để tránh lỗi build
const sliderVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'tween', duration: 0.3 } // Trượt tween cơ bản, mượt, nhẹ máy
  }
};

export default function OverviewSlider() {
  return (
    <motion.div
      variants={sliderVariants}
      initial="hidden"
      animate="visible"
      className="w-full flex-none pointer-events-none z-1000
                md:relative md:w-96 md:h-full md:border-r md:border-zinc-100 md:bg-white/95 md:backdrop-blur-sm md:pointer-events-auto"
    >
      {/* --- MOBILE: DANH SÁCH TRƯỢT NGANG --- */}
      {/* pointer-events-auto bắt buộc phải có ở đây để slider vuốt được */}
      <div className="md:hidden mb-0 pointer-events-auto">
        <div className="flex gap-4 p-5 overflow-x-auto scroll-snap-type-x mandatory no-scrollbar">
          {MOCK_PLACES.map((place) => (
            <div 
              key={place.id}
              className="flex-none w-[260px] bg-zinc-950 rounded-2xl overflow-hidden relative group aspect-[4/3] shadow-md shadow-zinc-950/10"
            >
              <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
              
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="flex items-center gap-1 text-[10px] text-rose-300 font-semibold mb-0.5">
                  <Star className="w-3 h-3 fill-rose-300" />
                  <span>{place.rating}</span>
                  <span className="text-white/50">({place.distance})</span>
                </div>
                <h3 className="text-sm font-bold tracking-tight line-clamp-1">{place.name}</h3>
                <p className="text-[11px] text-white/60 line-clamp-1">{place.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- DESKTOP: SIDEBAR CUỘN DỌC --- */}
      <div className="hidden md:flex flex-col h-full mt-20">
        <div className="px-5 pb-3 pt-5 border-b border-zinc-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-950 tracking-tight flex items-center gap-2">
                <span className="text-rose-500">Rose</span> Spots
                <span className="text-xs bg-rose-50 text-rose-500 px-2.5 py-1 rounded-full font-semibold">{MOCK_PLACES.length}</span>
              </h2>
              <p className="text-xs text-zinc-400">Địa điểm ăn uống xung quanh bạn</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-zinc-950 flex items-center justify-center text-rose-400">
              <Utensils className="w-5 h-5" />
            </div>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input type="text" placeholder="Tìm nhanh quán ăn, cafe..." className="w-full pl-10 pr-4 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-1 focus:ring-rose-400 focus:outline-none" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {MOCK_PLACES.map((place) => (
            <div 
              key={place.id}
              className="group flex gap-3 p-2 bg-white border border-zinc-100 rounded-xl hover:border-rose-100 hover:shadow-sm transition-all duration-200 cursor-pointer"
            >
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0">
                <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between py-0.5">
                <div>
                  <h3 className="text-xs font-semibold text-zinc-950 line-clamp-1 group-hover:text-rose-600 transition-colors">{place.name}</h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{place.type}</p>
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-dashed border-zinc-100">
                  <span className="flex items-center gap-0.5 font-medium text-zinc-700">
                    <MapPin className="w-3 h-3 text-rose-400" /> {place.distance}
                  </span>
                  <span className="font-bold text-zinc-950 group-hover:text-rose-500 transition-colors">Xem &rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}