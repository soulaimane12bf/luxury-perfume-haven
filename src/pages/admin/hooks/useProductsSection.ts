import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';
import { productsApi } from '@/lib/api';
import showAdminAlert from '@/lib/swal-admin';
import { useCart } from '@/contexts/CartContext';
import type { PaginatedResponse, Product } from '../types';

type ApiErrorHandler = (error: unknown, operation: string) => void;

type ProductsSectionParams = {
  handleApiError: ApiErrorHandler;
  initialProductPage: number;
  initialBestSellersPage: number;
};

export type ProductFormState = {
  id: string;
  name: string;
  brand: string;
  price: string;
  old_price: string;
  category: string;
  type: string;
  size: string;
  description: string;
  stock: string | number;
};

export type ProductsSectionState = {
  products: Product[];
  filteredProducts: Product[];
  productSearchQuery: string;
  setProductSearchQuery: (value: string) => void;
  productDialog: boolean;
  setProductDialog: (open: boolean) => void;
  editingProduct: Product | null;
  productForm: ProductFormState;
  setProductForm: Dispatch<SetStateAction<ProductFormState>>;
  productImages: File[];
  setProductImages: Dispatch<SetStateAction<File[]>>;
  existingImageUrls: string[];
  setExistingImageUrls: Dispatch<SetStateAction<string[]>>;
  productPage: number;
  setProductPage: (page: number) => void;
  productTotalPages: number;
  setProductTotalPages: (value: number) => void;
  productTotal: number;
  setProductTotal: (value: number) => void;
  productLimit: number;
  productBestSellersCount: number;
  setProductBestSellersCount: (value: number) => void;
  bestSellersProducts: Product[];
  setBestSellersProducts: Dispatch<SetStateAction<Product[]>>;
  bestSellersPage: number;
  setBestSellersPage: (page: number) => void;
  bestSellersTotalPages: number;
  setBestSellersTotalPages: (value: number) => void;
  bestSellersTotal: number;
  setBestSellersTotal: (value: number) => void;
  bestSellersLimit: number;
  openProductDialog: (product?: Product) => void;
  handleSaveProduct: () => Promise<void>;
  handleDeleteProduct: (productId: string) => Promise<void>;
  handleToggleBestSelling: (productId: string) => Promise<void>;
  fetchProducts: (page?: number, limit?: number) => Promise<void>;
  fetchBestSellers: (page?: number, limit?: number) => Promise<void>;
  fetchBestSellerCount: () => Promise<void>;
};

const DEFAULT_PRODUCT_FORM: ProductFormState = {
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
};

