'use client';

import React, { useEffect, useState } from 'react';
import { useViewStore } from "@/stores/useViewStore";
import { useAuth } from "@/hooks/useAuth";
import { createSubMarker } from "@/services/map.services";
import { uploadImage } from "@/services/uploadimage.services";
import { THEME_CONFIGS } from "@/components/uioverlay/themeConfig";
import { Sparkles, Check, ShieldAlert, X, MapPin, Phone, Landmark, Image, Link, ExternalLink, Loader2, Upload } from 'lucide-react';

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
  const [imageUrl, setImageUrl] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [address, setAddress] = useState('');
  const [isUploading, setIsUploading] = useState(false);

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

  const fallbackImage = selectedParentId ? THEME_CONFIGS[selectedParentId]?.fallbackImages?.[0] : undefined;

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn tệp ảnh hợp lệ!");
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
    } catch (err) {
      console.error(err);
      alert("Đăng ảnh lên Cloudinary thất bại. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

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
        const normalizedExternalUrl = externalUrl.trim()
          ? externalUrl.trim().startsWith('http')
            ? externalUrl.trim()
            : `https://${externalUrl.trim()}`
          : undefined;

        const markerData = {
          categoryId: selectedParentId,
          title,
          position: [lat, lng] as [number, number],
          type: subType,
          createdBy: user.uid,
          rating: 5,
          imageUrl: imageUrl?.trim() || undefined,
          externalUrl: normalizedExternalUrl,
          address: address?.trim() || undefined,
        };

        const newDocId = await createSubMarker(markerData);
        addSubMarker(selectedParentId, { id: newDocId, ...markerData });

        setIsSuccess(true);
        setTitle('');
        setImageUrl('');
        setExternalUrl('');
        setAddress('');
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
    <div className="fixed inset-0 z-2000 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={cancelSelection}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-white border border-rose-100 overflow-hidden rounded-4xl shadow-[0_30px_80px_rgba(0,0,0,0.14)] flex flex-col max-h-[95vh]">
        <div className="shrink-0">
          {/* Header */}
          <div className="px-5 py-4 border-b border-rose-100 bg-white flex items-center justify-between">
            <div>
              <h3 className="text-sm md:text-base font-black tracking-wider text-rose-600 uppercase">
                {creationType === 'sub' ? 'Ghim Vị Trí Mới' : 'Mở Hệ Sinh Thái Riêng'}
              </h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                {creationType === 'sub' ? 'Chia sẻ tọa độ thực địa cho cộng đồng.' : 'Mở rộng bản đồ hệ sinh thái.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={cancelSelection}
                className="w-8 h-8 rounded-full bg-rose-50 border border-rose-100 hover:border-rose-200 flex items-center justify-center transition text-rose-700 hover:bg-rose-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Toggle chuyển đổi phân hệ */}
          <div className="p-4 pb-0">
            <div className="flex gap-1 p-1 bg-rose-50 rounded-2xl border border-rose-100">
              <button
                type="button"
                onClick={() => setCreationType('sub')}
                className={`flex-1 py-2 text-xs font-bold tracking-wide rounded-lg transition-all ${creationType === 'sub'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-200/60'
                    : 'text-rose-700 hover:bg-white hover:text-rose-900'
                  }`}
              >
                📍 Thêm Điểm Con
              </button>

              <button
                type="button"
                onClick={() => setCreationType('main')}
                className={`flex-1 py-2 text-xs font-bold tracking-wide rounded-lg transition-all ${creationType === 'main'
                    ? 'bg-white text-zinc-950 font-black shadow'
                    : 'text-rose-600 hover:bg-rose-100 hover:text-rose-900'
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
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-rose-600/10 border border-rose-200 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-[12px] font-medium text-zinc-700 tracking-tight">
                  {latitude ? `LAT: ${latitude} / LNG: ${longitude}` : 'Đang đợi chấm điểm trên bản đồ...'}
                </div>
              </div>

              {/* Nhập tên */}
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">
                  Tên vị trí / Tên nhóm nhỏ
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Cơm trưa SV giá rẻ Cô Năm..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-rose-100 rounded-3xl p-3 text-sm text-zinc-900 shadow-sm focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none placeholder-zinc-400 transition"
                />
              </div>

              {/* Bộ chọn danh mục */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-[10px] font-bold text-rose-700 uppercase tracking-widest block mb-1">
                    Thuộc cụm chủ đề
                  </label>
                  <select
                    value={selectedParentId}
                    onChange={(e) => setSelectedParentId(e.target.value)}
                    className="w-full p-3 rounded-3xl border border-rose-100 bg-white text-sm text-zinc-900 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        💼 {cat.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-rose-700 uppercase tracking-widest block mb-1">
                    Phân loại mô hình nhỏ
                  </label>
                  <select
                    value={subType}
                    onChange={(e) => setSubType(e.target.value)}
                    className="w-full p-3 rounded-3xl border border-rose-100 bg-white text-sm text-zinc-900 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
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

              {/* Hình ảnh / Liên kết ngoài / Địa chỉ */}
              <div className="space-y-4 pt-1">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-1">
                    <Image size={11} /> Ảnh minh họa (tuỳ chọn)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label
                      htmlFor="marker-image-upload"
                      className="flex-1 rounded-3xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 cursor-pointer hover:border-rose-400 transition"
                    >
                      <div className="flex items-center gap-2">
                        <Upload size={14} />
                        <span>Chọn ảnh</span>
                      </div>
                      <input
                        id="marker-image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isUploading}
                      />
                    </label>
                    <input
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 rounded-3xl border border-rose-100 bg-white p-3 text-sm text-zinc-900 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    Nếu không chọn ảnh, hệ thống sẽ dùng ảnh chủ đề phù hợp với cụm bạn đang chọn.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-1">
                    <Link size={11} /> Link ngoài (Shopee / YouTube / Web app...)
                  </label>
                  <input
                    type="url"
                    placeholder="https://your-shop.link"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    className="w-full rounded-3xl border border-rose-100 bg-white p-3 text-sm text-zinc-900 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-1">
                    <MapPin size={11} /> Địa chỉ / ghi chú vị trí
                  </label>
                  <input
                    type="text"
                    placeholder="Số nhà, con hẻm, tên quán..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-3xl border border-rose-100 bg-white p-3 text-sm text-zinc-900 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  />
                </div>

                {(imageUrl || fallbackImage) && (
                  <div className="rounded-3xl overflow-hidden border border-rose-100 bg-white shadow-sm">
                    <img
                      src={imageUrl || fallbackImage}
                      alt="Ảnh xem trước"
                      className="w-full h-40 object-cover"
                    />
                    <div className="px-4 py-3 bg-white flex items-center justify-between gap-2 text-[11px] text-zinc-600">
                      <span>{imageUrl ? 'Ảnh do bạn chọn' : 'Ảnh chủ đề mặc định'}</span>
                      {externalUrl && (
                        <a
                          href={externalUrl.startsWith('http') ? externalUrl : `https://${externalUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-500"
                        >
                          <ExternalLink size={12} /> Xem link
                        </a>
                      )}
                    </div>
                  </div>
                )}
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
                    className="w-full py-3 text-xs font-black tracking-widest uppercase bg-rose-600 text-white rounded-3xl transition-all shadow-[0_20px_40px_rgba(236,72,153,0.24)] disabled:bg-rose-100 disabled:text-rose-300"
                  >
                    {loading ? 'Đang mã hóa dữ liệu...' : isAuthenticated ? '⚡ Xác Nhận Xuất Bản' : '🔓 Đăng Nhập & Đăng Tải'}
                  </button>
                )}
              </div>
            </form>
          ) : (
            /* Phân hệ TẠO MAIN CATEGORY: Chuyển đổi thành Hub kết nối trực tiếp đến Founder */
            <div className="p-6 space-y-5 text-center animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto shadow-sm">
                <Landmark className="w-5 h-5 text-rose-500" />
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-rose-600">Xây dựng Không gian Tổ chức riêng?</h4>
                <p className="text-xs text-zinc-600 leading-relaxed max-w-xs mx-auto">
                  Để giữ bản đồ LovelyNet luôn sạch và tin cậy, các cụm chủ đề lớn cấp quốc gia/vùng miền cần được cấu hình hạ tầng riêng biệt.
                </p>
              </div>

              {/* Thông tin liên hệ trực tiếp của Founder */}
              <div className="bg-rose-50 border border-rose-100 rounded-3xl p-4 space-y-3 max-w-sm mx-auto">
                <p className="text-[11px] uppercase tracking-widest font-bold text-rose-700">Đường dây nóng kết nối trực tiếp</p>

                <a
                  href="tel:0793784133" // Thay bằng số điện thoại thật của bạn ở đây
                  className="flex items-center justify-center gap-2 text-rose-700 hover:text-rose-500 transition group font-mono text-base font-black tracking-wider"
                >
                  <Phone className="w-4 h-4 text-rose-500 group-hover:scale-110 transition" />
                  0793784133
                </a>

                <p className="text-[10px] text-zinc-500">
                  Hỗ trợ tích hợp Ý tưởng mới, CLB các Trường Cao đẳng / Đại Học trong vòng 24h.
                </p>
              </div>

              <div className="p-3 bg-rose-50 border border-rose-100 rounded-3xl text-[10px] text-zinc-600 flex gap-2 items-start text-left">
                <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Tính năng tự tạo chủ đề lớn trực tiếp trên giao diện sẽ được mở khóa khi dự án đạt mốc quy mô 10,000 người dùng.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

  );
}