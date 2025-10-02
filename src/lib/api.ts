import axios from 'axios';
import { Product, Review, ApiResponse, PaginatedResponse, Filter } from '../types';
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

export const productsApi = {
  getAll: async (): Promise<ApiResponse<Product[]>> => {
    const response = await api.get('/watches');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await api.get(`/watches/${id}`);
    return response.data;
  },

  getFeatured: async (): Promise<ApiResponse<Product[]>> => {
    const response = await api.get('/watches/featured');
    return response.data;
  },

  getBestSellers: async (): Promise<ApiResponse<Product[]>> => {
    const response = await api.get('/watches/best-sellers');
    return response.data;
  },

  search: async (
    filters: Partial<Filter>,
    page: number = 1,
    pageSize: number = 12
  ): Promise<PaginatedResponse<Product>> => {
    const response = await api.get('/watches/search', {
      params: {
        ...filters,
        page,
        pageSize,
      },
    });

    return response.data;
  },

  create: async (productData: any) => {
    const response = await api.post('/watches', productData);
    return {
      success: true,
      data: response.data,
    };
  },

  update: async (id: string, productData: any) => {
    const response = await api.put(`/watches/${id}`, productData);
    return {
      success: true,
      data: response.data,
    };
  },

  delete: async (id: string) => {
    await api.delete(`/watches/${id}`);
    return { success: true };
  },
};

export const reviewsApi = {
  getByProductId: async (productId: string): Promise<ApiResponse<Review[]>> => {
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
    const response = await api.post('/reviews', reviewData);
    return {
      success: true,
      data: response.data,
    };
  },
};

export const authApi = {
  login: async (email: string, password: string) => {
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
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || 'User';
    const lastName = nameParts.slice(1).join(' ') || 'Name';
    
    const response = await api.post('/auth/register', { 
      email, 
      password, 
      firstName,
      lastName 
    });
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
    await api.post('/auth/logout');
    removeToken();
    return { success: true };
  },
};

export const cartApi = {
  getCart: async () => {
    const response = await api.get('/cart');
    return { success: true, data: response.data };
  },

  addItem: async (productId: string, quantity: number = 1, variantId?: string) => {
    const response = await api.post('/cart', { watchId: productId, quantity, variantId });
    return response.data;
  },

  updateItem: async (itemId: string, quantity: number) => {
    const response = await api.put(`/cart/${itemId}`, { quantity });
    return response.data;
  },

  removeItem: async (itemId: string) => {
    await api.delete(`/cart/${itemId}`);
    return { success: true };
  },

  clearCart: async () => {
    await api.delete('/cart');
    return { success: true };
  },
};

export const ordersApi = {
  createOrder: async (orderData: any) => {
    const response = await api.post('/orders', orderData);
    return { success: true, data: response.data };
  },

  getOrders: async (page: number = 1, pageSize: number = 10) => {
    const response = await api.get('/orders', { params: { page, pageSize } });
    return response.data;
  },

  getOrderById: async (orderId: string) => {
    const response = await api.get(`/orders/${orderId}`);
    return { success: true, data: response.data };
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  },
};

export const wishlistApi = {
  getWishlist: async () => {
    const response = await api.get('/wishlist');
    return { success: true, data: response.data };
  },

  addItem: async (productId: string) => {
    const response = await api.post('/wishlist', { watchId: productId });
    return response.data;
  },

  removeItem: async (productId: string) => {
    await api.delete(`/wishlist/${productId}`);
    return { success: true };
  },
};

export const adminApi = {
  // Users Management
  getUsers: async (page: number = 1, pageSize: number = 10) => {
    const response = await api.get('/users', { params: { page, pageSize } });
    return response.data;
  },

  getUserById: async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return { success: true, data: response.data };
  },

  createUser: async (userData: any) => {
    const response = await api.post('/users', userData);
    return { success: true, data: response.data };
  },

  updateUser: async (userId: string, userData: any) => {
    const response = await api.put(`/users/${userId}`, userData);
    return { success: true, data: response.data };
  },

  deleteUser: async (userId: string) => {
    await api.delete(`/users/${userId}`);
    return { success: true };
  },

  // Stores Management
  getStores: async (page: number = 1, pageSize: number = 10) => {
    const response = await api.get('/stores', { params: { page, pageSize } });
    return response.data;
  },

  getStoreById: async (storeId: string) => {
    const response = await api.get(`/stores/${storeId}`);
    return { success: true, data: response.data };
  },

  createStore: async (storeData: any) => {
    const response = await api.post('/stores', storeData);
    return { success: true, data: response.data };
  },

  updateStore: async (storeId: string, storeData: any) => {
    const response = await api.put(`/stores/${storeId}`, storeData);
    return { success: true, data: response.data };
  },

  deleteStore: async (storeId: string) => {
    await api.delete(`/stores/${storeId}`);
    return { success: true };
  },

  // Support/Chat
  getSupportTickets: async (page: number = 1, pageSize: number = 10) => {
    const response = await api.get('/support/tickets', { params: { page, pageSize } });
    return response.data;
  },

  getTicketMessages: async (ticketId: string) => {
    const response = await api.get(`/support/tickets/${ticketId}/messages`);
    return { success: true, data: response.data };
  },

  sendMessage: async (ticketId: string, message: string) => {
    const response = await api.post(`/support/tickets/${ticketId}/messages`, { message });
    return { success: true, data: response.data };
  },
};

export default api;
