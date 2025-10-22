import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/ProductCardSkeleton";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { useProducts } from "@/lib/hooks/useApi";
import { HeroSlider } from "@/components/HeroSlider";
import { useState, useEffect } from "react";
import { slidersApi } from "@/lib/api";

const Index = () => {
  const { data: allProducts, isLoading, error } = useProducts({ category: 'men' });
  const [sliders, setSliders] = useState<any[]>([]);
  const [slidersLoading, setSlidersLoading] = useState(true);
  
  // Get first 6 products for homepage
  const products = Array.isArray(allProducts) ? allProducts.slice(0, 6) : [];

  // Fetch sliders for testing
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const response = await slidersApi.getAll();
        console.log('🎯 Fetched sliders:', response);
        setSliders(Array.isArray(response) ? response : []);
      } catch (err) {
        console.error('❌ Error fetching sliders:', err);
      } finally {
        setSlidersLoading(false);
      }
    };
    fetchSliders();
  }, []);

  // Show error toast if fetch fails
  if (error) {
    toast.error('فشل تحميل المنتجات');
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Slider Section */}
      <HeroSlider />

      {/* TEST SECTION: Slider Images as Cards */}
      <section className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            🧪 Test: Slider Images
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Testing image URLs from the slider API
          </p>
        </div>

        {slidersLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
          </div>
        ) : sliders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No sliders found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sliders.map((slider, index) => (
              <div 
                key={slider.id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border-2 border-yellow-500"
              >
                <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
                  <img
                    src={slider.image_url}
                    alt={slider.title || `Slider ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error(`❌ Failed to load image for slider ${slider.id}:`, slider.image_url);
                      e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%3E%3Crect%20fill%3D%22%23ddd%22%20width%3D%22400%22%20height%3D%22300%22%2F%3E%3Ctext%20fill%3D%22%23999%22%20font-family%3D%22sans-serif%22%20font-size%3D%2220%22%20dy%3D%2210.5%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3EERROR%3C%2Ftext%3E%3C%2Fsvg%3E';
                    }}
                    onLoad={() => {
                      console.log(`✅ Successfully loaded image for slider ${slider.id}:`, slider.image_url);
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-yellow-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Order: {slider.order ?? index}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100">
                    {slider.title || 'No Title'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {slider.subtitle || 'No subtitle'}
                  </p>
                  <div className="space-y-2">
                    <div className="text-xs font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded break-all">
                      <span className="font-bold text-gray-700 dark:text-gray-300">ID:</span>{' '}
                      <span className="text-gray-600 dark:text-gray-400">{slider.id}</span>
                    </div>
                    <div className="text-xs font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded break-all">
                      <span className="font-bold text-gray-700 dark:text-gray-300">URL:</span>{' '}
                      <span className="text-blue-600 dark:text-blue-400">{slider.image_url}</span>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <a 
                        href={slider.image_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                      >
                        Open URL
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(slider.image_url);
                          toast.success('URL copied!');
                        }}
                        className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
                      >
                        Copy URL
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
