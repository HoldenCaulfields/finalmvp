import React, { useState, useEffect } from 'react';
import { Star, MessageSquareCode, Award, Send, Check } from 'lucide-react';
import { Review, Dish } from '../types';
import { useAuth } from '../context/AuthContext';
import { handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, doc, setDoc, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ReviewSectionProps {
  dish: Dish;
  onDishRatingUpdated?: (newRating: number, newCount: number) => void;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ dish, onDishRatingUpdated }) => {
  const { user, loginWithGoogle } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Review form states
  const [starCount, setStarCount] = useState<number>(5);
  const [hoverStarCount, setHoverStarCount] = useState<number | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotif, setSuccessNotif] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dynamic real-time loading of reviews
  useEffect(() => {
    setLoading(true);
    const reviewsRef = collection(db, 'reviews');
    const q = query(
      reviewsRef, 
      where('dishId', '==', dish.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedReviews: Review[] = [];
      snapshot.forEach((docSnap) => {
        loadedReviews.push(docSnap.data() as Review);
      });
      // Sort in memory by date descending
      loadedReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setReviews(loadedReviews);
      setLoading(false);
    }, (err) => {
      console.error("Error reading reviews in real-time:", err);
      // Fallback
      setLoading(false);
    });

    return () => unsubscribe();
  }, [dish.id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    if (!user) {
      setErrorMsg('Vui lòng đăng nhập để gửi đánh giá và xếp hạng quán ăn nhé!');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const reviewId = `rev_${Date.now()}`;
    const newReview: Review = {
      id: reviewId,
      dishId: dish.id,
      userId: user.uid,
      userName: user.displayName || "Thành viên Chợ Phan Rang",
      userAvatar: user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.displayName || 'PR')}`,
      rating: starCount,
      comment: commentInput.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      // 1. Write the review into Firestore
      await setDoc(doc(db, 'reviews', reviewId), newReview);
      
      // Calculate new ratings
      const activeRatings = [...reviews.map(r => r.rating), starCount];
      const newAverage = parseFloat((activeRatings.reduce((sum, r) => sum + r, 0) / activeRatings.length).toFixed(1));
      
      // 2. Upward update Dish metadata in Firestore so ratings stay persistent in database
      const dishRef = doc(db, 'dishes', dish.id);
      await setDoc(dishRef, {
        ...dish,
        rating: newAverage,
        reviewsCount: activeRatings.length
      });

      // Notify parent to adjust UI-state
      if (onDishRatingUpdated) {
        onDishRatingUpdated(newAverage, activeRatings.length);
      }

      setCommentInput('');
      setStarCount(5);
      setSuccessNotif(true);
      setTimeout(() => setSuccessNotif(false), 3000);
    } catch (err: any) {
      console.error("Review posting error:", err);
      try {
        handleFirestoreError(err, OperationType.WRITE, `reviews/${reviewId}`);
      } catch (fErr: any) {
        setErrorMsg(`Lỗi đăng đánh giá: ${fErr.message.includes('permission') ? 'Vui lòng xác minh thông tin đăng nhập của bạn.' : fErr.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Distribution scoring
  const starDistribution = [0, 0, 0, 0, 0];
  reviews.forEach(r => {
    const idx = Math.min(Math.max(Math.round(r.rating) - 1, 0), 4);
    starDistribution[idx]++;
  });

  return (
    <div className="space-y-6 pt-2">
      <div className="flex items-center justify-between border-b border-rose-100 pb-3">
        <h3 className="text-md sm:text-lg font-extrabold text-charcoal flex items-center gap-1.5">
          <MessageSquareCode className="w-5 h-5 text-rose-brand" /> Đánh giá tử tế ({reviews.length})
        </h3>
        <span className="text-[11px] font-bold uppercase tracking-wider text-rose-brand flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-rose-brand" /> 100% người ăn thật
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-rose-brand-light/40 border border-rose-100 p-5 rounded-2xl">
        {/* Sum of statistics */}
        <div className="md:col-span-4 text-center border-r-0 md:border-r border-rose-100/60 pr-0 md:pr-4">
          <div className="text-5xl font-black text-rose-brand tracking-tight">
            {reviews.length > 0 
              ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
              : dish.rating.toFixed(1)}
          </div>
          
          <div className="flex items-center justify-center gap-0.5 mt-2.5">
            {[1, 2, 3, 4, 5].map((star) => {
              const score = reviews.length > 0 
                ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) 
                : dish.rating;
              return (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= Math.round(score) ? 'fill-rose-brand text-rose-brand' : 'text-gray-300'}`}
                />
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-2 font-semibold">Tất cả xếp hạng trên Chợ</p>
        </div>

        {/* Distributed Progress Bar charts */}
        <div className="md:col-span-8 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = starDistribution[stars - 1];
            const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500 w-3 tracking-wide">{stars}</span>
                <Star className="w-3 h-3 fill-rose-brand text-rose-brand shrink-0" />
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-brand rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 font-mono w-6 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write a review Section */}
      <div className="bg-white border border-rose-100 p-5 rounded-2xl shadow-xs">
        {user ? (
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <h4 className="text-sm font-extrabold text-charcoal">Chia sẻ trải nghiệm ăn của bạn</h4>
            
            {/* Star inputs */}
            <div className="flex items-center gap-2 bg-rose-brand-light/50 border border-rose-100/60 w-fit px-4 py-2.5 rounded-xl">
              <span className="text-xs font-bold text-charcoal pr-1.5">Mức độ ngon:</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setStarCount(star)}
                    onMouseEnter={() => setHoverStarCount(star)}
                    onMouseLeave={() => setHoverStarCount(null)}
                    className="focus:outline-none cursor-pointer transition-transform duration-100 hover:scale-110"
                  >
                    <Star
                      className={`w-5.5 h-5.5 ${
                        (hoverStarCount !== null ? star <= hoverStarCount : star <= starCount)
                          ? 'fill-rose-brand text-rose-brand'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-rose-brand pl-2 w-16">
                {starCount === 5 ? 'Quá ngon!' : starCount === 4 ? 'Ngon lành!' : starCount === 3 ? 'Bình thường' : starCount === 2 ? 'Tạm ổn' : 'Rất tệ'}
              </span>
            </div>

            {/* Comment Area */}
            <div className="relative">
              <textarea
                rows={3}
                required
                maxLength={500}
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Thịt gà có thơm dai giòn không? Nước mắm ăn bánh căn ngon không? Để lại đánh giá cho mọi người ghé mua nhé..."
                className="w-full text-xs font-medium p-3.5 bg-gray-soft border border-gray-200 focus:outline-none focus:border-rose-brand focus:ring-1 focus:ring-rose-brand rounded-xl placeholder:text-gray-400"
              />
              <span className="absolute bottom-2.5 right-3 text-[10px] text-gray-400 font-mono">
                {commentInput.length}/500
              </span>
            </div>

            {/* Submit responses */}
            {successNotif && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-xl shadow-xs border border-emerald-100 animate-slide-in">
                <Check className="w-4 h-4 bg-emerald-500 text-white rounded-full p-0.5" />
                Cảm ơn bạn! Đánh giá đã được ghim trực tiếp lên Chợ Phan Rang.
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl">
                {errorMsg}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !commentInput.trim()}
                className="px-5 py-2.5 bg-rose-brand text-white hover:bg-rose-brand-dark rounded-full font-bold text-xs tracking-wide flex items-center justify-center gap-1.5 transition-all cursor-pointer transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'Đang tải lên...' : 'Gửi Đánh Giá'}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4 px-3 bg-gray-soft rounded-2xl border border-gray-100">
            <p className="text-xs text-gray-400 leading-relaxed font-semibold">
              Bạn muốn để lại bình chọn 5 sao cho món ăn này?
            </p>
            <button
              onClick={() => loginWithGoogle()}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 border border-rose-100 bg-white hover:bg-rose-brand-light text-rose-brand font-bold text-xs rounded-full shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <Star className="w-4 h-4 text-rose-brand" /> Đăng nhập để đánh giá
            </button>
          </div>
        )}
      </div>

      {/* Reviews Comments list */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="animate-pulse flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-2.5 bg-gray-200 rounded w-1/4" />
                  <div className="h-2 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-rose-100 rounded-2xl bg-gray-soft/50 text-gray-400 text-xs">
            Chưa có đánh giá nào cho món ăn này. Bạn sẽ là người đầu tiên thưởng thức chứ?
          </div>
        ) : (
          <div className="space-y-3.5">
            {reviews.map((rev) => (
              <div 
                key={rev.id} 
                className="p-4 rounded-2xl bg-white border border-rose-100/50 shadow-xs hover:border-rose-100 transition-colors flex items-start gap-3"
              >
                <img
                  referrerPolicy="no-referrer"
                  src={rev.userAvatar}
                  alt={rev.userName}
                  className="w-10 h-10 rounded-full shrink-0 border border-rose-200 shadow-xs"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2.5">
                    <h5 className="text-xs sm:text-sm font-black text-charcoal truncate">{rev.userName}</h5>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  {/* Stars given */}
                  <div className="flex items-center gap-0.5 mt-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= rev.rating ? 'fill-rose-brand text-rose-brand' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>

                  {/* Comment context */}
                  <p className="text-xs text-charcoal/80 font-semibold leading-relaxed mt-2.5 whitespace-pre-line">
                    {rev.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
