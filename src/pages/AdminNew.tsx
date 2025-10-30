import { useState, useEffect, Fragment } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import AdminNavbar from '@/components/AdminNavbar';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import AdminProfile from '@/components/AdminProfile';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BestSellingToggle } from '@/components/BestSellingToggle';
import { Badge } from '@/components/ui/badge';
import { compressImage } from '@/lib/imageCompression';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { generateCustomerWhatsAppUrl } from '@/lib/whatsapp';
import { productsApi, categoriesApi, reviewsApi, ordersApi, slidersApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import showAdminAlert from '@/lib/swal-admin';
import { useAuth } from '@/hooks/use-auth';
import { 
  Package, 
  FolderTree, 
  Star, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2,
  Check,
  X,
  MessageCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';

// Basic type definitions used in this admin page
// These are intentionally minimal — expand as needed to match your backend contracts.
type Product = {
  id: string;
  name: string;
  brand?: string;
  price?: number | string;
  old_price?: number | string | null;
  category?: string;
  type?: string;
  size?: string;
  description?: string;
  stock?: number | string;
  image_urls?: string[];
  best_selling?: boolean;
  // any additional fields returned by your API can be added here
};

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
};

type Review = {
  id: string;
  name: string;
  rating: number;
  comment?: string;
  approved?: boolean;
  product_id?: string;
};

type Order = {
  id: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  customer_address?: string;
  shipping_address?: string;
  city?: string;
  items?: any[];
  total_amount?: number;
  status?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  // extend as needed
};

type Slider = {
  id: string;
  image_url?: string;
  title?: string;
  subtitle?: string;
  button_text?: string;
  button_link?: string;
  order?: number;
  active?: boolean;
};

// Add PaginatedResponse type definition
type PaginatedResponse = {
  products: Product[];
  total: number;
  totalPages: number;
};

type DeleteTarget = {
  type: 'product' | 'category' | 'review' | 'order' | 'slider';
  id: string;
  name?: string;
  meta?: string;
};

const ADMIN_TABS = ['orders', 'products', 'categories', 'reviews', 'bestsellers', 'sliders', 'profile'] as const;
type AdminTab = typeof ADMIN_TABS[number];
const DEFAULT_ADMIN_TAB: AdminTab = 'orders';

type CategoryForm = {
  name: string;
  slug: string;
  description: string;
};

const isAdminTab = (value: string | null): value is AdminTab =>
  Boolean(value && (ADMIN_TABS as readonly string[]).includes(value));

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, token, loading: authLoading, logout } = useAuth();

  // Auto logout on session end (token missing/invalid)
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !token) {
      showAdminAlert({ title: 'انتهت الجلسة', text: 'يرجى تسجيل الدخول مرة أخرى', icon: 'error', timer: 4000 });
      if (typeof logout === 'function') logout();
      navigate('/login');
      return;
    }
    // Periodic check every 30 seconds
    const interval = setInterval(() => {
      const t = localStorage.getItem('token');
      if (!t) {
        showAdminAlert({ title: 'انتهت الجلسة', text: 'يرجى تسجيل الدخول مرة أخرى', icon: 'error', timer: 4000 });
        if (typeof logout === 'function') logout();
        navigate('/login');
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, token, authLoading, logout, navigate]);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const productPageParam = parseInt(searchParams.get('productsPage') || '1', 10) || 1;
  const [productPage, setProductPage] = useState<number>(productPageParam);
  const [productLimit, setProductLimit] = useState<number>(24);
  const [productTotalPages, setProductTotalPages] = useState<number>(1);
  const [productTotal, setProductTotal] = useState<number>(0);
  const [productBestSellersCount, setProductBestSellersCount] = useState<number>(0);
  // Best-sellers specific pagination/state
  const [bestSellersProducts, setBestSellersProducts] = useState<Product[]>([]);
  const bestSellersPageParam = parseInt(searchParams.get('bestsellersPage') || '1', 10) || 1;
  const [bestSellersPage, setBestSellersPage] = useState<number>(bestSellersPageParam);
  const [bestSellersLimit, setBestSellersLimit] = useState<number>(24);
  const [bestSellersTotalPages, setBestSellersTotalPages] = useState<number>(1);
  const [bestSellersTotal, setBestSellersTotal] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [sliders, setSliders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTabState] = useState<AdminTab>(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    return isAdminTab(tabParam) ? tabParam : DEFAULT_ADMIN_TAB;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);
  const handleTabChange = (tab: string) => {
    if (isAdminTab(tab)) {
      setActiveTabState(tab);
    } else {
      setActiveTabState(DEFAULT_ADMIN_TAB);
    }
  };
  
  // Product search state
  const [productSearchQuery, setProductSearchQuery] = useState('');

  // Debug: Log categories when they change
  useEffect(() => {
    console.log('Categories state updated:', categories);
  }, [categories]);

  // Filtered products based on search
  const filteredProducts = products.filter((product) => {
    const matchesSearch = productSearchQuery === '' || 
      product.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(productSearchQuery.toLowerCase());
    
    return matchesSearch;
  });
  
  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };
  
  // Product form state
  const [productDialog, setProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    brand: '',
    price: '',
    old_price: '',
    category: '',
    type: 'PRODUIT',
    size: '100ml',
    description: '',
    stock: '' as string | number,
  });
  const [productImages, setProductImages] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);

  // Category form state
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryForm>({
    name: '',
    slug: '',
    description: '',
  });

  // Slider form state
  const [sliderDialog, setSliderDialog] = useState(false);
  const [editingSlider, setEditingSlider] = useState<any | null>(null);
  const [sliderForm, setSliderForm] = useState({
    image_url: '',
    title: '',
    subtitle: '',
    button_text: '',
    button_link: '',
    order: 0,
    active: true,
  });
  const [sliderImage, setSliderImage] = useState<File | null>(null);

  // Check authentication
  useEffect(() => {
    // Wait for auth to finish loading before checking
    if (authLoading) return;
    
    if (!isAuthenticated || !token) {
      showAdminAlert({ title: 'غير مصرح', text: 'يرجى تسجيل الدخول أولاً', icon: 'error', timer: 5000 });
      navigate('/login');
    }
  }, [isAuthenticated, token, authLoading, navigate, toast]);

  // Pagination helpers (desktop full with ellipses, mobile condensed)
  const generateDesktopPages = (current: number, total: number) => {
    const pages: (number | 'e')[] = [];
    const showEllipsisStart = current > 4;
    const showEllipsisEnd = current < total - 3;

    pages.push(1);

    if (showEllipsisStart) {
      pages.push('e');
      for (let i = current - 2; i < current; i++) {
        if (i > 1 && i < total) pages.push(i);
      }
    } else {
      for (let i = 2; i < current; i++) {
        if (i < total) pages.push(i);
      }
    }

    if (current !== 1 && current !== total) pages.push(current);

    if (showEllipsisEnd) {
      for (let i = current + 1; i <= current + 2; i++) {
        if (i > 1 && i < total) pages.push(i);
      }
      pages.push('e');
    } else {
      for (let i = current + 1; i < total; i++) {
        pages.push(i);
      }
    }

    if (total > 1) pages.push(total);
    return pages;
  };

  const generateMobilePages = (current: number, total: number) => {
    const pages: (number | 'e')[] = [];
    pages.push(1);
    if (current > 2) pages.push('e');
    if (current > 1 && current < total) {
      if (current > 2) pages.push(current - 1);
      pages.push(current);
      if (current < total - 1) pages.push(current + 1);
    }
    if (current < total - 1) pages.push('e');
    if (total > 1) pages.push(total);
    return pages;
  };

  // When admin logs in, pre-fetch counts/stats so top cards show correct numbers
  useEffect(() => {
    const fetchAdminStats = async () => {
      if (authLoading || !isAuthenticated) return;
      try {
        // Fetch lightweight paginated product meta + small lists for other entities in parallel
        setLoading(true);
        const [productsPage, categoriesList, reviewsList, ordersList, bestSellersPage] = (await Promise.all([
          productsApi.getAll({ page: 1, limit: 1 }).catch(() => ({ products: [], total: 0, totalPages: 1 })),
          categoriesApi.getAll().catch(() => []),
          reviewsApi.getAll().catch(() => []),
          ordersApi.getAll().catch(() => []),
          // get count of best selling products via filtered paginated request
          productsApi.getAll({ best_selling: true, page: 1, limit: 1 }).catch(() => ({ products: [], total: 0 })),
  ])) as [PaginatedResponse, unknown[], unknown[], unknown[], PaginatedResponse];

        // Update product totals (server-provided)
        if (productsPage && typeof productsPage.total !== 'undefined') {
          setProductTotal(Number(productsPage.total || 0));
          setProductTotalPages(Number(productsPage.totalPages || 1));
        }

        // Populate other admin lists so stats derive correctly
  if (Array.isArray(categoriesList) && categoriesList.length > 0) setCategories(categoriesList as unknown as Category[]);
  if (Array.isArray(reviewsList) && reviewsList.length > 0) setReviews(reviewsList as unknown as Review[]);
  if (Array.isArray(ordersList) && ordersList.length > 0) setOrders(ordersList as unknown as any[]);

        // Best sellers count from paginated meta
        if (bestSellersPage && typeof bestSellersPage.total !== 'undefined') {
          setProductBestSellersCount(Number(bestSellersPage.total || 0));
        }
      } catch (err) {
        console.error('Failed to prefetch admin stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    // Load data for the active tab only
    loadTabData(activeTab);
  }, [activeTab]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    const normalizedTab = isAdminTab(tabParam) ? tabParam : DEFAULT_ADMIN_TAB;
    setActiveTabState((current) => (current === normalizedTab ? current : normalizedTab));
  }, [location.search]);

  // Keep product page in sync with URL so refresh/back-forward preserves page
  useEffect(() => {
    const p = parseInt(searchParams.get('productsPage') || '1', 10) || 1;
    if (p !== productPage) setProductPage(p);
  }, [searchParams]);

  useEffect(() => {
    const p = parseInt(searchParams.get('productsPage') || '1', 10) || 1;
    if (p !== productPage) {
      const np = new URLSearchParams(searchParams);
      np.set('productsPage', String(productPage));
      setSearchParams(np, { replace: true });
    }
  }, [productPage]);

  // Keep best-sellers page in sync with URL
  useEffect(() => {
    const bp = parseInt(searchParams.get('bestsellersPage') || '1', 10) || 1;
    if (bp !== bestSellersPage) setBestSellersPage(bp);
  }, [searchParams]);

  useEffect(() => {
    const bp = parseInt(searchParams.get('bestsellersPage') || '1', 10) || 1;
    if (bp !== bestSellersPage) {
      const np = new URLSearchParams(searchParams);
      np.set('bestsellersPage', String(bestSellersPage));
      setSearchParams(np, { replace: true });
    }
  }, [bestSellersPage]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === activeTab) {
      return;
    }
    params.set('tab', activeTab);
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
  }, [activeTab, location.pathname, location.search, navigate]);

  // Handle browser back/forward so the app doesn't feel like it's "toggling"
  // repeatedly between admin tabs. If the user navigates via history to a
  // different admin tab (popstate) we prefer to send them to the login page
  // rather than allow quick toggling between two admin tabs which is confusing.
  useEffect(() => {
    const onPopState = () => {
      try {
        const { pathname, search } = window.location;
        if (pathname !== '/admin') return;
        const params = new URLSearchParams(search);
        const tab = params.get('tab') || DEFAULT_ADMIN_TAB;
        if (tab !== activeTab) {
          // Redirect to login to break toggle loop. Use replace so we don't
          // create an extra history entry.
          navigate('/login', { replace: true });
        }
      } catch (e) {
        // ignore
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [activeTab, navigate]);

  // Helper function to handle API errors
  const handleApiError = (error: any, operation: string) => {
    console.error(`Error during ${operation}:`, error);
    
    let errorMessage = error?.message || 'حدث خطأ غير متوقع';
    let shouldLogout = false;

    // Try to extract backend error message
    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.data?.message) {
      errorMessage = error.data.message;
    }

    // Check for specific error types
    if (error?.status === 413 || error?.message?.includes('413')) {
      errorMessage = 'حجم الصورة كبير جداً. يرجى اختيار صورة أصغر (أقل من 10MB).';
    } else if (error?.isAuthError || error?.status === 401 || error?.message?.includes('401')) {
      errorMessage = 'انتهت جلستك. يرجى تسجيل الدخول مرة أخرى.';
      shouldLogout = true;
    } else if (error?.isNetworkError) {
      errorMessage = 'فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.';
    }

    showAdminAlert({ title: 'خطأ', text: errorMessage, icon: 'error', timer: 5000 });

    if (shouldLogout) {
      setTimeout(() => navigate('/login'), 1500);
    }
  };

  const handleContactCustomer = (order: any) => {
    const whatsappUrl = generateCustomerWhatsAppUrl(
      order.customer_phone,
      {
        orderId: order.id,
        customerName: order.customer_name,
        totalAmount: order.total_amount,
      }
    );
    window.open(whatsappUrl, '_blank');
  };

  const formatOrderDate = (order: any): string => {
    try {
      // Try both created_at (snake_case from DB) and createdAt (camelCase from Sequelize)
      const dateValue = order.created_at || order.createdAt || order.updatedAt || order.updated_at;
      
      if (!dateValue) {
        console.warn('No date field found in order:', order);
        return 'لا يوجد تاريخ';
      }
      
      const date = new Date(dateValue);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date value:', dateValue);
        return 'تاريخ غير صالح';
      }
      
      return date.toLocaleDateString('ar-MA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'تاريخ غير صالح';
    }
  };

  const loadTabData = async (tab: AdminTab) => {
    try {
      setLoading(true);
      
      switch (tab) {
        case 'orders':
          if (orders.length === 0) {
            const ordersData = await ordersApi.getAll().catch(() => []);
            setOrders(Array.isArray(ordersData) ? ordersData : []);
          }
          break;
        case 'products':
          if (products.length === 0) {
            const productsData = (await productsApi.getAll({ page: productPage, limit: productLimit }).catch(() => ({ products: [] }))) as PaginatedResponse | unknown;
            // If admin receives paginated response, it will include products + meta
            if (productsData && typeof productsData === 'object' && 'products' in productsData) {
              const pd = productsData as PaginatedResponse;
              setProducts(Array.isArray(pd.products) ? (pd.products as any) : []);
              setProductTotal(Number(pd.total || 0));
              setProductTotalPages(Number(pd.totalPages || 1));
            } else {
              const productsArray = Array.isArray(productsData) ? productsData : ([] as unknown[]);
              setProducts(Array.isArray(productsArray) ? (productsArray as any) : []);
            }
          }
          break;
        case 'bestsellers':
          // For admin UX we want to show the same paginated product list here
          // but with a toggle for "best_selling". So load the regular products
          // page and also fetch a lightweight count of total best-selling items
          // to display the totals.
          if (bestSellersProducts.length === 0) {
            const productsPage = (await productsApi.getAll({ page: bestSellersPage, limit: bestSellersLimit }).catch(() => ({ products: [] }))) as PaginatedResponse | unknown;
            if (productsPage && typeof productsPage === 'object' && 'products' in productsPage) {
              const pp = productsPage as PaginatedResponse;
              setBestSellersProducts(Array.isArray(pp.products) ? (pp.products as any) : []);
              // total here is total products; keep separate total for best-sellers count
              setBestSellersTotalPages(Number(pp.totalPages || 1));
            } else {
              const arr = Array.isArray(productsPage) ? productsPage : ([] as unknown[]);
              setBestSellersProducts(Array.isArray(arr) ? (arr as any) : []);
            }

            // Fetch only the meta count for best-selling products so we can show totals
            (async () => {
              try {
                const bestCount = (await productsApi.getAll({ best_selling: true, page: 1, limit: 1 }).catch(() => ({ total: 0 }))) as PaginatedResponse | unknown;
                if (bestCount && typeof bestCount === 'object' && 'total' in bestCount) {
                  const bc = bestCount as PaginatedResponse;
                  setBestSellersTotal(Number(bc.total || 0));
                }
              } catch (e) {
                // ignore
              }
            })();
          }
          break;
        case 'categories':
          if (categories.length === 0) {
            const categoriesData = await categoriesApi.getAll().catch(() => []);
            setCategories(Array.isArray(categoriesData) ? categoriesData : []);
          }
          break;
        case 'reviews':
          if (reviews.length === 0) {
            const reviewsData = await reviewsApi.getAll().catch(() => []);
            setReviews(Array.isArray(reviewsData) ? reviewsData : []);
          }
          break;
        case 'sliders':
          if (sliders.length === 0) {
            const slidersData = await slidersApi.getAll().catch(() => []);
            setSliders(Array.isArray(slidersData) ? slidersData : []);
          }
          break;
        case 'profile':
          // Profile tab doesn't need data loading
          break;
      }
    } catch (error: any) {
      console.error(`Error loading ${tab} data:`, error);
      handleApiError(error, `تحميل بيانات ${tab}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    // Deprecated - now using loadTabData for better performance
    // This is kept for backward compatibility only
    await loadTabData(activeTab);
  };

  // Re-fetch products when page or limit changes (only when products tab is active)
  useEffect(() => {
    if (activeTab === 'products') {
      (async () => {
        try {
          setLoading(true);
            const productsData = (await productsApi.getAll({ page: productPage, limit: productLimit })) as any;
          if (productsData && typeof productsData === 'object' && 'products' in productsData) {
            const pd = productsData as PaginatedResponse;
            setProducts(Array.isArray(pd.products) ? (pd.products as any) : []);
            setProductTotal(Number(pd.total || 0));
            setProductTotalPages(Number(pd.totalPages || 1));
          } else {
            const productsArray = Array.isArray(productsData) ? productsData : ([] as unknown[]);
            setProducts(Array.isArray(productsArray) ? (productsArray as any) : []);
          }
        } catch (error: any) {
          handleApiError(error, 'جلب المنتجات');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [productPage, productLimit, activeTab]);

  

  // Re-fetch best-sellers when its page or limit changes (only when bestsellers tab is active)
  useEffect(() => {
    if (activeTab === 'bestsellers') {
      (async () => {
        try {
          setLoading(true);
          // Load regular paginated products for admin view so toggled-off items remain visible
          const productsPage = (await productsApi.getAll({ page: bestSellersPage, limit: bestSellersLimit })) as any;
          if (productsPage && typeof productsPage === 'object' && 'products' in productsPage) {
            const pp = productsPage as PaginatedResponse;
            setBestSellersProducts(Array.isArray(pp.products) ? (pp.products as any) : []);
            setBestSellersTotalPages(Number(pp.totalPages || 1));
          } else {
            const arr = Array.isArray(productsPage) ? productsPage : ([] as unknown[]);
            setBestSellersProducts(Array.isArray(arr) ? (arr as any) : []);
          }

          // Also fetch best-sellers count meta separately
          try {
                const bestCount = (await productsApi.getAll({ best_selling: true, page: 1, limit: 1 })) as any;
            if (bestCount && typeof bestCount.total !== 'undefined') {
              setBestSellersTotal(Number(bestCount.total || 0));
              if (typeof bestCount.total !== 'undefined') setProductBestSellersCount(Number(bestCount.total || 0));
            }
          } catch (e) {
            // ignore count fetch error
          }
        } catch (error: any) {
          handleApiError(error, 'جلب الأكثر مبيعاً');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [bestSellersPage, bestSellersLimit, activeTab]);

  // Refresh data for the current active tab
  const refreshTabData = async () => {
    await refreshSpecificTab(activeTab);
  };

  // Refresh data for a specific tab
  const refreshSpecificTab = async (tab: string) => {
    try {
      switch (tab) {
        case 'products':
          {
            const productsData = (await productsApi.getAll({ page: productPage, limit: productLimit })) as any;
            // Handle both new API format { products: [], total, page, totalPages }
            if (productsData && productsData.products) {
              setProducts(Array.isArray(productsData.products) ? productsData.products : []);
              setProductTotal(Number(productsData.total || 0));
              setProductTotalPages(Number(productsData.totalPages || 1));
              // also refresh best-sellers count (lightweight)
              (async () => {
                try {
                  const bestPage = (await productsApi.getAll({ best_selling: true, page: 1, limit: 1 })) as any;
                  if (bestPage && typeof bestPage.total !== 'undefined') setProductBestSellersCount(Number(bestPage.total || 0));
                } catch (e) {
                  // ignore
                }
              })();
            } else {
              const productsArray = productsData.products || (Array.isArray(productsData) ? productsData : []);
              setProducts(Array.isArray(productsArray) ? productsArray : []);
            }
          }
          break;
        case 'bestsellers':
          {
            const bestData = (await productsApi.getAll({ best_selling: true, page: bestSellersPage, limit: bestSellersLimit })) as any;
            if (bestData && bestData.products) {
              setBestSellersProducts(Array.isArray(bestData.products) ? bestData.products : []);
              setBestSellersTotal(Number(bestData.total || 0));
              setBestSellersTotalPages(Number(bestData.totalPages || 1));
              // keep top-card count in sync
              if (typeof bestData.total !== 'undefined') setProductBestSellersCount(Number(bestData.total || 0));
            } else {
              const arr = bestData.products || (Array.isArray(bestData) ? bestData : []);
              setBestSellersProducts(Array.isArray(arr) ? arr : []);
            }
          }
          break;
        case 'categories':
          const categoriesData = await categoriesApi.getAll();
          setCategories(Array.isArray(categoriesData) ? categoriesData : []);
          break;
        case 'reviews':
          const reviewsData = await reviewsApi.getAll();
          setReviews(Array.isArray(reviewsData) ? reviewsData : []);
          break;
        case 'orders':
          const ordersData = await ordersApi.getAll();
          setOrders(Array.isArray(ordersData) ? ordersData : []);
          break;
        case 'sliders':
          const slidersData = await slidersApi.getAll();
          setSliders(Array.isArray(slidersData) ? slidersData : []);
          break;
      }
    } catch (error: any) {
      console.error(`Error refreshing ${tab}:`, error);
      handleApiError(error, `تحديث ${tab}`);
    }
  };

  // Product handlers
  const openProductDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        id: product.id,
        name: product.name,
        brand: product.brand,
        // Ensure numeric values are converted to strings to match the form state types
        price: product.price != null ? String(product.price) : '',
        old_price: product.old_price != null ? String(product.old_price) : '',
        category: product.category,
        type: product.type || 'PRODUIT',
        size: product.size || '100ml',
        description: product.description || '',
        // stock can be number or string in form state; normalize to string for consistency
        stock: product.stock != null ? String(product.stock) : '',
      });
      setExistingImageUrls(product.image_urls || []);
      setProductImages([]);
    } else {
      setEditingProduct(null);
      setProductForm({
        id: '',
        name: '',
        brand: '',
        price: '',
        old_price: '',
        category: '',
        type: 'PRODUIT',
        size: '100ml',
        description: '',
        stock: '',
      });
      setExistingImageUrls([]);
      setProductImages([]);
    }
    setProductDialog(true);
  };

  const handleSaveProduct = async () => {
    try {
      console.log('handleSaveProduct called with productForm:', productForm);
      
      // Validate required fields
      if (!productForm.type) {
        console.error('Type field is missing or null:', productForm.type);
        showAdminAlert({ title: 'خطأ', text: 'نوع المنتج مطلوب', icon: 'error', timer: 5000 });
        return;
      }
      // Convert images to base64 or upload them
      let imageUrls = [...existingImageUrls];
      
      // Convert new images to base64 data URLs for now
      // In production, you'd upload to a CDN or cloud storage
      if (productImages.length > 0) {
        const newImageUrls = await Promise.all(
          productImages.map(file => {
            return new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
            });
          })
        );
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        old_price: productForm.old_price ? parseFloat(productForm.old_price) : null,
        stock: typeof productForm.stock === 'string' && productForm.stock === '' ? 0 : Number(productForm.stock),
        notes: null, // Remove notes
        image_urls: imageUrls,
        type: productForm.type || 'PRODUIT', // Ensure type is never null
      };

      console.log('Product form state:', productForm);
      console.log('Product data being sent:', productData);
      
      // Double-check that type is not null
      if (!productData.type) {
        console.error('Type field is null in productData:', productData);
        productData.type = 'PRODUIT';
        console.log('Fixed type field:', productData.type);
      }

      if (editingProduct) {
        await productsApi.update(editingProduct.id, productData);
        showAdminAlert({ title: '✅ نجح', text: 'تم تحديث المنتج بنجاح', icon: 'success', timer: 3000 });
      } else {
        await productsApi.create(productData);
        showAdminAlert({ title: '✅ نجح', text: 'تم إضافة المنتج بنجاح', icon: 'success', timer: 3000 });
      }
      
      setProductDialog(false);
      await refreshTabData();
    } catch (error: any) {
      handleApiError(error, editingProduct ? 'تحديث المنتج' : 'إضافة المنتج');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await productsApi.delete(productId);
      showAdminAlert({ title: '✅ نجح', text: 'تم حذف المنتج', icon: 'success', timer: 3000 });
      await refreshTabData();
    } catch (error: any) {
      handleApiError(error, 'حذف المنتج');
      throw error;
    }
  };

  const handleToggleBestSelling = async (productId: string) => {
    try {
      const result = await productsApi.toggleBestSelling(productId) as any;
      showAdminAlert({ title: '✅ نجح', text: result.best_selling ? 'تمت الإضافة للأكثر مبيعاً' : 'تمت الإزالة من الأكثر مبيعاً', icon: 'success', timer: 3000 });
      // Update local lists so toggled product remains visible in the Best Sellers
      // tab (don't immediately remove it from the UI when the admin toggles it).
      setBestSellersProducts((prev) => prev.map((p) => p.id === productId ? { ...p, best_selling: result.best_selling } : p));
      setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, best_selling: result.best_selling } : p));
      // Refresh main products list to keep global state consistent, but avoid
      // refetching the bestsellers list which would remove the toggled item.
      await refreshSpecificTab('products');

      // Also refresh the lightweight best-sellers count so the displayed total
      // (إجمالي المنتجات الأكثر مبيعاً) updates immediately after toggling.
      try {
        const bestCount = (await productsApi.getAll({ best_selling: true, page: 1, limit: 1 }).catch(() => ({ total: 0 }))) as PaginatedResponse | unknown;
        if (bestCount && typeof bestCount === 'object' && 'total' in bestCount) {
          const bc = bestCount as PaginatedResponse;
          setBestSellersTotal(Number(bc.total || 0));
          // Keep the top-card count in sync too
          setProductBestSellersCount(Number(bc.total || 0));
        }
      } catch (e) {
        // ignore non-critical count refresh errors
      }
    } catch (error: any) {
      handleApiError(error, 'تحديث حالة الأكثر مبيعاً');
    }
  };

  // Category handlers
  const openCategoryDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: '',
        slug: '',
        description: '',
      });
    }
    setCategoryDialog(true);
  };

  const handleSaveCategory = async () => {
    try {
      const payload = editingCategory
        ? { ...categoryForm, image_url: editingCategory.image_url }
        : categoryForm;
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, payload);
        showAdminAlert({ title: '✅ نجح', text: 'تم تحديث الفئة بنجاح', icon: 'success', timer: 3000 });
      } else {
        await categoriesApi.create(payload);
        showAdminAlert({ title: '✅ نجح', text: 'تم إضافة الفئة بنجاح', icon: 'success', timer: 3000 });
      }
      
      setCategoryDialog(false);
      await refreshSpecificTab('categories');
    } catch (error: any) {
      handleApiError(error, editingCategory ? 'تحديث الفئة' : 'إضافة الفئة');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await categoriesApi.delete(categoryId);
      showAdminAlert({ title: '✅ نجح', text: 'تم حذف الفئة', icon: 'success', timer: 3000 });
      await refreshSpecificTab('categories');
    } catch (error: any) {
      handleApiError(error, 'حذف الفئة');
      throw error;
    }
  };

  // Slider handlers
  const openSliderDialog = (slider?: any) => {
    if (slider) {
      setEditingSlider(slider);
      setSliderForm({
        image_url: slider.image_url || '',
        title: slider.title || '',
        subtitle: slider.subtitle || '',
        button_text: slider.button_text || '',
        button_link: slider.button_link || '',
        order: slider.order || 0,
        active: slider.active !== undefined ? slider.active : true,
      });
    } else {
      setEditingSlider(null);
      setSliderForm({
        image_url: '',
        title: '',
        subtitle: '',
        button_text: '',
        button_link: '',
        order: 0,
        active: true,
      });
    }
    setSliderImage(null);
    setSliderDialog(true);
  };

  const handleSaveSlider = async () => {
    try {
      // Validate required fields
      if (!sliderImage && !editingSlider) {
        showAdminAlert({ title: '❌ خطأ', text: 'يرجى اختيار صورة للسلايدر', icon: 'error', timer: 5000 });
        return;
      }

      if (!sliderForm.title) {
        showAdminAlert({ title: '❌ خطأ', text: 'يرجى إدخال عنوان السلايدر', icon: 'error', timer: 5000 });
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
      
      // Add image file if selected (with compression)
      if (sliderImage) {
        console.log(`📸 Original image size: ${(sliderImage.size / 1024 / 1024).toFixed(2)}MB`);
        const compressedImage = await compressImage(sliderImage, 3, 1920); // Max 3MB, max 1920px
        console.log(`✅ Compressed image size: ${(compressedImage.size / 1024 / 1024).toFixed(2)}MB`);
        formData.append('image', compressedImage);
      }
      
      // Add other fields
      formData.append('title', sliderForm.title);
      formData.append('subtitle', sliderForm.subtitle);
      formData.append('button_text', sliderForm.button_text);
      formData.append('button_link', sliderForm.button_link);
      formData.append('order', sliderForm.order.toString());
      formData.append('active', sliderForm.active.toString());

      if (editingSlider) {
        await slidersApi.update(editingSlider.id, formData);
        showAdminAlert({ title: '✅ نجح', text: 'تم تحديث السلايدر بنجاح', icon: 'success', timer: 3000 });
      } else {
        await slidersApi.create(formData);
        showAdminAlert({ title: '✅ نجح', text: 'تم إضافة السلايدر بنجاح', icon: 'success', timer: 3000 });
      }
      
      setSliderDialog(false);
      setSliderImage(null);
      await refreshSpecificTab('sliders');
    } catch (error: any) {
      handleApiError(error, editingSlider ? 'تحديث السلايدر' : 'إضافة السلايدر');
    }
  };

  const handleDeleteSlider = async (sliderId: string) => {
    try {
      await slidersApi.delete(sliderId);
      showAdminAlert({ title: '✅ نجح', text: 'تم حذف السلايدر', icon: 'success', timer: 3000 });
      await refreshSpecificTab('sliders');
    } catch (error: any) {
      handleApiError(error, 'حذف السلايدر');
      throw error;
    }
  };

  const handleLogout = () => {
    // Use central auth logout so all auth state is cleared consistently
    try {
      if (typeof logout === 'function') logout();
    } catch (e) {
      // fallback: clear token/admin directly
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
      } catch (err) {
        // ignore
      }
    }
    setActiveTabState('orders');
    closeSidebar();
    showAdminAlert({ title: 'تم تسجيل الخروج', text: 'إلى اللقاء!', icon: 'info', timer: 3000 });
    navigate('/login');
  };

  // Review handlers
  const handleApproveReview = async (reviewId: string) => {
    try {
      await reviewsApi.approve(reviewId);
      showAdminAlert({ title: '✅ نجح', text: 'تم الموافقة على التقييم', icon: 'success', timer: 3000 });
      await refreshSpecificTab('reviews');
    } catch (error: any) {
      handleApiError(error, 'الموافقة على التقييم');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await reviewsApi.delete(reviewId);
      showAdminAlert({ title: '✅ نجح', text: 'تم حذف التقييم', icon: 'success', timer: 3000 });
      await refreshSpecificTab('reviews');
    } catch (error: any) {
      handleApiError(error, 'حذف التقييم');
      throw error;
    }
  };

  // Order handlers
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      showAdminAlert({ title: '✅ نجح', text: 'تم تحديث حالة الطلب', icon: 'success', timer: 3000 });
      await refreshSpecificTab('orders');
    } catch (error: any) {
      handleApiError(error, 'تحديث حالة الطلب');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await ordersApi.delete(orderId);
      showAdminAlert({ title: '✅ نجح', text: 'تم حذف الطلب', icon: 'success', timer: 3000 });
      await refreshSpecificTab('orders');
    } catch (error: any) {
      handleApiError(error, 'حذف الطلب');
      throw error;
    }
  };
  
  const openDeleteDialog = (target: DeleteTarget) => {
    setDeleteTarget(target);
    setDeleteDialogOpen(true);
  };
  
  const closeDeleteDialog = () => {
    if (isDeleting) return;
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };
  
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      switch (deleteTarget.type) {
        case 'product':
          await handleDeleteProduct(deleteTarget.id);
          break;
        case 'category':
          await handleDeleteCategory(deleteTarget.id);
          break;
        case 'review':
          await handleDeleteReview(deleteTarget.id);
          break;
        case 'order':
          await handleDeleteOrder(deleteTarget.id);
          break;
        case 'slider':
          await handleDeleteSlider(deleteTarget.id);
          break;
      }
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      // Errors are surfaced via handleApiError; keep dialog open for user review.
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="relative flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
        <div className="hidden md:flex">
          <AdminSidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onLogout={handleLogout}
            className="md:translate-x-0"
          />
        </div>

        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeSidebar}
            />
            <div className="absolute inset-y-0 right-0 w-72 max-w-[85%] animate-in slide-in-from-right-full duration-300">
              <AdminSidebar
                activeTab={activeTab}
                onTabChange={(tab) => {
                  handleTabChange(tab);
                  closeSidebar();
                }}
                onLogout={handleLogout}
                onClose={closeSidebar}
                isMobile
                className="h-full"
              />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col">
          <AdminNavbar showMenuButton onToggleSidebar={toggleSidebar} />
          <main className="flex-1 flex items-center justify-center px-4">
            <div className="text-center space-y-3">
              <div className="h-12 w-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">جاري التحميل...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const stats = {
    // Prefer server-provided total when available (productTotal), fallback to loaded products length
    totalProducts: productTotal > 0 ? productTotal : (Array.isArray(products) ? products.length : 0),
    totalCategories: Array.isArray(categories) ? categories.length : 0,
  bestSellers: productBestSellersCount > 0 ? productBestSellersCount : (Array.isArray(products) ? products.filter(p => p.best_selling).length : 0),
    pendingReviews: Array.isArray(reviews) ? reviews.filter(r => !r.approved).length : 0,
    totalOrders: Array.isArray(orders) ? orders.length : 0,
    pendingOrders: Array.isArray(orders) ? orders.filter((o: any) => o.status === 'pending').length : 0,
  };

  const navigationTabs = [
    { id: 'orders', label: 'الطلبات' },
    { id: 'products', label: 'المنتجات' },
    { id: 'bestsellers', label: 'الأكثر مبيعاً' },
    { id: 'sliders', label: 'السلايدر' },
    { id: 'categories', label: 'الأقسام' },
    { id: 'reviews', label: 'التقييمات' },
    { id: 'profile', label: 'الملف الشخصي' },
  ];

  const deleteLabels: Record<DeleteTarget['type'], string> = {
    product: 'المنتج',
    category: 'الفئة',
    review: 'التقييم',
    order: 'الطلب',
    slider: 'الصورة',
  };

  const deleteTargetLabel = deleteTarget ? deleteLabels[deleteTarget.type] : '';
  const deleteTargetDetails = deleteTarget
    ? [deleteTarget.name, deleteTarget.meta].filter(Boolean).join(' • ') || deleteTarget.id
    : '';

  return (
    <div className="relative flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <div className="hidden md:flex">
        <AdminSidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          onLogout={handleLogout}
        />
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeSidebar}
          />
          <div className="absolute inset-y-0 right-0 w-72 max-w-[85%] animate-in slide-in-from-right-full duration-300">
            <AdminSidebar
              activeTab={activeTab}
              onTabChange={(tab) => {
                handleTabChange(tab);
                closeSidebar();
              }}
              onLogout={handleLogout}
              onClose={closeSidebar}
              isMobile
              className="h-full"
            />
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
  <AdminNavbar showMenuButton onToggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-black">
          <div className="container py-4 md:py-8 px-4">
            <div className="md:hidden mb-4">
              <Select value={activeTab} onValueChange={handleTabChange}>
                <SelectTrigger className="justify-between bg-white/80 dark:bg-gray-900/60">
                  <SelectValue placeholder="اختر القسم" />
                </SelectTrigger>
                <SelectContent>
                  {navigationTabs.map((tab) => (
                    <SelectItem key={tab.id} value={tab.id}>
                      {tab.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
              <Card className="border-l-4 border-l-amber-500 bg-white/80 dark:bg-gray-900/60 backdrop-blur hover:shadow-xl transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
                  <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-amber-100">إجمالي المنتجات</CardTitle>
                  <Package className="h-3 w-3 md:h-4 md:w-4 text-amber-500" />
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <div className="text-xl md:text-2xl font-bold text-amber-900 dark:text-amber-400">{stats.totalProducts}</div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500 bg-white/80 dark:bg-gray-900/60 backdrop-blur hover:shadow-xl transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
                  <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-amber-100">الفئات</CardTitle>
                  <FolderTree className="h-3 w-3 md:h-4 md:w-4 text-blue-500" />
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <div className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-400">{stats.totalCategories}</div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500 bg-white/80 dark:bg-gray-900/60 backdrop-blur hover:shadow-xl transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
                  <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-amber-100">الأكثر مبيعاً</CardTitle>
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <div className="text-xl md:text-2xl font-bold text-green-900 dark:text-green-400">{stats.bestSellers}</div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-yellow-500 bg-white/80 dark:bg-gray-900/60 backdrop-blur hover:shadow-xl transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
                  <CardTitle className="text-xs md:text-sm font-medium text-gray-700 dark:text-amber-100">تقييمات معلقة</CardTitle>
                  <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-500" />
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <div className="text-xl md:text-2xl font-bold text-yellow-900 dark:text-yellow-400">{stats.pendingReviews}</div>
                </CardContent>
              </Card>
            </div>

            {/* Content based on active tab */}
            <div className="space-y-6">
              {activeTab === 'orders' && (
                <Card>
              <CardHeader className="p-4 md:p-6">
                <div>
                  <CardTitle className="text-lg md:text-xl">إدارة الطلبات</CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    {stats.totalOrders} طلب - {stats.pendingOrders} قيد الانتظار
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0 md:p-6 md:pt-0">
                {/* Desktop Table */}
                <div className="hidden md:block rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">رقم الطلب</TableHead>
                        <TableHead className="text-right">العميل</TableHead>
                        <TableHead className="text-right">المبلغ</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">التاريخ</TableHead>
                        <TableHead className="text-right">إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order: any) => (
                        <Fragment key={order.id}>
                          <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => toggleOrderDetails(order.id)}>
                            <TableCell className="font-mono text-xs">
                              <div className="flex items-center gap-2">
                                {expandedOrders.has(order.id) ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                                {order.id}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{order.customer_name}</div>
                                {/* Small product preview: show up to 3 thumbnails and first product name */}
                                {Array.isArray(order.items) && order.items.length > 0 && (
                                  <div className="mt-1 flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                      {order.items.slice(0, 3).map((it: any, i: number) => {
                                        const src = it.image_url || it.image || (it.image_urls && it.image_urls[0]) || '';
                                        return (
                                          <img
                                            key={i}
                                            src={src}
                                            alt={it.name || 'product'}
                                            className="h-8 w-8 rounded object-cover border bg-white"
                                          />
                                        );
                                      })}
                                      {order.items.length > 3 && (
                                        <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs ml-1">+{order.items.length - 3}</div>
                                      )}
                                    </div>
                                    <div className="text-xs text-muted-foreground max-w-[220px] truncate">
                                      {order.items[0]?.name}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-bold text-primary">{order.total_amount} درهم</TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Select 
                                value={order.status}
                                onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                              >
                                <SelectTrigger className="w-[130px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">قيد الانتظار</SelectItem>
                                  <SelectItem value="confirmed">مؤكد</SelectItem>
                                  <SelectItem value="processing">قيد التجهيز</SelectItem>
                                  <SelectItem value="shipped">تم الشحن</SelectItem>
                                  <SelectItem value="delivered">تم التسليم</SelectItem>
                                  <SelectItem value="cancelled">ملغي</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-xs">
                              {formatOrderDate(order)}
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleContactCustomer(order)}
                                  title="تواصل مع العميل عبر واتساب"
                                >
                                  <MessageCircle className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openDeleteDialog({ type: 'order', id: order.id, name: order.customer_name, meta: order.customer_phone })}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          {expandedOrders.has(order.id) && (
                            <TableRow key={`${order.id}-details`}>
                              <TableCell colSpan={6} className="bg-muted/30">
                                <div className="p-4 space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">معلومات العميل</h4>
                                      <div className="space-y-1 text-sm">
                                        <div><span className="font-medium">الاسم:</span> {order.customer_name}</div>
                                        <div><span className="font-medium">الهاتف:</span> {order.customer_phone}</div>
                                        {order.customer_email && (
                                          <div><span className="font-medium">البريد الإلكتروني:</span> {order.customer_email}</div>
                                        )}
                                        {order.customer_address && (
                                          <div><span className="font-medium">العنوان:</span> {order.customer_address}</div>
                                        )}
                                        {order.shipping_address && (
                                          <div><span className="font-medium">عنوان الشحن:</span> {order.shipping_address}</div>
                                        )}
                                        {order.city && (
                                          <div><span className="font-medium">المدينة:</span> {order.city}</div>
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-2">المنتجات</h4>
                                      <div className="space-y-2">
                                        {order.items.map((item: any, idx: number) => {
                                          const img = item.image_url || item.image || (item.image_urls && item.image_urls[0]) || '';
                                          return (
                                            <div key={idx} className="flex items-center justify-between">
                                              <div className="flex items-center gap-3 min-w-0">
                                                <img src={img} alt={item.name} className="h-12 w-12 rounded object-cover flex-shrink-0 bg-white border" />
                                                <div className="min-w-0">
                                                  <div className="font-medium truncate">{item.name}</div>
                                                  {item.variant && <div className="text-xs text-muted-foreground truncate">{item.variant}</div>}
                                                </div>
                                              </div>
                                              <div className="text-right">
                                                <div className="text-sm">x{item.quantity}</div>
                                                <div className="font-medium">{item.price * item.quantity} درهم</div>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                      <div className="mt-2 pt-2 border-t">
                                        <div className="flex justify-between font-bold">
                                          <span>المجموع:</span>
                                          <span>{order.total_amount} درهم</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {order.notes && (
                                    <div>
                                      <h4 className="font-semibold mb-1">ملاحظات:</h4>
                                      <p className="text-sm text-muted-foreground">{order.notes}</p>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4 p-4">
                  {orders.map((order: any) => (
                    <Card key={order.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start" onClick={() => toggleOrderDetails(order.id)}>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {expandedOrders.has(order.id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                              <div className="font-bold">{order.customer_name}</div>
                            </div>
                            <div className="text-xs text-muted-foreground font-mono mr-6">{order.id}</div>
                          </div>
                          <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>
                            {order.status === 'pending' ? 'قيد الانتظار' : order.status}
                          </Badge>
                        </div>
                        
                        {!expandedOrders.has(order.id) && (
                          <div className="text-sm space-y-1">
                            <div className="flex items-center gap-3">
                              <div className="flex -space-x-2">
                                {order.items.slice(0,3).map((it: any, i: number) => {
                                  const s = it.image_url || it.image || (it.image_urls && it.image_urls[0]) || '';
                                  return (
                                    <img key={i} src={s} alt={it.name} className="h-8 w-8 rounded object-cover border bg-white" />
                                  );
                                })}
                                {order.items.length > 3 && <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">+{order.items.length - 3}</div>}
                              </div>
                              <div className="flex-1">
                                <div>📱 {order.customer_phone}</div>
                                <div className="text-xs text-muted-foreground">📦 {order.items.length} منتج</div>
                              </div>
                              <div className="font-bold text-primary">💰 {order.total_amount} درهم</div>
                            </div>
                          </div>
                        )}
                        
                        {expandedOrders.has(order.id) && (
                          <div className="space-y-3 bg-muted/30 p-3 rounded-lg">
                            <div>
                              <h4 className="font-semibold text-sm mb-2">معلومات العميل</h4>
                              <div className="space-y-1 text-sm">
                                <div><span className="font-medium">الاسم:</span> {order.customer_name}</div>
                                <div><span className="font-medium">الهاتف:</span> {order.customer_phone}</div>
                                {order.customer_email && (
                                  <div><span className="font-medium">البريد:</span> {order.customer_email}</div>
                                )}
                                {order.customer_address && (
                                  <div><span className="font-medium">العنوان:</span> {order.customer_address}</div>
                                )}
                                {order.shipping_address && (
                                  <div><span className="font-medium">عنوان الشحن:</span> {order.shipping_address}</div>
                                )}
                                {order.city && (
                                  <div><span className="font-medium">المدينة:</span> {order.city}</div>
                                )}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm mb-2">المنتجات</h4>
                              <div className="space-y-1">
                                {order.items.map((item: any, idx: number) => {
                                  const img = item.image_url || item.image || (item.image_urls && item.image_urls[0]) || '';
                                  return (
                                    <div key={idx} className="flex items-center justify-between">
                                      <div className="flex items-center gap-3 min-w-0">
                                        <img src={img} alt={item.name} className="h-12 w-12 rounded object-cover flex-shrink-0 bg-white border" />
                                        <div className="min-w-0">
                                          <div className="font-medium truncate">{item.name}</div>
                                          {item.variant && <div className="text-xs text-muted-foreground truncate">{item.variant}</div>}
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-sm">x{item.quantity}</div>
                                        <div className="font-medium">{item.price * item.quantity} درهم</div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="mt-2 pt-2 border-t">
                                <div className="flex justify-between font-bold text-sm">
                                  <span>المجموع:</span>
                                  <span>{order.total_amount} درهم</span>
                                </div>
                              </div>
                            </div>
                            {order.notes && (
                              <div>
                                <h4 className="font-semibold text-sm mb-1">ملاحظات:</h4>
                                <p className="text-xs text-muted-foreground">{order.notes}</p>
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground">
                              التاريخ: {formatOrderDate(order)}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Select 
                            value={order.status}
                            onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">قيد الانتظار</SelectItem>
                              <SelectItem value="confirmed">مؤكد</SelectItem>
                              <SelectItem value="processing">قيد التجهيز</SelectItem>
                              <SelectItem value="shipped">تم الشحن</SelectItem>
                              <SelectItem value="delivered">تم التسليم</SelectItem>
                              <SelectItem value="cancelled">ملغي</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleContactCustomer(order)}
                            title="تواصل مع العميل عبر واتساب"
                          >
                            <MessageCircle className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => openDeleteDialog({ type: 'order', id: order.id, name: order.customer_name, meta: order.customer_phone })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
              )}

              {/* Products Tab */}
              {activeTab === 'products' && (
                <Card>
                  <CardHeader className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg md:text-xl">إدارة المنتجات</CardTitle>
                    <CardDescription className="text-xs md:text-sm">عرض وتعديل وحذف المنتجات</CardDescription>
                  </div>
                  <Button onClick={() => openProductDialog()} size="sm" className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة منتج
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 md:p-6 md:pt-0">
                {/* Search and Filters */}
                <div className="p-4 md:p-6 md:pt-0 border-b">
                  <div className="flex-1">
                    <Input
                      placeholder="البحث في المنتجات..."
                      value={productSearchQuery}
                      onChange={(e) => setProductSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                {/* Mobile View - Cards */}
                <div className="md:hidden space-y-3 p-4 overflow-x-hidden">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="p-4">
                      <div className="flex gap-3">
                        <img 
                          src={product.image_urls[0]} 
                          alt={product.name}
                          className="h-20 w-20 rounded object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                          <p className="text-xs text-muted-foreground">{product.brand}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">{product.category}</Badge>
                            <span className="text-sm font-bold text-gold">{product.price} DH</span>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openProductDialog(product)}
                              className="flex-1"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              تعديل
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openDeleteDialog({ type: 'product', id: product.id, name: product.name })}
                              className="flex-1"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              حذف
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Mobile View - Cards */}
                <div className="md:hidden space-y-3 p-4 overflow-x-hidden">
                  {sliders.map((slider) => (
                    <Card key={slider.id} className="p-3">
                      <div className="flex flex-col">
                        <img
                          src={slider.image_url}
                          alt={slider.title || 'Slider'}
                          className="w-full h-40 object-cover rounded-md border bg-white"
                        />
                        <div className="mt-3">
                          <div className="font-medium truncate">{slider.title || 'بدون عنوان'}</div>
                          {slider.subtitle && (
                            <div className="text-xs text-muted-foreground line-clamp-2">{slider.subtitle}</div>
                          )}
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => openSliderDialog(slider)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            تعديل
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="flex-1"
                            onClick={() => openDeleteDialog({ type: 'slider' as any, id: slider.id, name: slider.title })}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            حذف
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Desktop View - Table */}
                <div className="hidden md:block rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الصورة</TableHead>
                        <TableHead>الاسم</TableHead>
                        <TableHead>العلامة</TableHead>
                        <TableHead>الفئة</TableHead>
                        <TableHead>السعر</TableHead>
                        <TableHead>المخزون</TableHead>
                        <TableHead>إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <img 
                              src={product.image_urls[0]} 
                              alt={product.name}
                              className="h-12 w-12 rounded object-cover"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.brand}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.category}</Badge>
                          </TableCell>
                          <TableCell>{product.price} درهم</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => openProductDialog(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => openDeleteDialog({ type: 'product', id: product.id, name: product.name })}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination controls */}
                {productTotalPages > 1 && (
                  <div className="w-full max-w-full px-2 py-3 bg-white/5 border-t mt-4 overflow-x-auto touch-pan-x scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {/* Desktop / Tablet: full/compact numeric pagination using helper generator */}
                    <div className="hidden md:flex items-center justify-center gap-2">
                      <nav className="flex items-center gap-2" aria-label="Pagination">
                        <button
                          onClick={() => setProductPage((p) => Math.max(1, p - 1))}
                          disabled={(productPage || 1) === 1}
                          className={`px-4 py-2 rounded font-medium transition-all ${((productPage || 1) === 1)
                            ? 'bg-zinc-800 text-gray-600 cursor-not-allowed'
                            : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
                        >
                          السابق
                        </button>

                        <div className="flex items-center gap-1 mx-2">
                          {generateDesktopPages(productPage || 1, (productTotalPages && productTotalPages > 0) ? productTotalPages : Math.max(1, Math.ceil((productTotal || 0) / (productLimit || 1)))).map((pg, idx) => (
                            typeof pg === 'string' ? (
                              <span key={`e-${idx}`} className="px-3 py-2 text-gray-500">…</span>
                            ) : (
                              <button
                                key={pg}
                                onClick={() => setProductPage(Number(pg))}
                                className={`min-w-[44px] px-4 py-2 rounded font-medium transition-all ${pg === productPage
                                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50'
                                  : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
                              >
                                {pg}
                              </button>
                            )
                          ))}
                        </div>

                        <button
                          onClick={() => setProductPage((p) => Math.min(((productTotalPages && productTotalPages > 0) ? productTotalPages : Math.max(1, Math.ceil((productTotal || 0) / (productLimit || 1)))), p + 1))}
                          disabled={(productPage || 1) === ((productTotalPages && productTotalPages > 0) ? productTotalPages : Math.max(1, Math.ceil((productTotal || 0) / (productLimit || 1))))}
                          className={`px-4 py-2 rounded font-medium transition-all ${((productPage || 1) === ((productTotalPages && productTotalPages > 0) ? productTotalPages : Math.max(1, Math.ceil((productTotal || 0) / (productLimit || 1)))))
                            ? 'bg-zinc-800 text-gray-600 cursor-not-allowed'
                            : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
                        >
                          التالي
                        </button>
                      </nav>

                      {/* Current / Total indicator (desktop/tablet) */}
                      <div className="ml-3 text-sm text-gray-300 hidden md:flex items-center">
                        <span className="font-medium text-white">{productPage}</span>
                        <span className="mx-1 text-gray-400">/</span>
                        <span className="text-gray-300">{(productTotalPages && productTotalPages > 0) ? productTotalPages : Math.max(1, Math.ceil((productTotal || 0) / (productLimit || 1)))}</span>
                      </div>
                    </div>

                    {/* Mobile: compact Prev | current/total | Next */}
                    <div className="md:hidden flex items-center justify-center gap-3">
                      <button onClick={() => setProductPage((p) => Math.max(1, p - 1))} aria-label="السابق" className="px-3 py-2 rounded bg-zinc-800 text-white text-sm">
                        السابق
                      </button>
                      <div className="px-4 py-2 bg-zinc-900 rounded text-sm font-medium">
                        <span>{productPage}</span>
                        <span className="mx-2 text-gray-400">/</span>
                        <span>{(productTotalPages && productTotalPages > 0) ? productTotalPages : Math.max(1, Math.ceil((productTotal || 0) / (productLimit || 1)))}</span>
                      </div>
                      <button onClick={() => setProductPage((p) => Math.min((productTotalPages && productTotalPages > 0) ? productTotalPages : Math.max(1, Math.ceil((productTotal || 0) / (productLimit || 1))), p + 1))} aria-label="التالي" className="px-3 py-2 rounded bg-zinc-800 text-white text-sm">
                        التالي
                      </button>
                    </div>

                    <div className="text-sm text-muted mt-2">إجمالي المنتجات: {productTotal}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

              {/* Categories Tab */}
              {activeTab === 'categories' && (
                <Card>
                  <CardHeader className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg md:text-xl">إدارة الفئات</CardTitle>
                    <CardDescription className="text-xs md:text-sm">عرض وتعديل الفئات</CardDescription>
                  </div>
                  <Button onClick={() => openCategoryDialog()} size="sm" className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة فئة
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 md:p-6 md:pt-0">
                {/* Mobile View - Cards */}
                <div className="md:hidden space-y-3 p-4">
                  {categories.map((category) => (
                    <Card key={category.id} className="p-4">
                      <div className="space-y-2">
                        <div>
                          <h3 className="font-semibold text-sm">{category.name}</h3>
                          <p className="text-xs text-muted-foreground">{category.slug}</p>
                        </div>
                        {category.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">{category.description}</p>
                        )}
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openCategoryDialog(category)}
                            className="flex-1"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            تعديل
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog({ type: 'category', id: category.id, name: category.name })}
                            className="flex-1"
                          >
                            <Trash2 className="h-3 w-3 text-destructive mr-1" />
                            حذف
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Desktop View - Table */}
                <div className="hidden md:block rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الاسم</TableHead>
                        <TableHead>الرمز</TableHead>
                        <TableHead>الوصف</TableHead>
                        <TableHead>إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell>{category.slug}</TableCell>
                          <TableCell>{category.description}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => openCategoryDialog(category)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => openDeleteDialog({ type: 'category', id: category.id, name: category.name })}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                  </CardContent>
                </Card>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <Card>
                  <CardHeader className="p-4 md:p-6">
                <div>
                  <CardTitle className="text-lg md:text-xl">إدارة التقييمات</CardTitle>
                  <CardDescription className="text-xs md:text-sm">الموافقة على التقييمات أو حذفها</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0 md:p-6 md:pt-0">
                {/* Mobile View - Cards */}
                <div className="md:hidden space-y-3 p-4">
                  {reviews.map((review) => {
                    const product = products.find(p => p.id === review.product_id);
                    return (
                      <Card key={review.id} className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-semibold text-sm">{review.name}</h3>
                            <p className="text-xs text-muted-foreground">{product?.name || review.product_id}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            {review.approved ? (
                              <Badge variant="default" className="text-xs">موافق عليه</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">معلق</Badge>
                            )}
                          </div>
                          {review.comment && (
                            <p className="text-xs text-muted-foreground line-clamp-3">{review.comment}</p>
                          )}
                          <div className="flex gap-2 pt-2">
                            {!review.approved && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApproveReview(review.id)}
                                className="flex-1"
                              >
                                <Check className="h-3 w-3 text-green-600 mr-1" />
                                موافقة
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDeleteDialog({ type: 'review', id: review.id, name: review.name, meta: product?.name })}
                              className={!review.approved ? 'flex-1' : 'w-full'}
                            >
                              <Trash2 className="h-3 w-3 text-destructive mr-1" />
                              حذف
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {/* Desktop View - Table */}
                <div className="hidden md:block rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الاسم</TableHead>
                        <TableHead>المنتج</TableHead>
                        <TableHead>التقييم</TableHead>
                        <TableHead>التعليق</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>إجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews.map((review) => {
                        const product = products.find(p => p.id === review.product_id);
                        return (
                          <TableRow key={review.id}>
                            <TableCell className="font-medium">{review.name}</TableCell>
                            <TableCell className="text-sm">{product?.name || review.product_id}</TableCell>
                            <TableCell>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
                            <TableCell>
                              {review.approved ? (
                                <Badge variant="default">موافق عليه</Badge>
                              ) : (
                                <Badge variant="secondary">معلق</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {!review.approved && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleApproveReview(review.id)}
                                  >
                                    <Check className="h-4 w-4 text-green-600" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openDeleteDialog({ type: 'review', id: review.id, name: review.name, meta: product?.name })}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                  </CardContent>
                </Card>
              )}

              {/* Best Sellers Tab */}
              {activeTab === 'bestsellers' && (
                <Card>
                  <CardHeader className="p-4 md:p-6">
                <div>
                  <CardTitle className="text-lg md:text-xl">إدارة الأكثر مبيعاً</CardTitle>
                  <CardDescription className="text-xs md:text-sm">تبديل حالة "الأكثر مبيعاً" للمنتجات</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0 md:p-6 md:pt-0">
                {/* Mobile View - Cards */}
                <div className="md:hidden space-y-3 p-4">
                  {bestSellersProducts.map((product) => {
                    const toggleId = `best-selling-toggle-${product.id}`;
                    const labelId = `${toggleId}-label`;
                    return (
                      <Card key={product.id} className="p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                          <p className="text-xs text-muted-foreground">{product.brand}</p>
                          <p className="text-sm font-bold text-gold mt-1">{product.price} درهم</p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <span id={labelId} className="text-xs text-muted-foreground whitespace-nowrap">الأكثر مبيعاً</span>
                          <BestSellingToggle
                            id={toggleId}
                            ariaLabelledBy={labelId}
                            checked={product.best_selling}
                            onChange={() => handleToggleBestSelling(product.id)}
                          />
                        </div>
                      </div>
                      </Card>
                    );
                  })}
                </div>

                {/* Desktop View - Table */}
                <div className="hidden md:block rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>المنتج</TableHead>
                        <TableHead>العلامة</TableHead>
                        <TableHead>السعر</TableHead>
                        <TableHead className="text-center">الأكثر مبيعاً</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bestSellersProducts.map((product) => {
                        const toggleId = `best-selling-toggle-desktop-${product.id}`;
                        const labelId = `${toggleId}-label`;
                        return (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>{product.brand}</TableCell>
                            <TableCell>{product.price} درهم</TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center">
                                <span id={labelId} className="sr-only">الأكثر مبيعاً</span>
                                <BestSellingToggle
                                  id={toggleId}
                                  ariaLabelledBy={labelId}
                                  checked={product.best_selling}
                                  onChange={() => handleToggleBestSelling(product.id)}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination controls for Best Sellers */}
                {bestSellersTotalPages > 1 && (
                  <div className="w-full overflow-x-auto bg-transparent mt-4 border-t">
                    {/* Desktop / Tablet pagination */}
                    <div className="hidden md:flex items-center justify-center px-4 py-3 bg-white/5">
                      <nav className="flex items-center gap-2" aria-label="Best sellers pagination">
                        <button
                          onClick={() => setBestSellersPage((p) => Math.max(1, p - 1))}
                          disabled={(bestSellersPage || 1) === 1}
                          className={`px-4 py-2 rounded font-medium transition-all ${((bestSellersPage || 1) === 1)
                            ? 'bg-zinc-800 text-gray-600 cursor-not-allowed'
                            : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
                        >
                          السابق
                        </button>

                        <div className="flex items-center gap-1 mx-2">
                          {generateDesktopPages(bestSellersPage || 1, bestSellersTotalPages || Math.max(1, Math.ceil((bestSellersTotal || 0) / (bestSellersLimit || 1)))).map((pg, idx) => (
                            typeof pg === 'string' ? (
                              <span key={`e-b-${idx}`} className="px-3 py-2 text-gray-500">…</span>
                            ) : (
                              <button
                                key={`b-${pg}`}
                                onClick={() => setBestSellersPage(Number(pg))}
                                className={`min-w-[44px] px-4 py-2 rounded font-medium transition-all ${pg === bestSellersPage
                                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50'
                                  : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
                              >
                                {pg}
                              </button>
                            )
                          ))}
                        </div>

                        <button
                          onClick={() => setBestSellersPage((p) => Math.min((bestSellersTotalPages || 1), p + 1))}
                          disabled={(bestSellersPage || 1) === (bestSellersTotalPages || 1)}
                          className={`px-4 py-2 rounded font-medium transition-all ${((bestSellersPage || 1) === (bestSellersTotalPages || 1))
                            ? 'bg-zinc-800 text-gray-600 cursor-not-allowed'
                            : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
                        >
                          التالي
                        </button>
                      </nav>

                      {/* Current / Total indicator (desktop/tablet) for Best Sellers */}
                      <div className="ml-3 text-sm text-gray-300 hidden md:flex items-center">
                        <span className="font-medium text-white">{bestSellersPage}</span>
                        <span className="mx-1 text-gray-400">/</span>
                        <span className="text-gray-300">{bestSellersTotalPages || Math.max(1, Math.ceil((bestSellersTotal || 0) / (bestSellersLimit || 1)))}</span>
                      </div>
                    </div>

                    {/* Mobile compact pagination */}
                    <div className="md:hidden flex items-center justify-center gap-3 px-4 py-3 bg-white/5">
                      <button onClick={() => setBestSellersPage((p) => Math.max(1, p - 1))} aria-label="السابق" className="px-3 py-2 rounded bg-zinc-800 text-white text-sm">
                        السابق
                      </button>
                      <div className="px-4 py-2 bg-zinc-900 rounded text-sm font-medium">
                        <span>{bestSellersPage}</span>
                        <span className="mx-2 text-gray-400">/</span>
                        <span>{bestSellersTotalPages}</span>
                      </div>
                      <button onClick={() => setBestSellersPage((p) => Math.min((bestSellersTotalPages || 1), p + 1))} aria-label="التالي" className="px-3 py-2 rounded bg-zinc-800 text-white text-sm">
                        التالي
                      </button>
                    </div>

                    <div className="px-4 py-2 bg-white/5">
                      <div className="text-sm text-black font-medium">إجمالي المنتجات الأكثر مبيعاً: {bestSellersTotal}</div>
                    </div>
                  </div>
                )}
                  </CardContent>
                </Card>
              )}

              {/* Sliders Tab */}
              {activeTab === 'sliders' && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>إدارة السلايدر</CardTitle>
                      <CardDescription>إدارة صور وعروض السلايدر الرئيسي</CardDescription>
                    </div>
                    <Button onClick={() => openSliderDialog()}>
                      <Plus className="ml-2 h-4 w-4" />
                      إضافة شريحة جديدة
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right">الصورة</TableHead>
                          <TableHead className="text-right">العنوان</TableHead>
                          <TableHead className="text-right">الترتيب</TableHead>
                          <TableHead className="text-right">الحالة</TableHead>
                          <TableHead className="text-right">الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sliders.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              لا توجد شرائح. قم بإضافة شريحة جديدة للبدء.
                            </TableCell>
                          </TableRow>
                        ) : (
                          sliders.map((slider) => (
                            <TableRow key={slider.id}>
                              <TableCell>
                                <img 
                                  src={slider.image_url} 
                                  alt={slider.title || 'Slider'}
                                  className="h-16 w-24 object-cover rounded"
                                />
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{slider.title || 'بدون عنوان'}</p>
                                  {slider.subtitle && (
                                    <p className="text-sm text-muted-foreground">{slider.subtitle}</p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{slider.order}</TableCell>
                              <TableCell>
                                <Badge variant={slider.active ? 'default' : 'secondary'}>
                                  {slider.active ? 'نشط' : 'غير نشط'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openSliderDialog(slider)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openDeleteDialog({ type: 'slider' as any, id: slider.id, name: slider.title })}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <AdminProfile />
              )}
            </div>
          </div>
        </main>

        <AlertDialog
          open={deleteDialogOpen}
          onOpenChange={(open) => {
            if (open) {
              setDeleteDialogOpen(true);
            } else {
              closeDeleteDialog();
            }
          }}
        >
          <AlertDialogContent className="bg-gradient-to-br from-black via-gray-900 to-black border border-amber-500/40 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-amber-300">
                {deleteTarget ? `حذف ${deleteTargetLabel}` : 'تأكيد الحذف'}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300 leading-relaxed">
                {deleteTarget ? (
                  <span>
                    سيتم حذف {deleteTargetLabel}
                    {deleteTargetDetails && (
                      <span className="font-semibold text-amber-200"> {deleteTargetDetails}</span>
                    )}
                    . هذا الإجراء لا يمكن التراجع عنه وسيتم إزالة البيانات نهائياً.
                  </span>
                ) : (
                  'هذا الإجراء لا يمكن التراجع عنه وسيتم إزالة البيانات نهائياً.'
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel
                disabled={isDeleting}
                onClick={closeDeleteDialog}
                className="bg-gray-800/80 text-gray-200 border-gray-700 hover:bg-gray-700/80"
              >
                تراجع
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={isDeleting}
                onClick={confirmDelete}
                className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-black font-semibold hover:from-amber-400 hover:via-amber-500 hover:to-amber-400"
              >
                {isDeleting ? 'جارٍ الحذف...' : 'تأكيد الحذف'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Product Dialog */}
        <Dialog open={productDialog} onOpenChange={setProductDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</DialogTitle>
              <DialogDescription>
                {editingProduct ? 'تعديل بيانات المنتج' : 'أدخل بيانات المنتج الجديد'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="product-name">اسم المنتج</Label>
                <Input
                  id="product-name"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-brand">العلامة التجارية</Label>
                  <Input
                    id="product-brand"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-price">السعر الحالي (درهم)</Label>
                  <Input
                    id="product-price"
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-old-price">السعر القديم (اختياري)</Label>
                  <Input
                    id="product-old-price"
                    type="number"
                    placeholder="للتخفيضات فقط"
                    value={productForm.old_price}
                    onChange={(e) => setProductForm({ ...productForm, old_price: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">إذا كان هناك تخفيض، أدخل السعر القديم هنا</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-category">الفئة</Label>
                  <select
                    id="product-category"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">اختر الفئة</option>
                    {categories.length === 0 ? (
                      <option disabled>جاري تحميل الفئات...</option>
                    ) : (
                      categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                {/* Removed product type selector per admin request: keep type managed by backend/defaults */}
                <div className="space-y-2">
                  <Label htmlFor="product-stock">المخزون</Label>
                  <Input
                    id="product-stock"
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value === '' ? '' : parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-description">الوصف</Label>
                <Textarea
                  id="product-description"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-images">صور المنتج</Label>
                <Input
                  id="product-images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setProductImages(files);
                  }}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">يمكنك اختيار صور متعددة</p>
                
                {existingImageUrls.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-2">الصور الحالية:</p>
                    <div className="flex flex-wrap gap-2">
                      {existingImageUrls.map((url, idx) => (
                        <div key={idx} className="relative">
                          <img src={url} alt={`Product ${idx + 1}`} className="h-20 w-20 object-cover rounded border" />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6"
                            onClick={() => setExistingImageUrls(existingImageUrls.filter((_, i) => i !== idx))}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {productImages.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-2">الصور الجديدة:</p>
                    <div className="flex flex-wrap gap-2">
                      {productImages.map((file, idx) => (
                        <div key={idx} className="relative">
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt={`New ${idx + 1}`} 
                            className="h-20 w-20 object-cover rounded border" 
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6"
                            onClick={() => setProductImages(productImages.filter((_, i) => i !== idx))}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setProductDialog(false)} className="w-full sm:w-auto">
                إلغاء
              </Button>
              <Button onClick={handleSaveProduct} className="w-full sm:w-auto">
                {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Category Dialog */}
        <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}</DialogTitle>
              <DialogDescription>
                {editingCategory ? 'تعديل بيانات الفئة' : 'أدخل بيانات الفئة الجديدة'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">اسم الفئة</Label>
                <Input
                  id="category-name"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-slug">الرمز (Slug)</Label>
                <Input
                  id="category-slug"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  placeholder="category-slug"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-description">الوصف</Label>
                <Textarea
                  id="category-description"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  rows={2}
                />
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setCategoryDialog(false)} className="w-full sm:w-auto">
                إلغاء
              </Button>
              <Button onClick={handleSaveCategory} className="w-full sm:w-auto">
                {editingCategory ? 'حفظ التعديلات' : 'إضافة الفئة'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Slider Dialog */}
        <Dialog open={sliderDialog} onOpenChange={setSliderDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingSlider ? 'تعديل شريحة' : 'إضافة شريحة جديدة'}</DialogTitle>
              <DialogDescription>
                أضف صورة وعنوان ونص للشريحة التي ستظهر في الصفحة الرئيسية
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="slider-image">صورة السلايدر</Label>
                <Input
                  id="slider-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSliderImage(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-muted-foreground">
                  سيتم ضغط الصور الكبيرة تلقائياً. الحد الأقصى: 10MB
                </p>
                {(sliderForm.image_url || sliderImage) && (
                  <img 
                    src={sliderImage ? URL.createObjectURL(sliderImage) : sliderForm.image_url} 
                    alt="Preview"
                    className="mt-2 h-32 w-full object-cover rounded"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slider-title">العنوان الرئيسي</Label>
                <Input
                  id="slider-title"
                  placeholder="مثال: عروض خاصة على العطور الفاخرة"
                  value={sliderForm.title}
                  onChange={(e) => setSliderForm({ ...sliderForm, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slider-subtitle">النص الفرعي</Label>
                <Textarea
                  id="slider-subtitle"
                  placeholder="وصف قصير للعرض أو المحتوى"
                  value={sliderForm.subtitle}
                  onChange={(e) => setSliderForm({ ...sliderForm, subtitle: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slider-button-text">نص الزر (اختياري)</Label>
                  <Input
                    id="slider-button-text"
                    placeholder="تسوق الآن"
                    value={sliderForm.button_text}
                    onChange={(e) => setSliderForm({ ...sliderForm, button_text: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slider-button-link">رابط الزر (اختياري)</Label>
                  <Input
                    id="slider-button-link"
                    placeholder="/collection/parfums"
                    value={sliderForm.button_link}
                    onChange={(e) => setSliderForm({ ...sliderForm, button_link: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slider-order">ترتيب العرض</Label>
                  <Input
                    id="slider-order"
                    type="number"
                    value={sliderForm.order}
                    onChange={(e) => setSliderForm({ ...sliderForm, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="slider-active"
                    checked={sliderForm.active}
                    onChange={(e) => setSliderForm({ ...sliderForm, active: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="slider-active">نشط</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSliderDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveSlider}>
                {editingSlider ? 'تحديث' : 'إضافة'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollToTopButton />
    </div>
  );
}
