import Order from '../models/order.js';
import Admin from '../models/admin.js';
import nodemailer from 'nodemailer';

// Get admin contact info and SMTP credentials from database
const getAdminContactInfo = async () => {
  try {
    const admin = await Admin.findOne({ 
      where: { role: 'super-admin' },
      attributes: ['email', 'phone', 'smtp_email', 'smtp_password']
    });
    
    return {
      email: admin?.email || process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      phone: admin?.phone || process.env.ADMIN_WHATSAPP || '212600000000',
      smtp_email: admin?.smtp_email || process.env.EMAIL_USER,
      smtp_password: admin?.smtp_password || process.env.EMAIL_PASS
    };
  } catch (error) {
    console.error('Error fetching admin info:', error);
    return {
      email: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      phone: process.env.ADMIN_WHATSAPP || '212600000000',
      smtp_email: process.env.EMAIL_USER,
      smtp_password: process.env.EMAIL_PASS
    };
  }
};

// WhatsApp notification helper
const sendWhatsAppNotification = async (order, adminPhone) => {
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
  
  const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
  console.log('📱 WhatsApp notification URL:', whatsappUrl);
  return whatsappUrl;
};

// Send email notification (with dynamic SMTP credentials)
const sendEmailNotification = async (order, adminEmail, smtpEmail, smtpPassword) => {
  try {
    // Create transporter with admin's SMTP credentials
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: smtpEmail,
        pass: smtpPassword,
      },
    });

    const itemsHTML = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <img src="${item.image_url || ''}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.price} درهم</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: smtpEmail,
      to: adminEmail,
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
            ${order.notes ? `<p><strong>ملاحظات:</strong> ${order.notes}</p>` : ''}
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
            رقم الطلب: ${order.id}<br>
            تاريخ الطلب: ${new Date(order.created_at).toLocaleString('ar-MA')}
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email notification sent successfully to:', adminEmail);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
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

    // Send notifications in background (non-blocking)
    setImmediate(async () => {
      try {
        const adminInfo = await getAdminContactInfo();
        
        // Send email with dynamic SMTP credentials
        await sendEmailNotification(order, adminInfo.email, adminInfo.smtp_email, adminInfo.smtp_password);
        
        // Generate WhatsApp notification
        await sendWhatsAppNotification(order, adminInfo.phone);
        
        console.log('✅ Notifications sent successfully for order:', order.id);
      } catch (notificationError) {
        console.error('❌ Error sending notifications for order:', order.id, notificationError);
        // Don't fail the order creation if notifications fail
      }
    });

    // Return response immediately without waiting for notifications
    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

// Update order status (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

// Delete order (Admin only)
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
