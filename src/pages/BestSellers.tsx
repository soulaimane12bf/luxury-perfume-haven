import { useState, useEffect } from 'react';
import { productsApi } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Sparkles } from 'lucide-react';

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const data = await productsApi.getBestSelling(12);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching best sellers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
          <div className="container py-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 text-yellow-500" />
              <h1 className="text-5xl font-bold">الأكثر مبيعاً</h1>
              <Sparkles className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              اكتشف أفضل العطور الفاخرة التي اختارها عملاؤنا
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container py-12">
          {loading ? (
            <div className="text-center py-20">جاري التحميل...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">لا توجد منتجات حالياً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
