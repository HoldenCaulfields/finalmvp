export interface Stall {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  banner: string;
  ownerId: string;
  rating: number;
  reviewsCount?: number;
  createdAt?: any;
}

export interface Dish {
  id: string;
  stallId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviewsCount: number;
  ownerId: string;
}

export interface Review {
  id: string;
  dishId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export interface OrderItem {
  dishId: string;
  dishName: string;
  price: number;
  quantity: number;
  stallId: string;
  stallName: string;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  phone: string;
  address: string;
  items: string; // JSON-serialized OrderItem[]
  total: number;
  status: 'pending' | 'preparing' | 'delivering' | 'completed';
  createdAt: any;
}
