import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <header className="fixed top-0 left-0 right-0 z-[100] bg-black shadow-xl border-b-2 border-gold/30">
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
              <SheetContent side="left" className="w-[280px] sm:w-[320px] bg-white border-r-2 border-gold/30 p-0 z-[200]">
                <div className="flex flex-col h-full">
                  {/* Logo at top */}
                  <div className="flex justify-center py-6 border-b-2 border-gold/30 bg-gradient-to-b from-gold/5 to-transparent">
                    <img 
                      src={cosmedLogo} 
                      alt="COSMED Logo" 
                      className="h-24 w-auto object-contain"
                    />
                  </div>

                  {/* Search Input */}
                  <div className="px-4 py-4 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="search"
                        placeholder="ابحث عن المنتجات..."
                        className="pl-10 pr-4 h-10 border-gray-300 focus:border-gold focus:ring-gold"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSearchOpen(true);
                        }}
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex flex-col gap-2 p-4 overflow-y-auto flex-1">
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
                </div>
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
