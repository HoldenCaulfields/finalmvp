import { create } from 'zustand';
import { Stall, Dish, OrderItem } from '../types';

interface CloudinaryConfig {
  cloudName: string;
  preset: string;
}

interface StoreState {
  // Database state
  stalls: Stall[];
  dishes: Dish[];
  loading: boolean;
  
  // Filtration state
  searchQuery: string;
  categoryFilter: string;
  
  // Selection states
  selectedStall: Stall | null;
  selectedDish: Dish | null;
  
  // Cart state
  cartItems: OrderItem[];
  
  // Cloudinary settings
  cloudinaryConfig: CloudinaryConfig;

  // Setters
  setStalls: (stalls: Stall[]) => void;
  setDishes: (dishes: Dish[]) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (filter: string) => void;
  setSelectedStall: (stall: Stall | null) => void;
  setSelectedDish: (dish: Dish | null) => void;
  
  // Cart operations
  addToCart: (item: OrderItem) => void;
  updateCartQuantity: (dishId: string, delta: number) => void;
  removeFromCart: (dishId: string) => void;
  clearCart: () => void;
  
  // Cloudinary setters
  setCloudinaryConfig: (cloudName: string, preset: string) => void;
}

// Read cart from localStorage helper
const getInitialCart = (): OrderItem[] => {
  try {
    const saved = localStorage.getItem('pr_cart_items');
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error('Failed to parse cart items from localStorage:', err);
    return [];
  }
};

// Read Cloudinary settings helper
const getInitialCloudinary = (): CloudinaryConfig => {
  try {
    const cloudName = localStorage.getItem('pr_cloudinary_cloud') || 'chophanrang';
    const preset = localStorage.getItem('pr_cloudinary_preset') || 'pr_unsigned_preset';
    return { cloudName, preset };
  } catch {
    return { cloudName: 'chophanrang', preset: 'pr_unsigned_preset' };
  }
};

export const useStore = create<StoreState>((set) => ({
  stalls: [],
  dishes: [],
  loading: true,
  searchQuery: '',
  categoryFilter: 'all',
  selectedStall: null,
  selectedDish: null,
  cartItems: getInitialCart(),
  cloudinaryConfig: getInitialCloudinary(),

  setStalls: (stalls) => set({ stalls }),
  setDishes: (dishes) => set({ dishes }),
  setLoading: (loading) => set({ loading }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setSelectedStall: (selectedStall) => set({ selectedStall }),
  setSelectedDish: (selectedDish) => set({ selectedDish }),

  addToCart: (item) => set((state) => {
    const existingIdx = state.cartItems.findIndex((i) => i.dishId === item.dishId);
    let nextCart: OrderItem[];
    if (existingIdx > -1) {
      nextCart = [...state.cartItems];
      nextCart[existingIdx].quantity += item.quantity;
    } else {
      nextCart = [...state.cartItems, item];
    }
    localStorage.setItem('pr_cart_items', JSON.stringify(nextCart));
    return { cartItems: nextCart };
  }),

  updateCartQuantity: (dishId, delta) => set((state) => {
    const nextCart = state.cartItems.map((item) => {
      if (item.dishId === dishId) {
        const nextQty = item.quantity + delta;
        return { ...item, quantity: nextQty > 0 ? nextQty : 1 };
      }
      return item;
    });
    localStorage.setItem('pr_cart_items', JSON.stringify(nextCart));
    return { cartItems: nextCart };
  }),

  removeFromCart: (dishId) => set((state) => {
    const nextCart = state.cartItems.filter((item) => item.dishId !== dishId);
    localStorage.setItem('pr_cart_items', JSON.stringify(nextCart));
    return { cartItems: nextCart };
  }),

  clearCart: () => set(() => {
    localStorage.removeItem('pr_cart_items');
    return { cartItems: [] };
  }),

  setCloudinaryConfig: (cloudName, preset) => set(() => {
    localStorage.setItem('pr_cloudinary_cloud', cloudName);
    localStorage.setItem('pr_cloudinary_preset', preset);
    return { cloudinaryConfig: { cloudName, preset } };
  }),
}));
