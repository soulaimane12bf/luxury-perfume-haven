const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' ? `${window.location.origin}/api` : '/api');

// Simple in-memory cache with TTL
type CachedEntry = { data: unknown; timestamp: number };
const cache = new Map<string, CachedEntry>();
const CACHE_TTL = 60000; // 1 minute for public data
const ADMIN_CACHE_TTL = 10000; // 10 seconds for admin data

const getCachedData = <T = unknown>(key: string, ttl: number = CACHE_TTL): T | null => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    console.log(`[Cache HIT] ${key}`);
    return cached.data as T;
  }
  console.log(`[Cache MISS] ${key}`);
  return null;
};

const setCachedData = (key: string, data: unknown) => {
  cache.set(key, { data, timestamp: Date.now() });
};

const clearCache = (pattern?: string) => {
  if (pattern) {
    Array.from(cache.keys()).forEach(key => {
      if (key.includes(pattern)) cache.delete(key);
    });
  } else {
    cache.clear();
  }
};

// Error messages in Arabic and English
const ERROR_MESSAGES = {
  NETWORK_ERROR: {
    ar: 'فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.',
    en: 'Failed to connect to server. Please check your internet connection.',
  },
  UNAUTHORIZED: {
    ar: 'غير مصرح. يرجى تسجيل الدخول مرة أخرى.',
    en: 'Unauthorized. Please login again.',
  },
  FORBIDDEN: {
    ar: 'ليس لديك صلاحية للوصول إلى هذا المورد.',
    en: 'You do not have permission to access this resource.',
  },
  NOT_FOUND: {
    ar: 'المورد المطلوب غير موجود.',
    en: 'The requested resource was not found.',
  },
  SERVER_ERROR: {
    ar: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.',
    en: 'Server error occurred. Please try again later.',
  },
  VALIDATION_ERROR: {
    ar: 'البيانات المدخلة غير صحيحة. يرجى التحقق من المعلومات.',
    en: 'Invalid data. Please check the information.',
  },
  GENERIC_ERROR: {
    ar: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
    en: 'An unexpected error occurred. Please try again.',
  },
};

// Auth helpers
const getToken = () => typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
const withAuth = (headers: Record<string, string> = {}) => {
  const token = getToken();
  console.log('[API] withAuth called:', { hasToken: !!token, tokenLength: token?.length });
  return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
};

// Error handler helper
const handleApiError = async (response: Response, defaultMessage: string) => {
  let errorMessage = defaultMessage;
  
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorData.error || defaultMessage;
  } catch {
    // If JSON parsing fails, use status-based messages
    switch (response.status) {
      case 401:
        errorMessage = ERROR_MESSAGES.UNAUTHORIZED.ar;
        break;
      case 403:
        errorMessage = ERROR_MESSAGES.FORBIDDEN.ar;
        break;
      case 404:
        errorMessage = ERROR_MESSAGES.NOT_FOUND.ar;
        break;
      case 422:
        errorMessage = ERROR_MESSAGES.VALIDATION_ERROR.ar;
        break;
      case 500:
      case 502:
      case 503:
        errorMessage = ERROR_MESSAGES.SERVER_ERROR.ar;
        break;
      default:
        errorMessage = defaultMessage;
    }
  }
  
  return {
    status: response.status,
    message: errorMessage,
    isAuthError: response.status === 401,
  };
};

// API wrapper with error handling
const apiCall = async <T>(
  url: string,
  options: RequestInit = {},
  errorContext: string
): Promise<T> => {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const error = await handleApiError(response, `فشل ${errorContext}`);
      const errorObj = new Error(error.message) as Error & { status?: number; isAuthError?: boolean };
      errorObj.status = error.status;
      errorObj.isAuthError = error.isAuthError;
      throw errorObj;
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const networkError = new Error(ERROR_MESSAGES.NETWORK_ERROR.ar) as Error & { isNetworkError?: boolean };
      networkError.isNetworkError = true;
      throw networkError;
    }
    throw error;
  }
};

export const authApi = {
  login: async (username: string, password: string) => {
    return apiCall(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }, 'تسجيل الدخول');
  },
  
  verify: async () => {
    return apiCall(`${API_BASE_URL}/auth/verify`, {
      headers: withAuth(),
    }, 'التحقق من الصلاحيات');
  },
  
  changePassword: async (currentPassword: string, newPassword: string) => {
    return apiCall(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ currentPassword, newPassword }),
    }, 'تغيير كلمة المرور');
  },
};

