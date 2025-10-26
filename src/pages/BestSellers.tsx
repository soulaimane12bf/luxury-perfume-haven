import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/hooks/useApi';
import { productsApi } from '@/lib/api';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Sparkles } from 'lucide-react';

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1', 10) || 1;
  const [page, setPage] = useState<number>(pageParam);
  const [limit] = useState<number>(12);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const data = await productsApi.getBestSelling(limit, page);
        // Response will be either paginated { products, total, page, totalPages }
        if (Array.isArray(data)) {
          setProducts(data);
          setTotalPages(null);
        } else if (data && Array.isArray(data.products)) {
          setProducts(data.products);
          setTotalPages(Number(data.totalPages || 1));
        } else {
          setProducts([]);
          setTotalPages(null);
        }
      } catch (error) {
        console.error('Error fetching best sellers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, [page]);

  // Sync page <-> URL
  useEffect(() => {
    const p = parseInt(searchParams.get('page') || '1', 10) || 1;
    if (p !== page) {
      setPage(p);
    }
  }, [searchParams]);

  useEffect(() => {
    const np = new URLSearchParams(searchParams);
    np.set('page', String(page));
    setSearchParams(np, { replace: true });
  }, [page]);

  // Prefetch next page
  useEffect(() => {
    if (totalPages && page < totalPages) {
      const next = page + 1;
      const key = QUERY_KEYS.products.bestSelling(`${limit}:${next}` as any);
      queryClient.prefetchQuery({ queryKey: key, queryFn: () => productsApi.getBestSelling(limit, next) });
    }
  }, [page, totalPages]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background pt-24 md:pt-28">
        {/* Header */}
        <div className="border-b bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
          <div className="container py-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 text-yellow-500" />
              <h1 className="text-5xl font-bold">الأكثر مبيعاً</h1>
              <Sparkles className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              اكتشف أفضل العطور الفاخرة التي اختارها عملاؤنا
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container py-12">
          {loading ? (
            <div className="text-center py-20">جاري التحميل...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">لا توجد منتجات حالياً</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Numbered pagination for best sellers when available */}
              {totalPages && totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setPage((p) => Math.max(1, p - 1));
                          }}
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pn) => (
                        <PaginationItem key={pn}>
                          <PaginationLink
                            href="#"
                            isActive={pn === page}
                            onClick={(e) => {
                              e.preventDefault();
                              setPage(pn);
                            }}
                          >
                            {pn}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setPage((p) => Math.min(totalPages, p + 1));
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
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
