import axios from 'axios';
import { Product, Review, ApiResponse, PaginatedResponse, Filter } from '../types';
import { mockProducts, mockReviews } from '../data/mockProducts';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock API implementation - simulates backend responses
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const productsApi = {
  getAll: async (): Promise<ApiResponse<Product[]>> => {
    await delay(300);
    return {
      success: true,
      data: mockProducts,
    };
  },

  getById: async (id: string): Promise<ApiResponse<Product>> => {
    await delay(200);
    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    return {
      success: true,
      data: product,
    };
  },

  getFeatured: async (): Promise<ApiResponse<Product[]>> => {
    await delay(200);
    return {
      success: true,
      data: mockProducts.filter(p => p.isFeatured),
    };
  },

  getBestSellers: async (): Promise<ApiResponse<Product[]>> => {
    await delay(200);
    return {
      success: true,
      data: mockProducts.filter(p => p.isBestSeller),
    };
  },

  search: async (
    filters: Partial<Filter>,
    page: number = 1,
    pageSize: number = 12
  ): Promise<PaginatedResponse<Product>> => {
    await delay(300);
    
    let filtered = [...mockProducts];

    // Apply filters
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter(p => filters.brands!.includes(p.brand));
    }

    if (filters.movements && filters.movements.length > 0) {
      filtered = filtered.filter(p => filters.movements!.includes(p.movement));
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      filtered = filtered.filter(p => p.price >= min && p.price <= max);
    }

    if (filters.diameterRange) {
      const [min, max] = filters.diameterRange;
      filtered = filtered.filter(
        p => p.caseDiameter >= min && p.caseDiameter <= max
      );
    }

    if (filters.materials && filters.materials.length > 0) {
      filtered = filtered.filter(
        p =>
          filters.materials!.includes(p.caseMaterial) ||
          filters.materials!.includes(p.strapMaterial)
      );
    }

    if (filters.colors && filters.colors.length > 0) {
      filtered = filtered.filter(p =>
        filters.colors!.some(color =>
          p.color.toLowerCase().includes(color.toLowerCase())
        )
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = filtered.slice(start, end);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages,
    };
  },
};

export const reviewsApi = {
  getByProductId: async (productId: string): Promise<ApiResponse<Review[]>> => {
    await delay(200);
    return {
      success: true,
      data: mockReviews.filter(r => r.productId === productId),
    };
  },
};

export const authApi = {
  login: async (email: string, password: string) => {
    await delay(500);
    // Mock login - always succeeds
    return {
      success: true,
      data: {
        user: {
          id: '1',
          email,
          name: email.split('@')[0],
        },
        token: 'mock-jwt-token',
      },
    };
  },

  register: async (email: string, password: string, name: string) => {
    await delay(500);
    return {
      success: true,
      data: {
        user: {
          id: '1',
          email,
          name,
        },
        token: 'mock-jwt-token',
      },
    };
  },

  logout: async () => {
    await delay(200);
    return { success: true };
  },
};

export default api;
