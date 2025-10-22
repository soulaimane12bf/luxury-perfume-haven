import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Search, Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { categoriesApi } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { useTheme } from "@/contexts/ThemeContext";
import SearchDialog from "@/components/SearchDialog";

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
  const { isDark, toggleTheme } = useTheme();

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
        <p className="text-center text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 animate-pulse">
          🚚 التوصيل لجميع المدن ابتداء من 25 درهم فقط
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
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-lg">
              و
            </h1>
            <p className="text-xs text-muted-foreground font-medium tracking-wider">عطور فاخرة</p>
          </div>

          {/* Right: Dark Mode, Search & Menu */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="hover:bg-gold/10 transition-all duration-300">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
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