// Products API
export const productsApi = {
  getAll: async (
    filters: Record<string, string | number | boolean | null | undefined> = {}
  ) => {
    const token = getToken();
    const isAdmin = !!token;
    
    // Create cache key from filters
    const cacheKey = `products:${JSON.stringify(filters)}`;
    
    // Check cache only for non-admin requests
    if (!isAdmin) {
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
    }
    
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });
    
    // Add cache-busting timestamp for admin requests
    if (isAdmin) {
      params.append('_t', Date.now().toString());
    }
    
    const data: unknown = await apiCall(`${API_BASE_URL}/products?${params}`, {
      headers: isAdmin ? withAuth({ 'Cache-Control': 'no-cache' }) : {},
    }, 'جلب المنتجات');
    // `data` shape varies by endpoint and request params; treat as unknown and
    // narrow below where needed to avoid `any` usage.

    // If the caller requested pagination (page or limit present) return the full
    // paginated response (products + meta). This allows public pages to request
    // specific pages and render pagination controls. Admin requests always
    // receive the full paginated response as well.
    const hasPaginationRequested = Object.prototype.hasOwnProperty.call(filters, 'page') || Object.prototype.hasOwnProperty.call(filters, 'limit');

    if (isAdmin || hasPaginationRequested) {
      return data; // { products, total, page, totalPages }
    }

    // For simple public list requests (no pagination) return only products array and cache it
    const resp = data as { products?: unknown };
    const productsData = resp.products ?? data;
    setCachedData(cacheKey, productsData);
    return productsData;
  },

  getById: async (id: string | number) => {
    const cacheKey = `product:${id}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;
    
    const data = await apiCall(`${API_BASE_URL}/products/${id}`, {}, 'جلب تفاصيل المنتج');
    setCachedData(cacheKey, data);
    return data;
  },

  getBestSelling: async (limit = 8, page: number | undefined = undefined) => {
    // If page is provided, request paginated response; otherwise behave like
    // previous implementation (return list limited by `limit`). Cache keys
    // include page when present.
    const cacheKey = page ? `bestsellers:page=${page}:limit=${limit}` : `bestsellers:limit=${limit}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const params = new URLSearchParams();
    params.append('limit', String(limit));
    if (page) params.append('page', String(page));

    const data = await apiCall(`${API_BASE_URL}/products/best-selling?${params}`, {}, 'جلب المنتجات الأكثر مبيعاً');
    setCachedData(cacheKey, data);
    return data;
  },

  getBrands: async () => {
    const cacheKey = 'brands';
    const cached = getCachedData(cacheKey);
    if (cached) return cached;
    
    const data = await apiCall(`${API_BASE_URL}/products/brands`, {}, 'جلب العلامات التجارية');
    setCachedData(cacheKey, data);
    return data;
  },

  search: async (query: string, limit = 10) => {
    const params = new URLSearchParams();
    params.append('q', query);
    params.append('limit', String(limit));
    const data = await apiCall(`${API_BASE_URL}/products/search?${params}`, {}, 'البحث عن المنتجات');
    // Normalize response: some backends return { products, total } while others return an array
    const resp: unknown = data;
    if (Array.isArray(resp)) return resp as unknown[];
    const maybeObj = resp as { products?: unknown };
    if (Array.isArray(maybeObj?.products)) return maybeObj.products as unknown[];
    return [];
  },

  create: async (product: unknown) => {
    const data = await apiCall(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(product),
    }, 'إنشاء منتج جديد');
    clearCache('products');
    clearCache('bestsellers');
    return data;
  },

  update: async (id: string | number, product: unknown) => {
    const data = await apiCall(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(product),
    }, 'تحديث المنتج');
    clearCache('products');
    clearCache('bestsellers');
    clearCache(`product:${id}`);
    return data;
  },

  delete: async (id: string | number) => {
    const data = await apiCall(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: withAuth(),
    }, 'حذف المنتج');
    clearCache('products');
    clearCache('bestsellers');
    clearCache(`product:${id}`);
    return data;
  },

  toggleBestSelling: async (id: string | number) => {
    const data = await apiCall(`${API_BASE_URL}/products/${id}/best-selling`, {
      method: 'PATCH',
      headers: withAuth({ 'Cache-Control': 'no-cache' }),
    }, 'تحديث حالة الأكثر مبيعاً');
    clearCache('products');
    clearCache('bestsellers');
    clearCache(`product:${id}`);
    return data;
  },
};

