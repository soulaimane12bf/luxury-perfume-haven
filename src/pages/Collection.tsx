import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { productsApi, categoriesApi } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import FilterBar from '@/components/FilterBar';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Collection() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categoryData, setCategoryData] = useState(null);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const filters = {
    category: category || searchParams.get('category'),
    brand: searchParams.get('brand'),
    type: searchParams.get('type'),
    minPrice: searchParams.get('minPrice'),
    maxPrice: searchParams.get('maxPrice'),
    best_selling: searchParams.get('best_selling'),
    sort: searchParams.get('sort') || 'newest',
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, brandsData] = await Promise.all([
          productsApi.getAll(filters),
          productsApi.getBrands(),
        ]);
        
        setProducts(productsData);
        setBrands(brandsData);

        if (category) {
          const catData = await categoriesApi.getBySlug(category);
          setCategoryData(catData);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, searchParams]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value === null || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container py-8">
          <h1 className="text-4xl font-bold mb-2">
            {categoryData?.name || 'جميع العطور'}
          </h1>
          {categoryData?.description && (
            <p className="text-muted-foreground">{categoryData.description}</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
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
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-20">جاري التحميل...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">لا توجد منتجات تطابق معايير البحث</p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  {products.length} منتج
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
  );
}
