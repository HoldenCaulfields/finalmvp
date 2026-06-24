import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet" // Sửa lại import tùy project bạn (react-leaflet)
import { MapContainer as LeafletMapContainer, TileLayer as LeafletTileLayer, Marker as LeafletMarker } from "react-leaflet";
import { useViewStore } from "../stores/useViewStore";
import Flyto from "./map/Flyto";
import { useEffect, useMemo, useRef, useState } from "react";
import { mapCategoriesData } from "./map/markerData"; 
import CustomMarker from "./map/CustomMarker";
import { fetchSubMarkersByCategory } from "@/services/map.services"; 
import L from 'leaflet';
import SubMarkerDetailModal from "@/components/map/SubMarkerModal"; // Import modal mới tạo

export default function Map() {
  const categories = useViewStore((s) => s.categories);
  const selectedCategoryId = useViewStore((s) => s.selectedCategoryId);
  const selectedFilterId = useViewStore((s) => s.selectedFilterId);
  
  const setCategories = useViewStore((s) => s.setCategories);
  const selectCategory = useViewStore((s) => s.selectCategory);
  const selectSubMarker = useViewStore((s) => s.selectSubMarker);
  
  const [subMarkersCache, setSubMarkersCache] = useState<Record<string, any[]>>({});
  const [isFetchingSubs, setIsFetchingSubs] = useState(false);

  // --- STATE QUẢN LÝ MODAL POPUP ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubData, setSelectedSubData] = useState<any>(null);

  const isSelectingLocation = useViewStore((s) => s.isSelectingLocation);
  const draftLatLng = useViewStore((s) => s.draftLatLng);
  const setDraftLatLng = useViewStore((s) => s.setDraftLatLng);

  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (categories.length === 0) {
      setCategories(mapCategoriesData);
    }
  }, [setCategories, categories]);

  useEffect(() => {
    if (!selectedCategoryId) return;
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

  const draftIcon = useMemo(() => L.divIcon({
    className: 'custom-draft-marker',
    html: `
      <div class="relative flex items-center justify-center w-12 h-12" style="transform: translate(-24px, -24px);">
        <div class="absolute w-12 h-12 bg-rose-500/20 rounded-full animate-ping opacity-70"></div>
        <div class="absolute w-8 h-8 bg-rose-500/40 rounded-full animate-pulse"></div>
        <div class="relative w-6 h-6 bg-zinc-950 border-2 border-white rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(244,63,94,0.5)]">
          <div class="w-2.5 h-2.5 bg-rose-500 rounded-full"></div>
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

  const visibleCategories = useMemo(() => {
    if (!selectedFilterId || selectedFilterId === "all") return categories;
    return categories.filter((c) => c.id === selectedFilterId);
  }, [categories, selectedFilterId]);

  const activeSubMarkers = useMemo(() => {
    if (!selectedCategoryId) return [];
    return subMarkersCache[selectedCategoryId] || [];
  }, [selectedCategoryId, subMarkersCache]);

  // --- THAY THẾ ALERT BẰNG VIỆC MỞ MODAL ---
  const handleSubMarkerClick = (subMarker: any) => {
    selectSubMarker(subMarker.id);
    setSelectedSubData(subMarker);
    setIsModalOpen(true);
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col bg-zinc-100 min-h-[400px]">
      
      {isFetchingSubs && (
        <div className="absolute top-4 right-4 z-[1000] bg-black/80 text-white text-xs px-3 py-1.5 rounded-full border border-rose-500/30 shadow-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
          <span>Đang đồng bộ dữ liệu thực địa...</span>
        </div>
      )}

      <LeafletMapContainer
        center={[11.57328, 108.99317]}
        zoom={13}
        zoomControl={false}
        minZoom={3}
        className="h-full w-full absolute inset-0"
        maxBounds={[[-85, -180], [85, 180]]}
        maxBoundsViscosity={1.0}
      >
        <LeafletTileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        <Flyto />
        <MapLocationPicker />

        {isSelectingLocation && draftLatLng && (
          <LeafletMarker
            position={draftLatLng}
            icon={draftIcon}
            draggable={true}
            eventHandlers={eventHandlers}
            ref={markerRef}
          />
        )}

        {/* Click vào MainCategory mở bung SubMarkers (Giữ nguyên logic của bạn) */}
        {visibleCategories.map((category) => (
          <CustomMarker
            key={category.id}
            position={category.position}
            title={category.title}
            iconType={category.iconType}
            onClick={() => selectCategory(category.id)}
          />
        ))}

        {/* Click vào SubMarker mở Modal Popup (Đã cập nhật) */}
        {activeSubMarkers.map((sub) => (
          <CustomMarker
            key={sub.id}
            position={sub.position}
            title={sub.title}
            iconType={sub.type}
            isSubMarker={true}
            rating={sub?.rating}
            onClick={() => handleSubMarkerClick(sub)} // Truyền nguyên cụm object sub thay vì chỉ truyền string
          />
        ))}
      </LeafletMapContainer>

      {/* MODAL POPUP NẰM NGOÀI LEAFLET, ĐƯỢC CHÈN VÀO CUỐI ĐỂ KHÔNG BỊ BẢN ĐỒ CHE KHUẤT */}
      <SubMarkerDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subMarkerData={selectedSubData}
      />
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