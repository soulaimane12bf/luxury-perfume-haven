import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { HeroSlider } from "@/components/HeroSlider";
import { BestSellers } from "@/components/BestSellers";
import { CategorySection } from "@/components/CategorySection";
import { categoriesApi } from "@/lib/api";

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

const Index = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAll();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast.error('فشل تحميل الفئات');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
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

      {/* Hero Slider Section */}
      <HeroSlider />

      {/* Best Sellers Section */}
      <BestSellers />

      {/* Dynamic Category Sections */}
      {!loading && categories.length > 0 && categories.map((category, index) => (
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
          />
        </div>
      ))}

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

      <Footer />
    </div>
  );
};

export default Index;
