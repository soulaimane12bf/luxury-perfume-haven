import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';

interface Filters {
  category?: string | null;
  brand?: string | null;
  type?: string | null;
  minPrice?: string | null;
  maxPrice?: string | null;
  best_selling?: string | null;
  sort?: string | null;
}

interface FilterBarProps {
  filters: Filters;
  onFilterChange: (key: string, value: string | null) => void;
  brands: string[];
}

export default function FilterBar({ filters, onFilterChange, brands }: FilterBarProps) {
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [logoSrc, setLogoSrc] = useState<string | null>(null);

  // Try to dynamically load a store sidebar logo if present. Graceful fallback if not.
  useEffect(() => {
    let mounted = true;
    import('@/assets/images/sidebar-logo.png')
      .then((m) => {
        if (mounted && m && m.default) setLogoSrc(m.default as string);
      })
      .catch(() => {
        // ignore — optional logo
      });
    return () => { mounted = false; };
  }, []);

  const handleBrandToggle = (brand) => {
    const currentBrands = filters.brand ? filters.brand.split(',') : [];
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter(b => b !== brand)
      : [...currentBrands, brand];
    
    onFilterChange('brand', newBrands.length > 0 ? newBrands.join(',') : null);
  };

  const handleTypeToggle = (type) => {
    onFilterChange('type', filters.type === type ? null : type);
  };

  const handlePriceChange = () => {
    onFilterChange('minPrice', priceRange[0].toString());
    onFilterChange('maxPrice', priceRange[1].toString());
  };

  const clearFilters = () => {
    setPriceRange([0, 5000]);
    onFilterChange('brand', null);
    onFilterChange('type', null);
    onFilterChange('minPrice', null);
    onFilterChange('maxPrice', null);
    onFilterChange('best_selling', null);
  };

  const selectedBrands = filters.brand ? filters.brand.split(',') : [];
  const hasActiveFilters = filters.brand || filters.type || filters.minPrice || filters.maxPrice || filters.best_selling;

  return (
    <Card className="p-0 sticky top-4 overflow-hidden">
      {/* Optional header with logo/title to match store sidebar design */}
      <div className="p-4 border-b bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-between">
        <div className="flex items-center gap-3">
          {logoSrc ? (
            <img src={logoSrc} alt="logo" className="h-10 w-auto object-contain" />
          ) : (
            <div className="text-sm font-bold text-white">تصفية المتجر</div>
          )}
        </div>
        {hasActiveFilters && (
          <div className="pr-2">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              مسح الكل
            </Button>
          </div>
        )}
      </div>

      {/* Padded content area with contrasting background so form controls render correctly */}
      <div className="p-6 bg-gradient-to-b from-transparent to-transparent text-white">
        <Separator className="my-4 opacity-30" />

      {/* Sort By */}
      <div className="mb-6">
        <Label className="mb-2 block">ترتيب حسب</Label>
        <Select value={filters.sort || 'newest'} onValueChange={(value) => onFilterChange('sort', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">الأحدث</SelectItem>
            <SelectItem value="oldest">الأقدم</SelectItem>
            <SelectItem value="price-asc">السعر: من الأقل للأعلى</SelectItem>
            <SelectItem value="price-desc">السعر: من الأعلى للأقل</SelectItem>
          </SelectContent>
        </Select>
      </div>

        <Separator className="my-4" />

        {/* Best Selling */}
        <div className="mb-6 relative">
          <ArrowLeft className="absolute left-3 top-3 w-4 h-4 text-amber-400 opacity-90" />
          <div className="flex items-center space-x-2 space-x-reverse ml-6">
            <Checkbox
              id="best-selling"
              checked={filters.best_selling === 'true'}
              onCheckedChange={(checked) => onFilterChange('best_selling', checked ? 'true' : null)}
            />
            <Label htmlFor="best-selling" className="cursor-pointer text-white">
              الأكثر مبيعاً فقط 🔥
            </Label>
          </div>
        </div>

      <Separator className="my-4" />

      {/* Brand Filter */}
      <div className="mb-6">
        <Label className="mb-3 block">العلامة التجارية</Label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => handleBrandToggle(brand)}
              />
              <Label htmlFor={`brand-${brand}`} className="cursor-pointer text-sm">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

        <Separator className="my-4" />

        {/* Brand Filter */}
        <div className="mb-6 relative">
          <ArrowLeft className="absolute left-3 top-3 w-4 h-4 text-amber-400 opacity-90" />
          <Label className="mb-3 block ml-6 text-white">العلامة التجارية</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto ml-6">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => handleBrandToggle(brand)}
                />
                <Label htmlFor={`brand-${brand}`} className="cursor-pointer text-sm text-white">
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Type Filter */}
        <div className="mb-6 relative">
          <ArrowLeft className="absolute left-3 top-3 w-4 h-4 text-amber-400 opacity-90" />
          <Label className="mb-3 block ml-6 text-white">النوع</Label>
          <div className="space-y-2 ml-6">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="type-produit"
                checked={filters.type === 'PRODUIT'}
                onCheckedChange={() => handleTypeToggle('PRODUIT')}
              />
              <Label htmlFor="type-produit" className="cursor-pointer text-sm text-white">
                PRODUIT (منتج أصلي)
              </Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="type-testeur"
                checked={filters.type === 'TESTEUR'}
                onCheckedChange={() => handleTypeToggle('TESTEUR')}
              />
              <Label htmlFor="type-testeur" className="cursor-pointer text-sm text-white">
                TESTEUR (تستر)
              </Label>
            </div>
          </div>
        </div>

      <Separator className="my-4" />

      {/* Price Range */}
      <div className="mb-6">
        <Label className="mb-3 block">السعر (درهم)</Label>
        <div className="px-2">
          <Slider
            min={0}
            max={5000}
            step={100}
            value={priceRange}
            onValueChange={setPriceRange}
            onValueCommit={handlePriceChange}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{priceRange[0]} درهم</span>
            <span>{priceRange[1]} درهم</span>
          </div>
        </div>
      </div>
      </div>
    </Card>
  );
}
