import { useCallback, useEffect } from 'react';
import type { AdminTab } from '../types';
import type { ProductsSectionState } from './useProductsSection';
import type { OrdersSectionState } from './useOrdersSection';
import type { CategoriesSectionState } from './useCategoriesSection';
import type { ReviewsSectionState } from './useReviewsSection';
import type { SlidersSectionState } from './useSlidersSection';

type ProductsSection = ProductsSectionState;
type OrdersSection = OrdersSectionState;
type CategoriesSection = CategoriesSectionState;
type ReviewsSection = ReviewsSectionState;
type SlidersSection = SlidersSectionState;

type UseAdminDataManagerParams = {
  activeTab: AdminTab;
  setLoading: (value: boolean) => void;
  authLoading: boolean;
  isAuthenticated: boolean;
  productsSection: ProductsSection;
  ordersSection: OrdersSection;
  categoriesSection: CategoriesSection;
  reviewsSection: ReviewsSection;
  slidersSection: SlidersSection;
};

export const useAdminDataManager = ({
  activeTab,
  setLoading,
  authLoading,
  isAuthenticated,
  productsSection,
  ordersSection,
  categoriesSection,
  reviewsSection,
  slidersSection,
}: UseAdminDataManagerParams) => {
  const {
    products,
    productPage,
    productLimit,
    fetchProducts,
    fetchBestSellers,
    fetchBestSellerCount,
    bestSellersProducts,
    bestSellersPage,
    bestSellersLimit,
  } = productsSection;
  const { orders, refreshOrders } = ordersSection;
  const { categories, fetchCategories } = categoriesSection;
  const { reviews, fetchReviews } = reviewsSection;
  const { sliders, fetchSliders } = slidersSection;

  const refreshSpecificTab = useCallback(
    async (tab: AdminTab) => {
      switch (tab) {
        case 'products':
          await fetchProducts(productPage, productLimit);
          await fetchBestSellerCount();
          break;
        case 'bestsellers':
          await fetchBestSellers(bestSellersPage, bestSellersLimit);
          await fetchBestSellerCount();
          break;
        case 'categories':
          await fetchCategories();
          break;
        case 'reviews':
          await fetchReviews();
          break;
        case 'orders':
          await refreshOrders();
          break;
        case 'sliders':
          await fetchSliders();
          break;
        default:
          break;
      }
    },
    [
      bestSellersLimit,
      bestSellersPage,
      fetchBestSellerCount,
      fetchBestSellers,
      fetchCategories,
      fetchProducts,
      fetchReviews,
      fetchSliders,
      productLimit,
      productPage,
      refreshOrders,
    ],
  );

  const refreshTabData = useCallback(async () => {
    await refreshSpecificTab(activeTab);
  }, [activeTab, refreshSpecificTab]);

  const loadTabData = useCallback(
    async (tab: AdminTab) => {
      setLoading(true);
      try {
        switch (tab) {
          case 'orders':
            if (orders.length === 0) await refreshOrders();
            break;
          case 'products':
            if (products.length === 0) {
              await fetchProducts(productPage, productLimit);
              await fetchBestSellerCount();
            }
            break;
          case 'bestsellers':
            if (bestSellersProducts.length === 0) {
              await fetchBestSellers(bestSellersPage, bestSellersLimit);
              await fetchBestSellerCount();
            }
            break;
          case 'categories':
            if (categories.length === 0) await fetchCategories();
            break;
          case 'reviews':
            if (reviews.length === 0) await fetchReviews();
            break;
          case 'sliders':
            if (sliders.length === 0) await fetchSliders();
            break;
          default:
            break;
        }
      } finally {
        setLoading(false);
      }
    },
    [
      bestSellersLimit,
      bestSellersPage,
      bestSellersProducts.length,
      categories.length,
      fetchBestSellerCount,
      fetchBestSellers,
      fetchCategories,
      fetchProducts,
      fetchReviews,
      fetchSliders,
      orders.length,
      productLimit,
      productPage,
      products.length,
      refreshOrders,
      reviews.length,
      setLoading,
      sliders.length,
    ],
  );

  // Initial data load only - don't refetch everything on page changes
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    (async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchProducts(1, productLimit), // Always fetch page 1 initially
          fetchBestSellerCount(),
          fetchCategories(),
          fetchReviews(),
          refreshOrders(),
          fetchSliders(),
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, [
    authLoading,
    isAuthenticated,
    fetchProducts,
    productLimit,
    fetchBestSellerCount,
    fetchCategories,
    fetchReviews,
    refreshOrders,
    fetchSliders,
    setLoading,
  ]);

  // Fetch products when productPage changes (but don't refetch other data)
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    if (productPage === 1) return; // Skip if page 1 (already loaded in initial effect)
    fetchProducts(productPage, productLimit);
  }, [productPage, productLimit, authLoading, isAuthenticated, fetchProducts]);

  // Fetch bestsellers when bestSellersPage changes
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    if (activeTab !== 'bestsellers') return; // Only fetch if on bestsellers tab
    fetchBestSellers(bestSellersPage, bestSellersLimit);
  }, [bestSellersPage, bestSellersLimit, authLoading, isAuthenticated, activeTab, fetchBestSellers]);

  useEffect(() => {
    loadTabData(activeTab);
  }, [activeTab, loadTabData]);

  return {
    refreshSpecificTab,
    refreshTabData,
    loadTabData,
  };
};
