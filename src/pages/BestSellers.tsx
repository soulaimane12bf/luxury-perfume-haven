import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/lib/api';
import PaginationResponsive from '@/components/PaginationResponsive';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Sparkles } from 'lucide-react';
import SEO from '@/components/SEO';
import type { Product } from '@/pages/admin/types';

type PaginatedBestSellersResponse = {
  products: Product[];
  total?: number;
  totalPages?: number;
  page?: number;
};

const isProduct = (value: unknown): value is Product => {
  return typeof value === 'object' && value !== null && 'id' in value;
};

const isProductArray = (value: unknown): value is Product[] => {
  return Array.isArray(value) && value.every(isProduct);
};

const isPaginatedResponse = (value: unknown): value is PaginatedBestSellersResponse => {
  if (typeof value !== 'object' || value === null) return false;
  const maybe = value as { products?: unknown; totalPages?: unknown };
  return isProductArray(maybe.products);
};

export default function BestSellers() {
  const canonical = typeof window !== 'undefined' ? window.location.href : 'https://www.cosmedstores.com/best-sellers';
  const title = 'الأكثر مبيعاً | Cosmed Stores';
  const description = 'اكتشف أفضل العطور الأكثر مبيعاً في Cosmed Stores.';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = useMemo(() => {
    const parsed = parseInt(searchParams.get('page') || '1', 10);
    return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
  }, [searchParams]);

  const [page, setPage] = useState<number>(pageParam);
  const limit = 12;

  const queryClient = useQueryClient();

  const fetchBestSellers = useCallback(
    async (currentPage: number) => {
      setLoading(true);
      try {
        const data = await productsApi.getBestSelling(limit, currentPage);
        if (isProductArray(data)) {
          setProducts(data);
          setTotalPages(null);
          return;
        }

        if (isPaginatedResponse(data)) {
          setProducts(data.products);
          setTotalPages(typeof data.totalPages === 'number' ? data.totalPages : null);
          return;
        }

        setProducts([]);
        setTotalPages(null);
      } catch (error) {
        console.error('Error fetching best sellers:', error);
        setProducts([]);
        setTotalPages(null);
      } finally {
        setLoading(false);
      }
    },
    [limit],
  );

  useEffect(() => {
    fetchBestSellers(page);
  }, [fetchBestSellers, page]);

  useEffect(() => {
    setPage(pageParam);
  }, [pageParam]);

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (next.get('page') === String(page)) {
          return prev;
        }
        next.set('page', String(page));
        return next;
      },
      { replace: true },
    );
  }, [page, setSearchParams]);

  useEffect(() => {
    if (!totalPages || page >= totalPages) return;
    const nextPage = page + 1;
    queryClient.prefetchQuery({
      queryKey: ['products', 'best-selling', limit, nextPage],
      queryFn: () => productsApi.getBestSelling(limit, nextPage),
    });
  }, [limit, page, queryClient, totalPages]);

  return (
    <>
      <SEO
        title={title}
        description={description}
        canonical={canonical}
        jsonLd={{ '@context': 'https://schema.org', '@type': 'WebPage', name: title, description }}
      />
      <Header />
      <div className="min-h-screen bg-background pt-24 md:pt-28">
        <div className="border-b bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
          <div className="container py-12 text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <Sparkles className="h-8 w-8 text-yellow-500" />
              <h1 className="text-5xl font-bold">الأكثر مبيعاً</h1>
              <Sparkles className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">اكتشف أفضل العطور الفاخرة التي اختارها عملاؤنا</p>
          </div>
        </div>

        <div className="container py-12">
          {loading ? (
            <div className="py-20 text-center">جاري التحميل...</div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-xl text-muted-foreground">لا توجد منتجات حالياً</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages && totalPages > 1 && (
                <div className="mt-6">
                  <PaginationResponsive
                    current={page}
                    total={totalPages}
                    onChange={(nextPage) => setPage(nextPage)}
                    ariaLabel="Best sellers pagination"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