// Categories API
export const categoriesApi = {
  getAll: async () => {
    const token = getToken();
    const cacheKey = 'categories';
    
    // Use cache for non-admin requests
    if (!token) {
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
    }
    
    const url = token 
      ? `${API_BASE_URL}/categories?_t=${Date.now()}`
      : `${API_BASE_URL}/categories`;
    
    const data = await apiCall(url, {
      headers: token ? withAuth({ 'Cache-Control': 'no-cache' }) : {},
    }, 'جلب الفئات');
    
    // Cache for public requests
    if (!token) {
      setCachedData(cacheKey, data);
    }
    
    return data;
  },

  getBySlug: async (slug: string) => {
    const cacheKey = `category:${slug}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;
    
    const data = await apiCall(`${API_BASE_URL}/categories/${slug}`, {}, 'جلب تفاصيل الفئة');
    setCachedData(cacheKey, data);
    return data;
  },

  create: async (category: unknown) => {
    const data = await apiCall(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(category),
    }, 'إنشاء فئة جديدة');
    clearCache('categories');
    return data;
  },

  update: async (id: string | number, category: unknown) => {
    const data = await apiCall(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(category),
    }, 'تحديث الفئة');
    clearCache('categories');
    return data;
  },

  delete: async (id: string | number) => {
    const data = await apiCall(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: withAuth(),
    }, 'حذف الفئة');
    clearCache('categories');
    return data;
  },
};

// Reviews API
export const reviewsApi = {
  getByProduct: async (productId: string | number) => {
    try {
      return await apiCall(`${API_BASE_URL}/reviews/product/${productId}`, {}, 'جلب التقييمات');
    } catch (error) {
      console.error(`Failed to fetch reviews for product ${productId}:`, error);
      return [];
    }
  },

  getAll: async () => {
    try {
      const token = getToken();
      const url = token 
        ? `${API_BASE_URL}/reviews?_t=${Date.now()}`
        : `${API_BASE_URL}/reviews`;
      return await apiCall(url, {
        headers: withAuth({ 'Cache-Control': 'no-cache' }),
      }, 'جلب جميع التقييمات');
    } catch (error: unknown) {
      const e = error as { isAuthError?: boolean };
      if (e.isAuthError) {
        console.error('Unauthorized: Please login to view reviews');
      }
      return [];
    }
  },

  create: async (review: unknown) => {
    return apiCall(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    }, 'إنشاء تقييم جديد');
  },

  approve: async (id: string | number) => {
    return apiCall(`${API_BASE_URL}/reviews/${id}/approve`, {
      method: 'PATCH',
      headers: withAuth({ 'Cache-Control': 'no-cache' }),
    }, 'الموافقة على التقييم');
  },

  delete: async (id: string | number) => {
    return apiCall(`${API_BASE_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: withAuth(),
    }, 'حذف التقييم');
  },
};

// Orders API
export const ordersApi = {
  getAll: async () => {
    try {
      const url = `${API_BASE_URL}/orders?_t=${Date.now()}`;
      return await apiCall(url, {
        headers: withAuth({ 'Cache-Control': 'no-cache' }),
      }, 'جلب جميع الطلبات');
    } catch (error: unknown) {
      const e = error as { isAuthError?: boolean };
      if (e.isAuthError) {
        console.error('Unauthorized: Please login to view orders');
      }
      return [];
    }
  },

  getById: async (id: string | number) => {
    return apiCall(`${API_BASE_URL}/orders/${id}`, {
      headers: withAuth(),
    }, 'جلب تفاصيل الطلب');
  },

  create: async (orderData: {
    customer_name: string;
    customer_email?: string;
    customer_phone: string;
    customer_address: string;
    items: Array<{
      product_id: string;
      name: string;
      price: number;
      quantity: number;
      image_url: string;
    }>;
    total_amount: number;
    notes?: string;
  }) => {
    return apiCall(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    }, 'إنشاء طلب جديد');
  },

  updateStatus: async (id: string | number, status: string) => {
    return apiCall(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: withAuth({ 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' }),
      body: JSON.stringify({ status }),
    }, 'تحديث حالة الطلب');
  },

  delete: async (id: string | number) => {
    return apiCall(`${API_BASE_URL}/orders/${id}`, {
      method: 'DELETE',
      headers: withAuth(),
    }, 'حذف الطلب');
  },
};

