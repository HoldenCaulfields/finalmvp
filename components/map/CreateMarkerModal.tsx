'use client';

import React, { useEffect, useState } from 'react';
import { useViewStore } from "@/stores/useViewStore";
import { Sparkles, Check, ShieldAlert, X, MapPin } from 'lucide-react';

export default function CreateMarkerModal() {
  // 🔥 TỐI ƯU 1: Sử dụng Selectors cô lập dữ liệu, tránh Rerender chéo
  const categories = useViewStore((s) => s.categories);
  const setCategories = useViewStore((s) => s.setCategories);
  const cancelSelection = useViewStore((s) => s.cancelSelection);
  const isCreateOpen = useViewStore((s) => s.isCreateOpen);
  const draftLatLng = useViewStore((s) => s.draftLatLng);

  // Form States (Giữ cục bộ, không đẩy lên Store chung)
  const [creationType, setCreationType] = useState<'sub' | 'main'>('sub');
  const [title, setTitle] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [selectedParentId, setSelectedParentId] = useState('');
  const [subType, setSubType] = useState('food');
  const [mainIconType, setMainIconType] = useState('startup');
  const [isSuccess, setIsSuccess] = useState(false);

  // Tự động cập nhật danh mục mặc định khi categories từ store load xong
  useEffect(() => {
    if (categories.length > 0 && !selectedParentId) {
      setSelectedParentId(categories[0].id);
    }
  }, [categories, selectedParentId]);

  // Đồng bộ tọa độ từ bản đồ vào form
  useEffect(() => {
    if (draftLatLng) {
      setLatitude(draftLatLng[0].toFixed(6));
      setLongitude(draftLatLng[1].toFixed(6));
    }
  }, [draftLatLng]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !latitude || !longitude) return;

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (creationType === 'sub') {
      const updatedCategories = categories.map(cat => {
        if (cat.id === selectedParentId) {
          return {
            ...cat,
            subMarkers: [
              ...cat.subMarkers,
              {
                id: `sub_${Date.now()}`,
                position: [lat, lng] as [number, number],
                title: title,
                type: subType
              }
            ]
          };
        }
        return cat;
      });
      setCategories(updatedCategories);
    } else {
      const newCategory = {
        id: `main_${Date.now()}`,
        title: title,
        position: [lat, lng] as [number, number],
        iconType: mainIconType as any,
        zoomLevel: 13,
        subMarkers: []
      };
      setCategories([...categories, newCategory]);
    }

    setIsSuccess(true);
    setTitle('');
    setTimeout(() => {
      setIsSuccess(false);
      cancelSelection(); 
    }, 2000);
  };

  if (!isCreateOpen) return null;

  return (
    <div className="absolute top-20 right-4 left-4 md:left-auto z-[1100] w-auto md:w-96 max-w-md animate-in fade-in slide-in-from-top-5 duration-300">
      <div className="w-full bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)] font-sans">
        
        {/* Header Form */}
        <div className="p-4 border-b border-zinc-100 bg-zinc-50/60 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900">Chi tiết địa điểm</h3>
            <p className="text-[11px] text-zinc-500 mt-0.5">Đặt tên và phân loại cho vị trí bạn vừa chọn</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full bg-rose-50 flex items-center justify-center border border-rose-100">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <button
              type="button"
              onClick={cancelSelection}
              className="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-white">
          {/* Tọa độ hiển thị */}
          <div className="p-3 bg-zinc-50 border border-zinc-200/60 rounded-xl flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-zinc-200 flex items-center justify-center shrink-0 shadow-sm">
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-[10px] font-mono uppercase font-bold text-emerald-700 tracking-wider">Tọa độ đã khóa</span>
              <span className="block text-xs font-mono text-zinc-600 truncate mt-0.5">
                {latitude ? `${latitude}, ${longitude}` : 'Chưa nhận được vị trí...'}
              </span>
            </div>
          </div>

          {/* Input Tên */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold">Tên địa điểm / Tên ghim</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={creationType === 'sub' ? "Ví dụ: Quán cơm 2K, Góc học tập..." : "Ví dụ: Cộng đồng GenZ Ninh Thuận"}
              className="w-full bg-zinc-50/50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl p-2.5 text-xs text-zinc-900 placeholder-zinc-400 outline-none transition-all"
            />
          </div>

          {/* Phân loại logic hiển thị */}
          {creationType === 'sub' ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold">Thuộc Lĩnh Vực</label>
                <select
                  value={selectedParentId}
                  onChange={(e) => setSelectedParentId(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl p-2 text-xs text-zinc-900 outline-none transition-all"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.title}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold">Loại Hình Chi Tiết</label>
                <select
                  value={subType}
                  onChange={(e) => setSubType(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl p-2 text-xs text-zinc-900 outline-none transition-all"
                >
                  <option value="food">🍲 Quán ăn / Đồ uống</option>
                  <option value="shop">🛍️ Sạp hàng / Mua sắm</option>
                  <option value="office">🏢 Văn phòng / Học tập</option>
                  <option value="student">👥 Hội nhóm / Đội nhóm</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-bold">Phong cách Biểu tượng</label>
              <select
                value={mainIconType}
                onChange={(e) => setMainIconType(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white rounded-xl p-2 text-xs text-zinc-900 outline-none transition-all"
              >
                <option value="startup">🚀 Phong cách Khởi nghiệp / Ý tưởng</option>
                <option value="market">🏪 Phong cách Cửa hàng / Thương mại</option>
                <option value="cinema">🎬 Phong cách Giải trí / Cinema</option>
                <option value="jobs">💼 Phong cách Việc làm / Doanh nghiệp</option>
              </select>
            </div>
          )}

          {/* Chọn quyền hạn phụ trợ */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold">Tùy chọn nâng cao</label>
            <div className="grid grid-cols-2 gap-1.5 bg-zinc-100 p-1 rounded-xl border border-zinc-200/40">
              <button
                type="button"
                onClick={() => setCreationType('sub')}
                className={`py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${creationType === 'sub'
                  ? 'bg-white text-zinc-900 font-black shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                📍 Điểm Thường (Miễn Phí)
              </button>
              <button
                type="button"
                onClick={() => setCreationType('main')}
                className={`py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all duration-200 flex items-center justify-center gap-1 ${creationType === 'main'
                  ? 'bg-zinc-900 text-white font-black shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                🌟 Tạo Hệ Thống Lớn
              </button>
            </div>
          </div>

          {creationType === 'main' && (
            <div className="p-3 bg-zinc-900 text-white rounded-xl flex gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
              <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="text-[11px] text-zinc-300 leading-relaxed">
                <span className="font-bold block text-white uppercase tracking-wide mb-0.5">Dành cho Nhà tài trợ / Đối tác</span>
                Khởi tạo một biểu tượng danh mục lớn độc lập trên Bản đồ của mạng lưới. Đội ngũ admin hỗ trợ xác minh nhanh chóng trong vòng 24 giờ.
              </div>
            </div>
          )}

          <hr className="border-zinc-100 my-1" />

          {isSuccess ? (
            <div className="w-full py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4" />
              {creationType === 'sub' ? 'Đã thêm điểm mới thành công!' : 'Đã gửi hồ sơ đối tác thành công!'}
            </div>
          ) : (
            <button
              type="submit"
              className={`w-full py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 active:scale-[0.98]
                ${creationType === 'sub'
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/10'
                  : 'bg-zinc-900 hover:bg-black text-white shadow-md shadow-zinc-950/10'
                }`}
            >
              {creationType === 'sub' ? 'Hoàn tất ghim vị trí' : 'Đăng ký quyền tài trợ'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}