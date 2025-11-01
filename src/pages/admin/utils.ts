import { ADMIN_TABS, AdminTab, Order } from './types';

export const isAdminTab = (value: string | null): value is AdminTab =>
  Boolean(value && (ADMIN_TABS as readonly string[]).includes(value));

type OrderWithOptionalDates = Order & {
  createdAt?: string;
  updatedAt?: string;
};

export const formatOrderDate = (order: OrderWithOptionalDates): string => {
  try {
    const dateValue = order.created_at ?? order.createdAt ?? order.updated_at ?? order.updatedAt;
    if (!dateValue) {
      return 'لا يوجد تاريخ';
    }

    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      return 'تاريخ غير صالح';
    }

    return date.toLocaleDateString('ar-MA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'تاريخ غير صالح';
  }
};
