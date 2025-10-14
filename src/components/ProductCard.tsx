import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  onAddToCart: (product: { id: number; name: string; price: number; image: string }) => void;
}

const ProductCard = ({ id, name, price, image, onAddToCart }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden hover-scale shadow-elegant hover:shadow-gold transition-smooth border-0">
      <CardContent className="p-0">
        <div className="aspect-square relative overflow-hidden bg-secondary">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-3 p-6">
        <h3 className="text-lg font-semibold text-center line-clamp-2">{name}</h3>
        <p className="text-2xl font-bold text-gold">{price} درهم</p>
        <Button
          variant="cta"
          className="w-full"
          onClick={() => onAddToCart({ id, name, price, image })}
        >
          اضغط هنا للطلب
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
