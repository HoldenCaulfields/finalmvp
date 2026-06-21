import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import { useViewStore } from "../stores/useViewStore";
import Flyto from "./map/Flyto";
import { useEffect, useMemo, useRef } from "react";
import { mapCategoriesData } from "./map/markerData";
import CustomMarker from "./map/CustomMarker";
import L from 'leaflet';

export default function Map() {
  const categories = useViewStore((s) => s.categories);
  const selectedCategoryId = useViewStore((s) => s.selectedCategoryId);
  const selectedFilterId = useViewStore((s) => s.selectedFilterId);
  const setCategories = useViewStore((s) => s.setCategories);
  const selectCategory = useViewStore((s) => s.selectCategory);
  const selectSubMarker = useViewStore((s) => s.selectSubMarker);
  
  const isSelectingLocation = useViewStore((s) => s.isSelectingLocation);
  const draftLatLng = useViewStore((s) => s.draftLatLng);
  const setDraftLatLng = useViewStore((s) => s.setDraftLatLng);

  const markerRef = useRef<any>(null);

  // Initialize data if category list is empty
  useEffect(() => {
    if (categories.length === 0) {
      setCategories(mapCategoriesData);
    }
  }, [setCategories, categories]);

  // Draft locator icon
  const draftIcon = useMemo(() => L.divIcon({
    className: 'custom-draft-marker',
    html: `
      <div class="relative flex items-center justify-center w-12 h-12" style="transform: translate(-24px, -24px);">
        <div class="absolute w-12 h-12 bg-rose-500/20 rounded-full animate-ping opacity-70"></div>
        <div class="absolute w-8 h-8 bg-rose-500/40 rounded-full animate-pulse"></div>
        
        <div class="relative w-6 h-6 bg-zinc-950 border-2 border-white rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(244,63,94,0.5)]">
          <div class="w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-rose-500/10"></div>
          
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

  // Pre-filter active categories shown
  const visibleCategories = useMemo(() => {
    if (!selectedFilterId || selectedFilterId === "all") {
      return categories;
    }
    return categories.filter((c) => c.id === selectedFilterId);
  }, [categories, selectedFilterId]);

  // Pre-filter active sub-markers
  const activeSubMarkers = useMemo(() => {
    const activeCat = categories.find(cat => cat.id === selectedCategoryId);
    return activeCat ? (activeCat.subMarkers || []) : [];
  }, [categories, selectedCategoryId]);

  const handleSubMarkerClick = (subId: string, subTitle: string) => {
    selectSubMarker(subId);
    alert(`📍 Bạn đã chọn điểm liên kết: "${subTitle}". Đang tải thông tin chi tiết dịch vụ.`);
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col bg-zinc-100 min-h-[400px]">
      <MapContainer
        center={[16.047079, 108.206230]}
        zoom={6}
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
        
        {/* Camera system handling smooth pan operations */}
        <Flyto />
        
        {/* Global click registration listener */}
        <MapLocationPicker />

        {/* Dynamic drafted placeholder marker */}
        {isSelectingLocation && draftLatLng && (
          <Marker
            position={draftLatLng}
            icon={draftIcon}
            draggable={true}
            eventHandlers={eventHandlers}
            ref={markerRef}
          />
        )}

        {/* Iterate & render primary main hubs */}
        {visibleCategories.map((category) => (
          <CustomMarker
            key={category.id}
            position={category.position}
            title={category.title}
            iconType={category.iconType}
            onClick={() => selectCategory(category.id)}
          />
        ))}

        {/* Iterate & render active sub components */}
        {activeSubMarkers.map((sub) => (
          <CustomMarker
            key={sub.id}
            position={sub.position}
            title={sub.title}
            iconType={sub.type}
            isSubMarker={true}
            onClick={() => handleSubMarkerClick(sub.id, sub.title)}
          />
        ))}
      </MapContainer>
    </div>
  );
}

// Map events handler separated for high performance and isolation
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
