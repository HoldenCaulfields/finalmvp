
export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  isFeatured?: boolean;
}

export interface Stall {
  id: string;
  name: string;
  owner: string;
  ownerTitle?: string;
  description: string;
  category: 'weaving' | 'pottery' | 'cuisine' | 'agriculture' | 'other';
  phone: string;
  avatar: string;
  banner: string;
  address: string;
  products: Product[];
}

export interface CheckIn {
  id: string;
  name: string;
  avatar: string;
  image: string;
  caption: string;
  location: string;
  likes: number;
  createdAt: string;
  lat?: number;
  lng?: number;
}

export interface Artisan {
  id: string;
  name: string;
  title: string;
  experience: string;
  specialty: string;
  avatar: string;
  bio: string;
  location: string;
  phone: string;
}

export interface ScheduleItem {
  id: string;
  date: string; // e.g. "2026-06-26"
  time: string; // e.g. "08:00"
  title: string;
  location: string;
  description: string;
  type: 'main' | 'culture' | 'workshop' | 'exhibition';
}

export interface CartItem {
  id: string;
  product: Product;
  stallId: string;
  stallName: string;
  quantity: number;
}

