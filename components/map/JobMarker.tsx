"use client";
import L from "leaflet";
import { Marker } from "react-leaflet";
import { useViewStore } from "@/stores/useViewStore"; 

export default function JobMarker() {
    const openMarker = useViewStore((s) => s.openMarker);

    return (
        <Marker
            position={[21.01584, 105.83637]}
            icon={createCDNIcon()}
            zIndexOffset={100}
            eventHandlers={{ click: () => openMarker('jobs') }}
        />
    );
}

function createCDNIcon() {
  return L.divIcon({
    className: "jobs-marker",
    html: `
      <div class="flex flex-col items-center" style="transform: translate(-50%, -80%);">
        
        <span class="absolute bottom-1.5 inline-flex h-2.5 w-7 bg-blue-400 opacity-30 rounded-full animate-ping"></span>

        <div class="relative w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 
                    p-[2px] shadow-[0_4px_12px_rgba(225,29,72,0.35)]
                    transition-all duration-300 ease-in-out
                    hover:scale-115 hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(225,29,72,0.5)]
                    cursor-pointer
                    flex items-center justify-center">
          
          <div class="w-full h-full bg-white rounded-full p-[1.5px] flex items-center justify-center overflow-hidden">
            
            <div class="w-full h-full rounded-full bg-blue-600 flex items-center justify-center shadow-inner">
                <span class="text-xl font-black tracking-tight text-white select-none">
                    💼
                </span>
            </div>

          </div>

          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-blue-600 rotate-45 z-[-1] shadow-sm"></div>
        </div>

        <div class="mt-1.5">
          <div class="px-2.5 py-0.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-full shadow-md border border-slate-700/50 whitespace-nowrap">
            <p class="text-[11px] font-medium tracking-wide flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              kết nối việc làm
            </p>
          </div>
        </div>

      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}