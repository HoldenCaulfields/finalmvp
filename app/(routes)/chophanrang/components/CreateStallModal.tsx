import React, { useState } from 'react';
import { X, Store, Sparkles, PlusCircle, Check, DollarSign, Image, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { Stall, Dish } from '../types';
import { useStore } from '../store/useStore';
import { uploadToCloudinary, convertFileToBase64 } from '../lib/cloudinary';
import { db } from '@/lib/firebase';

interface CreateStallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStallCreated: (newStall: Stall) => void;
  onDishCreated?: (newDish: Dish) => void;
  stallsList: Stall[]; // list of stalls owned or general to add dish
}

const CATEGORY_PRESETS = [
  'Bánh Căn',
  'Cơm Gà',
  'Bánh Xèo',
  'Hải Sản',
  'Nhậu & Đặc sản',
  'Giải Khát / Trái cây',
  'Món Ăn Vặt'
];

const PRESET_BANNERS = [
  { name: 'Cơm Gà', url: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=600' },
  { name: 'Ăn Vặt / Bánh Căn', url: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=600' },
  { name: 'Bánh Xèo', url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600' },
  { name: 'Nho Ninh Thuận', url: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&q=80&w=600' },
  { name: 'Thịt Dê Cừu', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600' },
];

export const CreateStallModal: React.FC<CreateStallModalProps> = ({
  isOpen,
  onClose,
  onStallCreated,
  onDishCreated,
  stallsList,
}) => {
  const { user, loginWithGoogle } = useAuth();
  const { cloudinaryConfig } = useStore();
  
  // Tab selector: 1 for Stall, 2 for Dish within Stall
  const [activeTab, setActiveTab] = useState<'stall' | 'dish'>('stall');
  
  // Upload and loading states
  const [isStallUploading, setIsStallUploading] = useState(false);
  const [isDishUploading, setIsDishUploading] = useState(false);

  // Stall states
  const [stallName, setStallName] = useState('');
  const [stallDesc, setStallDesc] = useState('');
  const [stallCategory, setStallCategory] = useState(CATEGORY_PRESETS[0]);
  const [stallAddress, setStallAddress] = useState('Chợ Phan Rang, Ninh Thuận');
  const [stallBanner, setStallBanner] = useState(PRESET_BANNERS[0].url);

  // Dish states
  const [dishStallId, setDishStallId] = useState('');
  const [dishName, setDishName] = useState('');
  const [dishDesc, setDishDesc] = useState('');
  const [dishPrice, setDishPrice] = useState<number>(35000);
  const [dishCategory, setDishCategory] = useState('');
  const [dishImage, setDishImage] = useState(PRESET_BANNERS[0].url);

  // Common UI states
  const [isSaving, setIsSaving] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Uploading handler for Stall Banners
  const handleStallBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsStallUploading(true);
    setErrorMsg(null);
    try {
      const secureUrl = await uploadToCloudinary(file, cloudinaryConfig.cloudName, cloudinaryConfig.preset);
      setStallBanner(secureUrl);
    } catch (err: any) {
      console.warn('Cloudinary upload failure, attempting Base64 fallback:', err);
      try {
        const base64 = await convertFileToBase64(file);
        setStallBanner(base64);
        setErrorMsg('Đã tự động nạp ảnh bằng dải nhị phân nội bộ (Base64) - bạn nên cấu hình Cloudinary chuẩn xác từ góc trang cá nhân để có link ảnh vĩnh viễn!');
      } catch (fErr) {
        setErrorMsg('Lỗi xử lý tệp ảnh. Vui lòng kiểm tra định dạng.');
      }
    } finally {
      setIsStallUploading(false);
    }
  };

  // Uploading handler for Dishes
  const handleDishImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsDishUploading(true);
    setErrorMsg(null);
    try {
      const secureUrl = await uploadToCloudinary(file, cloudinaryConfig.cloudName, cloudinaryConfig.preset);
      setDishImage(secureUrl);
    } catch (err: any) {
      console.warn('Cloudinary upload failure, attempting Base64 fallback for dish:', err);
      try {
        const base64 = await convertFileToBase64(file);
        setDishImage(base64);
        setErrorMsg('Đã nạp món ăn bằng dải màu Base64. Bạn nên cấu hình Cloudinary ở thẻ tủ đồ cá nhân để có link lâu dài.');
      } catch (fErr) {
        setErrorMsg('Lỗi nạp tệp món ăn.');
      }
    } finally {
      setIsDishUploading(false);
    }
  };

  // Filter stalls that either belong to current user or all (we show all for ease of playtesting)
  const myStalls = stallsList;

  if (!isOpen) return null;

  const handleCreateStall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg('Bạn cần đăng nhập để khởi tạo gian hàng mới!');
      return;
    }
    if (!stallName || !stallDesc || !stallAddress) {
      setErrorMsg('Vui lòng điền đầy đủ các trường thông tin bắt buộc.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    const stallId = `stall_${Date.now()}`;
    const newStall: Stall = {
      id: stallId,
      name: stallName.trim(),
      description: stallDesc.trim(),
      category: stallCategory,
      address: stallAddress.trim(),
      banner: stallBanner,
      ownerId: user.uid,
      rating: 5, // All new stalls start with 5 stars!
      reviewsCount: 0,
    };

    try {
      await setDoc(doc(db, 'stalls', stallId), {
        ...newStall,
        createdAt: new Date().toISOString()
      });
      onStallCreated(newStall);
      
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setActiveTab('dish'); // Swift transition to letting them add dishes
        setDishStallId(stallId); // Prefill added stall ID!
        setStallName('');
        setStallDesc('');
      }, 1500);

    } catch (err: any) {
      console.error("Firestore Stall writing err:", err);
      try {
        handleFirestoreError(err, OperationType.WRITE, `stalls/${stallId}`);
      } catch (fErr: any) {
        setErrorMsg(fErr.message.includes('permission') ? 'Lỗi an ninh: Bạn chưa có quyền lưu hoặc đang offline.' : fErr.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg('Bạn cần đăng nhập để thêm món ăn.');
      return;
    }
    if (!dishStallId) {
      setErrorMsg('Vui lòng chọn gian hàng bạn muốn thêm món ăn vào!');
      return;
    }
    if (!dishName || !dishDesc || !dishPrice) {
      setErrorMsg('Vui lòng hoàn thành thông tin món ăn.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    const dishId = `dish_${Date.now()}`;
    const newDish: Dish = {
      id: dishId,
      stallId: dishStallId,
      name: dishName.trim(),
      description: dishDesc.trim(),
      price: Number(dishPrice),
      image: dishImage,
      category: dishCategory.trim() || stallCategory || 'Món chính',
      rating: 5,
      reviewsCount: 0,
      ownerId: user.uid,
    };

    try {
      await setDoc(doc(db, 'dishes', dishId), newDish);
      if (onDishCreated) {
        onDishCreated(newDish);
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setDishName('');
        setDishDesc('');
        onClose();
      }, 1500);

    } catch (err: any) {
      console.error("Firestore Dish writing err:", err);
      try {
        handleFirestoreError(err, OperationType.WRITE, `dishes/${dishId}`);
      } catch (fErr: any) {
        setErrorMsg(fErr.message.includes('permission') ? 'Lỗi an ninh: Bạn chưa có quyền khởi tạo món ăn.' : fErr.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-charcoal/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Box */}
      <div className="relative bg-white max-w-lg w-full rounded-3xl shadow-2xl p-6 sm:p-8 animate-scale-up z-10 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1 text-gray-400 hover:text-rose-brand hover:bg-rose-brand-light rounded-full transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 border-b border-rose-100 pb-4 mb-5">
          <Store className="w-6 h-6 text-rose-brand animate-bounce" />
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-charcoal">Hợp Tác Xã Chợ Phan Rang</h3>
            <p className="text-xs text-gray-400">Đăng tuyển gian hàng và món ăn mới của bạn</p>
          </div>
        </div>

        {/* Tabs */}
        {!submitSuccess && (
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-soft rounded-2xl mb-6">
            <button
              onClick={() => { setActiveTab('stall'); setErrorMsg(null); }}
              className={`py-2 text-xs font-extrabold rounded-xl transition-all ${activeTab === 'stall' ? 'bg-white text-rose-brand shadow-sm' : 'text-gray-400 hover:text-charcoal'}`}
            >
              Mở Gian Hàng Mới
            </button>
            <button
              onClick={() => { setActiveTab('dish'); setErrorMsg(null); }}
              className={`py-2 text-xs font-extrabold rounded-xl transition-all ${activeTab === 'dish' ? 'bg-white text-rose-brand shadow-sm' : 'text-gray-400 hover:text-charcoal'}`}
            >
              Thêm Món Vào Quán
            </button>
          </div>
        )}

        {/* Auth Barrier */}
        {!user ? (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-rose-brand/30 mx-auto mb-4" />
            <p className="text-sm font-bold text-gray-500 leading-relaxed max-w-xs mx-auto mb-5">
              Để hạn chế rác, bạn cần đăng nhập tài khoản trước khi đăng ký mở gian hàng hoặc đăng món!
            </p>
            <button
              onClick={() => loginWithGoogle()}
              className="px-6 py-2.5 bg-rose-brand hover:bg-rose-brand-dark text-white font-black text-xs rounded-full shadow-md hover:shadow-lg transition-all"
            >
              Đăng Nhập Ngay
            </button>
          </div>
        ) : submitSuccess ? (
          /* SUCCESS STATE */
          <div className="text-center py-10 flex flex-col items-center justify-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-charcoal">Đã Đăng Ký Thành Công!</h4>
            <p className="text-xs text-gray-400 mt-1 max-w-sm px-4 leading-relaxed">
              Thông tin đang được phân bổ vào sơ đồ ki-ốt của Chợ Đêm Phan Rang Ninh Thuận. Bạn có thể kiểm tra trực tiếp ngoài bảng tin.
            </p>
          </div>
        ) : activeTab === 'stall' ? (
          /* CREATE STALL FORM */
          <form onSubmit={handleCreateStall} className="space-y-4">
            
            <div>
              <label className="text-xs font-extrabold text-charcoal block mb-1">Tên gian hàng / tên quán *</label>
              <input
                type="text"
                required
                value={stallName}
                onChange={(e) => setStallName(e.target.value)}
                placeholder="Ví dụ: Bánh Xèo Hai Bà Hải, Cơm Gà Chợ Lớn..."
                className="w-full text-xs font-semibold px-3 py-2.5 bg-gray-soft border border-gray-200 focus:outline-none focus:border-rose-brand rounded-xl placeholder:text-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-extrabold text-charcoal block mb-1">Chuyên mục đặc sản *</label>
                <select
                  value={stallCategory}
                  onChange={(e) => setStallCategory(e.target.value)}
                  className="w-full text-xs font-extrabold px-3 py-2.5 bg-gray-soft border border-gray-200 focus:outline-none focus:border-rose-brand rounded-xl"
                >
                  {CATEGORY_PRESETS.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-charcoal block mb-1">Địa chỉ ki-ốt *</label>
                <input
                  type="text"
                  required
                  value={stallAddress}
                  onChange={(e) => setStallAddress(e.target.value)}
                  placeholder="Ki-ốt 12, sảnh chính Chợ Phan Rang"
                  className="w-full text-xs font-semibold px-3 py-2.5 bg-gray-soft border border-gray-200 focus:outline-none focus:border-rose-brand rounded-xl placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-extrabold text-charcoal block mb-1">Vài dòng giới thiệu quán *</label>
              <textarea
                required
                rows={2}
                value={stallDesc}
                onChange={(e) => setStallDesc(e.target.value)}
                placeholder="Kể chút về tinh túy nguyên liệu tươi ngon hữu cơ Ninh Thuận..."
                className="w-full text-xs font-medium p-3 bg-gray-soft border border-gray-200 focus:outline-none focus:border-rose-brand rounded-xl placeholder:text-gray-400"
              />
            </div>

            {/* Banner presets choice */}
            <div>
              <label className="text-xs font-extrabold text-charcoal block mb-2 flex items-center gap-1">
                <Image className="w-3.5 h-3.5 text-rose-brand" /> Chọn ảnh bìa quán cuốn hút
              </label>
              <div className="grid grid-cols-5 gap-2 mb-3">
                {PRESET_BANNERS.map((cur) => (
                  <button
                    key={cur.name}
                    type="button"
                    onClick={() => setStallBanner(cur.url)}
                    className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${stallBanner === cur.url ? 'border-rose-brand scale-95 shadow' : 'border-transparent opacity-75 hover:opacity-100'}`}
                  >
                    <img src={cur.url} alt={cur.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] font-bold text-white py-0.5 text-center truncate">
                      {cur.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Real Cloudinary file upload wrapper */}
              <div className="relative border-2 border-dashed border-rose-100 hover:border-rose-300 p-4 rounded-2xl text-center bg-rose-50/20 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleStallBannerUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={isStallUploading}
                />
                <Upload className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-charcoal">
                  {isStallUploading ? 'Đang tống ảnh lên Cloudinary...' : '...Hoặc click để tải ảnh từ máy tính của bạn'}
                </span>
                <p className="text-[9px] text-gray-400 font-medium">Hỗ trợ PNG, JPG, WebP. Link ảnh đẩy trực tiếp lên Cloud.</p>
                {stallBanner && (stallBanner.startsWith('http://') || stallBanner.startsWith('https://')) && (
                  <div className="text-[9px] text-emerald-600 font-bold mt-1 truncate max-w-full">
                    ✔️ Link ảnh hiện tại: {stallBanner}
                  </div>
                )}
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl">{errorMsg}</div>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 bg-rose-brand text-white hover:bg-rose-brand-dark rounded-full font-bold text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isSaving ? 'ĐANG KÝ GHI...' : 'MỞ GIAN HÀNG NGAY'}
            </button>
          </form>
        ) : (
          /* CREATE DISH FORM */
          <form onSubmit={handleCreateDish} className="space-y-4">
            
            <div>
              <label className="text-xs font-extrabold text-charcoal block mb-1">Chọn gian hàng mục tiêu *</label>
              <select
                required
                value={dishStallId}
                onChange={(e) => setDishStallId(e.target.value)}
                className="w-full text-xs font-extrabold px-3 py-2.5 bg-gray-soft border border-gray-200 focus:outline-none focus:border-rose-brand rounded-xl"
              >
                <option value="">-- Chọn quán phục vụ món này --</option>
                {myStalls.map(st => (
                  <option key={st.id} value={st.id}>{st.name} [Ki-ốt: {st.address.split(',')[0]}]</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-extrabold text-charcoal block mb-1">Tên món ăn độc quyền *</label>
                <input
                  type="text"
                  required
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  placeholder="Ví dụ: Combo 10 Bánh Căn Trứng"
                  className="w-full text-xs font-semibold px-3 py-2.5 bg-gray-soft border border-gray-200 focus:outline-none focus:border-rose-brand rounded-xl placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-charcoal block mb-1">Giá bán trong Chợ (VND) *</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min={1}
                    value={dishPrice}
                    onChange={(e) => setDishPrice(Number(e.target.value))}
                    placeholder="35000"
                    className="w-full text-xs font-bold pl-8 pr-3 py-2.5 bg-gray-soft border border-gray-200 focus:outline-none focus:border-rose-brand rounded-xl placeholder:text-gray-400"
                  />
                  <span className="absolute left-3 top-3 text-xs font-bold text-gray-400">₫</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-extrabold text-charcoal block mb-1">Phân loại món *</label>
                <input
                  type="text"
                  value={dishCategory}
                  onChange={(e) => setDishCategory(e.target.value)}
                  placeholder="Điền Bánh Căn, Cơm Gà..."
                  className="w-full text-xs font-semibold px-3 py-2.5 bg-gray-soft border border-gray-200 focus:outline-none focus:border-rose-brand rounded-xl placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-charcoal block mb-1">Mã hóa chủ sở hữu</label>
                <input
                  type="text"
                  disabled
                  value={user.displayName || ''}
                  className="w-full text-xs font-bold opacity-60 px-3 py-2.5 bg-gray-200 border border-gray-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-extrabold text-charcoal block mb-1">Mô tả độ ngon (Nguyên liệu, cách chế biến) *</label>
              <textarea
                required
                rows={2}
                value={dishDesc}
                onChange={(e) => setDishDesc(e.target.value)}
                placeholder="Rưới mỡ hành thơm phức, vỏ gạo giòn, nhân tôm mực ngọt lịm..."
                className="w-full text-xs font-medium p-3 bg-gray-soft border border-gray-200 focus:outline-none focus:border-rose-brand rounded-xl placeholder:text-gray-400"
              />
            </div>

            {/* Food Presets Choice */}
            <div>
              <label className="text-xs font-extrabold text-charcoal block mb-2 flex items-center gap-1">
                <Image className="w-3.5 h-3.5 text-rose-brand" /> Click chọn ảnh món ăn chân thực
              </label>
              <div className="grid grid-cols-5 gap-2 mb-3">
                {[
                  { name: 'Gà Luộc', url: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=600' },
                  { name: 'Bánh Căn', url: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=600' },
                  { name: 'Nước Gà', url: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&q=80&w=600' },
                  { name: 'Mực Sữa', url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=600' },
                  { name: 'Mật Nho', url: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&q=80&w=600' },
                ].map((cur) => (
                  <button
                    key={cur.name}
                    type="button"
                    onClick={() => setDishImage(cur.url)}
                    className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${dishImage === cur.url ? 'border-rose-brand scale-95 shadow' : 'border-transparent opacity-75 hover:opacity-100'}`}
                  >
                    <img src={cur.url} alt={cur.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] font-bold text-white py-0.5 text-center truncate">
                      {cur.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Real Cloudinary file upload wrapper for dishes */}
              <div className="relative border-2 border-dashed border-rose-100 hover:border-rose-300 p-4 rounded-2xl text-center bg-rose-50/20 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDishImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={isDishUploading}
                />
                <Upload className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-charcoal">
                  {isDishUploading ? 'Đang gửi món lên Cloudinary...' : '...Hoặc click tải ảnh món ăn từ thư viện của bạn'}
                </span>
                <p className="text-[9px] text-gray-400 font-medium">Link ảnh lưu giữ trường tồn phục vụ đặt món nhanh chóng.</p>
                {dishImage && (dishImage.startsWith('http://') || dishImage.startsWith('https://')) && (
                  <div className="text-[9px] text-emerald-600 font-bold mt-1 truncate max-w-full">
                    ✔️ Link món ăn hiện tại: {dishImage}
                  </div>
                )}
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl">{errorMsg}</div>
            )}

            <button
              type="submit"
              disabled={isSaving || !dishStallId}
              className="w-full py-3 bg-charcoal hover:bg-rose-brand text-white rounded-full font-bold text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              {isSaving ? 'ĐANG TẢI MÓN GHI...' : 'THÊM MÓN VÀO THỰC ĐƠN'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
