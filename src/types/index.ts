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

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
