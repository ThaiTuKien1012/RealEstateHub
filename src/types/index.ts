export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  category: string;
  movement: 'automatic' | 'quartz' | 'mechanical';
  caseDiameter: number;
  caseMaterial: string;
  strapMaterial: string;
  waterResistance: string;
  color: string;
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  variants?: ProductVariant[];
  specifications?: ProductSpecification[];
}

export interface ProductVariant {
  id: string;
  name: string;
  type: 'size' | 'strap' | 'color';
  value: string;
  priceModifier: number;
  stock: number;
  imageUrl?: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface Filter {
  brands: string[];
  priceRange: [number, number];
  movements: ('automatic' | 'quartz' | 'mechanical')[];
  diameterRange: [number, number];
  materials: string[];
  colors: string[];
  searchQuery: string;
}

export interface SortOption {
  label: string;
  value: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'rating' | 'newest';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role?: 'customer' | 'admin' | 'vendor';
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  bio?: string;
  address?: string;
  preferences?: {
    brands?: string[];
    priceRange?: string;
  };
  notificationSettings?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  twoFactorEnabled?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  helpful: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface AdminProduct {
  id: number;
  name: string;
  brand: string;
  price: number;
  stock: number;
  image: string;
  status: 'in_stock' | 'low_stock' | 'out_stock';
}

export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  date: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'vendor';
  orders: number;
  spent: number;
  joined: string;
  avatar: string;
}

export interface AdminStore {
  id: number;
  name: string;
  owner: string;
  products: number;
  sales: number;
  status: 'active' | 'pending' | 'suspended';
  rating: number;
  logo: string;
}

export interface AdminTicket {
  id: string;
  user: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  created: string;
  messages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
