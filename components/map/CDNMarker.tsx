"use client";
import L from "leaflet";
import { Marker } from "react-leaflet";
import { useViewStore } from "@/stores/useViewStore"; 

export default function CDNMarker() {
    const openMarker = useViewStore((s) => s.openMarker);

    return (
        <Marker
            position={[11.56370, 109.01373]}
            icon={createCDNIcon()}
            zIndexOffset={100}
            eventHandlers={{ click: () => openMarker('study') }}
        />
    );
}

function createCDNIcon() {
  return L.divIcon({
    className: "sinh-vien-net",
    html: `
      <div class="flex flex-col items-center" style="transform: translate(-50%, -80%);">
        <div class="relative w-12 h-12 rounded-full bg-rose-500
                    p-1 shadow-[0_4px_12px_rgba(225,29,72,0.35)]
                    transition-all duration-300 ease-in-out
                    hover:scale-115 hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(225,29,72,0.5)]
                    cursor-pointer
                    flex items-center justify-center">
          
          <div class="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
            <div class="absolute inset-0.5 rounded-full bg-white flex items-center justify-center
                        shadow-inner overflow-hidden">
                <img
                    src="/cdn.png"
                    class="w-full h-full object-cover transition-transform duration-700 scale-125"
                    alt="School logo"
                />
            </div>
          </div>

          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-rose-600 rotate-45 z-[-1] shadow-sm"></div>
        </div>

        <div class="mt-1.5">
          <div class="px-2.5 py-0.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-full shadow-md border border-slate-700/50 whitespace-nowrap">
            <p class="text-[11px] font-medium tracking-wide flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
              Sinh Viên Cao Đẳng Nghề
            </p>
          </div>
        </div>

      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}