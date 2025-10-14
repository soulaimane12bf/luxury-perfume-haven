import { useState } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import heroImage from "@/assets/hero-perfume.jpg";
import perfume1 from "@/assets/perfume-1.jpg";
import perfume2 from "@/assets/perfume-2.jpg";
import perfume3 from "@/assets/perfume-3.jpg";
import perfume4 from "@/assets/perfume-4.jpg";
import perfume5 from "@/assets/perfume-5.jpg";
import perfume6 from "@/assets/perfume-6.jpg";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const Index = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const products = [
    { id: 1, name: "CREED Aventus 75ML", price: 3500, image: perfume1 },
    { id: 2, name: "CHANEL Coco Mademoiselle", price: 2800, image: perfume2 },
    { id: 3, name: "Dior Sauvage Elixir", price: 3200, image: perfume3 },
    { id: 4, name: "Tom Ford Black Orchid", price: 4200, image: perfume4 },
    { id: 5, name: "Versace Eros Flame", price: 1680, image: perfume5 },
    { id: 6, name: "Lancôme La Vie Est Belle", price: 2400, image: perfume6 },
  ];

  const handleAddToCart = (product: { id: number; name: string; price: number; image: string }) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        toast.success("تم تحديث الكمية");
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      toast.success("تمت الإضافة إلى السلة");
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: number, change: number) => {
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

  const handleRemoveItem = (id: number) => {
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
              <Button variant="gold" size="lg" className="text-lg px-8 py-6">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
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
