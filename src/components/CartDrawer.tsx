import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, change: number) => void;
  onRemoveItem: (id: number) => void;
}

const CartDrawer = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem }: CartDrawerProps) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-full sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">سلة مشترياتي</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full mt-6">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto space-y-4">
            {items.length === 0 ? (
              <p className="text-center text-muted-foreground mt-8">السلة فارغة</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border border-border rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-2">{item.name}</h4>
                    <p className="text-gold font-bold mb-2">{item.price} درهم</p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onUpdateQuantity(item.id, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onUpdateQuantity(item.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>مجموع سلة التسوق</span>
                <span className="text-gold">{total} درهم</span>
              </div>
              <Button variant="cta" className="w-full" size="lg">
                شراء الآن
              </Button>
              <Button variant="ghost" className="w-full" onClick={onClose}>
                استمر في التسوق
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
