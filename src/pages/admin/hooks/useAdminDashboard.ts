import { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import showAdminAlert from '@/lib/swal-admin';
import {
  AdminTab,
  ADMIN_TABS,
  DeleteTarget,
} from '../types';
import { isAdminTab } from '../utils';
import { useOrdersSection } from './useOrdersSection';
import { useProductsSection } from './useProductsSection';
import { useCategoriesSection } from './useCategoriesSection';
import { useReviewsSection } from './useReviewsSection';
import { useSlidersSection } from './useSlidersSection';
import { useAdminAuthGuard } from './useAdminAuthGuard';
import { useAdminNavigationSync } from './useAdminNavigationSync';
import { useAdminDataManager } from './useAdminDataManager';
import { useAdminDeleteDialog } from './useAdminDeleteDialog';

export const DEFAULT_ADMIN_TAB: AdminTab = 'orders';

const DELETE_LABELS: Record<DeleteTarget['type'], string> = {
  product: 'المنتج',
  category: 'الفئة',
  review: 'التقييم',
  order: 'الطلب',
  slider: 'الصورة',
};

export const useAdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialProductPage = parseInt(searchParams.get('productsPage') || '1', 10) || 1;
  const initialBestSellersPage = parseInt(searchParams.get('bestsellersPage') || '1', 10) || 1;

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTabState] = useState<AdminTab>(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    return isAdminTab(tabParam) ? tabParam : DEFAULT_ADMIN_TAB;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => setIsSidebarOpen((prev) => !prev), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  type ApiError = {
    message?: string;
    response?: { data?: { message?: string } };
    data?: { message?: string };
    status?: number;
    isAuthError?: boolean;
    isNetworkError?: boolean;
  };

  const handleApiError = useCallback(
    (error: unknown, operation: string) => {
      console.error(`Error during ${operation}:`, error);

      const apiError = (typeof error === 'object' && error !== null ? error : {}) as ApiError;
      let errorMessage = apiError.message || 'حدث خطأ غير متوقع';
      let shouldLogout = false;

      if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message;
      } else if (apiError.data?.message) {
        errorMessage = apiError.data.message;
      }

      if (apiError.status === 413 || apiError.message?.includes('413')) {
        errorMessage = 'حجم الصورة كبير جداً. يرجى اختيار صورة أصغر (أقل من 10MB).';
      } else if (apiError.isAuthError || apiError.status === 401 || apiError.message?.includes('401')) {
        errorMessage = 'انتهت جلستك. يرجى تسجيل الدخول مرة أخرى.';
        shouldLogout = true;
      } else if (apiError.isNetworkError) {
        errorMessage = 'فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.';
      }

      showAdminAlert({ title: 'خطأ', text: errorMessage, icon: 'error', timer: 5000 });

      if (shouldLogout) {
        setTimeout(() => navigate('/login'), 1500);
      }
    },
    [navigate],
  );

  const ordersSection = useOrdersSection({ handleApiError });
  const productsSection = useProductsSection({ handleApiError, initialProductPage, initialBestSellersPage });
  const categoriesSection = useCategoriesSection({ handleApiError });
  const reviewsSection = useReviewsSection({ handleApiError });
  const slidersSection = useSlidersSection({ handleApiError });

  const { authLoading, isAuthenticated, handleLogout } = useAdminAuthGuard({
    navigate,
    closeSidebar,
    setActiveTab: setActiveTabState,
  });

  const { handleTabChange } = useAdminNavigationSync({
    activeTab,
    setActiveTab: setActiveTabState,
    location,
    navigate,
    searchParams,
    setSearchParams,
    productPage: productsSection.productPage,
    setProductPage: productsSection.setProductPage,
    bestSellersPage: productsSection.bestSellersPage,
    setBestSellersPage: productsSection.setBestSellersPage,
  });

  const { refreshSpecificTab, refreshTabData, loadTabData } = useAdminDataManager({
    activeTab,
    setLoading,
    authLoading,
    isAuthenticated,
    productsSection,
    ordersSection,
    categoriesSection,
    reviewsSection,
    slidersSection,
  });

  const deleteDialog = useAdminDeleteDialog({
    handleDeleteProduct: productsSection.handleDeleteProduct,
    handleDeleteCategory: categoriesSection.handleDeleteCategory,
    handleDeleteReview: reviewsSection.handleDeleteReview,
    handleDeleteOrder: ordersSection.handleDeleteOrder,
    handleDeleteSlider: slidersSection.handleDeleteSlider,
  });

  const stats = useMemo(
    () => ({
      totalProducts: productsSection.productTotal > 0 ? productsSection.productTotal : productsSection.products.length,
      totalCategories: categoriesSection.categories.length,
      bestSellers:
        productsSection.productBestSellersCount > 0
          ? productsSection.productBestSellersCount
          : productsSection.products.filter((p) => p.best_selling).length,
      pendingReviews: reviewsSection.reviews.filter((review) => !review.approved).length,
      totalOrders: ordersSection.orders.length,
      pendingOrders: ordersSection.orders.filter((order) => order.status === 'pending').length,
    }),
    [
      categoriesSection.categories.length,
      ordersSection.orders,
      productsSection.productBestSellersCount,
      productsSection.productTotal,
      productsSection.products,
      reviewsSection.reviews,
    ],
  );

  const tabLabels: Record<AdminTab, string> = {
    orders: 'الطلبات',
    products: 'المنتجات',
    categories: 'الأقسام',
    reviews: 'التقييمات',
    bestsellers: 'الأكثر مبيعاً',
    sliders: 'السلايدر',
    profile: 'الملف الشخصي',
  };

  const navigationTabs = ADMIN_TABS.map((tab) => ({ id: tab, label: tabLabels[tab] }));

  return {
    loading: loading || authLoading,
    activeTab,
    navigationTabs,
    stats,
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    handleTabChange,
    products: productsSection.products,
    orders: ordersSection.orders,
    filteredProducts: productsSection.filteredProducts,
    productSearchQuery: productsSection.productSearchQuery,
    setProductSearchQuery: productsSection.setProductSearchQuery,
    productDialog: productsSection.productDialog,
    setProductDialog: productsSection.setProductDialog,
    editingProduct: productsSection.editingProduct,
    productForm: productsSection.productForm,
    setProductForm: productsSection.setProductForm,
    productImages: productsSection.productImages,
    setProductImages: productsSection.setProductImages,
    existingImageUrls: productsSection.existingImageUrls,
    setExistingImageUrls: productsSection.setExistingImageUrls,
    productPage: productsSection.productPage,
    setProductPage: productsSection.setProductPage,
    productTotalPages: productsSection.productTotalPages,
    productTotal: productsSection.productTotal,
    productLimit: productsSection.productLimit,
    categories: categoriesSection.categories,
    categoryDialog: categoriesSection.categoryDialog,
    setCategoryDialog: categoriesSection.setCategoryDialog,
    editingCategory: categoriesSection.editingCategory,
    categoryForm: categoriesSection.categoryForm,
    setCategoryForm: categoriesSection.setCategoryForm,
    reviews: reviewsSection.reviews,
    bestSellersProducts: productsSection.bestSellersProducts,
    bestSellersPage: productsSection.bestSellersPage,
    setBestSellersPage: productsSection.setBestSellersPage,
    bestSellersTotalPages: productsSection.bestSellersTotalPages,
    bestSellersTotal: productsSection.bestSellersTotal,
    bestSellersLimit: productsSection.bestSellersLimit,
    sliders: slidersSection.sliders,
    sliderDialog: slidersSection.sliderDialog,
    setSliderDialog: slidersSection.setSliderDialog,
    editingSlider: slidersSection.editingSlider,
    sliderForm: slidersSection.sliderForm,
    setSliderForm: slidersSection.setSliderForm,
    sliderImage: slidersSection.sliderImage,
    setSliderImage: slidersSection.setSliderImage,
    expandedOrders: ordersSection.expandedOrders,
    toggleOrderDetails: ordersSection.toggleOrderDetails,
    deleteDialogOpen: deleteDialog.deleteDialogOpen,
    isDeleting: deleteDialog.isDeleting,
    deleteTargetLabel: deleteDialog.deleteTarget ? DELETE_LABELS[deleteDialog.deleteTarget.type] : '',
    deleteTargetDetails:
      deleteDialog.deleteTarget
        ? [deleteDialog.deleteTarget.name, deleteDialog.deleteTarget.meta].filter(Boolean).join(' • ') || deleteDialog.deleteTarget.id
        : '',
    openDeleteDialog: deleteDialog.openDeleteDialog,
    closeDeleteDialog: deleteDialog.closeDeleteDialog,
    confirmDelete: deleteDialog.confirmDelete,
    openProductDialog: productsSection.openProductDialog,
    handleSaveProduct: productsSection.handleSaveProduct,
    handleToggleBestSelling: productsSection.handleToggleBestSelling,
    openCategoryDialog: categoriesSection.openCategoryDialog,
    handleSaveCategory: categoriesSection.handleSaveCategory,
    handleApproveReview: reviewsSection.handleApproveReview,
    handleDeleteReview: reviewsSection.handleDeleteReview,
    handleUpdateOrderStatus: ordersSection.handleUpdateOrderStatus,
    handleContactCustomer: ordersSection.handleContactCustomer,
    handleLogout,
    handleSaveSlider: slidersSection.handleSaveSlider,
    openSliderDialog: slidersSection.openSliderDialog,
    refreshSpecificTab,
    refreshTabData,
    loadTabData,
  };
};
