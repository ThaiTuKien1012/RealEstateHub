export const API_CONFIG = {
  BASE_URL: 'https://beecommercewatchstore-production.up.railway.app/api',
  TIMEOUT: 10000,
  ENABLE_MOCK: false, // Set to true for development with mock data
};

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  
  // Watches/Products
  WATCHES: {
    LIST: '/watches',
    DETAIL: '/watches/:id',
    SEARCH: '/watches/search',
    FEATURED: '/watches/featured',
    BESTSELLERS: '/watches/bestsellers',
  },
  
  // Cart
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    UPDATE: '/cart/update',
    REMOVE: '/cart/remove/:id',
    CLEAR: '/cart/clear',
  },
  
  // Orders
  ORDERS: {
    LIST: '/orders',
    DETAIL: '/orders/:id',
    CREATE: '/orders/create',
    UPDATE_STATUS: '/orders/:id/status',
  },
  
  // Wishlist
  WISHLIST: {
    GET: '/wishlist',
    ADD: '/wishlist/add',
    REMOVE: '/wishlist/remove/:id',
  },
  
  // Admin - Users
  USERS: {
    LIST: '/users',
    DETAIL: '/users/:id',
    CREATE: '/users/create',
    UPDATE: '/users/:id',
    DELETE: '/users/:id',
  },
  
  // Admin - Stores
  STORES: {
    LIST: '/stores',
    DETAIL: '/stores/:id',
    CREATE: '/stores/create',
    UPDATE: '/stores/:id',
    DELETE: '/stores/:id',
  },
  
  // Admin - Support
  SUPPORT: {
    TICKETS: '/chat/tickets',
    TICKET_DETAIL: '/chat/tickets/:id',
    SEND_MESSAGE: '/chat/messages',
  },
};
