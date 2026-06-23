import { create } from 'zustand';

export interface MainCategory {
  id: string;
  title: string;
  position: [number, number];
  iconType: string;
}

export interface SubMarker {
  id: string;
  categoryId: string;
  title: string;
  position: [number, number];
  type: string;
  rating?: number;
  createdBy: string;
}

interface ViewState {
  // --- DATA STATES ---
  categories: MainCategory[];
  subMarkersCache: Record<string, SubMarker[]>; // categoryId -> danh sách sub-markers đã fetch
  selectedCategoryId: string | null;            // Thay cho activeCategoryId để khớp code Map cũ của bạn
  selectedFilterId: string;                     // Quản lý bộ lọc danh mục (ví dụ: "all", "market", "startup")
  selectedSubMarkerId: string | null;           // Lưu id sub-marker đang được xem chi tiết

  // --- INTERACTION / CREATE WORKFLOW STATES ---
  isSelectingLocation: boolean;                 // Chế độ đang bật ngắm điểm trên bản đồ (Hiện TipBar)
  isCreateOpen: boolean;                         // Chế độ mở Modal Form nhập tên/loại sau khi đã chấm điểm xong
  draftLatLng: [number, number] | null;          // Tọa độ tạm thời khi user đang click/kéo thả trên map

  // --- APP NAVIGATION ---
  activeRoute: string;                           // Quản lý Tab hiện tại (Home, Ideas, Teams, Map, v.v.)

  // --- ACTIONS ---
  setCategories: (categories: MainCategory[]) => void;
  setSubMarkersForCategory: (categoryId: string, markers: SubMarker[]) => void;
  addSubMarker: (categoryId: string, marker: SubMarker) => void;
  selectCategory: (id: string | null) => void;
  selectSubMarker: (id: string | null) => void;
  setSelectedFilterId: (id: string) => void;
  setActiveRoute: (route: string) => void;
  
  // --- INTERACTION ACTIONS (Đã tối ưu flow: Chọn vị trí -> Xác nhận -> Hiện Form điền thông tin) ---
  startSelectingLocation: (userLocation?: [number, number]) => void;
  setDraftLatLng: (latlng: [number, number] | null) => void;
  confirmLocationSelection: () => void;         // Bấm xác nhận điểm ghim -> Chuyển sang mở Form
  cancelSelection: () => void;                  // Hủy ngang -> Đóng hết, xóa dấu vết ghim tạm
  setDropMarkerMode: (open: boolean) => void;    // Ép đóng/mở trực tiếp Modal Form nếu cần
}

export const useViewStore = create<ViewState>((set) => ({
  // --- INITIAL STATES ---
  categories: [],
  subMarkersCache: {},
  selectedCategoryId: null,
  selectedFilterId: "all",
  selectedSubMarkerId: null,

  isSelectingLocation: false,
  isCreateOpen: false,
  draftLatLng: null,

  activeRoute: "map",

  // --- DATA ACTIONS ---
  setCategories: (categories) => set({ categories }),
  
  setSubMarkersForCategory: (categoryId, markers) => 
    set((state) => ({
      subMarkersCache: { ...state.subMarkersCache, [categoryId]: markers }
    })),
    
  addSubMarker: (categoryId, marker) =>
    set((state) => {
      const currentMarkers = state.subMarkersCache[categoryId] || [];
      return {
        subMarkersCache: {
          ...state.subMarkersCache,
          [categoryId]: [...currentMarkers, marker],
        },
      };
    }),

  selectCategory: (id) => set({ selectedCategoryId: id, selectedSubMarkerId: null }),
  selectSubMarker: (id) => set({ selectedSubMarkerId: id }),
  setSelectedFilterId: (id) => set({ selectedFilterId: id, selectedCategoryId: null, selectedSubMarkerId: null }),
  setActiveRoute: (route) => set({ activeRoute: route }),

  // --- WORKFLOW CREATION ACTIONS ---
  // Bước 1: Bật chế độ tìm điểm, nếu có GPS định vị thì ghim luôn tại đó, không thì mặc định Phan Rang
  startSelectingLocation: (userLocation) => set({
    isSelectingLocation: true,
    isCreateOpen: false,
    draftLatLng: userLocation || [11.5732, 108.9931]
  }),

  // Cập nhật liên tục khi user click điểm mới hoặc kéo thả ghim trên map
  setDraftLatLng: (latlng) => set({ draftLatLng: latlng }),

  // Bước 2: User ưng ý vị trí, bấm "Xác nhận vị trí này"
  confirmLocationSelection: () => set({
    isSelectingLocation: false, // Tắt chế độ ngắm bắn điểm
    isCreateOpen: true          // Bật sáng Modal điền Form thông tin chi tiết
  }),

  // Bước quay xe: Hủy bỏ toàn bộ tiến trình
  cancelSelection: () => set({
    isSelectingLocation: false,
    isCreateOpen: false,
    draftLatLng: null
  }),

  setDropMarkerMode: (open) => set({ isCreateOpen: open })
}));