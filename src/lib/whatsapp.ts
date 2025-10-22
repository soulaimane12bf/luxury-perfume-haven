// WhatsApp Checkout Utility Functions

// Your business WhatsApp number (update this with your actual number)
const WHATSAPP_NUMBER = '212600000000'; // Format: country code + number (without + or spaces)

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image_url?: string;
}

/**
 * Generate WhatsApp message for a single product purchase
 */
export function generateWhatsAppMessageSingle(
  product: { id: string; name: string; brand: string; price: number },
  quantity: number
): string {
  const productUrl = `${window.location.origin}/product/${product.id}`;
  
  const message = `
🛍️ *طلب منتج جديد*

*المنتج:* ${product.name}
*العلامة التجارية:* ${product.brand}
*الكمية:* ${quantity}
*السعر:* ${product.price} درهم
*المجموع:* ${product.price * quantity} درهم

📎 *رابط المنتج:*
${productUrl}

---
أود تأكيد هذا الطلب، شكراً!
  `.trim();

  return encodeURIComponent(message);
}

/**
 * Generate WhatsApp message for cart checkout (multiple products)
 */
export function generateWhatsAppMessageCart(cartItems: Product[]): string {
  const productsList = cartItems
    .map((item, index) => {
      const productUrl = `${window.location.origin}/product/${item.id}`;
      return `
${index + 1}. *${item.name}*
   العلامة: ${item.brand}
   الكمية: ${item.quantity}
   السعر: ${item.price} درهم
   المجموع: ${item.price * item.quantity} درهم
   الرابط: ${productUrl}`;
    })
    .join('\n');

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const message = `
🛒 *طلب سلة مشتريات*

*المنتجات:*
${productsList}

📊 *الملخص:*
عدد المنتجات: ${totalItems}
*المجموع الكلي:* ${totalPrice} درهم

---
أود تأكيد هذا الطلب، شكراً!
  `.trim();

  return encodeURIComponent(message);
}

/**
 * Open WhatsApp with pre-filled message
 */
export function openWhatsAppCheckout(message: string): void {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  window.open(whatsappUrl, '_blank');
}

/**
 * Buy single product directly via WhatsApp
 */
export function buyNowWhatsApp(
  product: { id: string; name: string; brand: string; price: number },
  quantity: number
): void {
  const message = generateWhatsAppMessageSingle(product, quantity);
  openWhatsAppCheckout(message);
}

/**
 * Checkout cart via WhatsApp
 */
export function checkoutCartWhatsApp(cartItems: Product[]): void {
  const message = generateWhatsAppMessageCart(cartItems);
  openWhatsAppCheckout(message);
}

/**
 * Generate WhatsApp URL to contact a customer about their order
 */
export function generateCustomerWhatsAppUrl(
  customerPhone: string,
  orderDetails?: {
    orderId: string;
    customerName: string;
    totalAmount: number;
  }
): string {
  // Remove any non-digit characters from phone number
  let cleanPhone = customerPhone.replace(/\D/g, '');
  
  // If phone starts with 0, replace with country code (assuming Morocco +212)
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '212' + cleanPhone.substring(1);
  }
  // If phone doesn't start with country code, add Morocco code
  else if (!cleanPhone.startsWith('212') && !cleanPhone.startsWith('00212')) {
    cleanPhone = '212' + cleanPhone;
  }
  // Remove leading 00 if present
  if (cleanPhone.startsWith('00')) {
    cleanPhone = cleanPhone.substring(2);
  }

  // Generate optional message about the order (use api.whatsapp.com for better encoding support)
  if (orderDetails) {
    const message = `مرحباً ${orderDetails.customerName}، أتواصل معك بخصوص طلبك رقم ${orderDetails.orderId} بقيمة ${orderDetails.totalAmount} درهم.`;
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
  }

  // If no message, just open chat with the customer
  return `https://wa.me/${cleanPhone}`;
}

export { WHATSAPP_NUMBER };
