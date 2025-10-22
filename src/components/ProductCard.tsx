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

  const discountPercentage = product.old_price && product.old_price > product.price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : null;

  return (
    <Card 
      className="relative overflow-hidden cursor-pointer bg-white group h-full flex flex-col border border-gray-100 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] hover:-translate-y-1"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Golden accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardContent className="p-0 relative flex-shrink-0">
        <div className="aspect-square relative overflow-hidden bg-gray-50">
          <img
            src={product.image_urls[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          />
          
          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {discountPercentage && (
            <Badge className="absolute top-3 left-3 bg-black text-yellow-500 font-bold text-xs px-3 py-1 shadow-lg">
              {discountPercentage}%-
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-3 p-4 md:p-5 bg-white flex-grow">
        <div className="w-full flex-grow flex flex-col justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-1 uppercase tracking-widest font-medium">
              {product.brand}
            </p>
            <h3 className="text-sm md:text-base font-semibold line-clamp-2 mb-3 text-gray-800 group-hover:text-black transition-colors duration-300">
              {product.name}
            </h3>
          </div>
          
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mb-3">
              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
              <span className="text-xs text-gray-600 font-semibold">{product.rating}</span>
            </div>
          )}
          
          <div className="flex items-baseline gap-2 flex-wrap mb-1">
            <span className="text-xl md:text-2xl font-bold text-black">
              {product.price} د.م
            </span>
            {product.old_price && product.old_price > product.price && (
              <span className="text-sm text-gray-400 line-through font-medium">
                {product.old_price}
              </span>
            )}
          </div>
          
          {product.stock < 10 && product.stock > 0 && (
            <p className="text-xs text-red-600 font-medium">بقي {product.stock} فقط</p>
          )}
        </div>
        
        <Button
          className="w-full bg-black hover:bg-gray-900 text-yellow-500 font-bold py-5 transition-all duration-300 transform group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative overflow-hidden"
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product, 1);
          }}
        >
          <span className="relative z-10">اضغط هنا للطلب</span>
          {/* Golden shine effect */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;