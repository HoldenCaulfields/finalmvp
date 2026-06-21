// @/components/Map.tsx
'use client';
import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import { useViewStore } from "@/stores/useViewStore";
import Flyto from "./map/Flyto";
import { useEffect, useMemo, useRef } from "react";
import { mapCategoriesData } from "./map/markerData";
import CustomMarker from "./map/CustomMarker";
import L from 'leaflet';

export default function Map() {
  // 🔥 TỐI ƯU HIỆU NĂNG: Chia nhỏ Selectors giúp chặn đứng hiện tượng lag giật
  const categories = useViewStore((s) => s.categories);
  const selectedCategoryId = useViewStore((s) => s.selectedCategoryId);
  const setCategories = useViewStore((s) => s.setCategories);
  const selectCategory = useViewStore((s) => s.selectCategory);
  const selectSubMarker = useViewStore((s) => s.selectSubMarker);
  
  const isSelectingLocation = useViewStore((s) => s.isSelectingLocation);
  const draftLatLng = useViewStore((s) => s.draftLatLng);
  const setDraftLatLng = useViewStore((s) => s.setDraftLatLng);

  const markerRef = useRef<any>(null);

  // Khởi tạo dữ liệu gốc
  useEffect(() => {
    setCategories(mapCategoriesData);
  }, [setCategories]);

  // ✨ NÂNG CẤP UI: Thiết kế Marker Nháp "Cinematic Glass" White-Rose-Black siêu mịn
  const draftIcon = useMemo(() => L.divIcon({
    className: 'custom-draft-marker',
    html: `
      <div class="relative flex items-center justify-center w-12 h-12">
        <div class="absolute w-12 h-12 bg-rose-500/20 rounded-full animate-ping opacity-70"></div>
        <div class="absolute w-8 h-8 bg-rose-500/40 rounded-full animate-pulse"></div>
        
        <div class="relative w-6 h-6 bg-zinc-950 border-2 border-white rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(244,63,94,0.5)]">
          <div class="w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-rose-500/20"></div>
          
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-zinc-950"></div>
        </div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 28] // Căn chỉnh tâm icon chuẩn điểm nhọn của ghim
  }), []);

  const eventHandlers = useMemo(() => ({
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const latLng = marker.getLatLng();
        setDraftLatLng([latLng.lat, latLng.lng]);
      }
    },
  }), [setDraftLatLng]);

  // Lọc sẵn sub-markers để hạn chế tính toán lặp bên trong JSX
  const activeSubMarkers = useMemo(() => {
    return categories
      .filter(cat => cat.id === selectedCategoryId)
      .flatMap(cat => cat.subMarkers);
  }, [categories, selectedCategoryId]);

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col bg-zinc-100">
      <MapContainer
        center={[11.5732, 108.9931]}
        zoom={11}
        zoomControl={false}
        minZoom={3}
        className="h-full w-full"
        maxBounds={[[-85, -180], [85, 180]]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {/* Hệ thống định vị camera thông minh */}
        <Flyto />
        
        {/* Lắng nghe click chuột trên diện rộng */}
        <MapLocationPicker />

        {/* HIỂN THỊ MARKER ĐANG CHỌN (DRAFT) */}
        {isSelectingLocation && draftLatLng && (
          <Marker
            position={draftLatLng}
            icon={draftIcon}
            draggable={true}
            eventHandlers={eventHandlers}
            ref={markerRef}
          />
        )}

        {/* HIỂN THỊ CÁC DANH MỤC LỚN (MAIN) */}
        {categories.map((category) => (
          <CustomMarker
            key={category.id}
            position={category.position}
            title={category.title}
            iconType={category.iconType}
            onClick={() => selectCategory(category.id)}
          />
        ))}

        {/* HIỂN THỊ CÁC ĐIỂM CON (SUB MARKERS) */}
        {activeSubMarkers.map((sub) => (
          <CustomMarker
            key={sub.id}
            position={sub.position}
            title={sub.title}
            iconType={sub.type}
            isSubMarker={true}
            onClick={() => selectSubMarker(sub.id)}
          />
        ))}
      </MapContainer>
    </div>
  );
}

// Hợp phần xử lý click nhấp điểm trên Bản đồ tách biệt hoàn toàn
function MapLocationPicker() {
  const isSelectingLocation = useViewStore((s) => s.isSelectingLocation);
  const setDraftLatLng = useViewStore((s) => s.setDraftLatLng);

  useMapEvents({
    click(e) {
      if (isSelectingLocation) {
        setDraftLatLng([e.latlng.lat, e.latlng.lng]);
      }
    },
  });
  return null;
}