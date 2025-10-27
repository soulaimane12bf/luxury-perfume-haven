import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi, categoriesApi, reviewsApi, ordersApi } from '../api';

// Query Keys
export const QUERY_KEYS = {
  products: {
    all: ['products'] as const,
    list: (filters: Record<string, string | number | boolean | null | undefined>) => ['products', 'list', filters] as const,
    detail: (id: string | number) => ['products', 'detail', id] as const,
    bestSelling: (limit: number) => ['products', 'best-selling', limit] as const,
    brands: ['products', 'brands'] as const,
    search: (query: string) => ['products', 'search', query] as const,
  },
  categories: {
    all: ['categories'] as const,
    detail: (slug: string) => ['categories', 'detail', slug] as const,
  },
  reviews: {
    all: ['reviews'] as const,
    byProduct: (productId: string | number) => ['reviews', 'product', productId] as const,
  },
  orders: {
    all: ['orders'] as const,
    detail: (id: string | number) => ['orders', 'detail', id] as const,
  },
};

// Products Hooks
export function useProducts(filters: Record<string, string | number | boolean | null | undefined> = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.products.list(filters),
    queryFn: () => productsApi.getAll(filters),
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
}

export function useProduct(id: string | number) {
  return useQuery({
    queryKey: QUERY_KEYS.products.detail(id),
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useBestSellingProducts(limit = 8, page?: number) {
  return useQuery({
    queryKey: ['products', 'best-selling', limit, page ?? 1] as const,
    queryFn: () => productsApi.getBestSelling(limit, page),
    staleTime: 10 * 60 * 1000, // 10 minutes - best sellers don't change often
  });
}

export function useBrands() {
  return useQuery({
    queryKey: QUERY_KEYS.products.brands,
    queryFn: () => productsApi.getBrands(),
    staleTime: 15 * 60 * 1000, // 15 minutes - brands rarely change
  });
}

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: QUERY_KEYS.products.search(query),
    queryFn: () => productsApi.search(query),
    enabled: query.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Categories Hooks
export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.categories.all,
    queryFn: () => categoriesApi.getAll(),
    staleTime: 30 * 60 * 1000, // 30 minutes - categories rarely change
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.categories.detail(slug),
    queryFn: () => categoriesApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Reviews Hooks
export function useReviews() {
  return useQuery({
    queryKey: QUERY_KEYS.reviews.all,
    queryFn: () => reviewsApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProductReviews(productId: string | number) {
  return useQuery({
    queryKey: QUERY_KEYS.reviews.byProduct(productId),
    queryFn: () => reviewsApi.getByProduct(productId),
    enabled: !!productId,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
}

// Orders Hooks
export function useOrders() {
  return useQuery({
    queryKey: QUERY_KEYS.orders.all,
    queryFn: () => ordersApi.getAll(),
    staleTime: 1 * 60 * 1000, // 1 minute - orders update frequently
  });
}

export function useOrder(id: string | number) {
  return useQuery({
    queryKey: QUERY_KEYS.orders.detail(id),
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Mutations with automatic cache updates
export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (product: unknown) => productsApi.create(product),
    onSuccess: () => {
      // Invalidate all product queries to refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.all });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: unknown }) => 
      productsApi.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific product and all product lists
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.all });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string | number) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.all });
    },
  });
}

export function useToggleBestSelling() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string | number) => productsApi.toggleBestSelling(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.products.all });
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
  mutationFn: (orderData: Parameters<typeof ordersApi.create>[0]) => ordersApi.create(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string | number; status: string }) => 
      ordersApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
    },
  });
}
