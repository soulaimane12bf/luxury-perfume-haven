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
        const data = await productsApi.getAll({ category: 'men' });
        setProducts(data.slice(0, 6)); // Get first 6 products
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
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${heroImage})`,
          }}
        >
          <div className="container mx-auto px-4 h-full flex items-center justify-center">
            <div className="text-center text-primary-foreground space-y-6 animate-fade-in">
              <h1 className="text-5xl md:text-7xl font-bold gradient-gold bg-clip-text text-transparent">
                عطور فاخرة أصلية
              </h1>
              <p className="text-xl md:text-2xl text-white/90">
                اكتشف مجموعتنا الحصرية من أفخم العطور العالمية
              </p>
              <Button 
                variant="gold" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => navigate('/collection')}
              >
                تسوق الآن
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-4xl font-bold">عطور الرجال</h2>
          <p className="text-xl text-muted-foreground">العطور الأصلية الأكثر شهرة</p>
        </div>

        {loading ? (
          <div className="text-center py-20">جاري التحميل...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
