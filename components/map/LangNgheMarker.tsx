"use client";
import L from "leaflet";
import { Marker } from "react-leaflet";
import { useViewStore } from "@/stores/useViewStore";

export default function LangNgheMarker() {
    const openMarker = useViewStore((s) => s.openMarker);

    return (
        <Marker
            position={[11.521836, 108.942515]}
            icon={createWeavingIcon()}
            zIndexOffset={100}
            eventHandlers={{ click: () => openMarker("market") }}
        />
    );
}

function createWeavingIcon() {
  return L.divIcon({
    className: "custom-leaflet-icon",
    html: `
      <div class="relative flex flex-col items-center justify-center" style="transform: translate(-50%, -50%);">
        
        <!-- Decorative Pattern Rings (Thổ cẩm vibe) -->
        <div class="absolute w-24 h-24 rounded-full border-4 border-dotted border-amber-600/30"></div>
        <div class="absolute w-20 h-20 rounded-full border border-orange-500/40"></div>

        <!-- Main Marker -->
        <div class="relative w-14 h-14 rounded-full
                    bg-linear-to-br from-amber-500 via-orange-600 to-red-700
                    shadow-[0_15px_40px_rgba(234,88,12,0.4)]
                    flex items-center justify-center z-10
                    transition-all duration-500 hover:scale-110 group overflow-hidden">

            <!-- Pattern overlay -->
            <div class="absolute inset-0 opacity-30"
                 style="
                 background-image: repeating-linear-gradient(
                    45deg,
                    #fff 0px,
                    #fff 2px,
                    transparent 2px,
                    transparent 6px
                 );">
            </div>

            <!-- Inner Image -->
            <div class="absolute inset-1 rounded-full bg-white flex items-center justify-center
                        shadow-inner border border-white/50 overflow-hidden">
                <img
                    src="/langnghe.jpg"
                    class="w-full h-full object-cover scale-110"
                    alt="My Nghiep"
                />
            </div>

            <!-- Pin tail -->
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-700 rotate-45 z-[-1] shadow-sm"></div>
        </div>

        <!-- Label -->
        <div class="absolute top-full mt-2 pointer-events-none">
          <div class="relative px-4 py-1 bg-white border-2 border-orange-600 rounded-full shadow-xl backdrop-blur-md">
            <span class="text-[12px] font-bold text-orange-700 whitespace-nowrap tracking-wide">
              Làng Nghề Mỹ Nghiệp
            </span>
          </div>
        </div>

      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}