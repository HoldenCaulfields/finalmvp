// @/components/map/Flyto.tsx
'use client';
import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { useViewStore } from "@/stores/useViewStore";

export default function Flyto() {
  const map = useMap();
  
  // Cô lập selectors để tránh re-render lặp vô hạn
  const selectedCategoryId = useViewStore((s) => s.selectedCategoryId);
  const categories = useViewStore((s) => s.categories);
  const isSelectingLocation = useViewStore((s) => s.isSelectingLocation);
  const draftLatLng = useViewStore((s) => s.draftLatLng);

  useEffect(() => {
    // ƯU TIÊN 1: Nếu đang chọn vị trí ghim, tự động phóng to vào điểm nháp để user chỉnh sửa dễ dàng
    if (isSelectingLocation && draftLatLng) {
      map.flyTo(draftLatLng, 16, { duration: 1.5 });
      return; 
    }

    // ƯU TIÊN 2: Luồng click xem danh mục cũ của bạn
    if (selectedCategoryId) {
      const activeCategory = categories.find(c => c.id === selectedCategoryId);
      if (activeCategory) {
        map.flyTo(activeCategory.position, activeCategory.zoomLevel || 13, { duration: 1.8 });
      }
    } else {
      // Tọa độ mặc định khi không chọn mục nào (Toàn cảnh khu vực miền Trung/Khánh Hòa - Ninh Thuận)
      map.flyTo([14, 108], 6, { duration: 1.8 });
    }
  }, [selectedCategoryId, categories, draftLatLng, map]);

  return null;
}