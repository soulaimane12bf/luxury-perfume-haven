const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Auth helpers
const getToken = () => typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
const withAuth = (headers: Record<string, string> = {}) => {
  const token = getToken();
  return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
};

export const authApi = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },
  verify: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: withAuth(),
    });
    if (!response.ok) throw new Error('Not authenticated');
    return response.json();
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!response.ok) throw new Error('Change password failed');
    return response.json();
  },
};

// Products API
export const productsApi = {
  getAll: async (
    filters: Record<string, string | number | boolean | null | undefined> = {}
  ) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });
    const response = await fetch(`${API_BASE_URL}/products?${params}`);
    return response.json();
  },

  getById: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return response.json();
  },

  getBestSelling: async (limit = 8) => {
    const response = await fetch(`${API_BASE_URL}/products/best-selling?limit=${limit}`);
    return response.json();
  },

  getBrands: async () => {
    const response = await fetch(`${API_BASE_URL}/products/brands`);
    return response.json();
  },

  create: async (product: unknown) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(product),
    });
    return response.json();
  },

  update: async (id: string | number, product: unknown) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(product),
    });
    return response.json();
  },

  delete: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: withAuth(),
    });
    return response.json();
  },

  toggleBestSelling: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}/best-selling`, {
      method: 'PATCH',
      headers: withAuth(),
    });
    return response.json();
  },
};

// Categories API
export const categoriesApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    return response.json();
  },

  getBySlug: async (slug: string) => {
    const response = await fetch(`${API_BASE_URL}/categories/${slug}`);
    return response.json();
  },

  create: async (category: unknown) => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(category),
    });
    return response.json();
  },

  update: async (id: string | number, category: unknown) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(category),
    });
    return response.json();
  },

  delete: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: withAuth(),
    });
    return response.json();
  },
};

// Reviews API
export const reviewsApi = {
  getByProduct: async (productId: string | number) => {
    const response = await fetch(`${API_BASE_URL}/reviews/product/${productId}`);
    return response.json();
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      headers: withAuth(),
    });
    return response.json();
  },

  create: async (review: unknown) => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });
    return response.json();
  },

  approve: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}/approve`, {
      method: 'PATCH',
      headers: withAuth(),
    });
    return response.json();
  },

  delete: async (id: string | number) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: withAuth(),
    });
    return response.json();
  },
};
