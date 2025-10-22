import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/ProductCardSkeleton";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { useProducts } from "@/lib/hooks/useApi";
import { HeroSlider } from "@/components/HeroSlider";

const Index = () => {
  const { data: allProducts, isLoading, error } = useProducts({ category: 'men' });
  
  // Get first 6 products for homepage
  const products = Array.isArray(allProducts) ? allProducts.slice(0, 6) : [];

  // Show error toast if fetch fails
  if (error) {
    toast.error('فشل تحميل المنتجات');
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Slider Section */}
      <HeroSlider />

      {/* Products Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
            عطور الرجال
          </h2>
          <p className="text-xl text-muted-foreground font-medium">العطور الأصلية الأكثر شهرة</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            <ProductGridSkeleton count={6} />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Index;
