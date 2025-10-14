import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { productsApi } from "@/lib/api";
import { useNavigate } from "react-router-dom";

import heroImage from "@/assets/hero-perfume.jpg";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const Index = () => {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
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

  const handleAddToCart = (product: any) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        toast.success("تم تحديث الكمية");
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      toast.success("تمت الإضافة إلى السلة");
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        image: product.image_urls[0],
        quantity: 1 
      }];
    });
  };

  const handleUpdateQuantity = (id: string, change: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + change;
            if (newQuantity <= 0) return null;
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("تم الحذف من السلة");
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={cartItemCount}
        cartTotal={cartTotal}
        onCartClick={() => setIsCartOpen(true)}
      />

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
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};

export default Index;
