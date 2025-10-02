import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../lib/api';
import { Filter } from '../types';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productsApi.getFeatured(),
    staleTime: 1000 * 60 * 10,
  });
};

export const useBestSellers = () => {
  return useQuery({
    queryKey: ['products', 'best-sellers'],
    queryFn: () => productsApi.getBestSellers(),
    staleTime: 1000 * 60 * 10,
  });
};

export const useProductSearch = (
  filters: Partial<Filter>,
  page: number = 1,
  pageSize: number = 12
) => {
  return useQuery({
    queryKey: ['products', 'search', filters, page, pageSize],
    queryFn: () => productsApi.search(filters, page, pageSize),
    staleTime: 1000 * 60 * 2,
    placeholderData: (previousData) => previousData,
  });
};
