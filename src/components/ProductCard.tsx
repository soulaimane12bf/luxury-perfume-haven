import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
    old_price?: number;
    image_urls: string[];
    type: string;
    best_selling?: boolean;
    rating?: number;
    stock?: number;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Calculate discount percentage if old_price exists
  const discountPercentage = product.old_price && product.old_price > product.price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : null;

  return (
    <Card 
      className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 cursor-pointer bg-white dark:bg-gray-900 group"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <CardContent className="p-0 relative">
        <div className="aspect-square relative overflow-hidden bg-gray-50 dark:bg-gray-800">
          <img
            src={product.image_urls[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {product.best_selling && (
            <Badge className="absolute top-2 right-2 bg-red-500 text-white shadow-lg">
              🔥 الأكثر مبيعاً
            </Badge>
          )}
          {discountPercentage && (
            <Badge className="absolute top-2 left-2 bg-gradient-to-r from-green-600 to-green-500 text-white shadow-xl font-bold text-sm px-3 py-1 border-2 border-white">
              🔥 خصم {discountPercentage}%
            </Badge>
          )}
          <Badge 
            variant={product.type === 'PRODUIT' ? 'default' : 'secondary'} 
            className="absolute bottom-2 left-2 shadow-md"
          >
            {product.type}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 p-4 md:p-6 bg-white dark:bg-gray-900">
        <div className="w-full">
          <p className="text-xs md:text-sm text-muted-foreground mb-1 uppercase tracking-wide">{product.brand}</p>
          <h3 className="text-sm md:text-base font-bold line-clamp-2 mb-2 min-h-[2.5rem]">{product.name}</h3>
          
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-xs md:text-sm text-muted-foreground font-medium">{product.rating}</span>
            </div>
          )}
          
          <div className="space-y-2">
            {product.old_price && product.old_price > product.price ? (
              <>
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground">كان:</p>
                  <p className="text-base md:text-lg font-semibold text-gray-400 line-through decoration-red-500 decoration-2">
                    {product.old_price} درهم
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold text-green-600">الآن:</p>
                  <p className="text-2xl md:text-3xl font-black bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                    {product.price} درهم
                  </p>
                </div>
              </>
            ) : (
              <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">
                {product.price} درهم
              </p>
            )}
          </div>
          
          {product.stock < 10 && product.stock > 0 && (
            <p className="text-xs text-red-500 mt-2 font-semibold">⚠️ بقي {product.stock} فقط!</p>
          )}
        </div>
        
        <Button
          className="w-full bg-black hover:bg-gray-900 text-gold font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product, 1);
          }}
        >
          اضغط هنا للطلب
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
