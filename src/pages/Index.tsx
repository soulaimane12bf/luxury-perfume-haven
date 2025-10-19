import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { productsApi } from "@/lib/api";
import { useNavigate } from "react-router-dom";

import heroImage from "@/assets/hero-perfume.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsApi.getAll({ category: 'men'}) as any;
        setProducts(Array.isArray(data) ? data.slice(0, 6) : []); // Get first 6 products
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('فشل تحميل المنتجات');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

        {loading ? (
          <div className="text-center py-20">جاري التحميل...</div>
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
