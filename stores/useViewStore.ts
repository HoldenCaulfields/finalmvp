import { create } from 'zustand';

export interface SubMarker {
    id: string;
    position: [number, number];
    title: string;
    description?: string;
    type: string; //"quan-an", "coffee" , "van phong"
}

export interface MainMarkerCategory {
    id: string;
    title: string;
    position: [number, number];
    zoomLevel?: number;
    iconType: 'market' | 'cinema' | 'startup' | 'jobs' | 'driver' | 'study' | 'caodangnghe' | 'langnghe';
    subMarkers: SubMarker[];
}

type State = {
    categories: MainMarkerCategory[];
    selectedCategoryId: string | null;
    activeSubMarkerId: string | null;

    setCategories: (categories: MainMarkerCategory[]) => void;
    selectCategory: (id: string | null) => void;
    selectSubMarker: (id: string) => void;

    //create:
    isCreateOpen: boolean;          // Điều khiển hiển thị Modal nhập thông tin
    isSelectingLocation: boolean;   // Điều khiển chế độ đang chọn vị trí (hiện TipBar)
    draftLatLng: [number, number] | null; // Tọa độ của marker tạm thời
    startSelectingLocation: (userLocation?: [number, number]) => void;
    setDraftLatLng: (latlng: [number, number] | null) => void;
    confirmLocation: () => void;
    cancelSelection: () => void;
    setDropMarkerMode: (open: boolean) => void;
}

export const useViewStore = create<State>((set) => ({
    categories: [],
    selectedCategoryId: null,
    activeSubMarkerId: null,

    selectCategory: (id) => set({ selectedCategoryId: id, activeSubMarkerId: null }),
    selectSubMarker: (id) => set({ activeSubMarkerId: id }),
    setCategories: (categories) => set({ categories }),

    //create:
    isCreateOpen: false,
    isSelectingLocation: false,
    draftLatLng: null,
    // Kích hoạt chế độ chọn vị trí, lấy vị trí mặc định của user nếu có
    startSelectingLocation: (userLocation) => set({
        isSelectingLocation: true,
        isCreateOpen: false,
        draftLatLng: userLocation || [11.5732, 108.9931] // Mặc định ở Phan Rang nếu ko lấy được GPS
    }),
    setDraftLatLng: (latlng) => set({ draftLatLng: latlng }),
    // Khi user ưng ý với vị trí ghim và bấm "Xác nhận"
    confirmLocation: () => set({
        isSelectingLocation: false,
        isCreateOpen: true
    }),
    cancelSelection: () => set({
        isSelectingLocation: false,
        isCreateOpen: false,
        draftLatLng: null
    }),
    setDropMarkerMode: (open) => set({ isCreateOpen: open })
}))