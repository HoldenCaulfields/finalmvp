import React, { useState } from 'react';
import { X, Star, ShoppingBag, Plus, Minus, CheckCircle, Heart } from 'lucide-react';
import { Dish, OrderItem } from '../types';
import { ReviewSection } from './ReviewSection';

interface DishDetailsModalProps {
  dish: Dish;
  stallName: string;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: OrderItem) => void;
}

export const DishDetailsModal: React.FC<DishDetailsModalProps> = ({
  dish,
  stallName,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'reviews'>('info');

  const [dishRating, setDishRating] = useState(dish.rating);
  const [reviewsCount, setReviewsCount] = useState(dish.reviewsCount || 0);

  if (!isOpen) return null;

  const handleRatingUpdated = (avg: number, count: number) => {
    setDishRating(avg);
    setReviewsCount(count);
  };

  const incrementQty = () => setQuantity(prev => prev + 1);
  const decrementQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCartClick = () => {
    const orderItem: OrderItem = {
      dishId: dish.id,
      dishName: dish.name,
      price: dish.price,
      quantity: quantity,
      stallId: dish.stallId,
      stallName: stallName,
      image: dish.image,
    };
    onAddToCart(orderItem);
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Dark Overlay background */}
      <div 
        className="fixed inset-0 bg-charcoal/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative bg-white max-w-2xl w-full rounded-3xl shadow-2xl p-0 animate-scale-up z-10 max-h-[90vh] overflow-y-auto">
        
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-1 bg-white/80 hover:bg-rose-brand text-charcoal hover:text-white rounded-full transition-all shadow-md cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover and details */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Dish Media Column */}
          <div className="relative h-64 md:h-auto min-h-[250px] bg-gray-100">
            <img 
              src={dish.image} 
              alt={dish.name}
              className="w-full h-full object-cover rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none"
            />
            
            {/* Tag Category overlay */}
            <div className="absolute top-4 left-4 inline-block bg-charcoal text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
              {dish.category}
            </div>
            
            <button className="absolute bottom-4 right-4 p-2 bg-white/90 rounded-full hover:bg-rose-brand-light hover:text-rose-brand transition-colors text-gray-500 shadow shadow-rose-200">
              <Heart className="w-4 h-4 fill-current" />
            </button>
          </div>

          {/* Dish Text description and Cart inputs Column */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div className="space-y-2">
              <p className="text-[11px] font-black text-rose-brand uppercase tracking-widest">{stallName}</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-charcoal leading-tight tracking-tight">
                {dish.name}
              </h3>
              
              <div className="flex items-center gap-1.5 py-1">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${star <= Math.round(dishRating) ? 'fill-rose-brand text-rose-brand' : 'text-gray-200'}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-charcoal">{dishRating.toFixed(1)}</span>
                <span className="text-gray-300 text-xs">|</span>
                <span className="text-xs font-semibold text-gray-400">{reviewsCount} đánh giá</span>
              </div>

              <div className="text-xl sm:text-2xl font-black text-rose-brand pt-1">
                {dish.price.toLocaleString('vi-VN')}₫
              </div>

              <p className="text-xs font-medium text-gray-400 leading-relaxed pt-2">
                {dish.description}
              </p>
            </div>

            {/* Item counts and actions container */}
            <div className="space-y-4 pt-3.5 border-t border-rose-100">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-charcoal">Chọn số lượng dĩa:</span>
                
                <div className="flex items-center gap-3 bg-gray-soft border border-gray-100 rounded-full p-1 shadow-inner">
                  <button
                    onClick={decrementQty}
                    className="w-8 h-8 rounded-full bg-white text-charcoal hover:bg-rose-brand-light hover:text-rose-brand flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-black text-charcoal min-w-[24px] text-center">{quantity}</span>
                  <button
                    onClick={incrementQty}
                    className="w-8 h-8 rounded-full bg-white text-charcoal hover:bg-rose-brand-light hover:text-rose-brand flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {showSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center justify-center gap-1.5 animate-slide-in">
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                  Đã xếp {quantity} món vào giỏ hàng thành công!
                </div>
              )}

              <button
                onClick={handleAddToCartClick}
                className="w-full py-3 bg-rose-brand text-white hover:bg-rose-brand-dark rounded-full font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition-transform active:scale-97 cursor-pointer hover:shadow-lg hover:shadow-rose-100"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                THÊM VÀO GIỎ • {(dish.price * quantity).toLocaleString('vi-VN')}₫
              </button>
            </div>

          </div>
        </div>

        {/* Tab Selection: Reviews vs Descriptions */}
        <div className="px-6 sm:px-8 border-t border-rose-100/60 pb-8 pt-5">
          <ReviewSection 
            dish={dish} 
            onDishRatingUpdated={handleRatingUpdated} 
          />
        </div>

      </div>
    </div>
  );
};
