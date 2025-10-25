import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/ProductCardSkeleton';
import FilterBar from '@/components/FilterBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
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

  // Use React Query hooks
  const { data: productsData, isLoading: productsLoading } = useProducts(filters);
  const { data: brandsData, isLoading: brandsLoading } = useBrands();
  const { data: catData } = useCategory(category!);
  
  // productsData can be either an array (public) or a paginated object (admin responses)
  const products = Array.isArray(productsData)
    ? productsData
    : (productsData && Array.isArray((productsData as any).products) ? (productsData as any).products : []);
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

  // Ensure we start at the top of the collection page when navigating to a category
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: 'auto' });
    } catch (e) {
      // no-op in environments without window
    }
  }, [resolvedCategory]);

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
