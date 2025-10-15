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

  return (
    <Card 
      className="overflow-hidden hover-scale shadow-elegant hover:shadow-gold transition-smooth border-0 cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <CardContent className="p-0 relative">
        <div className="aspect-square relative overflow-hidden bg-secondary">
          <img
            src={product.image_urls[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          {product.best_selling && (
            <Badge className="absolute top-2 right-2 bg-red-500">
              🔥 الأكثر مبيعاً
            </Badge>
          )}
          <Badge 
            variant={product.type === 'PRODUIT' ? 'default' : 'secondary'} 
            className="absolute bottom-2 left-2"
          >
            {product.type}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 p-6">
        <div className="w-full">
          <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
          <h3 className="text-lg font-semibold line-clamp-2 mb-2">{product.name}</h3>
          
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-muted-foreground">{product.rating}</span>
            </div>
          )}
          
          <p className="text-2xl font-bold text-gold">{product.price} درهم</p>
          
          {product.stock < 10 && product.stock > 0 && (
            <p className="text-xs text-red-500 mt-1">بقي {product.stock} فقط!</p>
          )}
        </div>
        
        <Button
          variant="cta"
          className="w-full"
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