export function useProductsSection({ handleApiError, initialProductPage, initialBestSellersPage }: ProductsSectionParams): ProductsSectionState {
  const { removeDeletedProduct, updateProductStock } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productDialog, setProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<ProductFormState>(DEFAULT_PRODUCT_FORM);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [productPage, setProductPage] = useState<number>(initialProductPage);
  const [productTotalPages, setProductTotalPages] = useState<number>(1);
  const [productTotal, setProductTotal] = useState<number>(0);
  const productLimit = 24;

  const [productBestSellersCount, setProductBestSellersCount] = useState<number>(0);
  const [bestSellersProducts, setBestSellersProducts] = useState<Product[]>([]);
  const [bestSellersPage, setBestSellersPage] = useState<number>(initialBestSellersPage);
  const bestSellersLimit = 24;
  const [bestSellersTotalPages, setBestSellersTotalPages] = useState<number>(1);
  const [bestSellersTotal, setBestSellersTotal] = useState<number>(0);

  const isPaginatedResponse = (value: unknown): value is PaginatedResponse => {
    if (typeof value !== 'object' || value === null) return false;
    const maybe = value as Partial<PaginatedResponse>;
    return Array.isArray(maybe.products) && typeof maybe.total === 'number' && typeof maybe.totalPages === 'number';
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const search = productSearchQuery.toLowerCase();
      return (
        productSearchQuery === '' ||
        product.name.toLowerCase().includes(search) ||
        (product.brand || '').toLowerCase().includes(search)
      );
    });
  }, [productSearchQuery, products]);

  const fetchProducts = useCallback(
    async (page = productPage, limit = productLimit) => {
      try {
        const productsData = (await productsApi.getAll({ page, limit })) as unknown;
        if (isPaginatedResponse(productsData)) {
          setProducts(productsData.products);
          setProductTotal(productsData.total);
          setProductTotalPages(productsData.totalPages);
        } else if (Array.isArray(productsData)) {
          setProducts(productsData as Product[]);
        } else {
          setProducts([]);
        }
      } catch (error) {
        handleApiError(error, 'جلب المنتجات');
      }
    },
    [handleApiError, productLimit, productPage],
  );

  const fetchBestSellerCount = useCallback(async () => {
    try {
      const result = (await productsApi.getAll({ best_selling: true, page: 1, limit: 1 }).catch(() => ({ total: 0, totalPages: 0, products: [] }))) as unknown;
      if (isPaginatedResponse(result)) {
        setProductBestSellersCount(result.total);
        setBestSellersTotal(result.total);
      }
    } catch (error) {
      handleApiError(error, 'جلب الأكثر مبيعاً');
    }
  }, [handleApiError]);

  const fetchBestSellers = useCallback(
    async (page = bestSellersPage, limit = bestSellersLimit) => {
      try {
        // For admin, fetch ALL products (not filtered by best_selling)
        // This allows admin to see and toggle all products
        const bestData = (await productsApi.getAll({ page, limit })) as unknown;
        if (isPaginatedResponse(bestData)) {
          setBestSellersProducts(bestData.products);
          setBestSellersTotalPages(bestData.totalPages);
          setBestSellersTotal(bestData.total);
        } else if (Array.isArray(bestData)) {
          setBestSellersProducts(bestData as Product[]);
        } else {
          setBestSellersProducts([]);
        }
      } catch (error) {
        handleApiError(error, 'جلب الأكثر مبيعاً');
      }
    },
    [bestSellersLimit, bestSellersPage, handleApiError],
  );

  const openProductDialog = useCallback((product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        id: product.id,
        name: product.name,
        brand: product.brand || '',
        price: product.price != null ? String(product.price) : '',
        old_price: product.old_price != null ? String(product.old_price) : '',
        category: product.category || '',
        type: product.type || 'PRODUIT',
        size: product.size || '100ml',
        description: product.description || '',
        stock: product.stock != null ? String(product.stock) : '',
      });
      setExistingImageUrls(product.image_urls || []);
      setProductImages([]);
    } else {
      setEditingProduct(null);
      setProductForm(DEFAULT_PRODUCT_FORM);
      setExistingImageUrls([]);
      setProductImages([]);
    }
    setProductDialog(true);
  }, []);

  const handleSaveProduct = useCallback(async () => {
    try {
      if (!productForm.type) {
        showAdminAlert({ title: 'خطأ', text: 'نوع المنتج مطلوب', icon: 'error', timer: 5000 });
        return;
      }

      let imageUrls = [...existingImageUrls];
      if (productImages.length > 0) {
        const newImageUrls = await Promise.all(
          productImages.map(
            (file) =>
              new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const result = reader.result;
                  resolve(typeof result === 'string' ? result : '');
                };
                reader.readAsDataURL(file);
              }),
          ),
        );
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        old_price: productForm.old_price ? parseFloat(productForm.old_price) : null,
        stock: typeof productForm.stock === 'string' && productForm.stock === '' ? 0 : Number(productForm.stock),
        notes: null,
        image_urls: imageUrls,
        type: productForm.type || 'PRODUIT',
      };

      if (!productData.type) {
        productData.type = 'PRODUIT';
      }

      if (editingProduct) {
        await productsApi.update(editingProduct.id, productData);
        showAdminAlert({ title: '✅ نجح', text: 'تم تحديث المنتج بنجاح', icon: 'success', timer: 3000 });
      } else {
        await productsApi.create(productData);
        showAdminAlert({ title: '✅ نجح', text: 'تم إضافة المنتج بنجاح', icon: 'success', timer: 3000 });
      }

      setProductDialog(false);
      await fetchProducts();
      await fetchBestSellerCount();
    } catch (error) {
      handleApiError(error, editingProduct ? 'تحديث المنتج' : 'إضافة المنتج');
    }
  }, [editingProduct, existingImageUrls, fetchBestSellerCount, fetchProducts, handleApiError, productForm, productImages]);

  const handleDeleteProduct = useCallback(
    async (productId: string) => {
      try {
        await productsApi.delete(productId);
        // Remove from customer carts
        removeDeletedProduct(productId);
        showAdminAlert({ title: '✅ نجح', text: 'تم حذف المنتج', icon: 'success', timer: 3000 });
        await fetchProducts();
        await fetchBestSellerCount();
      } catch (error) {
        handleApiError(error, 'حذف المنتج');
        throw error;
      }
    },
    [fetchBestSellerCount, fetchProducts, handleApiError, removeDeletedProduct],
  );

  const handleToggleBestSelling = useCallback(
    async (productId: string) => {
      // Find the product to get current state
      const product = bestSellersProducts.find(p => p.id === productId) || products.find(p => p.id === productId);
      if (!product) return;
      
      const newBestSellingState = !product.best_selling;
      
      // Optimistically update UI immediately for instant feedback
      setBestSellersProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, best_selling: newBestSellingState } : p)));
      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, best_selling: newBestSellingState } : p)));
      
      try {
        // Make API call in background
        const result = (await productsApi.toggleBestSelling(productId)) as { best_selling?: boolean };
        const updatedBestSeller = Boolean(result?.best_selling);
        
        showAdminAlert({
          title: '✅ نجح',
          text: updatedBestSeller ? 'تمت الإضافة للأكثر مبيعاً' : 'تمت الإزالة من الأكثر مبيعاً',
          icon: 'success',
          timer: 2000,
        });
        
        // Update count in background (don't await)
        fetchBestSellerCount();
        
      } catch (error) {
        // Revert optimistic update on error
        setBestSellersProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, best_selling: !newBestSellingState } : p)));
        setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, best_selling: !newBestSellingState } : p)));
        handleApiError(error, 'تحديث حالة الأكثر مبيعاً');
      }
    },
    [bestSellersProducts, products, fetchBestSellerCount, handleApiError],
  );

  return {
    products,
    filteredProducts,
    productSearchQuery,
    setProductSearchQuery,
    productDialog,
    setProductDialog,
    editingProduct,
    productForm,
    setProductForm,
    productImages,
    setProductImages,
    existingImageUrls,
    setExistingImageUrls,
    productPage,
    setProductPage,
    productTotalPages,
    setProductTotalPages,
    productTotal,
    setProductTotal,
    productLimit,
    productBestSellersCount,
    setProductBestSellersCount,
    bestSellersProducts,
    setBestSellersProducts,
    bestSellersPage,
    setBestSellersPage,
    bestSellersTotalPages,
    setBestSellersTotalPages,
    bestSellersTotal,
    setBestSellersTotal,
    bestSellersLimit,
    openProductDialog,
    handleSaveProduct,
    handleDeleteProduct,
    handleToggleBestSelling,
    fetchProducts,
    fetchBestSellers,
    fetchBestSellerCount,
  };
}
