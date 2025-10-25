import ProductCard from "./ProductCard";
import { ProductGridSkeleton } from "./ProductCardSkeleton";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface CategorySectionProps {
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  categoryDescription?: string;
  gradientFrom: string;
  gradientTo: string;
  products?: any[];
  isLoading?: boolean;
}

export function CategorySection({ 
  categoryId, 
  categorySlug, 
  categoryName, 
  categoryDescription,
  gradientFrom,
  gradientTo,
  products = [],
  isLoading = false
}: CategorySectionProps) {
  // Get first 4 products from category
  const categoryProducts = Array.isArray(products) ? products.slice(0, 4) : [];

  if (!isLoading && categoryProducts.length === 0) {
    return null; // Don't show section if no products
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-5 dark:opacity-10 rounded-full blur-3xl`} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12 animate-fade-in">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground dark:text-foreground">
              {categoryName}
            </h2>
            {categoryDescription && (
              <p className="text-base md:text-lg text-foreground/70 dark:text-foreground/60">
                {categoryDescription}
              </p>
            )}
          </div>
          
          <Link
            to={`/collection/${categorySlug}`}
            className="hidden md:inline-flex items-center gap-2 px-6 py-3 border-2 border-amber-600 text-amber-600 dark:text-amber-500 font-semibold rounded-full hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 dark:hover:text-white transition-all duration-300 hover:scale-105 group"
          >
            <span>عرض الكل</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            <ProductGridSkeleton count={4} />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="md:hidden text-center mt-8">
          <Link
            to={`/collection/${categorySlug}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            <span>عرض الكل</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
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

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
      `}</style>
    </section>
  );
}
