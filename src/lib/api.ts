import axios from 'axios';
import { Product, Review, ApiResponse, PaginatedResponse, Filter } from '../types';
import { mockProducts, mockReviews } from '../data/mockProducts';
import { API_CONFIG } from '../config/api.config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token storage helper (works on web)
const getToken = () => {
  try {
    return (global as any).localStorage?.getItem('authToken') || null;
  } catch {
    return null;
  }
};

const removeToken = () => {
  try {
    (global as any).localStorage?.removeItem('authToken');
  } catch {
    // Ignore error
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      removeToken();
    }
    return Promise.reject(error);
  }
);

// Mock API implementation - simulates backend responses (for development)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const productsApi = {
  getAll: async (): Promise<ApiResponse<Product[]>> => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(300);
      return {
        success: true,
        data: mockProducts,
      };
    }

    const response = await api.get('/watches');
    return {
      success: true,
      data: response.data,
    };
  },

  getById: async (id: string): Promise<ApiResponse<Product>> => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(200);
      const product = mockProducts.find(p => p.id === id);
      if (!product) {
        throw new Error('Product not found');
      }
      return {
        success: true,
        data: product,
      };
    }

    const response = await api.get(`/watches/${id}`);
    return {
      success: true,
      data: response.data,
    };
  },

  getFeatured: async (): Promise<ApiResponse<Product[]>> => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(200);
      return {
        success: true,
        data: mockProducts.filter(p => p.isFeatured),
      };
    }

    const response = await api.get('/watches/featured');
    return {
      success: true,
      data: response.data,
    };
  },

  getBestSellers: async (): Promise<ApiResponse<Product[]>> => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(200);
      return {
        success: true,
        data: mockProducts.filter(p => p.isBestSeller),
      };
    }

    const response = await api.get('/watches/bestsellers');
    return {
      success: true,
      data: response.data,
    };
  },

  search: async (
    filters: Partial<Filter>,
    page: number = 1,
    pageSize: number = 12
  ): Promise<PaginatedResponse<Product>> => {
    if (API_CONFIG.ENABLE_MOCK) {
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
    }

    const response = await api.get('/watches/search', {
      params: {
        ...filters,
        page,
        pageSize,
      },
    });

    return response.data;
  },
};

export const reviewsApi = {
  getByProductId: async (productId: string): Promise<ApiResponse<Review[]>> => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(200);
      return {
        success: true,
        data: mockReviews.filter(r => r.productId === productId),
      };
    }

    const response = await api.get(`/reviews/watch/${productId}`);
    return {
      success: true,
      data: response.data,
    };
  },

  create: async (reviewData: {
    productId: string;
    rating: number;
    comment: string;
  }) => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(300);
      return {
        success: true,
        data: { id: Date.now().toString(), ...reviewData },
      };
    }

    const response = await api.post('/reviews', reviewData);
    return {
      success: true,
      data: response.data,
    };
  },
};

export const authApi = {
  login: async (email: string, password: string) => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(500);
      if (email === 'admin@watchtime.com' && password === 'admin123') {
        return {
          success: true,
          data: {
            user: {
              id: 'admin-1',
              email,
              name: 'Admin User',
              role: 'admin' as const,
              avatar: 'https://ui-avatars.com/api/?name=Admin&background=3B82F6&color=fff',
            },
            token: 'mock-admin-jwt-token',
          },
        };
      }
      return {
        success: true,
        data: {
          user: {
            id: '1',
            email,
            name: email.split('@')[0],
            role: 'customer' as const,
          },
          token: 'mock-jwt-token',
        },
      };
    }

    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    
    try {
      (global as any).localStorage?.setItem('authToken', token);
    } catch {}
    
    return {
      success: true,
      data: { user, token },
    };
  },

  register: async (email: string, password: string, name: string) => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(500);
      return {
        success: true,
        data: {
          user: {
            id: '1',
            email,
            name,
            role: 'customer' as const,
          },
          token: 'mock-jwt-token',
        },
      };
    }

    const response = await api.post('/auth/register', { email, password, name });
    const { token, user } = response.data;
    
    try {
      (global as any).localStorage?.setItem('authToken', token);
    } catch {}
    
    return {
      success: true,
      data: { user, token },
    };
  },

  logout: async () => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(200);
      removeToken();
      return { success: true };
    }

    await api.post('/auth/logout');
    removeToken();
    return { success: true };
  },
};

