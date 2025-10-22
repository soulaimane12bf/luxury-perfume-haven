import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { categoriesApi } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import SearchDialog from "@/components/SearchDialog";
import cosmedLogo from "@/assets/images/cosmed-logo.png";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

const Header = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const { getTotalItems, openCart } = useCart();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAll();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-black shadow-xl border-b-2 border-gold/30">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 py-2 border-b border-gold/20">
        <p className="text-center text-xs md:text-sm font-semibold text-gold">
          التوصيل السريع لجميع المدن
        </p>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Left: Cart */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-gold/20 text-white transition-all duration-300"
            onClick={openCart}
          >
            <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 md:h-5 md:w-5 rounded-full bg-gold text-xs text-black flex items-center justify-center font-bold">
                {getTotalItems()}
              </span>
            )}
          </Button>

          {/* Center: Logo */}
          <Link to="/" className="flex flex-col items-center group">
            <div className="relative">
              <img 
                src={cosmedLogo} 
                alt="COSMED" 
                className="h-8 md:h-12 w-auto object-contain transition-all duration-300 group-hover:scale-105"
                style={{
                  filter: 'drop-shadow(0 2px 8px rgba(234, 179, 8, 0.3))'
                }}
              />
              {/* Gradient overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/20 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg blur-sm" />
            </div>
            <p className="text-xs text-gold/80 font-medium tracking-wider mt-1 hidden md:block">
              منتجات عالية الجودة
            </p>
          </Link>

          {/* Right: Search & Menu */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} className="hover:bg-gold/20 text-white transition-all duration-300">
              <Search className="h-5 w-5 md:h-5 md:w-5" />
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-gold/20 text-white transition-all duration-300">
                  <Menu className="h-5 w-5 md:h-6 md:w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px] bg-white border-r-2 border-gold/30">
                <nav className="flex flex-col gap-2 mt-6">
                  <Link
                    to="/"
                    className="text-base font-medium text-black hover:text-gold transition-all duration-300 py-2 px-4 rounded-lg hover:bg-gold/10 border-b border-gray-200"
                  >
                    الصفحة الرئيسية
                  </Link>
                  <Link
                    to="/best-sellers"
                    className="text-base font-medium text-black hover:text-gold transition-all duration-300 py-2 px-4 rounded-lg hover:bg-gold/10 border-b border-gray-200"
                  >
                    الأكثر مبيعاً
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/collection/${category.slug}`}
                      className="text-base font-medium text-black hover:text-gold transition-all duration-300 py-2 px-4 rounded-lg hover:bg-gold/10 border-b border-gray-200"
                    >
                      {category.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
};

export default Header;
