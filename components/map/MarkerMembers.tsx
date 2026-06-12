import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Star, MapPin, Phone, Clock } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// 1. Định nghĩa kiểu dữ liệu cho Quán ăn / Đồ uống
interface FoodLocation {
  id: string;
  name: string;
  type: 'food' | 'drink';
  lat: number;
  lng: number;
  rating: number; // Ví dụ: 4.5, 5.0
  address: string;
  phone?: string;
  openTime?: string;
}

// 2. Mock Data mẫu (Tọa độ ví dụ tại TP.HCM)
const MOCK_LOCATIONS: FoodLocation[] = [
  {
    id: '1',
    name: 'Phở Chào Bạn',
    type: 'food',
    lat: 11.565,
    lng: 108.989,
    rating: 4.8,
    address: '123 Ngô Gia Tự, Phan Rang–Tháp Chàm, Ninh Thuận',
    phone: '0901.234.567',
    openTime: '06:00 - 22:00',
  },
  {
    id: '2',
    name: 'The Modern Coffee',
    type: 'drink',
    lat: 11.563,
    lng: 108.985,
    rating: 4.2,
    address: '45 Thống Nhất, Phan Rang–Tháp Chàm',
    phone: '028.3333.4444',
    openTime: '07:00 - 23:00',
  },
  {
    id: '3',
    name: 'Bánh Mì & Trà Đá Sài Gòn',
    type: 'food',
    lat: 11.568,
    lng: 108.992,
    rating: 5.0,
    address: '88 16 Tháng 4, Phan Rang–Tháp Chàm, Ninh Thuận',
    openTime: '24/7',
  }
];

// 3. Hàm tạo Custom Marker siêu đẹp bằng Tailwind CSS
const createCustomIcon = (type: 'food' | 'drink', rating: number) => {
  const isFood = type === 'food';

  // Định nghĩa màu sắc hiện đại
  const bgColor = isFood ? 'bg-rose-500' : 'bg-amber-500';
  const shadowColor = isFood ? 'shadow-rose-200' : 'shadow-amber-200';

  // HTML String sử dụng Tailwind để render marker phẳng kèm badge số sao
  const iconHtml = `
    <div class="relative flex flex-col items-center group">
      <div class="${bgColor} ${shadowColor} text-xl shadow-lg text-white w-10 h-10 rounded-full flex items-center justify-center border-2 border-white transition-transform duration-200 group-hover:scale-110">
        ${isFood
      ? '🍲' 
      : '🥤' 
    }
      </div>
      
      <div class="absolute -top-2 -right-2 bg-slate-900 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 border border-slate-700 shadow-sm">
        <span>${rating.toFixed(1)}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
      </div>

      <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] ${isFood ? 'border-t-rose-500' : 'border-t-amber-500'} -mt-[1px]"></div>
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-leaflet-marker', // Xóa class mặc định của leaflet để tránh lỗi vỡ layout
    iconSize: [40, 46],
    iconAnchor: [20, 46], // Điểm neo ở chính giữa đáy mũi tên
    popupAnchor: [0, -46], // Popup xuất hiện ngay trên đầu marker
  });
};

export default function FoodMap() {
  // Helper render số sao trong Popup dưới dạng các ngôi sao màu vàng
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    return (
      <div className="flex items-center gap-0.5 text-amber-400">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={14}
            className={index < fullStars ? 'fill-amber-400' : 'text-gray-300'}
          />
        ))}
        <span className="text-xs font-semibold text-gray-600 ml-1">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <>
      {MOCK_LOCATIONS.map((location) => {
        // Tối ưu: Memoize các icon để tránh re-render không cần thiết
        const customIcon = createCustomIcon(location.type, location.rating);

        return (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={customIcon}
          >
            {/* Popup được Custom lại theo UI hiện đại, tối giản */}
            <Popup maxWidth={280} className="custom-popup">
              <div className="p-1 font-sans text-gray-800">
                {/* Tiêu đề & Loại hình */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-bold text-sm text-gray-900 m-0 leading-tight">
                    {location.name}
                  </h3>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider text-white shrink-0 ${location.type === 'food' ? 'bg-rose-500' : 'bg-amber-500'
                    }`}>
                    {location.type === 'food' ? 'Món ăn' : 'Đồ uống'}
                  </span>
                </div>

                {/* Đánh giá sao */}
                <div className="mb-2">
                  {renderStars(location.rating)}
                </div>

                {/* Thông tin chi tiết */}
                <div className="space-y-1 text-xs text-gray-600 border-t border-gray-100 pt-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-gray-400 shrink-0" />
                    <span className="truncate">{location.address}</span>
                  </div>

                  {location.openTime && (
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-gray-400 shrink-0" />
                      <span>{location.openTime}</span>
                    </div>
                  )}

                  {location.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone size={12} className="text-gray-400 shrink-0" />
                      <a href={`tel:${location.phone}`} className="text-blue-500 hover:underline">
                        {location.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}