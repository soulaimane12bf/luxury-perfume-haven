import { useProducts } from "@/lib/hooks/useApi";
import ProductCard from "./ProductCard";
import { ProductGridSkeleton } from "./ProductCardSkeleton";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function BestSellers() {
  const { data: allProducts, isLoading } = useProducts();

  // Filter best-selling products
  const bestSellers = Array.isArray(allProducts) 
    ? allProducts.filter(product => product.best_selling).slice(0, 4)
    : [];

  if (!isLoading && bestSellers.length === 0) {
    return null; // Don't show section if no best sellers
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-amber-50/30 dark:via-amber-950/20 to-background py-20">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-amber-600/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4 animate-fade-in">
          <div className="inline-block">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent animate-gradient">
                الأكثر مبيعاً
              </span>
            </h2>
            <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mt-4 rounded-full" />
          </div>
          <p className="text-lg md:text-xl text-foreground/70 dark:text-foreground/60 max-w-2xl mx-auto">
            اكتشف المنتجات المفضلة لدى عملائنا
          </p>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            <ProductGridSkeleton count={4} />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {bestSellers.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up opacity-0"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* View All Link */}
        {bestSellers.length > 0 && (
          <div className="text-center mt-12 animate-fade-in-up opacity-0" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
            <Link
              to="/collection"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              <span>عرض جميع المنتجات</span>
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
}
