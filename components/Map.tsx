'use client';
import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import { useViewStore } from "@/stores/useViewStore";
import Flyto from "./map/Flyto";
import { useEffect, useMemo, useRef } from "react";
import { mapCategoriesData } from "./map/markerData";
import CustomMarker from "./map/CustomMarker";
import L from 'leaflet';

export default function Map() {
    const { categories, selectedCategoryId, setCategories, selectCategory, selectSubMarker } = useViewStore();
    const { isSelectingLocation, draftLatLng, setDraftLatLng } = useViewStore();
    const markerRef = useRef<any>(null);
    // Khởi tạo dữ liệu vào Store lúc ban đầu
    useEffect(() => {
        setCategories(mapCategoriesData);
    }, [setCategories]);

    const draftIcon = useMemo(() => L.divIcon({
        className: 'custom-draft-marker',
        html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 bg-rose-500/30 rounded-full animate-ping"></div>
        <div class="w-5 h-5 bg-zinc-950 border-2 border-rose-600 rounded-full flex items-center justify-center shadow-md">
          <div class="w-2 h-2 bg-rose-500 rounded-full"></div>
        </div>
      </div>
    `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
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

    return (
        <div className="relative w-full h-full overflow-hidden flex flex-col animate-in fade-in duration-700 bg-zinc-100">
            <MapContainer
                center={[11.5, 109]}
                zoom={10}
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
                <Flyto />
                <MapLocationPicker />

                {isSelectingLocation && draftLatLng && (
                    <Marker
                        position={draftLatLng}
                        icon={draftIcon}
                        draggable={true}
                        eventHandlers={eventHandlers}
                        ref={markerRef}
                    />
                )}

                {categories.map((category) => (
                    <CustomMarker
                        key={category.id}
                        position={category.position}
                        title={category.title}
                        iconType={category.iconType}
                        onClick={() => selectCategory(category.id)}
                    />
                ))}

                {categories
                    .filter(cat => cat.id === selectedCategoryId)
                    .flatMap(cat => cat.subMarkers)
                    .map((sub) => (
                        <CustomMarker
                            key={sub.id}
                            position={sub.position}
                            title={sub.title}
                            iconType={sub.type} // ví dụ: 'food', 'shop'
                            isSubMarker={true}  // Kích hoạt kích thước nhỏ & zIndex thấp hơn
                            onClick={() => selectSubMarker(sub.id)}
                        />
                    ))}

            </MapContainer>
        </div>
    );
}

function MapLocationPicker() {
    const { isSelectingLocation, setDraftLatLng } = useViewStore();

    useMapEvents({
        click(e) {
            if (isSelectingLocation) {
                setDraftLatLng([e.latlng.lat, e.latlng.lng]);
            }
        },
    });
    return null;
}