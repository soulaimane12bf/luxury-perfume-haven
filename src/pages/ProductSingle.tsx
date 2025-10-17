import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsApi, reviewsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, Minus, Plus, ShoppingCart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import OrderForm from '@/components/OrderForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';

export default function ProductSingle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [orderFormOpen, setOrderFormOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, reviewsData] = await Promise.all([
          productsApi.getById(id),
          reviewsApi.getByProduct(id),
        ]);
        setProduct(productData as any);
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleReviewSubmit = async () => {
    const updatedReviews = await reviewsApi.getByProduct(id);
    setReviews(Array.isArray(updatedReviews) ? updatedReviews : []);
  };

  if (loading) {
    return <div className="container py-20 text-center">Loading...</div>;
  }

  if (!product) {
    return <div className="container py-20 text-center">Product not found</div>;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
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
                      i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.rating}) · {reviews.length} تقييم
              </span>
            </div>

            {/* Type Badge */}
            <div>
              <Badge variant={product.type === 'PRODUIT' ? 'default' : 'secondary'} className="text-lg px-4 py-1">
                {product.type}
              </Badge>
            </div>

            {/* Price */}
            <div>
              <p className="text-4xl font-bold text-primary">{product.price} درهم</p>
              {product.stock < 10 && (
                <p className="text-sm text-red-500 mt-1">بقي {product.stock} فقط في المخزون!</p>
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
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
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
                disabled={product.stock === 0}
                onClick={() => setOrderFormOpen(true)}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                اشتري الآن
              </Button>

              {/* Add to Cart Button */}
              <Button 
                size="lg" 
                variant="outline"
                className="w-full text-lg" 
                disabled={product.stock === 0}
                onClick={() => addToCart(product, quantity)}
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

        {/* Perfume Notes Section */}
        {(product.notes?.main_notes || product.notes?.top_notes) && (
          <Card className="mt-12 p-8">
            <h2 className="text-2xl font-bold mb-6">نفحات العطر</h2>
            
            <div className="space-y-6">
              {product.notes?.main_notes && (
                <div>
                  <h3 className="font-semibold mb-3">النفحات الرئيسية (Main Accords)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {product.notes.main_notes.map((note, index) => (
                      <div key={index} className="bg-muted rounded-lg p-3 text-center">
                        <div className="text-sm capitalize">{note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {product.notes?.top_notes && (
                <div>
                  <h3 className="font-semibold mb-3">النفحات العليا (Top Notes)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {product.notes.top_notes.map((note, index) => (
                      <div key={index} className="bg-primary/10 rounded-lg p-3 text-center">
                        <div className="text-sm capitalize font-medium">{note}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Description */}
        <Card className="mt-8 p-8">
          <h2 className="text-2xl font-bold mb-4">وصف العطر</h2>
          <p className="text-lg leading-relaxed text-muted-foreground">{product.description}</p>
        </Card>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">آراء العملاء ({reviews.length})</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <ReviewForm productId={product.id} onSuccess={handleReviewSubmit} />
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
        product_id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        quantity,
        image_url: product.image_urls[0],
      }]}
      totalAmount={parseFloat(product.price) * quantity}
      onSuccess={() => {
        // Optionally navigate or show success message
      }}
    />

    <Footer />
    </>
  );
}
