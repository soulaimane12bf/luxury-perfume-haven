import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X, MessageCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { checkoutCartWhatsApp } from "@/lib/whatsapp";

const CartDrawer = () => {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, getTotalPrice } = useCart();

  const handleWhatsAppCheckout = () => {
    checkoutCartWhatsApp(items);
    closeCart();
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
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
                    src={item.image_url}
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
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeFromCart(item.id)}
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
                <span className="text-gold">{getTotalPrice()} درهم</span>
              </div>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700" 
                size="lg"
                onClick={handleWhatsAppCheckout}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                اشتري الآن عبر واتساب
              </Button>
              <Button variant="ghost" className="w-full" onClick={closeCart}>
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

