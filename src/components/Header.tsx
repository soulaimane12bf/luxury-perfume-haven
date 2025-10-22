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
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm shadow-lg border-b border-border/50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-black via-gray-900 to-black py-2.5">
        <p className="text-center text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600">
          التوصيل السريع لجميع المدن
        </p>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Left: Cart */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-gold/10 transition-all duration-300"
            onClick={openCart}
          >
            <ShoppingCart className="h-6 w-6" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center font-bold animate-bounce">
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
                className="h-12 md:h-14 w-auto object-contain transition-all duration-300 group-hover:scale-110"
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                }}
              />
              {/* Gradient overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-yellow-500/20 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg blur-sm" />
            </div>
            <p className="text-xs text-muted-foreground font-medium tracking-wider mt-1">
              منتجات عالية الجودة
            </p>
          </Link>

          {/* Right: Search & Menu */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} className="hover:bg-gold/10 transition-all duration-300">
              <Search className="h-5 w-5" />
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-gold/10 transition-all duration-300">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] bg-background/95 backdrop-blur-xl border-r-2 border-gold/20">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link
                    to="/"
                    className="text-lg font-medium hover:text-gold transition-all duration-300 py-3 px-4 rounded-lg hover:bg-gold/10 border-b border-border"
                  >
                    🏠 الصفحة الرئيسية
                  </Link>
                  <Link
                    to="/best-sellers"
                    className="text-lg font-medium hover:text-gold transition-all duration-300 py-3 px-4 rounded-lg hover:bg-gold/10 border-b border-border"
                  >
                    🔥 الأكثر مبيعاً
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/collection/${category.slug}`}
                      className="text-lg font-medium hover:text-gold transition-all duration-300 py-3 px-4 rounded-lg hover:bg-gold/10 border-b border-border"
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
