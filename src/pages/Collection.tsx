import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/hooks/useApi';
import ProductCard from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/ProductCardSkeleton';
import FilterBar from '@/components/FilterBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';
import { Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useProducts, useBrands, useCategory } from '@/lib/hooks/useApi';

export default function Collection() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // Prefer path param (/:category) but fall back to ?category= query param
  const resolvedCategory = category || searchParams.get('category') || undefined;

  const filters = {
    category: resolvedCategory,
    brand: searchParams.get('brand'),
    type: searchParams.get('type'),
    minPrice: searchParams.get('minPrice'),
    maxPrice: searchParams.get('maxPrice'),
    best_selling: searchParams.get('best_selling'),
    sort: searchParams.get('sort') || 'newest',
  };

  // Pagination state (defaults match backend default limit = 24)
  // Keep page in sync with query string for shareable URLs
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1', 10) || 1;
  const [page, setPage] = useState<number>(pageParam);
  const [limit] = useState<number>(24);

  // Use React Query hooks — include pagination params so public requests can be paginated
  const queryClient = useQueryClient();

  const { data: productsData, isLoading: productsLoading } = useProducts({ ...filters, page, limit });
  const { data: brandsData, isLoading: brandsLoading } = useBrands();
  const { data: catData } = useCategory(category!);
  
  // productsData can be either an array (public) or a paginated object (admin responses)
  // productsData can be either an array (non-paginated public responses) or an
  // object { products, total, page, totalPages } when paginated requests are used.
  const products = Array.isArray(productsData)
    ? productsData
    : (productsData && Array.isArray((productsData as any).products) ? (productsData as any).products : []);

  // Pagination metadata when available
  const total = !Array.isArray(productsData) && productsData?.total ? Number(productsData.total) : undefined;
  const totalPages = !Array.isArray(productsData) && productsData?.totalPages ? Number(productsData.totalPages) : undefined;
  const brands = Array.isArray(brandsData) ? brandsData : [];
  const categoryData = catData as any;
  const loading = productsLoading || brandsLoading;

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value === null || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    
    setSearchParams(newParams);
    // Reset to first page when filters change
    setPage(1);
    newParams.set('page', '1');
    setSearchParams(newParams, { replace: true });
  };

  // If the page was opened with a path param (/:category) ensure the query string is in sync
  // so downstream components that read from searchParams keep working.
  useEffect(() => {
    if (category && searchParams.get('category') !== category) {
      const p = new URLSearchParams(searchParams);
      p.set('category', category);
      setSearchParams(p, { replace: true });
    }
  }, [category]);

  // Keep page state in sync with URL when navigation happens externally
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: 'auto' });
    } catch (e) {
      // no-op in environments without window
    }
  }, [resolvedCategory]);

  // Sync local page -> URL
  useEffect(() => {
    const p = parseInt(searchParams.get('page') || '1', 10) || 1;
    if (p !== page) {
      const np = new URLSearchParams(searchParams);
      np.set('page', String(page));
      setSearchParams(np, { replace: true });
    }
  }, [page]);

  // If URL changes (back/forward), reflect it in page state
  useEffect(() => {
    if (pageParam !== page) setPage(pageParam);
  }, [pageParam]);

  // Prefetch next page for snappier navigation
  useEffect(() => {
    if (!totalPages) return;
    if (page < (totalPages || 1)) {
      const nextPage = page + 1;
      const key = QUERY_KEYS.products.list({ ...filters, page: nextPage, limit });
      queryClient.prefetchQuery({ queryKey: key, queryFn: () => productsApi.getAll({ ...filters, page: nextPage, limit }) });
    }
  }, [page, totalPages, filters, limit]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background pt-28 md:pt-32">
        {/* Header */}
        <div className="border-b">
          <div className="container py-8">
            <h1 className="text-4xl font-bold mb-2">
              {categoryData?.name ? `${categoryData.name}` : 'جميع العطور'}
            </h1>
            {categoryData?.description && (
              <p className="text-muted-foreground">{categoryData.description}</p>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">{/* Desktop Filter Sidebar */}
            <div className="hidden lg:block">
              <FilterBar 
                filters={filters} 
                onFilterChange={handleFilterChange}
                brands={brands}
              />
            </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden fixed bottom-4 right-4 z-50">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="lg" className="rounded-full shadow-lg">
                  <Filter className="mr-2 h-5 w-5" />
                  تصفية
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <FilterBar 
                  filters={filters} 
                  onFilterChange={handleFilterChange}
                  brands={brands}
                />
              </SheetContent>
            </Sheet>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                <ProductGridSkeleton count={9} />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">لا توجد منتجات تطابق معايير البحث</p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                    {products.length} منتج
                </div>
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {/* Numbered pagination controls (show only when pagination metadata is present) */}
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

                        {/* Compact pagination: show first, last, current +/- 2, with ellipses */}
                        {(() => {
                          const pages: (number | '...')[] = [];
                          const delta = 2;
                          const left = Math.max(1, page - delta);
                          const right = Math.min(totalPages, page + delta);

                          if (left > 1) pages.push(1);
                          if (left > 2) pages.push('...');

                          for (let p = left; p <= right; p++) pages.push(p);

                          if (right < totalPages - 1) pages.push('...');
                          if (right < totalPages) pages.push(totalPages);

                          return pages.map((pn, idx) => (
                            pn === '...' ? (
                              <PaginationItem key={`e-${idx}`}>
                                <span className="px-2 py-1 text-sm text-muted-foreground">...</span>
                              </PaginationItem>
                            ) : (
                              <PaginationItem key={pn}>
                                <PaginationLink
                                  href="#"
                                  isActive={pn === page}
                                  onClick={(e) => { e.preventDefault(); setPage(Number(pn)); }}
                                >
                                  {pn}
                                </PaginationLink>
                              </PaginationItem>
                            )
                          ));
                        })()}

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
      </div>
    </div>
      <Footer />
    </>
  );
}