// Profile API
export const profileApi = {
  getProfile: async () => {
    return apiCall(`${API_BASE_URL}/profile`, {
      headers: withAuth(),
    }, 'جلب الملف الشخصي');
  },

  updateProfile: async (profileData: {
    username?: string;
    email?: string;
    phone?: string;
    smtp_email?: string;
    smtp_password?: string;
    instagram?: string | null;
    facebook?: string | null;
  }) => {
    return apiCall(`${API_BASE_URL}/profile`, {
      method: 'PATCH',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(profileData),
    }, 'تحديث الملف الشخصي');
  },

  updatePassword: async (currentPassword: string, newPassword: string) => {
    return apiCall(`${API_BASE_URL}/profile/password`, {
      method: 'PATCH',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ currentPassword, newPassword }),
    }, 'تغيير كلمة المرور');
  },
};

// Sliders API
export const slidersApi = {
  // Public - get active sliders
  getActive: async () => {
    // Force a cache-busting query param so CDN/browser return freshest data
    const url = `${API_BASE_URL}/sliders/active?_t=${Date.now()}`;

    // Keep a very short in-memory cache to avoid rapid repeated calls during a single render
    const cacheKey = `sliders:active:${new URL(url).searchParams.get('_t')}`;
    const cached = getCachedData(cacheKey, 0);
    if (cached) return cached;

    const data = await apiCall(url, {
      headers: {
        'x-vercel-protection-bypass': 'da202b5d8c7405b541f77b8eac473b47',
        // Ask intermediate caches to revalidate
        'Cache-Control': 'no-cache'
      }
    }, 'جلب السلايدر');
    // store but with effectively no TTL since URL is unique per call
    setCachedData(cacheKey, data);
    return data;
  },

  // Admin - get all sliders
  getAll: async () => {
    const url = `${API_BASE_URL}/sliders?_t=${Date.now()}`;
    return apiCall(url, {
      headers: {
        ...withAuth({ 'Cache-Control': 'no-cache' }),
        'x-vercel-protection-bypass': 'da202b5d8c7405b541f77b8eac473b47'
      },
    }, 'جلب جميع السلايدرات');
  },

  // Admin - get single slider
  getById: async (id: string) => {
    return apiCall(`${API_BASE_URL}/sliders/${id}`, {
      headers: {
        ...withAuth(),
        'x-vercel-protection-bypass': 'da202b5d8c7405b541f77b8eac473b47'
      },
    }, 'جلب تفاصيل السلايدر');
  },

  // Admin - create slider with file upload
  create: async (formData: FormData) => {
    const data = await apiCall(`${API_BASE_URL}/sliders`, {
      method: 'POST',
      headers: {
        ...withAuth(), // Don't set Content-Type, let browser set it with boundary
        'x-vercel-protection-bypass': 'da202b5d8c7405b541f77b8eac473b47'
      },
      body: formData,
    }, 'إنشاء سلايدر');
    clearCache('sliders');
    return data;
  },

  // Admin - update slider with optional file upload
  update: async (id: string, formData: FormData) => {
    const data = await apiCall(`${API_BASE_URL}/sliders/${id}`, {
      method: 'PUT',
      headers: {
        ...withAuth(), // Don't set Content-Type, let browser set it with boundary
        'x-vercel-protection-bypass': 'da202b5d8c7405b541f77b8eac473b47'
      },
      body: formData,
    }, 'تحديث السلايدر');
    clearCache('sliders');
    return data;
  },

  // Admin - delete slider
  delete: async (id: string) => {
    const data = await apiCall(`${API_BASE_URL}/sliders/${id}`, {
      method: 'DELETE',
      headers: {
        ...withAuth(),
        'x-vercel-protection-bypass': 'da202b5d8c7405b541f77b8eac473b47'
      },
    }, 'حذف السلايدر');
    clearCache('sliders');
    return data;
  },
};
