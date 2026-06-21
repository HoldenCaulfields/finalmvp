"use client";
import L from "leaflet";
import { Marker } from "react-leaflet";
import { useViewStore } from "@/stores/useViewStore";

export default function ChoPhanRang() {
    const openMarker = useViewStore((s) => s.openMarker);

    return (
        <Marker
            position={[11.573281710540968, 108.99317309988206]}
            icon={createCollegeIcon()}
            zIndexOffset={1000}
            eventHandlers={{ click: () => openMarker("market") }}
        />
    );
}

function createCollegeIcon() {
  return L.divIcon({
    className: "custom-leaflet-icon",
    html: `
      <div class="relative flex flex-col items-center justify-center" style="transform: translate(-50%, -50%);">
        
        <!-- Outer Energy Rings -->
        <div class="absolute w-32 h-32 border-2 border-dashed border-rose-500/30 rounded-full animate-spin"
             style="animation-duration: 20s;">
        </div>
        <div class="absolute w-28 h-28 border border-rose-400/40 rounded-full animate-spin"
             style="animation-duration: 15s; animation-direction: reverse;">
        </div>
        
        <!-- Main Marker Body -->
        <div class="relative w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 via-rose-600 to-rose-800 
                    shadow-[0_20px_50px_rgba(244,63,94,0.4)] flex items-center justify-center z-10 
                    transition-all duration-500 hover:scale-110 hover:rotate-6 group">
            
            <div class="absolute inset-1 rounded-full bg-white flex items-center justify-center
                        shadow-inner border border-white/50 overflow-hidden">
                <img
                    src="/pricon.jpg"
                    class="w-full h-full object-cover transition-transform duration-700 scale-125"
                    alt="School logo"
                />
            </div>

          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-rose-600 rotate-45 z-[-1] shadow-sm"></div>

        </div>
        
        <!-- Creative Glass Label -->
        <div class="absolute top-full mt-2 pointer-events-none">
          <div class="relative px-4 py-1 bg-white border-2 border-rose-500 rounded-full shadow-2xl flex flex-col items-center backdrop-blur-md">
            <span class="text-[12px] font-bold text-rose-700 whitespace-nowrap tracking-wider">
              Chợ Phan Rang
            </span>
          </div>
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}
