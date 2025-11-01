import { useCallback, useState } from 'react';
import { ordersApi, productsApi } from '@/lib/api';
import showAdminAlert from '@/lib/swal-admin';
import { generateCustomerWhatsAppUrl } from '@/lib/whatsapp';
import { useCart } from '@/contexts/CartContext';
import type { Order } from '../types';

type ApiErrorHandler = (error: unknown, operation: string) => void;

type UseOrdersSectionParams = {
  handleApiError: ApiErrorHandler;
};

export type OrdersSectionState = {
  orders: Order[];
  expandedOrders: Set<string>;
  toggleOrderDetails: (orderId: string) => void;
  handleContactCustomer: (order: Order) => void;
  handleUpdateOrderStatus: (orderId: string, status: string) => Promise<void>;
  handleDeleteOrder: (orderId: string) => Promise<void>;
  refreshOrders: () => Promise<void>;
};

export function useOrdersSection({ handleApiError }: UseOrdersSectionParams): OrdersSectionState {
  const { updateProductStock } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const refreshOrders = useCallback(async () => {
    try {
      const ordersData = (await ordersApi.getAll().catch(() => [])) as unknown;
      setOrders(Array.isArray(ordersData) ? (ordersData as Order[]) : []);
    } catch (error) {
      handleApiError(error, 'جلب الطلبات');
    }
  }, [handleApiError]);

  const toggleOrderDetails = useCallback((orderId: string) => {
    setExpandedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  }, []);

  const handleContactCustomer = useCallback((order: Order) => {
    const whatsappUrl = generateCustomerWhatsAppUrl(order.customer_phone, {
      orderId: order.id,
      customerName: order.customer_name,
      totalAmount: order.total_amount,
    });
    window.open(whatsappUrl, '_blank');
  }, []);

  const handleUpdateOrderStatus = useCallback(
    async (orderId: string, newStatus: string) => {
      try {
        // Get current order before updating
        const order = orders.find(o => o.id === orderId);
        const wasNotConfirmed = order && order.status !== 'confirmed' && order.status !== 'processing' && order.status !== 'shipped' && order.status !== 'delivered';
        
        await ordersApi.updateStatus(orderId, newStatus);
        
        // If order is being confirmed for the first time, decrease stock
        if (wasNotConfirmed && newStatus === 'confirmed' && order?.items) {
          for (const item of order.items) {
            try {
              // Fetch current product to get stock
              const productData = await productsApi.getById(item.id);
              const product = productData as { id: string; stock?: number | string; [key: string]: unknown };
              
              if (product && item.quantity) {
                const currentStock = typeof product.stock === 'number' ? product.stock : parseInt(String(product.stock || 0), 10);
                const newStock = currentStock - item.quantity;
                
                // Update product stock in database
                await productsApi.update(item.id, { 
                  stock: Math.max(0, newStock) 
                });
                
                // Update cart stock for all customers
                updateProductStock(item.id, Math.max(0, newStock));
              }
            } catch (err) {
              console.error(`Failed to update stock for product ${item.id}:`, err);
              // Continue with other items even if one fails
            }
          }
        }
        
        showAdminAlert({ title: '✅ نجح', text: 'تم تحديث حالة الطلب', icon: 'success', timer: 3000 });
        await refreshOrders();
      } catch (error) {
        handleApiError(error, 'تحديث حالة الطلب');
      }
    },
    [refreshOrders, handleApiError, orders, updateProductStock],
  );

  const handleDeleteOrder = useCallback(
    async (orderId: string) => {
      try {
        await ordersApi.delete(orderId);
        showAdminAlert({ title: '✅ نجح', text: 'تم حذف الطلب', icon: 'success', timer: 3000 });
        await refreshOrders();
      } catch (error) {
        handleApiError(error, 'حذف الطلب');
        throw error;
      }
    },
    [refreshOrders, handleApiError],
  );

  return {
    orders,
    expandedOrders,
    toggleOrderDetails,
    handleContactCustomer,
    handleUpdateOrderStatus,
    handleDeleteOrder,
    refreshOrders,
  };
}
