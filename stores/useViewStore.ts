import { create } from 'zustand';

type ViewMode = 'map' | 'members'; 
type MarkerType = 'market'| "jobs" | "cinema" | "study" | "startup" | "members";

type State = {
    viewMode: ViewMode;
    selectedMarkerType?: MarkerType | null;
    openMarker: (type: MarkerType) => void;
    closeMarker: () => void;
}

export const useViewStore = create<State>((set) => ({
    viewMode: 'map',
    selectedMarkerType: null,

    openMarker: (type: MarkerType) => set({ viewMode: 'members', selectedMarkerType: type }),
    closeMarker: () => set({ viewMode: 'map', selectedMarkerType: null }),
}))