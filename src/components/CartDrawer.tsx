import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
                className="w-full bg-primary hover:bg-primary/90" 
                size="lg"
                onClick={handleCheckout}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                إتمام الطلب
              </Button>
              <Button variant="ghost" className="w-full" onClick={closeCart}>
                استمر في التسوق
              </Button>
            </div>
          )}
        </div>
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

