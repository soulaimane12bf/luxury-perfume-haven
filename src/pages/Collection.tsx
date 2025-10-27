import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/hooks/useApi';
import { productsApi } from '@/lib/api';
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

type PaginatedResponse = {
  products?: unknown[];
  total?: number;
  totalPages?: number;
  page?: number;
};

export default function Collection() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // Prefer path param (/:category) but fall back to ?category= query param
  const resolvedCategory = category || searchParams.get('category') || undefined;

  // Derive individual search param values so we can safely memoize the
  // filters object and avoid causing effects to re-run every render.
  const brandParam = searchParams.get('brand');
  const typeParam = searchParams.get('type');
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const bestSellingParam = searchParams.get('best_selling');
  const sortParam = searchParams.get('sort') || 'newest';

  const filters = useMemo(() => ({
    category: resolvedCategory,
    brand: brandParam,
    type: typeParam,
    minPrice: minPriceParam,
    maxPrice: maxPriceParam,
    best_selling: bestSellingParam,
    sort: sortParam,
  }), [resolvedCategory, brandParam, typeParam, minPriceParam, maxPriceParam, bestSellingParam, sortParam]);

  // Pagination state (defaults match backend default limit = 24)
  // Keep page in sync with query string for shareable URLs
  const pageParam = parseInt(searchParams.get('page') || '1', 10) || 1;
  const [page, setPage] = useState<number>(pageParam);
  const [limit, setLimit] = useState<number>(parseInt(searchParams.get('limit') || '24', 10) || 24);

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
    : (productsData && Array.isArray((productsData as { products?: unknown }).products) ? (productsData as { products?: unknown }).products as unknown[] : []);

  // Pagination metadata when available - narrow unknown response safely
  let total: number | undefined = undefined;
  let totalPages: number | undefined = undefined;
  if (!Array.isArray(productsData) && typeof productsData === 'object' && productsData !== null) {
    const pd = productsData as PaginatedResponse;
    if (typeof pd.total !== 'undefined') total = Number(pd.total || 0);
    if (typeof pd.totalPages !== 'undefined') totalPages = Number(pd.totalPages || 0);
  }
  const brands = Array.isArray(brandsData) ? brandsData : [];
  const categoryData = catData as { name?: string; description?: string } | undefined;
  const loading = productsLoading || brandsLoading;

  // Ref to the products area so we can scroll the first product into view
  const productsRef = useRef<HTMLDivElement | null>(null);

  const handleFilterChange = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value === null || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    
    setSearchParams(newParams);
    // Reset to first page when filters change
    // Use the guarded setter so we don't trigger a loop between URL and state
    setPageGuarded(1);
    newParams.set('page', '1');
    setSearchParams(newParams, { replace: true });
  };

  // Guard against immediate loops where updating searchParams triggers a
  // router update which briefly reports the old/default page. We mark when
  // we're intentionally updating the page from UI actions and ignore the
  // transient URL-driven updates while the flag is set.
  const pageUpdatingRef = useRef(false);
  const setPageGuarded = (p: number | ((prev: number) => number)) => {
    pageUpdatingRef.current = true;
    if (typeof p === 'function') {
      setPage(p as (prev: number) => number);
    } else {
      setPage(p as number);
    }
    // Scroll the products container into view (so the user sees the first
    // product on the next page). Respect the fixed header by using the
    // --header-height CSS var if present.
    try {
      const container = productsRef.current ?? document.querySelector('.lg\\:col-span-3') as HTMLElement | null;
      const headerHeightStr = getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '';
      const headerHeight = headerHeightStr ? parseInt(headerHeightStr, 10) : 0;
      if (container) {
        const top = container.getBoundingClientRect().top + window.scrollY;
        const offset = Math.max(12, headerHeight || 12);
        window.scrollTo({ top: Math.max(0, top - offset), behavior: 'smooth' });
      }
    } catch (e) {
      // ignore errors when running in non-browser environments
    }

    // Clear the flag after a short delay once the router and effects settle.
    window.setTimeout(() => { pageUpdatingRef.current = false; }, 800);
  };

  // If the page was opened with a path param (/:category) ensure the query string is in sync
  // so downstream components that read from searchParams keep working.
  useEffect(() => {
    if (category && searchParams.get('category') !== category) {
      const p = new URLSearchParams(searchParams);
      p.set('category', category);
      setSearchParams(p, { replace: true });
    }
  }, [category, searchParams, setSearchParams]);

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
  }, [page, searchParams, setSearchParams]);


  // If URL changes (back/forward), reflect it in page state
  useEffect(() => {
    if (pageUpdatingRef.current) return;
    if (pageParam !== page) setPage(pageParam);
  }, [pageParam, page]);

  // Prefetch next page for snappier navigation
  useEffect(() => {
    if (!totalPages) return;
    if (page < (totalPages || 1)) {
      const nextPage = page + 1;
      const key = QUERY_KEYS.products.list({ ...filters, page: nextPage, limit });
      queryClient.prefetchQuery({ queryKey: key, queryFn: () => productsApi.getAll({ ...filters, page: nextPage, limit }) });
    }
  }, [page, totalPages, filters, limit, queryClient]);

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
              {/* Open the mobile sheet from the right to match the bottom-right trigger */}
              <SheetContent side="right" className="w-80 overflow-y-auto">
                <FilterBar 
                  filters={filters} 
                  onFilterChange={handleFilterChange}
                  brands={brands}
                />
              </SheetContent>
            </Sheet>
          </div>

          {/* Products Grid */}
          <div ref={productsRef} className="lg:col-span-3">
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
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-muted-foreground">عرض لكل صفحة:</label>
                        <select
                          value={String(limit)}
                          onChange={(e) => {
                            const v = parseInt(e.target.value, 10) || 24;
                            setLimit(v);
                            // reset to first page when page size changes
                            setPageGuarded(1);
                            const np = new URLSearchParams(searchParams);
                            np.set('limit', String(v));
                            np.set('page', '1');
                            setSearchParams(np, { replace: true });
                          }}
                          className="h-8 text-sm px-2 border rounded bg-background"
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="24">24</option>
                          <option value="48">48</option>
                        </select>
                      </div>
                      <div className="text-sm text-muted-foreground">صفحة {page} من {totalPages}</div>
                    </div>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setPageGuarded((p) => Math.max(1, (p as number) - 1));
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
                                  onClick={(e) => { e.preventDefault(); setPageGuarded(Number(pn)); }}
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
                              setPageGuarded((p) => Math.min(totalPages as number, (p as number) + 1));
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
