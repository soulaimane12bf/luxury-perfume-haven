import { useState, useEffect, Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminNavbar from '@/components/AdminNavbar';
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
  ChevronUp,
  RefreshCw
} from 'lucide-react';

type Product = {
  id: string;
  name: string;
  brand: string;
  price: string;
  old_price?: string;
  category: string;
  type: string;
  size: string;
  description: string;
  notes: {
    main_notes: string[];
    top_notes: string[];
  } | null;
  image_urls: string[];
  stock: number;
  rating: string;
  best_selling: boolean;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url?: string;
};

type Review = {
  id: string;
  product_id: string;
  name: string;
  rating: number;
  comment: string;
  approved: boolean;
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
  const { isAuthenticated, token, loading: authLoading } = useAuth();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [sliders, setSliders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Track which tabs have been loaded (for lazy loading)
  const [loadedTabs, setLoadedTabs] = useState<Set<AdminTab>>(new Set());
  const [tabLoading, setTabLoading] = useState<Record<AdminTab, boolean>>({
    products: false,
    categories: false,
    reviews: false,
    orders: false,
    sliders: false,
    bestsellers: false,
    profile: false,
  });
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState<Record<AdminTab, number>>({
    products: 1,
    categories: 1,
    reviews: 1,
    orders: 1,
    sliders: 1,
    bestsellers: 1,
    profile: 1,
  });
  
  const ITEMS_PER_PAGE: Record<AdminTab, number> = {
    products: 20,
    categories: 20,
    reviews: 10,
    orders: 10,
    sliders: 10,
    bestsellers: 20,
    profile: 1,
  };
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
      toast({
        title: 'غير مصرح',
        description: 'يرجى تسجيل الدخول أولاً',
        variant: 'destructive',
      });
      navigate('/login');
    } else {
      // Initial load is complete once auth is verified
      setLoading(false);
    }
  }, [isAuthenticated, token, authLoading, navigate, toast]);

  // Lazy load data when tab becomes active
  useEffect(() => {
    if (!isAuthenticated || authLoading) return;
    
    // Only load data for the active tab if it hasn't been loaded yet
    if (!loadedTabs.has(activeTab)) {
      loadTabData(activeTab);
    }
  }, [activeTab, isAuthenticated, authLoading]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    const normalizedTab = isAdminTab(tabParam) ? tabParam : DEFAULT_ADMIN_TAB;
    setActiveTabState((current) => (current === normalizedTab ? current : normalizedTab));
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === activeTab) {
      return;
    }
    params.set('tab', activeTab);
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
  }, [activeTab, location.pathname, location.search, navigate]);

  // Helper function to handle API errors
  const handleApiError = (error: any, operation: string) => {
    console.error(`Error during ${operation}:`, error);
    
    let errorMessage = error?.message || 'حدث خطأ غير متوقع';
    let shouldLogout = false;

    // Check for specific error types
    if (error?.status === 413 || error?.message?.includes('413')) {
      errorMessage = 'حجم الصورة كبير جداً. يرجى اختيار صورة أصغر (أقل من 10MB).';
    } else if (error?.isAuthError || error?.status === 401 || error?.message?.includes('401')) {
      errorMessage = 'انتهت جلستك. يرجى تسجيل الدخول مرة أخرى.';
      shouldLogout = true;
    } else if (error?.isNetworkError) {
      errorMessage = 'فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.';
    }

    toast({
      title: 'خطأ',
      description: errorMessage,
      variant: 'destructive',
    });

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

  // Lazy load data for a specific tab
  const loadTabData = async (tab: AdminTab) => {
    setTabLoading(prev => ({ ...prev, [tab]: true }));
    
    try {
      switch (tab) {
        case 'products':
          const productsData = await productsApi.getAll({});
          setProducts(Array.isArray(productsData) ? productsData : []);
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
      
      // Mark this tab as loaded
      setLoadedTabs(prev => new Set(prev).add(tab));
    } catch (error: any) {
      console.error(`Error fetching ${tab} data:`, error);
      handleApiError(error, `تحميل ${tab}`);
    } finally {
      setTabLoading(prev => ({ ...prev, [tab]: false }));
    }
  };
  
  // Refresh data for current tab (force reload)
  const refreshTabData = async () => {
    // Force reload by removing from cache and reloading immediately
    setLoadedTabs(prev => {
      const newSet = new Set(prev);
      newSet.delete(activeTab);
      return newSet;
    });
    await loadTabData(activeTab);
  };
  
  // Refresh specific tab's data
  const refreshSpecificTab = async (tab: AdminTab) => {
    setLoadedTabs(prev => {
      const newSet = new Set(prev);
      newSet.delete(tab);
      return newSet;
    });
    await loadTabData(tab);
  };
  
  // Pagination helpers
  const getPaginatedData = <T,>(data: T[], tab: AdminTab): T[] => {
    const page = currentPage[tab];
    const itemsPerPage = ITEMS_PER_PAGE[tab];
    const startIndex = (page - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };
  
  const getTotalPages = (dataLength: number, tab: AdminTab): number => {
    return Math.ceil(dataLength / ITEMS_PER_PAGE[tab]);
  };
  
  const handlePageChange = (tab: AdminTab, page: number) => {
    setCurrentPage(prev => ({ ...prev, [tab]: page }));
  };
  
  // Get paginated data for each tab
  const paginatedProducts = getPaginatedData(products, 'products');
  const paginatedCategories = getPaginatedData(categories, 'categories');
  const paginatedReviews = getPaginatedData(reviews, 'reviews');
  const paginatedOrders = getPaginatedData(orders, 'orders');
  const paginatedSliders = getPaginatedData(sliders, 'sliders');

  // Product handlers
  const openProductDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        old_price: product.old_price || '',
        category: product.category,
        type: product.type,
        size: product.size || '100ml',
        description: product.description || '',
        stock: product.stock,
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
      };

      if (editingProduct) {
        await productsApi.update(editingProduct.id, productData);
        toast({ 
          title: '✅ نجح', 
          description: 'تم تحديث المنتج بنجاح',
          className: 'bg-green-50 border-green-200',
        });
      } else {
        await productsApi.create(productData);
        toast({ 
          title: '✅ نجح', 
          description: 'تم إضافة المنتج بنجاح',
          className: 'bg-green-50 border-green-200',
        });
      }
      
      setProductDialog(false);
      // Refresh products data to show changes
      await refreshSpecificTab('products');
    } catch (error: any) {
      handleApiError(error, editingProduct ? 'تحديث المنتج' : 'إضافة المنتج');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await productsApi.delete(productId);
      toast({ 
        title: '✅ نجح', 
        description: 'تم حذف المنتج',
        className: 'bg-green-50 border-green-200',
      });
      await refreshSpecificTab('products');
    } catch (error: any) {
      handleApiError(error, 'حذف المنتج');
      throw error;
    }
  };

  const handleToggleBestSelling = async (productId: string) => {
    try {
      const result = await productsApi.toggleBestSelling(productId) as any;
      toast({
        title: '✅ نجح',
        description: result.best_selling ? 'تمت الإضافة للأكثر مبيعاً' : 'تمت الإزالة من الأكثر مبيعاً',
        className: 'bg-green-50 border-green-200',
      });
      // Update local state immediately
      setProducts(products.map(p => 
        p.id === productId ? { ...p, best_selling: result.best_selling } : p
      ));
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
        toast({ 
          title: '✅ نجح', 
          description: 'تم تحديث الفئة بنجاح',
          className: 'bg-green-50 border-green-200',
        });
      } else {
        await categoriesApi.create(payload);
        toast({ 
          title: '✅ نجح', 
          description: 'تم إضافة الفئة بنجاح',
          className: 'bg-green-50 border-green-200',
        });
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
      toast({ 
        title: '✅ نجح', 
        description: 'تم حذف الفئة',
        className: 'bg-green-50 border-green-200',
      });
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
        toast({ 
          title: '❌ خطأ', 
          description: 'يرجى اختيار صورة للسلايدر',
          variant: 'destructive',
        });
        return;
      }

      if (!sliderForm.title) {
        toast({ 
          title: '❌ خطأ', 
          description: 'يرجى إدخال عنوان السلايدر',
          variant: 'destructive',
        });
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
        toast({ 
          title: '✅ نجح', 
          description: 'تم تحديث السلايدر بنجاح',
          className: 'bg-green-50 border-green-200',
        });
      } else {
        await slidersApi.create(formData);
        toast({ 
          title: '✅ نجح', 
          description: 'تم إضافة السلايدر بنجاح',
          className: 'bg-green-50 border-green-200',
        });
      }
      
      setSliderDialog(false);
      setSliderImage(null);
      await refreshSpecificTab('reviews');
    } catch (error: any) {
      handleApiError(error, editingSlider ? 'تحديث السلايدر' : 'إضافة السلايدر');
    }
  };

  const handleDeleteSlider = async (sliderId: string) => {
    try {
      await slidersApi.delete(sliderId);
      toast({ 
        title: '✅ نجح', 
        description: 'تم حذف السلايدر',
        className: 'bg-green-50 border-green-200',
      });
      await refreshSpecificTab('reviews');
    } catch (error: any) {
      handleApiError(error, 'حذف السلايدر');
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setActiveTabState('orders');
    closeSidebar();
    toast({
      title: 'تم تسجيل الخروج',
      description: 'إلى اللقاء!',
    });
    navigate('/login');
  };

  // Review handlers
  const handleApproveReview = async (reviewId: string) => {
    try {
      await reviewsApi.approve(reviewId);
      toast({ 
        title: '✅ نجح', 
        description: 'تم الموافقة على التقييم',
        className: 'bg-green-50 border-green-200',
      });
      await refreshSpecificTab('sliders');
    } catch (error: any) {
      handleApiError(error, 'الموافقة على التقييم');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await reviewsApi.delete(reviewId);
      toast({ 
        title: '✅ نجح', 
        description: 'تم حذف التقييم',
        className: 'bg-green-50 border-green-200',
      });
      await refreshSpecificTab('sliders');
    } catch (error: any) {
      handleApiError(error, 'حذف التقييم');
      throw error;
    }
  };

  // Order handlers
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      toast({
        title: '✅ نجح',
        description: 'تم تحديث حالة الطلب',
        className: 'bg-green-50 border-green-200',
      });
      await refreshSpecificTab('orders');
    } catch (error: any) {
      handleApiError(error, 'تحديث حالة الطلب');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await ordersApi.delete(orderId);
      toast({
        title: '✅ نجح',
        description: 'تم حذف الطلب',
        className: 'bg-green-50 border-green-200',
      });
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
    totalProducts: Array.isArray(products) ? products.length : 0,
    totalCategories: Array.isArray(categories) ? categories.length : 0,
    bestSellers: Array.isArray(products) ? products.filter(p => p.best_selling).length : 0,
    pendingReviews: Array.isArray(reviews) ? reviews.filter(r => !r.approved).length : 0,
    totalOrders: Array.isArray(orders) ? orders.length : 0,
    pendingOrders: Array.isArray(orders) ? orders.filter((o: any) => o.status === 'pending').length : 0,
  };

  const navigationTabs = [
    { id: 'orders', label: 'الطلبات' },
    { id: 'products', label: 'المنتجات' },
    { id: 'bestsellers', label: 'الأكثر مبيعاً' },
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg md:text-xl">إدارة الطلبات</CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      {stats.totalOrders} طلب - {stats.pendingOrders} قيد الانتظار
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={refreshTabData} 
                    size="sm" 
                    variant="outline"
                    disabled={tabLoading.orders}
                    className="w-full sm:w-auto"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${tabLoading.orders ? 'animate-spin' : ''}`} />
                    تحديث
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 md:p-6 md:pt-0">
                {tabLoading.orders ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
                      <p className="mt-4 text-sm text-muted-foreground">جاري تحميل الطلبات...</p>
                    </div>
                  </div>
                ) : (
                  <>
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
                      {paginatedOrders.map((order: any) => (
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
                                        {order.items.map((item: any, idx: number) => (
                                          <div key={idx} className="text-sm flex justify-between">
                                            <span>{item.name} (x{item.quantity})</span>
                                            <span className="font-medium">{item.price * item.quantity} درهم</span>
                                          </div>
                                        ))}
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
                  {paginatedOrders.map((order: any) => (
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
                            <div>📱 {order.customer_phone}</div>
                            <div>📦 {order.items.length} منتج</div>
                            <div className="font-bold text-primary">💰 {order.total_amount} درهم</div>
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
                                {order.items.map((item: any, idx: number) => (
                                  <div key={idx} className="text-sm flex justify-between">
                                    <span>{item.name} (x{item.quantity})</span>
                                    <span className="font-medium">{item.price * item.quantity} درهم</span>
                                  </div>
                                ))}
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
                
                {/* Pagination for Orders */}
                {orders.length > ITEMS_PER_PAGE.orders && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t">
                    <div className="text-sm text-muted-foreground order-2 sm:order-1">
                      عرض {((currentPage.orders - 1) * ITEMS_PER_PAGE.orders) + 1} - {Math.min(currentPage.orders * ITEMS_PER_PAGE.orders, orders.length)} من {orders.length} طلب
                    </div>
                    <div className="flex gap-2 order-1 sm:order-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange('orders', currentPage.orders - 1)}
                        disabled={currentPage.orders === 1}
                      >
                        السابق
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange('orders', currentPage.orders + 1)}
                        disabled={currentPage.orders >= getTotalPages(orders.length, 'orders')}
                      >
                        التالي
                      </Button>
                    </div>
                  </div>
                )}
                </>
                )}
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
                    <CardDescription className="text-xs md:text-sm">
                      عرض وتعديل وحذف المنتجات ({products.length} منتج)
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button 
                      onClick={refreshTabData} 
                      size="sm" 
                      variant="outline"
                      disabled={tabLoading.products}
                      className="flex-1 sm:flex-initial"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${tabLoading.products ? 'animate-spin' : ''}`} />
                      تحديث
                    </Button>
                    <Button onClick={() => openProductDialog()} size="sm" className="flex-1 sm:flex-initial">
                      <Plus className="h-4 w-4 mr-2" />
                      إضافة منتج
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 md:p-6 md:pt-0">
                {tabLoading.products ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
                      <p className="mt-4 text-sm text-muted-foreground">جاري تحميل المنتجات...</p>
                    </div>
                  </div>
                ) : (
                  <>
                {/* Mobile View - Cards */}
                <div className="md:hidden space-y-3 p-4">
                  {paginatedProducts.map((product) => (
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
                      {paginatedProducts.map((product) => (
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
                
                {/* Pagination Controls */}
                {products.length > ITEMS_PER_PAGE.products && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t">
                    <div className="text-sm text-muted-foreground order-2 sm:order-1">
                      عرض {((currentPage.products - 1) * ITEMS_PER_PAGE.products) + 1} - {Math.min(currentPage.products * ITEMS_PER_PAGE.products, products.length)} من {products.length} منتج
                    </div>
                    <div className="flex gap-2 order-1 sm:order-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange('products', currentPage.products - 1)}
                        disabled={currentPage.products === 1}
                      >
                        السابق
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: getTotalPages(products.length, 'products') }, (_, i) => i + 1)
                          .filter(page => {
                            const current = currentPage.products;
                            const total = getTotalPages(products.length, 'products');
                            return page === 1 || page === total || 
                                   (page >= current - 1 && page <= current + 1);
                          })
                          .map((page, idx, arr) => (
                            <Fragment key={page}>
                              {idx > 0 && arr[idx - 1] !== page - 1 && (
                                <span className="px-2 text-muted-foreground">...</span>
                              )}
                              <Button
                                variant={currentPage.products === page ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handlePageChange('products', page)}
                                className="min-w-[40px]"
                              >
                                {page}
                              </Button>
                            </Fragment>
                          ))
                        }
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange('products', currentPage.products + 1)}
                        disabled={currentPage.products >= getTotalPages(products.length, 'products')}
                      >
                        التالي
                      </Button>
                    </div>
                  </div>
                )}
                </>
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
                  {products.map((product) => {
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
                      {products.map((product) => {
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-category">الفئة</Label>
                  <Select
                    value={productForm.category}
                    onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-type">النوع</Label>
                  <Select
                    value={productForm.type}
                    onValueChange={(value) => setProductForm({ ...productForm, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRODUIT">PRODUIT</SelectItem>
                      <SelectItem value="TESTEUR">TESTEUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                  disabled={!!editingCategory}
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
    </div>
  );
}