export const cartApi = {
  getCart: async () => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(300);
      return { success: true, data: { items: [], total: 0 } };
    }

    const response = await api.get('/cart');
    return { success: true, data: response.data };
  },

  addItem: async (productId: string, quantity: number = 1, variantId?: string) => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(200);
      return { success: true };
    }

    const response = await api.post('/cart/items', { productId, quantity, variantId });
    return { success: true, data: response.data };
  },

  updateItem: async (itemId: string, quantity: number) => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(200);
      return { success: true };
    }

    const response = await api.put(`/cart/items/${itemId}`, { quantity });
    return { success: true, data: response.data };
  },

  removeItem: async (itemId: string) => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(200);
      return { success: true };
    }

    await api.delete(`/cart/items/${itemId}`);
    return { success: true };
  },

  clearCart: async () => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(200);
      return { success: true };
    }

    await api.delete('/cart');
    return { success: true };
  },
};

export const ordersApi = {
  createOrder: async (orderData: any) => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(500);
      return {
        success: true,
        data: { id: Date.now().toString(), ...orderData, status: 'pending' },
      };
    }

    const response = await api.post('/orders', orderData);
    return { success: true, data: response.data };
  },

  getOrders: async (page: number = 1, pageSize: number = 10) => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(300);
      return {
        data: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      };
    }

    const response = await api.get('/orders', { params: { page, pageSize } });
    return response.data;
  },

  getOrderById: async (orderId: string) => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(200);
      return { success: true, data: null };
    }

    const response = await api.get(`/orders/${orderId}`);
    return { success: true, data: response.data };
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(200);
      return { success: true };
    }

    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return { success: true, data: response.data };
  },
};

export const wishlistApi = {
  getWishlist: async () => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(200);
      return { success: true, data: [] };
    }

    const response = await api.get('/wishlist');
    return { success: true, data: response.data };
  },

  addItem: async (productId: string) => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(200);
      return { success: true };
    }

    const response = await api.post('/wishlist/items', { productId });
    return { success: true, data: response.data };
  },

  removeItem: async (productId: string) => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(200);
      return { success: true };
    }

    await api.delete(`/wishlist/items/${productId}`);
    return { success: true };
  },
};

export const adminApi = {
  // Users Management
  getUsers: async (page: number = 1, pageSize: number = 10) => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(300);
      return {
        data: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      };
    }

    const response = await api.get('/users', { params: { page, pageSize } });
    return response.data;
  },

  getUserById: async (userId: string) => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(200);
      return { success: true, data: null };
    }

    const response = await api.get(`/users/${userId}`);
    return { success: true, data: response.data };
  },

  createUser: async (userData: any) => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(300);
      return { success: true, data: { id: Date.now().toString(), ...userData } };
    }

    const response = await api.post('/users', userData);
    return { success: true, data: response.data };
  },

  updateUser: async (userId: string, userData: any) => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(200);
      return { success: true };
    }

    const response = await api.put(`/users/${userId}`, userData);
    return { success: true, data: response.data };
  },

  deleteUser: async (userId: string) => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(200);
      return { success: true };
    }

    await api.delete(`/users/${userId}`);
    return { success: true };
  },

  // Stores Management
  getStores: async (page: number = 1, pageSize: number = 10) => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(300);
      return {
        data: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      };
    }

    const response = await api.get('/stores', { params: { page, pageSize } });
    return response.data;
  },

  getStoreById: async (storeId: string) => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(200);
      return { success: true, data: null };
    }

    const response = await api.get(`/stores/${storeId}`);
    return { success: true, data: response.data };
  },

  createStore: async (storeData: any) => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(300);
      return { success: true, data: { id: Date.now().toString(), ...storeData } };
    }

    const response = await api.post('/stores', storeData);
    return { success: true, data: response.data };
  },

  updateStore: async (storeId: string, storeData: any) => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(200);
      return { success: true };
    }

    const response = await api.put(`/stores/${storeId}`, storeData);
    return { success: true, data: response.data };
  },

  deleteStore: async (storeId: string) => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(200);
      return { success: true };
    }

    await api.delete(`/stores/${storeId}`);
    return { success: true };
  },

  // Support/Chat
  getSupportTickets: async (page: number = 1, pageSize: number = 10) => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(300);
      return {
        data: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      };
    }

    const response = await api.get('/support/tickets', { params: { page, pageSize } });
    return response.data;
  },

  getTicketMessages: async (ticketId: string) => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(200);
      return { success: true, data: [] };
    }

    const response = await api.get(`/support/tickets/${ticketId}/messages`);
    return { success: true, data: response.data };
  },

  sendMessage: async (ticketId: string, message: string) => {
    if (API_CONFIG.ENABLE_MOCK) {
      await delay(200);
      return { success: true };
    }

    const response = await api.post(`/support/tickets/${ticketId}/messages`, { message });
    return { success: true, data: response.data };
  },
};

export default api;
