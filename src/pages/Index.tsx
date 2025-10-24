import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { HeroSlider } from "@/components/HeroSlider";
import { BestSellers } from "@/components/BestSellers";
import { CategorySection } from "@/components/CategorySection";
import { categoriesApi, productsApi } from "@/lib/api";

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

type Product = {
  id: string;
  name: string;
  category: string;
  best_selling?: boolean;
  [key: string]: any;
};

const Index = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch only categories first (fastest)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoriesApi.getAll();
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products (paginated) after a small delay to prioritize initial render
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsApi.getAll({ page, limit: 24 });
        if (data && Array.isArray(data.products)) {
          // On first page replace, on subsequent pages append
          setProducts((prev) => (page === 1 ? data.products : [...prev, ...data.products]));
          setTotalPages(data.totalPages || 1);
        } else if (Array.isArray(data)) {
          // Fallback for older API shape
          setProducts(page === 1 ? data : [...products, ...data]);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error('فشل تحميل المنتجات');
      } finally {
        setLoading(false);
      }
    };
    
    const timer = setTimeout(fetchProducts, 100);
    return () => clearTimeout(timer);
  }, [page]);

  const loadMore = () => {
    if (isLoadingMore) return;
    if (page >= totalPages) return;
    setIsLoadingMore(true);
    setPage((p) => p + 1);
    setTimeout(() => setIsLoadingMore(false), 500);
  };

  // Gradient color combinations for each category
  const gradients = [
    { from: 'from-blue-500', to: 'to-indigo-600' },
    { from: 'from-pink-500', to: 'to-rose-600' },
    { from: 'from-purple-500', to: 'to-violet-600' },
    { from: 'from-green-500', to: 'to-emerald-600' },
    { from: 'from-orange-500', to: 'to-red-600' },
    { from: 'from-cyan-500', to: 'to-blue-600' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main content with padding for fixed header */}
      <div className="pt-24 md:pt-32">
        {/* Hero Slider Section */}
        <HeroSlider />

      {/* Best Sellers Section - Pass products as prop */}
      <BestSellers products={products} isLoading={loading} />

      {/* Dynamic Category Sections - Pass filtered products */}
      {!loading && categories.length > 0 && categories.map((category, index) => {
        const categoryProducts = products.filter(p => p.category === category.slug);
        
        return (
          <div key={category.id}>
            {/* Separator Line */}
            <div className="container mx-auto px-4">
              <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
            </div>

            {/* Category Section */}
            <CategorySection
              categoryId={category.id}
              categorySlug={category.slug}
              categoryName={category.name}
              categoryDescription={category.description}
              gradientFrom={gradients[index % gradients.length].from}
              gradientTo={gradients[index % gradients.length].to}
              products={categoryProducts}
              isLoading={false}
            />
          </div>
        );
      })}

      {/* Loading State */}
      {loading && (
        <div className="container mx-auto px-4 py-20">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && categories.length === 0 && (
        <div className="container mx-auto px-4 py-20">
          <div className="text-center text-foreground/70 dark:text-foreground/60">
            <p className="text-lg">لا توجد فئات متاحة حالياً</p>
          </div>
        </div>
      )}

        {/* Load more button for pagination */}
        {!loading && page < totalPages && (
          <div className="container mx-auto px-4 py-8 text-center">
            <button
              onClick={loadMore}
              className="px-6 py-2 bg-amber-600 text-white rounded-md"
              disabled={isLoadingMore}
            >
              {isLoadingMore ? 'جاري التحميل...' : 'تحميل المزيد'}
            </button>
          </div>
        )}
      </div> {/* Close main content wrapper */}

      <Footer />
    </div>
  );
};

export default Index;
