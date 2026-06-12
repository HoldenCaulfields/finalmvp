import React, { useState } from 'react';
import { ArrowLeft, MapPin, Tag, Star, ArrowRight, UtensilsCrossed, Sparkles } from 'lucide-react';
import { Stall, Dish } from '../types';

interface StallDetailViewProps {
  stall: Stall;
  dishes: Dish[];
  onBack: () => void;
  onDishClick: (dish: Dish) => void;
}

export const StallDetailView: React.FC<StallDetailViewProps> = ({
  stall,
  dishes,
  onBack,
  onDishClick,
}) => {
  const [dishCategoryFilter, setDishCategoryFilter] = useState('all');

  // Find unique dish categories
  const dishCategories = ['all', ...Array.from(new Set(dishes.map(d => d.category)))];

  const filteredDishes = dishCategoryFilter === 'all'
    ? dishes
    : dishes.filter(d => d.category === dishCategoryFilter);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in py-2">
      
      {/* Back button and navigation locator bar */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-black text-gray-500 hover:text-rose-brand bg-gray-soft p-2 px-3.5 rounded-full transition-all cursor-pointer border border-gray-100 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại chợ
        </button>
        <span className="text-xs text-gray-300">/</span>
        <span className="text-xs font-bold text-gray-400 capitalize max-w-[150px] sm:max-w-none truncate">{stall.name}</span>
      </div>

      {/* Hero Cover Header */}
      <div className="relative rounded-3xl overflow-hidden border border-rose-100 shadow-lg bg-white">
        <div className="h-48 sm:h-64 relative bg-gray-200">
          <img
            src={stall.banner}
            alt={stall.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        {/* Text information overlays */}
        <div className="p-6 sm:p-8 relative -mt-12 sm:-mt-16 bg-white rounded-t-3xl border-t border-rose-100/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-rose-brand-light text-rose-brand border border-rose-100 rounded-full">
                {stall.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight select-none">
                {stall.name}
              </h2>
              
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3.5 text-xs text-gray-400 font-semibold">
                <p className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-rose-brand shrink-0" /> {stall.address}
                </p>
                <p className="hidden sm:flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-gray-400" /> Ki-ốt phân bổ sảnh chính Chợ
                </p>
              </div>
            </div>

            {/* Overall Rating summaries */}
            <div className="flex items-center gap-3 bg-rose-brand-light/40 border border-rose-100 rounded-2xl p-4.5 shrink-0 w-fit self-start sm:self-center">
              <div className="text-center pr-3 border-r border-rose-100">
                <span className="text-[10px] uppercase font-black tracking-wider text-gray-400 block mb-0.5">Xếp hạng</span>
                <span className="text-2xl font-black text-rose-brand tracking-tight flex items-center gap-1">
                  <Star className="w-5.5 h-5.5 fill-rose-brand text-rose-brand shrink-0" /> {stall.rating.toFixed(1)}
                </span>
              </div>
              <div className="text-center pl-1">
                <span className="text-[10px] uppercase font-black tracking-wider text-gray-400 block mb-0.5">Yêu thích</span>
                <span className="text-sm font-bold text-charcoal font-black">{stall.reviewsCount || dishes.length * 3}+</span>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm font-medium leading-relaxed text-gray-400/90 mt-5 border-t border-rose-100/40 pt-4.5 max-w-4xl">
            {stall.description}
          </p>
        </div>
      </div>

      {/* Menu Sections and item list */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100/70 pb-4">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-rose-brand" />
            <h3 className="text-md sm:text-lg font-extrabold text-charcoal">Thực đơn đặc hữu ({dishes.length})</h3>
          </div>

          {/* Categories Chips filters within Stall */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none shrink-0 text-xs">
            {dishCategories.map((catName) => (
              <button
                key={catName}
                onClick={() => setDishCategoryFilter(catName)}
                className={`px-3.5 py-1.5 font-bold rounded-full border shrink-0 transition-all cursor-pointer ${
                  dishCategoryFilter === catName
                    ? 'bg-charcoal text-white border-charcoal'
                    : 'bg-white text-gray-400 border-gray-100 hover:text-charcoal'
                }`}
              >
                {catName === 'all' ? 'Tất cả món' : catName}
              </button>
            ))}
          </div>
        </div>

        {/* Dishes list grid */}
        {filteredDishes.length === 0 ? (
          <div className="text-center py-16 px-4 bg-gray-soft rounded-3xl border border-gray-100 text-gray-400 text-xs font-semibold">
            Chưa có món nào thuộc danh mục này trong quán ăn. Thử xem các danh mục khác nhé!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map((dish) => (
              <div
                key={dish.id}
                onClick={() => onDishClick(dish)}
                className="group bg-white rounded-3xl border border-rose-100/50 shadow-xs hover:shadow-xl hover:border-rose-100 cursor-pointer overflow-hidden transition-all flex flex-col justify-between"
              >
                {/* Visual Cover image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3.5 left-3.5 px-2.5 py-0.5 bg-white/90 text-charcoal text-[9px] font-black uppercase tracking-wider rounded-full shadow-sm border border-rose-100/20">
                    {dish.category}
                  </div>
                </div>

                {/* Info Text Card */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-black text-charcoal truncate tracking-tight group-hover:text-rose-brand transition-colors">
                      {dish.name}
                    </h4>
                    
                    <div className="flex items-center gap-1 mt-0.5 text-[11px] font-bold text-charcoal">
                      <Star className="w-3.5 h-3.5 fill-rose-brand text-rose-brand" />
                      <span>{dish.rating.toFixed(1)}</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-400">{dish.reviewsCount || 1} đánh giá</span>
                    </div>

                    <p className="text-xs text-gray-400/90 leading-relaxed max-w-sm line-clamp-2">
                      {dish.description}
                    </p>
                  </div>

                  {/* Pricing footer details */}
                  <div className="pt-3 border-t border-rose-500/5 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Giá đặc sản</p>
                      <p className="text-sm font-black text-rose-brand font-mono mt-0.5">
                        {dish.price.toLocaleString('vi-VN')}₫
                      </p>
                    </div>

                    <span className="w-8 h-8 rounded-full bg-rose-brand-light text-rose-brand group-hover:bg-rose-brand group-hover:text-white flex items-center justify-center shadow-sm group-hover:shadow transition-all duration-300 active:scale-90">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
