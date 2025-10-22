import { useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import OrderForm from "@/components/OrderForm";

const CartDrawer = () => {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [orderFormOpen, setOrderFormOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  const handleCheckout = () => {
    // Checkout all items
    setSelectedItems(items.map(item => ({
      product_id: item.id,
      name: item.name,
      price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
      quantity: item.quantity,
      image_url: item.image_url,
    })));
    setOrderFormOpen(true);
  };

  const handleCheckoutSingle = (item: any) => {
    // Checkout single item
    setSelectedItems([{
      product_id: item.id,
      name: item.name,
      price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
      quantity: item.quantity,
      image_url: item.image_url,
    }]);
    setOrderFormOpen(true);
  };

  const handleOrderSuccess = () => {
    // Clear cart after successful order
    clearCart();
    closeCart();
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent
        side="right"
        className="w-full sm:w-[420px] bg-background/95 backdrop-blur-xl border-l-2 border-gold/20 [&>button:last-of-type]:hidden flex flex-col p-0"
      >
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 text-left px-6 py-4 border-b">
          <SheetTitle className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-gold" />
            سلة مشترياتي
          </SheetTitle>
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground hover:text-foreground border border-transparent hover:border-gold/40 rounded-full transition-colors"
              onClick={closeCart}
            >
              <X className="h-5 w-5" />
            </Button>
          </SheetClose>
        </SheetHeader>

        {/* Cart Items - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center mt-20">
                <ShoppingBag className="h-20 w-20 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground text-lg">السلة فارغة</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border border-border rounded-xl bg-card hover:shadow-lg transition-all duration-300">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg shadow-md"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1 line-clamp-2">{item.name}</h4>
                    <p className="text-gold font-bold text-lg mb-2">{item.price} درهم</p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 hover:bg-red-500 hover:text-white transition-colors"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="font-bold text-sm w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 hover:bg-green-500 hover:text-white transition-colors"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-red-500 hover:text-white transition-colors"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer - Fixed at bottom */}
          {items.length > 0 && (
            <div className="border-t border-border bg-card px-6 py-4 space-y-3">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>مجموع سلة التسوق</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-500">
                  {getTotalPrice()} درهم
                </span>
              </div>
              <Button 
                className="w-full bg-black hover:bg-gray-900 text-gold font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5" 
                size="lg"
                onClick={handleCheckout}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                إتمام الطلب
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-2 hover:bg-gold/10 transition-all duration-300" 
                onClick={closeCart}
              >
                استمر في التسوق
              </Button>
            </div>
          )}
      </SheetContent>

      {/* Order Form Dialog */}
      <OrderForm
        open={orderFormOpen}
        onOpenChange={setOrderFormOpen}
        items={selectedItems}
        totalAmount={selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
        onSuccess={handleOrderSuccess}
      />
    </Sheet>
  );
};

export default CartDrawer;

