'use client';
import { MapContainer, TileLayer } from "react-leaflet";
import { useViewStore } from "@/stores/useViewStore";
import ChoPhanRang from "./map/ChoPhanRang";
import MarkerMembers from "./map/MarkerMembers";
import Flyto from "./map/Flyto";
import CimanetMarker from "./map/CimanetMarker";
import StartupMarker from "./map/StartupMarker";

export default function Map() {
    const { viewMode }  = useViewStore();

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
                <ChoPhanRang />
                <CimanetMarker />
                <StartupMarker />
                { viewMode === 'members' && <MarkerMembers /> }
                
            </MapContainer>
        </div>
    );
}
