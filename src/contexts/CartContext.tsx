import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { productsApi } from '@/lib/api';

interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url: string;
  quantity: number;
  type: string;
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: ProductInput, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  removeDeletedProduct: (productId: string) => void;
  updateProductStock: (productId: string, newStock: number) => void;
}

interface ProductInput {
  id: string;
  name: string;
  brand?: string;
  price: number;
  image_urls?: string[];
  image_url?: string;
  type?: string;
  stock?: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Validate cart items against database on mount
  useEffect(() => {
    const validateCart = async () => {
      if (items.length === 0) return;
      
      try {
        // Check each cart item against database
        const validationResults = await Promise.all(
          items.map(async (item) => {
            try {
              await productsApi.getById(item.id);
              return { id: item.id, exists: true };
            } catch (error) {
              console.log(`Product ${item.id} (${item.name}) no longer exists in database, will be removed from cart`);
              return { id: item.id, exists: false };
            }
          })
        );
        
        // Remove items that no longer exist in database
        const deletedProductIds = validationResults
          .filter(result => !result.exists)
          .map(result => result.id);
        
        if (deletedProductIds.length > 0) {
          setItems(currentItems => 
            currentItems.filter(item => !deletedProductIds.includes(item.id))
          );
          console.log(`Removed ${deletedProductIds.length} deleted product(s) from cart`);
        }
      } catch (error) {
        console.error('Cart validation failed:', error);
      }
    };
    
    validateCart();
  }, []); // Run once on mount

  const addToCart = (product: ProductInput, quantity: number = 1) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      
      return [
        ...currentItems,
        {
          id: product.id,
          name: product.name,
          brand: product.brand ?? '',
          price: product.price,
          image_url: (product.image_urls && product.image_urls[0]) || product.image_url || '',
          quantity: Math.min(quantity, product.stock ?? quantity),
          type: product.type ?? '',
          stock: product.stock ?? quantity,
        },
      ];
    });
    setIsOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.min(quantity, item.stock) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // Remove product from cart when deleted by admin
  const removeDeletedProduct = (productId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
  };

  // Update product stock in cart items
  const updateProductStock = (productId: string, newStock: number) => {
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id === productId) {
          // If stock is 0 or less, remove from cart
          if (newStock <= 0) {
            return null;
          }
          // If current quantity exceeds new stock, adjust it
          return {
            ...item,
            stock: newStock,
            quantity: Math.min(item.quantity, newStock)
          };
        }
        return item;
      }).filter((item): item is CartItem => item !== null)
    );
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isOpen,
        openCart,
        closeCart,
        removeDeletedProduct,
        updateProductStock,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
