export const COLORS = {
  primary: '#1a1a1a',
  secondary: '#666666',
  accent: '#d4af37',
  background: '#ffffff',
  surface: '#f5f5f5',
  error: '#dc2626',
  success: '#16a34a',
  text: {
    primary: '#1a1a1a',
    secondary: '#666666',
    light: '#999999',
  },
  border: '#e5e5e5',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
};

export const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000/api' 
  : 'https://api.watchshop.com';

export const FILTERS_DEFAULT = {
  brands: [],
  priceRange: [0, 50000] as [number, number],
  movements: [] as ('automatic' | 'quartz' | 'mechanical')[],
  diameterRange: [30, 50] as [number, number],
  materials: [],
  colors: [],
  searchQuery: '',
};

export const SORT_OPTIONS = [
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Name: A to Z', value: 'name-asc' },
  { label: 'Name: Z to A', value: 'name-desc' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Newest', value: 'newest' },
] as const;

export const BRANDS = [
  'Rolex',
  'Omega',
  'Patek Philippe',
  'TAG Heuer',
  'Audemars Piguet',
  'Cartier',
  'IWC',
  'Tudor',
  'Panerai',
  'Grand Seiko',
  'Jaeger-LeCoultre',
  'Breitling',
];

export const MOVEMENTS = ['automatic', 'quartz', 'mechanical'] as const;

export const MATERIALS = [
  'Stainless Steel',
  'Gold',
  'Titanium',
  'Ceramic',
  'Leather',
  'Rubber',
];
