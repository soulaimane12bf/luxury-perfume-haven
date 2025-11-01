import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu, Loader2, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { categoriesApi, productsApi } from "@/lib/api";
import { productMatchesQuery } from '@/lib/searchUtils';
import { useCart } from "@/contexts/CartContext";
import SearchDialog from "@/components/SearchDialog";
import cosmedLogo from "@/assets/images/cosmed-logo.png";
import sidebarLogo from "@/assets/images/sidebar-logo.png";

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
  interface ProductPreview {
    id: string;
    name?: string;
    brand?: string;
    image_urls?: string[];
    image_url?: string;
    price?: number;
  }
  const [sidebarSearchResults, setSidebarSearchResults] = useState<ProductPreview[]>([]);
  const [isSidebarSearching, setIsSidebarSearching] = useState(false);
  const { getTotalItems, openCart } = useCart();
  const navigate = useNavigate();
  const headerRef = (null as unknown) as React.RefObject<HTMLElement>;

  // expose header height as a CSS variable so pages / toasts can offset themselves
  useEffect(() => {
    const setHeaderHeight = () => {
      const el = document.querySelector('header');
      if (el instanceof HTMLElement) {
        const height = el.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${height}px`);
      }
    };

    // set initially and on resize (header may wrap/change height responsively)
    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);
    return () => window.removeEventListener('resize', setHeaderHeight);
  }, []);

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

  const performSidebarSearch = useCallback(async (query: string) => {
    setIsSidebarSearching(true);
    try {
      // Fetch a larger set and then apply client-side fuzzy matching for smarter results
      const raw = await productsApi.search(query, 20);
      const arr: unknown[] = Array.isArray(raw) ? raw : [];
      const filtered = arr.filter((p) => productMatchesQuery(p as ProductPreview, query)).slice(0, 8) as ProductPreview[];
      setSidebarSearchResults(filtered);
    } catch (error) {
      console.error('Sidebar search error:', error);
      setSidebarSearchResults([]);
    } finally {
      setIsSidebarSearching(false);
    }
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
  }, [sidebarSearchQuery, performSidebarSearch]);

  

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
  <div className="flex items-center justify-between py-3 flex-nowrap">
          {/* Left: Menu (swapped) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-gold/20 text-white transition-all duration-300">
                <Menu className="h-5 w-5 md:h-6 md:w-6" />
              </Button>
            </SheetTrigger>
            {/* Open client menu from the RIGHT so it doesn't conflict with admin sidebar */}
            <SheetContent side="right" className="w-[280px] sm:w-[320px] bg-white border-l-2 border-gold/30 p-0 z-[200]">
                <div className="flex flex-col h-full">
                {/* Logo/header at top (prefer sidebar-logo.png if present) */}
                <div className="flex justify-center py-4 border-b border-gold/30 bg-gradient-to-b from-gold/5 to-transparent">
                  <img
                    src={sidebarLogo || cosmedLogo}
                    alt="COSMED Logo"
                    className="h-16 w-auto object-contain"
                  />
                </div>

                {/* Search Input - With Results */}
                <div className="px-4 py-4 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-500" />
                    <Input
                      type="text"
                      placeholder="ابحث عن المنتجات..."
                      value={sidebarSearchQuery}
                      onChange={(e) => setSidebarSearchQuery(e.target.value)}
                      className="pr-10 pl-10 h-12 border-2 border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 text-right placeholder:text-gray-400 font-medium"
                      autoComplete="off"
                    />
                    {sidebarSearchQuery && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-red-50 rounded-full transition-colors group"
                        onClick={clearSidebarSearch}
                      >
                        <X className="h-4 w-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                      </Button>
                    )}
                  </div>

                  {/* Search Results */}
                  {(sidebarSearchResults.length > 0 || isSidebarSearching) && (
                    <div className="mt-4 max-h-64 overflow-y-auto rounded-xl border-2 border-amber-100 bg-white">
                      {isSidebarSearching ? (
                        <div className="text-center py-6 text-gray-500">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-amber-500" />
                          <p className="text-sm font-medium">جاري البحث...</p>
                        </div>
                      ) : sidebarSearchResults.length > 0 ? (
                        <div className="divide-y divide-amber-100">
                          {sidebarSearchResults.map((product: ProductPreview) => (
                            <button
                              key={product.id}
                              onClick={() => handleSidebarProductClick(product.id)}
                              className="w-full text-right p-3 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={product.image_urls?.[0] || product.image_url || '/placeholder-product.png'}
                                  alt={product.name}
                                  loading="lazy"
                                  className="w-14 h-14 object-cover rounded-lg flex-shrink-0 border-2 border-amber-100 group-hover:border-amber-300 transition-colors"
                                  onError={(e) => {
                                    e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20fill%3D%22%23f3f4f6%22%20width%3D%22100%22%20height%3D%22100%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20fill%3D%22%239ca3af%22%20font-size%3D%2212%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E';
                                  }}
                                />
                                <div className="flex-1 min-w-0 text-right">
                                  <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-amber-700 transition-colors">
                                    {product.name}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate mt-0.5">
                                    {product.brand || 'علامة تجارية غير محددة'}
                                  </p>
                                  <p className="text-sm font-bold text-amber-600 mt-1">
                                    {product.price ? `${product.price} د.م` : 'السعر غير محدد'}
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
                <nav className="flex flex-col gap-2 p-4 overflow-y-auto flex-1 text-gray-900">
                  <Link to="/" className="relative block py-3 px-4 rounded-lg hover:bg-amber-600/10 transition-colors">
                    <ArrowLeft className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <span className="ml-8 font-medium">الصفحة الرئيسية</span>
                  </Link>

                  <Link to="/best-sellers" className="relative block py-3 px-4 rounded-lg hover:bg-amber-600/10 transition-colors">
                    <ArrowLeft className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <span className="ml-8 font-medium">الأكثر مبيعاً</span>
                  </Link>

                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/collection/${category.slug}`}
                      className="relative block py-3 px-4 rounded-lg hover:bg-amber-600/10 transition-colors"
                    >
                      <ArrowLeft className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                      <span className="ml-8 font-medium">{category.name}</span>
                    </Link>
                  ))}
                </nav>
        </div>
      </SheetContent>
          </Sheet>

          {/* Center: Logo */}
          <Link to="/" className="flex flex-col items-center group flex-shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative">
              <img 
                src={cosmedLogo} 
                alt="COSMED" 
                className="h-8 md:h-12 w-auto object-contain transition-all duration-300 group-hover:scale-105 flex-shrink-0"
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

          {/* Right: Search & Cart (swapped) */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} className="hover:bg-gold/20 text-white transition-all duration-300">
              <Search className="h-5 w-5 md:h-5 md:w-5" />
            </Button>

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
          </div>
        </div>
      </div>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
};

export default Header;
