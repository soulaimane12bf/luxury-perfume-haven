import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import HeroSlider from "@/components/HeroSlider";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories and all products in parallel
        const [categoriesData, productsData] = await Promise.all([
          categoriesApi.getAll(),
          productsApi.getAll()
        ]);
        
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('فشل تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      </div> {/* Close main content wrapper */}

      <Footer />
    </div>
  );
};

export default Index;
