
'use client'
import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { useViewStore } from "@/stores/useViewStore";

export default function Flyto() {
  const map = useMap();
  const { selectedCategoryId, categories } = useViewStore();

  useEffect(() => {
    if (selectedCategoryId) {
      const activeCategory = categories.find(c => c.id === selectedCategoryId);
      if (activeCategory) {
        map.flyTo(activeCategory.position, activeCategory.zoomLevel || 13, { duration: 2 });
      }
    } else {
      // Tọa độ mặc định khi không chọn cái nào (Zoom out toàn bộ)
      map.flyTo([14, 107], 6, { duration: 2 });
    }
  }, [selectedCategoryId, categories, map]);

  return null;
}