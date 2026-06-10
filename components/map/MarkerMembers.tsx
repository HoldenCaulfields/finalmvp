"use client";
import L from "leaflet";
import { Marker } from "react-leaflet";

const members = [{ uid: "1", name: "John Doe", location: [11.563022, 109.013219], avatar: "" },
                 { uid: "2", name: "Jane Smith", location: [11.573022, 109.023219], avatar: "" }];

export default function MarkerMembers() {

  return (
    <>
      {
        members.map(marker => (
          <Marker
            key={marker.uid}
            position={marker.location ? [marker.location[0], marker.location[1]] : [0, 0]}
            icon={createMemberIcon(marker.name || "SV", marker.avatar || "")}
          />
        ))
      }
    </>
  );
}

function createMemberIcon(name: string, photoUrl?: string) {
  return L.divIcon({
    className: "custom-member-icon",
    html: `
      <div class="relative flex flex-col items-center" style="transform: translate(-50%, -30%);">

        <!-- MAIN MARKER -->
        <div class="group relative w-11 h-11 rounded-full 
                    bg-white border-3 border-blue-500
                    shadow-md flex items-center justify-center
                    transition-all duration-200 hover:scale-110">

          <!-- AVATAR -->
          <div class="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
            ${
              photoUrl
                ? `<img src="${photoUrl}" 
                        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />`
                : `<span class="text-sm font-black text-slate-700">
                     ${name.charAt(0)}
                   </span>`
            }
          </div>

        </div>

        <!-- LABEL -->
        <div class="mt-2 px-3 py-1 rounded-full
                    bg-white border border-slate-200
                    shadow-sm text-[11px] font-semibold text-slate-700
                    whitespace-nowrap">
          ${name}
        </div>

      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}