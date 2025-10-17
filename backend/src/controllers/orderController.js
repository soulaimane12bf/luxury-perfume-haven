import Order from '../models/order.js';
import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// WhatsApp notification helper
const sendWhatsAppNotification = async (order) => {
  const adminPhone = process.env.ADMIN_WHATSAPP || '212600000000';
  const itemsList = order.items.map(item => 
    `- ${item.name} (${item.quantity}x) - ${item.price} درهم`
  ).join('\n');
  
  const message = `🔔 *طلب جديد!*\n\n` +
    `📦 رقم الطلب: ${order.id}\n` +
    `👤 العميل: ${order.customer_name}\n` +
    `📱 الهاتف: ${order.customer_phone}\n` +
    `📧 البريد: ${order.customer_email || 'غير متوفر'}\n` +
    `📍 العنوان: ${order.customer_address}\n\n` +
    `🛍️ *المنتجات:*\n${itemsList}\n\n` +
    `💰 المجموع: ${order.total_amount} درهم`;
  
  // Return the WhatsApp URL (you can also use WhatsApp Business API if configured)
  return `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
};

// Send email notification
const sendEmailNotification = async (order) => {
  try {
    const itemsHTML = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <img src="${item.image_url}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.price} درهم</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `طلب جديد - ${order.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl;">
          <h2 style="color: #d4af37; text-align: center;">طلب جديد من متجر العطور</h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>معلومات العميل</h3>
            <p><strong>الاسم:</strong> ${order.customer_name}</p>
            <p><strong>الهاتف:</strong> ${order.customer_phone}</p>
            <p><strong>البريد الإلكتروني:</strong> ${order.customer_email || 'غير متوفر'}</p>
            <p><strong>العنوان:</strong> ${order.customer_address}</p>
          </div>
          <div style="margin: 20px 0;">
            <h3>تفاصيل الطلب</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f0f0f0;">
                  <th style="padding: 10px; text-align: right;">صورة</th>
                  <th style="padding: 10px; text-align: right;">المنتج</th>
                  <th style="padding: 10px; text-align: right;">الكمية</th>
                  <th style="padding: 10px; text-align: right;">السعر</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>
          </div>
          <div style="background: #d4af37; color: white; padding: 15px; text-align: center; border-radius: 8px; margin-top: 20px;">
            <h3 style="margin: 0;">المجموع الكلي: ${order.total_amount} درهم</h3>
          </div>
          <p style="text-align: center; color: #666; margin-top: 20px;">
            رقم الطلب: ${order.id}
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email notification sent successfully');
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};

// Get all orders (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [['created_at', 'DESC']],
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Get single order
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { customer_name, customer_email, customer_phone, customer_address, items, total_amount, notes } = req.body;

    // Validate required fields
    if (!customer_name || !customer_phone || !customer_address || !items || !total_amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create order
    const order = await Order.create({
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      items,
      total_amount,
      notes,
      status: 'pending',
    });

    // Send notifications
    try {
      await sendEmailNotification(order);
      const whatsappUrl = await sendWhatsAppNotification(order);
      console.log('WhatsApp notification URL:', whatsappUrl);
    } catch (notificationError) {
      console.error('Error sending notifications:', notificationError);
      // Don't fail the order creation if notifications fail
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Failed to update order' });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.destroy();
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Failed to delete order' });
  }
};
