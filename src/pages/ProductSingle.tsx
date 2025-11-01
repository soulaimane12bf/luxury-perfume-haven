import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, Minus, Plus, ShoppingCart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import OrderForm from '@/components/OrderForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import { useProduct, useProductReviews } from '@/lib/hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/hooks/useApi';

type ProductDetail = {
  id: string | number;
  name: string;
  description?: string;
  price?: string | number;
  old_price?: string | number;
  stock?: string | number;
  image_urls: string[];
  rating?: number;
  type?: string;
  brand?: string;
  sku?: string;
  category?: string;
  best_selling?: boolean;
};

const isProductDetail = (value: unknown): value is ProductDetail => {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<ProductDetail>;
  return typeof candidate.id !== 'undefined' && typeof candidate.name === 'string' && Array.isArray(candidate.image_urls);
};

export default function ProductSingle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const queryClient = useQueryClient();
  
  // Use React Query hooks
  const { data: productData, isLoading: productLoading } = useProduct(id!);
  const { data: reviewsData, isLoading: reviewsLoading } = useProductReviews(id!);
  
  const product = isProductDetail(productData) ? productData : null;
  const reviews = Array.isArray(reviewsData) ? reviewsData : [];
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [orderFormOpen, setOrderFormOpen] = useState(false);
  
  const loading = productLoading || reviewsLoading;

  const handleReviewSubmit = async () => {
    // Invalidate reviews query to refetch
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.reviews.byProduct(id!) });
  };

  if (loading) {
    return <div className="container py-20 text-center">Loading...</div>;
  }

  if (!product) {
    return <div className="container py-20 text-center">Product not found</div>;
  }

  const canonicalUrl = `${window.location.origin}/product/${product.id}`;
  const pageTitle = `${product.name} — ${product.brand} | متجر العطور`;
  const pageDescription = product.description || 'متجر العطور الأصلية الفاخرة - توصيل لجميع المدن';

  const parseNumeric = (value: unknown): number | null => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : null;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const numericPrice = parseNumeric(product.price) ?? 0;
  const numericStock = parseNumeric(product.stock);
  const isOutOfStock = numericStock !== null && numericStock <= 0;
  const oldPrice = parseNumeric(product.old_price);
  const currentPrice = numericPrice;
  const discountPercentage = oldPrice && oldPrice > currentPrice
    ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
    : null;

  const reviewRatings = reviews
    .map((review) => parseNumeric((review as { rating?: unknown })?.rating))
    .filter((rating): rating is number => rating !== null && rating >= 0);

  const averageRatingSource = reviewRatings.length > 0
    ? reviewRatings.reduce((sum, rating) => sum + rating, 0) / reviewRatings.length
    : parseNumeric(product.rating);

  const averageRating = averageRatingSource ? Number(averageRatingSource.toFixed(1)) : 0;
  const ratingCount = reviewRatings.length > 0 ? reviewRatings.length : reviews.length;

  useEffect(() => {
    if (numericStock === null) return;
    setQuantity((prev) => {
      if (numericStock <= 0) return 1;
      return Math.min(prev, numericStock);
    });
  }, [numericStock]);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image_urls || [],
    description: product.description || '',
    sku: product.sku || product.id,
    brand: { '@type': 'Brand', name: product.brand || '' },
    offers: {
      '@type': 'Offer',
      price: numericPrice.toFixed(2),
      priceCurrency: 'MAD',
      availability: isOutOfStock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <SEO title={pageTitle} description={pageDescription} canonical={canonicalUrl} jsonLd={productJsonLd} />
      <Header />
      <div className="min-h-screen bg-background pt-28 md:pt-32">
        {/* Header Navigation */}
        <div className="border-b">
          <div className="container py-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              العودة
            </Button>
          </div>
        </div>

      {/* Breadcrumb */}
      <div className="container py-4 text-sm text-muted-foreground">
        الرئيسية / {product.category} / {product.brand}
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted group">
              <img
                src={product.image_urls[selectedImage]}
                alt={product.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-zoom-in"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.image_urls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition group ${
                    selectedImage === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={url} 
                    alt={`${product.name} ${index + 1}`} 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-xl text-muted-foreground">{product.brand}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({averageRating}) · {ratingCount} تقييم
              </span>
            </div>

            {/* Type Badge */}
            <div className="flex gap-2">
              <Badge variant={product.type === 'PRODUIT' ? 'default' : 'secondary'} className="text-lg px-4 py-1">
                {product.type}
              </Badge>
              {discountPercentage && (
                <Badge className="bg-green-600 text-white text-lg px-4 py-1 font-bold">
                  خصم {discountPercentage}%
                </Badge>
              )}
            </div>

            {/* Price */}
            <div>
              {oldPrice && oldPrice > currentPrice ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">السعر القديم:</p>
                    <p className="text-3xl font-bold text-gray-400 line-through decoration-red-500 decoration-2">
                      {oldPrice.toFixed(2)} درهم
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-green-600">السعر الجديد:</p>
                    <p className="text-5xl font-black bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                      {currentPrice.toFixed(2)} درهم
                    </p>
                  </div>
                  <div className="inline-block bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-2 border-green-500 dark:border-green-600 rounded-xl px-6 py-3 shadow-md">
                    <p className="text-green-700 dark:text-green-400 font-black text-xl">
                      💰 وفّر {(oldPrice - currentPrice).toFixed(2)} درهم ({discountPercentage}% خصم)
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-4xl font-bold text-primary">{currentPrice.toFixed(2)} درهم</p>
              )}
              {isOutOfStock ? (
                <Badge variant="destructive" className="mt-2 text-sm">
                  نفذ من المخزون
                </Badge>
              ) : numericStock !== null && numericStock < 10 && (
                <p className="text-sm text-red-500 mt-1">بقي {numericStock} فقط في المخزون!</p>
              )}
            </div>

            <Separator />

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="font-medium">الكمية:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-6 font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setQuantity((prev) => {
                      if (numericStock === null) return prev + 1;
                      return Math.min(numericStock, prev + 1);
                    })
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              {/* Buy Now Button */}
              <Button 
                size="lg" 
                className="w-full text-lg bg-primary hover:bg-primary/90" 
                disabled={isOutOfStock}
                onClick={() => {
                  if (isOutOfStock) return;
                  setOrderFormOpen(true);
                }}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                اشتري الآن
              </Button>

              {/* Add to Cart Button */}
              <Button 
                size="lg" 
                variant="outline"
                className="w-full text-lg" 
                disabled={isOutOfStock}
                onClick={() => {
                  if (isOutOfStock) return;
                  addToCart(
                    {
                      ...product,
                      id: String(product.id),
                      price: numericPrice,
                      stock: numericStock ?? undefined,
                    },
                    Math.max(1, Math.min(quantity, numericStock ?? quantity))
                  );
                }}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                أضف إلى السلة
              </Button>
            </div>

            {product.best_selling && (
              <Badge variant="destructive" className="w-full justify-center py-2">
                🔥 الأكثر مبيعاً
              </Badge>
            )}
          </div>
        </div>

        {/* Description */}
        <Card className="mt-8 p-8">
          <h2 className="text-2xl font-bold mb-4">وصف المنتج</h2>
          <p className="text-lg leading-relaxed text-muted-foreground">{product.description}</p>
        </Card>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">آراء العملاء ({ratingCount})</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <ReviewForm productId={String(product.id)} onSuccess={handleReviewSubmit} />
            </div>
            <div>
              <ReviewList reviews={reviews} />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Order Form Dialog */}
    <OrderForm
      open={orderFormOpen}
      onOpenChange={setOrderFormOpen}
      items={[{
        product_id: String(product.id),
        name: product.name,
        price: numericPrice,
        quantity,
        image_url: product.image_urls[0],
      }]}
      totalAmount={numericPrice * quantity}
      onSuccess={() => {
        // Optionally navigate or show success message
      }}
    />

    <Footer />
    </>
  );
}
