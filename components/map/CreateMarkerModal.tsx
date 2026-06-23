'use client';

import React, { useEffect, useState } from 'react';
import { useViewStore } from "@/stores/useViewStore";
import { useAuth } from "@/hooks/useAuth";
import { createSubMarker } from "@/services/map.services";
import { Sparkles, Check, ShieldAlert, X, MapPin, Phone, Landmark } from 'lucide-react';

export default function CreateMarkerModal() {
  const categories = useViewStore((s) => s.categories);
  const cancelSelection = useViewStore((s) => s.cancelSelection);
  const isCreateOpen = useViewStore((s) => s.isCreateOpen);
  const draftLatLng = useViewStore((s) => s.draftLatLng);
  const addSubMarker = useViewStore((s) => s.addSubMarker);

  const { isAuthenticated, user, login } = useAuth();

  const [creationType, setCreationType] = useState<'sub' | 'main'>('sub');
  const [title, setTitle] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [selectedParentId, setSelectedParentId] = useState('');
  const [subType, setSubType] = useState('food');
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Đồng bộ danh mục mặc định ban đầu
  useEffect(() => {
    if (categories.length > 0 && !selectedParentId) {
      setSelectedParentId(categories[0].id);
    }
  }, [categories, selectedParentId]);

  // Nhận tọa độ được chấm từ bản đồ
  useEffect(() => {
    if (draftLatLng) {
      setLatitude(draftLatLng[0].toFixed(6));
      setLongitude(draftLatLng[1].toFixed(6));
    }
  }, [draftLatLng]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !latitude || !longitude) return;

    // UX TRẢI NGHIỆM GẮN KẾT: Nếu chưa đăng nhập, ép trigger popup login tại bước cuối
    if (!isAuthenticated) {
      alert("📍 Vị trí của bạn đã được ghi nhận! Hãy đăng nhập bằng Google nhanh để lưu điểm ghim này vào hệ thống.");
      await login();
      return;
    }

    setLoading(true);
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    try {
      if (creationType === 'sub' && user) {
        const markerData = {
          categoryId: selectedParentId,
          title,
          position: [lat, lng] as [number, number],
          type: subType,
          createdBy: user.uid,
          rating: 5 // Mặc định điểm mới khởi tạo đạt 5 sao từ người tạo
        };

        const newDocId = await createSubMarker(markerData);
        
        // Đẩy ngay lập tức vào bộ nhớ cache local để bản đồ render realtime không cần reload
        addSubMarker(selectedParentId, { id: newDocId, ...markerData });

        setIsSuccess(true);
        setTitle('');
        setTimeout(() => {
          setIsSuccess(false);
          cancelSelection();
        }, 2000);
      }
    } catch (error) {
      console.error("Gặp sự cố khi lưu điểm ghim mới:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isCreateOpen) return null;

  return (
    <div className="fixed inset-x-0 top-20 px-3 md:absolute md:top-6 md:right-6 md:left-auto md:px-0 z-2000 flex justify-center md:block">
      <div className="w-full max-w-lg md:w-96 animate-in fade-in slide-in-from-top-5 duration-300">
        
        {/* Container phong cách Cinematic (Nền đen đặc, phủ mờ kính cường lực, viền ánh hồng nhạt) */}
        <div className="bg-zinc-950/90 backdrop-blur-xl border border-rose-500/20 rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-white">
          
          {/* Header */}
          <div className="p-5 border-b border-zinc-900 bg-zinc-900/40 flex items-center justify-between">
            <div>
              <h3 className="text-sm md:text-base font-black tracking-wider text-rose-100 uppercase">
                {creationType === 'sub' ? 'Ghim Vị Trí Mới' : 'Mở Hệ Sinh Thái Riêng'}
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {creationType === 'sub' ? 'Chia sẻ tọa độ thực địa cho cộng đồng.' : 'Mở rộng bản đồ hệ sinh thái.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={cancelSelection}
                className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 flex items-center justify-center transition text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Toggle chuyển đổi phân hệ */}
          <div className="p-4 pb-0">
            <div className="flex p-1 bg-zinc-900 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setCreationType('sub')}
                className={`flex-1 py-2 text-xs font-bold tracking-wide rounded-lg transition-all ${
                  creationType === 'sub'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                📍 Thêm Điểm Con
              </button>

              <button
                type="button"
                onClick={() => setCreationType('main')}
                className={`flex-1 py-2 text-xs font-bold tracking-wide rounded-lg transition-all ${
                  creationType === 'main'
                    ? 'bg-white text-zinc-950 font-black shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                🌟 Đề Xuất Cụm Lớn
              </button>
            </div>
          </div>

          {/* Nội dung Form tương ứng */}
          {creationType === 'sub' ? (
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Box tọa độ thu gọn sắc nét */}
              <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-zinc-950 border border-rose-500/30 flex items-center justify-center shadow-inner">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                </div>
                <div className="text-[11px] font-mono text-zinc-400 tracking-tight">
                  {latitude ? `LAT: ${latitude} / LNG: ${longitude}` : 'Đang đợi chấm điểm trên bản đồ...'}
                </div>
              </div>

              {/* Nhập tên */}
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                  Tên vị trí / Tên nhóm nhỏ
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Cơm trưa SV giá rẻ Cô Năm..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none placeholder-zinc-600 transition"
                />
              </div>

              {/* Bộ chọn danh mục */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                    Thuộc cụm chủ đề
                  </label>
                  <select
                    value={selectedParentId}
                    onChange={(e) => setSelectedParentId(e.target.value)}
                    className="w-full p-3 rounded-xl border border-zinc-800 bg-zinc-900 text-sm text-rose-100 outline-none focus:border-rose-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        💼 {cat.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                    Phân loại mô hình nhỏ
                  </label>
                  <select
                    value={subType}
                    onChange={(e) => setSubType(e.target.value)}
                    className="w-full p-3 rounded-xl border border-zinc-800 bg-zinc-900 text-sm text-zinc-100 outline-none focus:border-rose-500"
                  >
                    <option value="food">🍲 Điểm Ăn uống / Căn tin</option>
                    <option value="shop">🛍️ Tiệm tạp hóa / Mua sắm giá SV</option>
                    <option value="office">🏢 Không gian làm việc / Khởi nghiệp</option>
                    <option value="student">👥 Hội nhóm / Câu lạc bộ kỹ năng</option>
                    <option value="station">🏍️ Trạm dừng chân / Điểm xe đêm</option>
                    <option value="craft">🏺 Làng nghề / Điểm văn hóa</option>
                  </select>
                </div>
              </div>

              {/* Nút Submit điều khiển trạng thái */}
              <div className="pt-2">
                {isSuccess ? (
                  <div className="py-2.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 rounded-xl text-xs font-bold flex justify-center items-center gap-2">
                    <Check className="w-4 h-4" />
                    Đã đồng bộ thực địa thành công!
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !latitude}
                    className="w-full py-3 text-xs font-black tracking-widest uppercase bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-white rounded-xl transition-all shadow-lg shadow-rose-950/50"
                  >
                    {loading ? 'Đang mã hóa dữ liệu...' : isAuthenticated ? '⚡ Xác Nhận Xuất Bản' : '🔓 Đăng Nhập & Đăng Tải'}
                  </button>
                )}
              </div>
            </form>
          ) : (
            /* Phân hệ TẠO MAIN CATEGORY: Chuyển đổi thành Hub kết nối trực tiếp đến Founder */
            <div className="p-6 space-y-5 text-center animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto shadow-inner">
                <Landmark className="w-5 h-5 text-rose-400" />
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-rose-200">Xây dựng Không gian Tổ chức riêng?</h4>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
                  Để giữ bản đồ LovelyNet luôn sạch và tin cậy, các cụm chủ đề lớn cấp quốc gia/vùng miền cần được cấu hình hạ tầng riêng biệt.
                </p>
              </div>

              {/* Thông tin liên hệ trực tiếp của Founder */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3 max-w-sm mx-auto">
                <p className="text-[11px] uppercase tracking-widest font-bold text-zinc-500">Đường dây nóng kết nối trực tiếp</p>
                
                <a 
                  href="tel:0793784133" // Thay bằng số điện thoại thật của bạn ở đây
                  className="flex items-center justify-center gap-2 text-rose-400 hover:text-rose-300 transition group font-mono text-base font-black tracking-wider"
                >
                  <Phone className="w-4 h-4 text-rose-500 group-hover:scale-110 transition" />
                  0793784133
                </a>
                
                <p className="text-[10px] text-zinc-500">
                  Hỗ trợ tích hợp Ý tưởng mới, CLB các Trường Cao đẳng / Đại Học trong vòng 24h.
                </p>
              </div>

              <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-[10px] text-zinc-400 flex gap-2 items-start text-left">
                <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Tính năng tự tạo chủ đề lớn trực tiếp trên giao diện sẽ được mở khóa khi dự án đạt mốc quy mô 10,000 người dùng.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}