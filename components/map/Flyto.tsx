'use client';
import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { useViewStore } from "@/stores/useViewStore";

export default function Flyto() {
    const map = useMap();
    const selectedMarkerType = useViewStore((s) => s.selectedMarkerType);

    useEffect(() => {
        if (selectedMarkerType === 'market') {
            map.flyTo([11.543022, 109.013219], 13, { duration: 2 });
        } else if (selectedMarkerType === 'cinema') {
            map.flyTo([16.4637, 107.5909], 13, { duration: 2 });
        } else if (selectedMarkerType === 'study') {
            map.flyTo([11.56370, 109.01373], 13, { duration: 2 });
        } else if (selectedMarkerType === 'startup') {
            map.flyTo([10.762622, 106.660172], 13, { duration: 2 });
        } else if (selectedMarkerType === 'driver') {
            map.flyTo([11.57455, 108.98268], 13, { duration: 2 });
        } else if (selectedMarkerType === 'jobs') {
            map.flyTo([21.01584, 105.83637], 13, { duration: 2 });
        } else {
            map.flyTo([14, 107], 6, { duration: 2 });
        }
    }, [selectedMarkerType, map]);

    return null;
}
