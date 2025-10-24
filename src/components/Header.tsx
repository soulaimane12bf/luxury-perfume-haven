import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { categoriesApi, productsApi } from "@/lib/api";
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
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState("");
  const [sidebarSearchResults, setSidebarSearchResults] = useState<any[]>([]);
  const [isSidebarSearching, setIsSidebarSearching] = useState(false);
  const { getTotalItems, openCart } = useCart();
  const navigate = useNavigate();

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

  // Debounce sidebar search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (sidebarSearchQuery.trim().length >= 2) {
        performSidebarSearch(sidebarSearchQuery);
      } else {
        setSidebarSearchResults([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [sidebarSearchQuery]);

  const performSidebarSearch = async (query: string) => {
    setIsSidebarSearching(true);
    try {
      const products = await productsApi.search(query, 8); // Limit to 8 results for sidebar
      setSidebarSearchResults(Array.isArray(products) ? products : []);
    } catch (error) {
      console.error('Sidebar search error:', error);
      setSidebarSearchResults([]);
    } finally {
      setIsSidebarSearching(false);
    }
  };

  const handleSidebarProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    setSidebarSearchQuery('');
    setSidebarSearchResults([]);
  };

  const clearSidebarSearch = () => {
    setSidebarSearchQuery('');
    setSidebarSearchResults([]);
  };

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
                  <div className="flex justify-center py-4 border-b-2 border-gold/30 bg-gradient-to-b from-gold/5 to-transparent">
                    <img 
                      src={cosmedLogo} 
                      alt="COSMED Logo" 
                      className="h-16 w-auto object-contain"
                    />
                  </div>

                  {/* Search Input - With Results */}
                  <div className="px-4 py-4 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="search"
                        placeholder="ابحث عن المنتجات..."
                        value={sidebarSearchQuery}
                        onChange={(e) => setSidebarSearchQuery(e.target.value)}
                        className="pl-10 pr-10 h-10 border-gray-300 focus:border-gold focus:ring-gold"
                        autoComplete="off"
                        data-autofocus="false"
                      />
                      {sidebarSearchQuery && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-2 top-1/2 -translate-y-1/2 h-6 w-6"
                          onClick={clearSidebarSearch}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

                    {/* Search Results */}
                    {(sidebarSearchResults.length > 0 || isSidebarSearching) && (
                      <div className="mt-3 max-h-64 overflow-y-auto border-t border-gray-200 pt-3">
                        {isSidebarSearching ? (
                          <div className="text-center py-4 text-gray-500">
                            <Loader2 className="h-5 w-5 animate-spin mx-auto mb-1" />
                            <p className="text-sm">جاري البحث...</p>
                          </div>
                        ) : sidebarSearchResults.length > 0 ? (
                          <div className="space-y-2">
                            {sidebarSearchResults.map((product) => (
                              <button
                                key={product.id}
                                onClick={() => handleSidebarProductClick(product.id)}
                                className="w-full text-left p-3 rounded-lg hover:bg-gold/10 transition-colors border border-gray-100 hover:border-gold/30"
                              >
                                <div className="flex items-center gap-3">
                                  <img
                                    src={product.image_urls?.[0] || product.image_url || '/placeholder-product.png'}
                                    alt={product.name}
                                    className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                                    onError={(e) => {
                                      e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20fill%3D%22%23f3f4f6%22%20width%3D%22100%22%20height%3D%22100%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20fill%3D%22%239ca3af%22%20font-size%3D%2212%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E';
                                    }}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {product.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      {product.brand || 'علامة تجارية غير محددة'}
                                    </p>
                                    <p className="text-sm font-semibold text-gold">
                                      {product.price ? `${product.price} ريال` : 'السعر غير محدد'}
                                    </p>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : sidebarSearchQuery.length >= 2 ? (
                          <div className="text-center py-4 text-gray-500">
                            <p className="text-sm">لا توجد نتائج للبحث</p>
                          </div>
                        ) : null}
                      </div>
                    )}
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
