"use client";
import L from "leaflet";
import { Marker } from "react-leaflet";
import { useViewStore } from "@/stores/useViewStore"; 

export default function TaiXePR() {
    const openMarker = useViewStore((s) => s.openMarker);

    return (
        <Marker
            position={[11.563022, 109.013219]}
            icon={createTaiXeIcon()}
            zIndexOffset={100}
            eventHandlers={{ click: () => openMarker('market') }}
        />
    );
}

function createTaiXeIcon() {
  // Thay thế đường dẫn bằng ảnh thực tế của Chợ Phan Rang
  const imageUrl = "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=150&auto=format&fit=crop"; 

  return L.divIcon({
    className: "cho-phan-rang-leaflet-icon",
    html: `
      <div class="flex flex-col items-center" style="transform: translate(-50%, -85%);">
        
        <!-- Sóng xung kích phát sáng lan tỏa dịu nhẹ (màu Emerald/Green đại diện cho chợ/thực phẩm tươi sống) -->
        <span class="absolute bottom-2 inline-flex h-3 w-10 bg-emerald-400 opacity-25 rounded-full animate-ping"></span>

        <!-- Khung chứa chính: Hình tròn Badge cao cấp -->
        <div class="relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 
                    p-[3px] shadow-[0_8px_20px_rgba(16,185,129,0.4)]
                    transition-all duration-300 ease-in-out
                    hover:scale-115 hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(16,185,129,0.6)]
                    cursor-pointer
                    flex items-center justify-center">
          
          <!-- Lớp nền phụ trắng bo tròn tạo khoảng đệm thẩm mỹ -->
          <div class="w-full h-full bg-white rounded-full p-[2px] flex items-center justify-center overflow-hidden">
            
            <!-- Vùng chứa ảnh: Đảm bảo flexbox luôn CĂN GIỮA ảnh tuyệt đối -->
            <div class="w-full h-full rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
              <img 
                src="${imageUrl}" 
                alt="tai xe phan rang" 
                class="w-full h-full object-cover transition-transform duration-500 hover:scale-120"
              />
            </div>

          </div>

          <!-- Mũi ghim tam giác định vị nhỏ nhắn, sắc nét nối liền từ vòng tròn cắm xuống bản đồ -->
          <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-teal-600 rotate-45 z-[-1] shadow-sm"></div>
        </div>

        <!-- Nhãn tên địa danh nằm gọn gàng ngay phía dưới Marker -->
        <div class="mt-2">
          <div class="px-3 py-1 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-full shadow-md border border-slate-700/50 whitespace-nowrap">
            <p class="text-[12px] font-medium tracking-wide flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Tài xế Phan Rang
            </p>
          </div>
        </div>

      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}