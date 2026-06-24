import { useEffect, useState } from "react";

interface SubMarkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  subMarkerData: {
    id: string;
    title: string;
    position: [number, number]; // [latitude, longitude]
    type?: string;
    rating?: number;
    imageUrl?: string; // Thêm trường ảnh nền tùy chọn
    address?: string;  // Thêm trường địa chỉ hiển thị thay cho tọa độ thô
  } | null;
}

export default function SubMarkerModal({ isOpen, onClose, subMarkerData }: SubMarkerModalProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Một chút delay nhỏ giúp hiệu ứng mượt mà hơn khi modal mount
      const timer = setTimeout(() => setAnimate(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
    }
  }, [isOpen]);

  if (!isOpen || !subMarkerData) return null;

  // Hàm điều hướng sang Google Maps bằng Tọa độ
  const handleDirectionsClick = () => {
    const [lat, lng] = subMarkerData.position;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleViewDetails = () => {
    // Logic xử lý khi bấm nút xem chi tiết (ví dụ: chuyển trang hoặc mở rộng modal)
    console.log("Xem chi tiết địa điểm:", subMarkerData.id);
  };

  return (
    <div className="absolute inset-0 z-[3000] flex items-end md:items-center md:justify-center p-0 md:p-4 bg-zinc-900/20 backdrop-blur-[2px] transition-opacity duration-300">
      {/* Backdrop nền mờ */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Thân Modal */}
      <div
        className={`relative w-full md:max-w-md bg-white shadow-[0_24px_60px_-15px_rgba(244,63,94,0.12),0_12px_40px_-20px_rgba(0,0,0,0.15)] rounded-t-[28px] md:rounded-[24px] overflow-hidden flex flex-col transition-all duration-500 transform cubic-bezier(0.34, 1.56, 0.64, 1)
          ${animate ? "translate-y-0 opacity-100" : "translate-y-full md:translate-y-8 md:opacity-0"}
        `}
      >
        {/* Thanh gờ kéo trên Mobile (Vuốt/Kéo giả lập) */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/60 backdrop-blur-md rounded-full z-10 md:hidden" onClick={onClose} />

        {/* Khu vực Hình ảnh Background & Header tích hợp */}
        <div className="relative h-48 w-full bg-rose-50 overflow-hidden flex-shrink-0">
          <img
            src={subMarkerData.imageUrl || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&auto=format&fit=crop"} 
            alt={subMarkerData.title}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
          />
          {/* Lớp gradient đè để text hoặc nút back nổi bật hơn */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          
          {/* Nút Đóng (Góc trên phải ảnh) */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-md text-zinc-700 hover:text-rose-600 hover:bg-white transition-all shadow-sm active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Badge loại địa điểm đè lên ảnh */}
          <div className="absolute bottom-4 left-5">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-rose-500 text-white uppercase tracking-wider shadow-sm">
              {subMarkerData.type || "Địa điểm"}
            </span>
          </div>
        </div>

        {/* Nội dung chi tiết */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[50vh]">
          {/* Tiêu đề & Đánh giá */}
          <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-extrabold text-zinc-900 leading-snug tracking-tight">
                {subMarkerData.title}
              </h3>
              
              {subMarkerData.rating && (
                <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-lg flex-shrink-0">
                  <span className="text-amber-500 font-bold text-xs">★</span>
                  <span className="text-amber-700 font-bold text-xs">{subMarkerData.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* Hiển thị địa chỉ thân thiện thay vì Lat/Lng */}
            <p className="text-sm text-zinc-500 leading-relaxed">
              {subMarkerData.address || "Nhấn chỉ đường để xem vị trí chi tiết trên bản đồ."}
            </p>
          </div>
        </div>

        {/* Thanh Action điều hướng & tác vụ */}
        <div className="p-5 bg-zinc-50/80 border-t border-zinc-100/80 flex flex-col sm:flex-row gap-2.5">
          {/* Nút Xem chi tiết - Tone Trắng viền Rose thanh lịch */}
          <button
            onClick={handleViewDetails}
            className="flex-1 px-4 py-3 bg-white border border-rose-200 text-rose-600 text-sm font-bold rounded-xl hover:bg-rose-50 hover:border-rose-300 active:scale-[0.98] transition-all text-center"
          >
            Xem chi tiết
          </button>

          {/* Nút Chỉ đường - Tone Đen/Rose cá tính */}
          <button
            onClick={handleDirectionsClick}
            className="flex-1 px-4 py-3 bg-zinc-950 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-[0_8px_20px_-6px_rgba(9,9,11,0.3)] flex items-center justify-center gap-2 group"
          >
            <svg className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5M3 12h16.5" />
            </svg>
            Chỉ đường (Maps)
          </button>
        </div>
      </div>
    </div>
  );
}