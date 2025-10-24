import { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { productsApi, categoriesApi } from '@/lib/api';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const navigate = useNavigate();

  // Fetch categories
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

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2 || (selectedCategory !== 'all' && searchQuery.trim().length === 0)) {
        performSearch(searchQuery, selectedCategory);
      } else if (searchQuery.trim().length < 2) {
        setSearchResults([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  const performSearch = async (query: string, categoryId?: string) => {
    setIsSearching(true);
    try {
      let products;
      
      if (query.trim().length >= 2) {
        // Search with query
        products = await productsApi.search(query, 20);
      } else if (categoryId && categoryId !== 'all') {
        // Search all products when only category is selected
        products = await productsApi.search('', 50); // Empty query to get all products
      } else {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      
      let filteredProducts = Array.isArray(products) ? products : [];
      
      // Filter by category if selected (not "all")
      if (categoryId && categoryId !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === categoryId);
      }
      
      // Limit to 10 results after filtering
      setSearchResults(filteredProducts.slice(0, 10));
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    onOpenChange(false);
    setSearchQuery('');
    setSelectedCategory('all');
    setSearchResults([]);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSearchResults([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl">بحث عن المنتجات</DialogTitle>
        </DialogHeader>

        {/* Category Selector */}
        <div className="mb-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="all">جميع الفئات</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="ابحث عن عطر، علامة تجارية، فئة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 text-base md:text-lg h-11 md:h-12"
            autoFocus
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto mt-4">
          {isSearching ? (
            <div className="text-center py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>جاري البحث...</p>
            </div>
          ) : searchQuery && searchResults.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium">لم يتم العثور على نتائج</p>
              <p className="text-sm mt-1">جرب كلمات بحث مختلفة</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-3">
                {searchResults.length} نتيجة
              </p>
              {searchResults.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="w-full flex items-center gap-3 md:gap-4 p-3 rounded-lg hover:bg-secondary transition-colors text-right border border-transparent hover:border-border"
                >
                  <img
                    src={product.image_urls[0]}
                    alt={product.name}
                    className="w-14 h-14 md:w-16 md:h-16 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm md:text-base truncate">{product.name}</h4>
                    <p className="text-xs md:text-sm text-muted-foreground">{product.brand}</p>
                    <p className="text-sm md:text-base font-bold text-gold mt-0.5">
                      {product.price} درهم
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-base">ابدأ الكتابة للبحث عن المنتجات</p>
              <p className="text-sm mt-1">يمكنك البحث بالاسم، العلامة التجارية، أو الفئة</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
