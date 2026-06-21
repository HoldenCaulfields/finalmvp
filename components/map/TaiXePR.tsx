"use client";
import L from "leaflet";
import { Marker } from "react-leaflet";
import { useViewStore } from "@/stores/useViewStore"; 

export default function TaiXePR() {
    const openMarker = useViewStore((s) => s.openMarker);

    return (
        <Marker
            position={[11.57455, 108.98268]}
            icon={createTaiXeIcon()}
            zIndexOffset={10}
            eventHandlers={{ click: () => openMarker('driver') }}
        />
    );
}

function createTaiXeIcon() {
  return L.divIcon({
    className: "cho-phan-rang-leaflet-icon",
    html: `
      <div class="flex flex-col items-center" style="transform: translate(-50%, -85%);">
        <!-- Khung chứa chính: Hình tròn Badge cao cấp -->
        <div class="relative w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 
                    p-[3px] shadow-[0_8px_20px_rgba(16,185,129,0.4)]
                    transition-all duration-300 ease-in-out
                    hover:scale-115 hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(16,185,129,0.6)]
                    cursor-pointer
                    flex items-center justify-center">
          
          <!-- Lớp nền phụ trắng bo tròn tạo khoảng đệm thẩm mỹ -->
          <div class="w-full h-full bg-emerald-500 rounded-full p-[2px] flex items-center justify-center overflow-hidden">
            
            <!-- Vùng chứa ảnh: Đảm bảo flexbox luôn CĂN GIỮA ảnh tuyệt đối -->
            <div class="w-full h-full text-4xl font-bold rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
              🚗
            </div>

          </div>

          <!-- Mũi ghim tam giác định vị nhỏ nhắn, sắc nét nối liền từ vòng tròn cắm xuống bản đồ -->
          <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-teal-600 rotate-45 z-[-1] shadow-sm"></div>
        </div>

        <!-- Nhãn tên địa danh nằm gọn gàng ngay phía dưới Marker -->
        <div class="mt-2">
          <div class="px-3 py-1 bg-teal-100 text-teal-800 rounded-full shadow-md border border-teal-500 whitespace-nowrap">
            <p class="text-[12px] font-bold tracking-wide flex items-center gap-1.5">
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