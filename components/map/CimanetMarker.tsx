"use client";
import L from "leaflet";
import { Marker } from "react-leaflet";
import { useViewStore } from "@/stores/useViewStore";

export default function CimanetMarker() {
    const openMarker = useViewStore((s) => s.openMarker);

    return (
        <Marker
            position={[16.4637, 107.5909]}
            icon={createCimanetIcon()}
            zIndexOffset={1000}
            eventHandlers={{ click: () => openMarker('cinema') }}
        />
    );
}

function createCimanetIcon() {
  return L.divIcon({
    className: "custom-leaflet-icon",
    html: `
      <div class="flex flex-col items-center" style="transform: translate(-50%, -50%);">
        
        <!-- Glow nền -->
        <div class="absolute w-14 h-14 bg-amber-400/20 rounded-full blur-xl"></div>

        <!-- Icon chính -->
        <div class="relative w-12 h-12 rounded-full bg-black/70
                    flex items-center justify-center
                    text-xl
                    shadow-lg
                    transition-all duration-300
                    hover:scale-110 hover:shadow-[0_0_25px_rgba(251,191,36,0.5)]">
          🎬
        </div>

        <div class="absolute top-full mt-1">
          <div class="px-3 py-0.5 bg-black/80 backdrop-blur-sm rounded-md shadow-md border border-white/20">
            <p class="text-[11px] font-medium text-white whitespace-nowrap tracking-tight">
              Hội yêu điện ảnh
            </p>
          </div>
        </div>

      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}