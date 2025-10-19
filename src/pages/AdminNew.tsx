import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '@/components/AdminNavbar';
import AdminProfile from '@/components/AdminProfile';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
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
import { productsApi, categoriesApi, reviewsApi, ordersApi } from '@/lib/api';
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
  ChevronUp
} from 'lucide-react';

type Product = {
  id: string;
  name: string;
  brand: string;
  price: string;
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
  image_url: string;
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
  type: 'product' | 'category' | 'review' | 'order';
  id: string;
  name?: string;
  meta?: string;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, token, loading: authLoading } = useAuth();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);
  
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
    category: '',
    type: 'PRODUIT',
    size: '100ml',
    description: '',
    stock: 0,
  });
  const [productImages, setProductImages] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);

  // Category form state
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
  });

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
    }
  }, [isAuthenticated, token, authLoading, navigate, toast]);

  useEffect(() => {
    fetchAllData();
  }, []);

  // Helper function to handle API errors
  const handleApiError = (error: any, operation: string) => {
    console.error(`Error during ${operation}:`, error);
    
    let errorMessage = error?.message || 'حدث خطأ غير متوقع';
    let shouldLogout = false;

    // Check if it's an auth error
    if (error?.isAuthError || error?.status === 401 || error?.message?.includes('401')) {
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

  const fetchAllData = async () => {
    try {
      const [productsData, categoriesData, reviewsData, ordersData] = await Promise.all([
        productsApi.getAll({}).catch((err) => {
          console.error('Error fetching products:', err);
          return [];
        }),
        categoriesApi.getAll().catch((err) => {
          console.error('Error fetching categories:', err);
          return [];
        }),
        reviewsApi.getAll().catch((err) => {
          console.error('Error fetching reviews:', err);
          return [];
        }),
        ordersApi.getAll().catch((err) => {
          console.error('Error fetching orders:', err);
          return [];
        }),
      ]);
      
      // Ensure we always have arrays
      setProducts(Array.isArray(productsData) ? productsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      // Set empty arrays as fallback
      setProducts([]);
      setCategories([]);
      setReviews([]);
      setOrders([]);
      handleApiError(error, 'تحميل البيانات');
    } finally {
      setLoading(false);
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
        price: product.price,
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
        category: '',
        type: 'PRODUIT',
        size: '100ml',
        description: '',
        stock: 0,
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
      fetchAllData();
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
      fetchAllData();
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
        image_url: category.image_url || '',
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: '',
        slug: '',
        description: '',
        image_url: '',
      });
    }
    setCategoryDialog(true);
  };

  const handleSaveCategory = async () => {
    try {
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, categoryForm);
        toast({ 
          title: '✅ نجح', 
          description: 'تم تحديث الفئة بنجاح',
          className: 'bg-green-50 border-green-200',
        });
      } else {
        await categoriesApi.create(categoryForm);
        toast({ 
          title: '✅ نجح', 
          description: 'تم إضافة الفئة بنجاح',
          className: 'bg-green-50 border-green-200',
        });
      }
      
      setCategoryDialog(false);
      fetchAllData();
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
      fetchAllData();
    } catch (error: any) {
      handleApiError(error, 'حذف الفئة');
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setActiveTab('orders');
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
      fetchAllData();
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
      fetchAllData();
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
      fetchAllData();
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
      fetchAllData();
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
            onTabChange={setActiveTab}
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
                  setActiveTab(tab);
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
          onTabChange={setActiveTab}
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
                setActiveTab(tab);
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
              <Select value={activeTab} onValueChange={setActiveTab}>
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
                        <>
                          <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50" onClick={() => toggleOrderDetails(order.id)}>
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
                              {new Date(order.created_at).toLocaleDateString('ar-MA')}
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <div className="flex gap-2">
                                {order.whatsapp_url && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => window.open(order.whatsapp_url, '_blank')}
                                    title="إرسال إشعار واتساب"
                                  >
                                    <MessageCircle className="h-4 w-4 text-green-600" />
                                  </Button>
                                )}
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
                            <TableRow>
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
                        </>
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
                              التاريخ: {new Date(order.created_at).toLocaleDateString('ar-MA')}
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
                          {order.whatsapp_url && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => window.open(order.whatsapp_url, '_blank')}
                              title="إرسال إشعار واتساب"
                            >
                              <MessageCircle className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
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
                {/* Mobile View - Cards */}
                <div className="md:hidden space-y-3 p-4">
                  {products.map((product) => (
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
                      {products.map((product) => (
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
                  {products.map((product) => (
                    <Card key={product.id} className="p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                          <p className="text-xs text-muted-foreground">{product.brand}</p>
                          <p className="text-sm font-bold text-gold mt-1">{product.price} درهم</p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">الأكثر مبيعاً</span>
                          <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            product.best_selling ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                          }`}>
                            <Switch
                              checked={product.best_selling}
                              onCheckedChange={() => handleToggleBestSelling(product.id)}
                              className="data-[state=checked]:bg-green-500"
                            />
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
                        <TableHead>المنتج</TableHead>
                        <TableHead>العلامة</TableHead>
                        <TableHead>السعر</TableHead>
                        <TableHead className="text-center">الأكثر مبيعاً</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.brand}</TableCell>
                          <TableCell>{product.price} درهم</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center">
                              <Switch
                                checked={product.best_selling}
                                onCheckedChange={() => handleToggleBestSelling(product.id)}
                                className="data-[state=checked]:bg-green-500"
                              />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-id">معرّف المنتج</Label>
                  <Input
                    id="product-id"
                    value={productForm.id}
                    onChange={(e) => setProductForm({ ...productForm, id: e.target.value })}
                    placeholder="product-id-slug"
                    disabled={!!editingProduct}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-name">اسم المنتج</Label>
                  <Input
                    id="product-name"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  />
                </div>
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
                  <Label htmlFor="product-price">السعر (درهم)</Label>
                  <Input
                    id="product-price"
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  />
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
                    onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })}
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

              <div className="space-y-2">
                <Label htmlFor="category-image">رابط الصورة</Label>
                <Input
                  id="category-image"
                  value={categoryForm.image_url}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
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
      </div>
    </div>
  );
}
