import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/ProductCardSkeleton";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useProducts } from "@/lib/hooks/useApi";

import heroImage from "@/assets/hero-perfume.jpg";

const Index = () => {
  const navigate = useNavigate();
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

      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url(${heroImage})`,
          }}
        >
          <div className="container mx-auto px-4 h-full flex items-center justify-center">
            <div className="text-center text-primary-foreground space-y-8 animate-fade-in">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-2xl">
                عطور فاخرة أصلية
              </h1>
              <p className="text-xl md:text-3xl text-white font-medium drop-shadow-lg">
                ✨ اكتشف مجموعتنا الحصرية من أفخم العطور العالمية ✨
              </p>
              <Button 
                size="lg" 
                className="text-lg px-10 py-7 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110"
                onClick={() => navigate('/collection')}
              >
                🛍️ تسوق الآن
              </Button>
            </div>
          </div>
        </div>
      </section>

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
