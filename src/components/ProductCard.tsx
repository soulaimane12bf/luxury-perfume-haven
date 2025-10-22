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
      className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 cursor-pointer bg-white group h-full flex flex-col"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <CardContent className="p-0 relative flex-shrink-0">
        <div className="aspect-square relative overflow-hidden bg-gray-50">
          <img
            src={product.image_urls[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {discountPercentage && (
            <Badge className="absolute top-2 left-2 bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg font-bold text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1">
              خصم {discountPercentage}%
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 p-3 md:p-4 bg-white flex-grow">
        <div className="w-full flex-grow flex flex-col justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-0.5 uppercase tracking-wide">{product.brand}</p>
            <h3 className="text-sm md:text-base font-semibold line-clamp-2 mb-2 h-[2.5rem]">{product.name}</h3>
          </div>
          
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-600 font-medium">{product.rating}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 flex-wrap">
            {product.old_price && product.old_price > product.price ? (
              <>
                <span className="text-lg md:text-xl font-bold text-black">
                  {product.price} د.م
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {product.old_price}
                </span>
              </>
            ) : (
              <span className="text-lg md:text-xl font-bold text-black">
                {product.price} د.م
              </span>
            )}
          </div>
          
          {product.stock < 10 && product.stock > 0 && (
            <p className="text-xs text-red-600 font-medium mt-1">بقي {product.stock} فقط</p>
          )}
        </div>
        
        <Button
          className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-2 text-sm transition-all duration-300"
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
