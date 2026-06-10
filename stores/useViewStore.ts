import { create } from 'zustand';

type ViewMode = 'map' | 'members'; 
type MarkerType = 'market'| 'driver' | "jobs" | "cinema" | "study" | "startup" | "members";

type State = {
    viewMode: ViewMode;
    selectedMarkerType?: MarkerType | null;
    setSelectedMarkerType: (type: MarkerType | null) => void;
    openMarker: (type: MarkerType) => void;
    closeMarker: () => void;
}

export const useViewStore = create<State>((set) => ({
    viewMode: 'map',
    selectedMarkerType: null,
    setSelectedMarkerType: (type) => set({ selectedMarkerType: type }),
    openMarker: (type: MarkerType) => set({ viewMode: 'members', selectedMarkerType: type }),
    closeMarker: () => set({ viewMode: 'map', selectedMarkerType: null }),
}))