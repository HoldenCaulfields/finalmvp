import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import { useViewStore } from "../stores/useViewStore";
import Flyto from "./map/Flyto";
import { useEffect, useMemo, useRef, useState } from "react";
import { mapCategoriesData } from "./map/markerData"; // Giữ file này làm bộ khung chính
import CustomMarker from "./map/CustomMarker";
import { fetchSubMarkersByCategory } from "@/services/map.services"; // Import service Firebase
import L from 'leaflet';

export default function Map() {
  const categories = useViewStore((s) => s.categories);
  const selectedCategoryId = useViewStore((s) => s.selectedCategoryId);
  const selectedFilterId = useViewStore((s) => s.selectedFilterId);
  
  const setCategories = useViewStore((s) => s.setCategories);
  const selectCategory = useViewStore((s) => s.selectCategory);
  const selectSubMarker = useViewStore((s) => s.selectSubMarker);
  
  // State quản lý bộ nhớ đệm (Cache) cục bộ cho các sub markers đã fetch từ Firebase
  const [subMarkersCache, setSubMarkersCache] = useState<Record<string, any[]>>({});
  const [isFetchingSubs, setIsFetchingSubs] = useState(false);

  const isSelectingLocation = useViewStore((s) => s.isSelectingLocation);
  const draftLatLng = useViewStore((s) => s.draftLatLng);
  const setDraftLatLng = useViewStore((s) => s.setDraftLatLng);

  const markerRef = useRef<any>(null);

  // 1. Khởi tạo Main Categories tức thì từ Local File dữ liệu mẫu
  useEffect(() => {
    if (categories.length === 0) {
      setCategories(mapCategoriesData);
    }
  }, [setCategories, categories]);

  // 2. Tự động theo dõi selectedCategoryId đổi để LAZY-FETCH dữ liệu từ Firebase
  useEffect(() => {
    if (!selectedCategoryId) return;

    // Nếu cụm này đã từng click và có trong cache, không fetch lại để tiết kiệm lượt Đọc (Read)
    if (subMarkersCache[selectedCategoryId]) return;

    const loadSubMarkers = async () => {
      setIsFetchingSubs(true);
      try {
        const firebaseSubs = await fetchSubMarkersByCategory(selectedCategoryId);
        setSubMarkersCache((prev) => ({
          ...prev,
          [selectedCategoryId]: firebaseSubs,
        }));
      } catch (err) {
        console.error("Lỗi tải điểm liên kết:", err);
      } finally {
        setIsFetchingSubs(false);
      }
    };

    loadSubMarkers();
  }, [selectedCategoryId, subMarkersCache]);

  // Icon định vị ghim tạm thời
  const draftIcon = useMemo(() => L.divIcon({
    className: 'custom-draft-marker',
    html: `
      <div class="relative flex items-center justify-center w-12 h-12" style="transform: translate(-24px, -24px);">
        <div class="absolute w-12 h-12 bg-rose-500/20 rounded-full animate-ping opacity-70"></div>
        <div class="absolute w-8 h-8 bg-rose-500/40 rounded-full animate-pulse"></div>
        <div class="relative w-6 h-6 bg-zinc-950 border-2 border-white rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(244,63,94,0.5)]">
          <div class="w-2.5 h-2.5 bg-rose-500 rounded-full"></div>
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-zinc-950"></div>
        </div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [0, 0]
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

  // Lọc các danh mục lớn được hiển thị trên bản đồ
  const visibleCategories = useMemo(() => {
    if (!selectedFilterId || selectedFilterId === "all") return categories;
    return categories.filter((c) => c.id === selectedFilterId);
  }, [categories, selectedFilterId]);

  // Lấy danh sách sub-markers ĐỘNG từ bộ nhớ cache thay vì đọc từ mảng cứng như cũ
  const activeSubMarkers = useMemo(() => {
    if (!selectedCategoryId) return [];
    return subMarkersCache[selectedCategoryId] || [];
  }, [selectedCategoryId, subMarkersCache]);

  const handleSubMarkerClick = (subId: string, subTitle: string) => {
    selectSubMarker(subId);
    alert(`📍 Bạn đã chọn điểm liên kết: "${subTitle}". Đang tải thông tin chi tiết dịch vụ.`);
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col bg-zinc-100 min-h-[400px]">
      
      {/* Loading Indicator nhỏ góc màn hình khi đang kéo data từ Firebase */}
      {isFetchingSubs && (
        <div className="absolute top-4 right-4 z-[1000] bg-black/80 text-white text-xs px-3 py-1.5 rounded-full border border-rose-500/30 shadow-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
          <span>Đang đồng bộ dữ liệu thực địa...</span>
        </div>
      )}

      <MapContainer
        center={[11.57328, 108.99317]} // Đặt center mặc định ngay vùng lõi hoạt động chính (Phan Rang)
        zoom={13}
        zoomControl={false}
        minZoom={3}
        className="h-full w-full absolute inset-0"
        maxBounds={[[-85, -180], [85, 180]]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        <Flyto />
        <MapLocationPicker />

        {/* Ghim tạm thời khi đang ở chế độ chấm bản đồ */}
        {isSelectingLocation && draftLatLng && (
          <Marker
            position={draftLatLng}
            icon={draftIcon}
            draggable={true}
            eventHandlers={eventHandlers}
            ref={markerRef}
          />
        )}

        {/* Render các Trạm/Cụm chính từ Mock data */}
        {visibleCategories.map((category) => (
          <CustomMarker
            key={category.id}
            position={category.position}
            title={category.title}
            iconType={category.iconType}
            onClick={() => selectCategory(category.id)}
          />
        ))}

        {/* Render các điểm con Realtime lấy từ Firebase */}
        {activeSubMarkers.map((sub) => (
          <CustomMarker
            key={sub.id}
            position={sub.position}
            title={sub.title}
            iconType={sub.type}
            isSubMarker={true}
            rating={sub?.rating}
            onClick={() => handleSubMarkerClick(sub.id, sub.title)}
          />
        ))}
      </MapContainer>
    </div>
  );
}

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