import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTopButton from '@/components/ScrollToTopButton';
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
  // productsByCategory stores up to 4 products per category (slug => products[])
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState(false);

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

  // Fetch up to 4 products per category so each category section shows 4 items
  useEffect(() => {
    const fetchPerCategory = async () => {
      setLoading(true);
      try {
        if (!categories || categories.length === 0) return;

        const results: Record<string, Product[]> = {};
        await Promise.all(categories.map(async (cat) => {
          try {
            const data = await productsApi.getAll({ category: cat.slug, limit: 4 });
            // productsApi returns an array for public requests
            const prods = Array.isArray(data) ? data : ((data as any).products || []);
            results[cat.slug] = prods;
          } catch (err) {
            console.error(`Failed to fetch products for category ${cat.slug}:`, err);
            results[cat.slug] = [];
          }
        }));

        setProductsByCategory(results);
      } finally {
        setLoading(false);
      }
    };

    // Run after categories are loaded
    if (categories.length > 0) {
      fetchPerCategory();
    }
  }, [categories]);

  // Aggregate all fetched category products for components that expect a flat list
  const aggregatedProducts = useMemo(() => {
    return Object.values(productsByCategory).flat();
  }, [productsByCategory]);

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

  {/* Best Sellers Section - pass aggregated products (we fetch per-category) */}
  <BestSellers products={aggregatedProducts} isLoading={loading} />

      {/* Dynamic Category Sections - fetch and pass up to 4 products per category */}
      {!loading && categories.length > 0 && categories.map((category, index) => {
        const categoryProducts = productsByCategory[category.slug] || [];

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
              isLoading={loading}
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

        {/* (Removed global "load more" pagination: each category shows up to 4 products with its own "عرض الكل" link) */}
      </div> {/* Close main content wrapper */}

      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Index;
