import Order from '../models/order.js';
import Admin from '../models/admin.js';
import nodemailer from 'nodemailer';

// Sanitize environment-provided API keys (strip accidental surrounding quotes/newlines)
const _sanitize = (v) => (typeof v === 'string' ? v.replace(/^\s*[\'\"]?|[\'\"]?\s*$/g, '').trim() : '');
const RESEND_API_KEY_SAFE = _sanitize(process.env.RESEND_API_KEY);
const SENDGRID_API_KEY_SAFE = _sanitize(process.env.SENDGRID_API_KEY);
const RESEND_FROM_EMAIL_SAFE = _sanitize(process.env.RESEND_FROM_EMAIL);
const SENDGRID_FROM_EMAIL_SAFE = _sanitize(process.env.SENDGRID_FROM_EMAIL);

// Basic validators for 'from' field accepted by Resend: email@domain or Name <email@domain>
const _isValidEmail = (v) => {
  if (!v || typeof v !== 'string') return false;
  // allow formats like: Name <email@domain> or email@domain
  const simpleEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameEmail = /^.+<[^\s@]+@[^\s@]+\.[^\s@]+>$/;
  return simpleEmail.test(v) || nameEmail.test(v);
};

const _chooseFromAddress = (adminEmail, smtpEmail) => {
  // prefer explicit RESEND_FROM_EMAIL, then SENDGRID_FROM_EMAIL, then smtp/admin envs
  const candidates = [RESEND_FROM_EMAIL_SAFE, SENDGRID_FROM_EMAIL_SAFE, smtpEmail, adminEmail, _sanitize(process.env.EMAIL_USER)];
  for (const c of candidates) {
    if (c && _isValidEmail(c)) return c;
    // also allow Name <email@domain> with optional quotes
    if (c && _isValidEmail(c.replace(/^\"|\"$/g, ''))) return c.replace(/^\"|\"$/g, '');
  }
  // last resort: use a clearly valid no-reply
  return 'no-reply@cosmedstores.com';
};

// Get admin contact info (no SMTP)
const getAdminContactInfo = async () => {
  try {
    const admin = await Admin.findOne({ 
      where: { role: 'super-admin' },
      attributes: ['email', 'phone']
    });
    
    return {
      email: admin?.email || process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      phone: admin?.phone || process.env.ADMIN_WHATSAPP || '212600000000',
    };
  } catch (error) {
    console.error('Error fetching admin info:', error);
    return {
      email: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      phone: process.env.ADMIN_WHATSAPP || '212600000000',
    };
  }
};

// Send email notification (Resend only)
const sendEmailNotification = async (order, adminEmail) => {
  // Build common HTML body
  const itemsHTML = (order.items || []).map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <img src="${item.image_url || ''}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.price} درهم</td>
      </tr>
    `).join('');

  const htmlBody = `
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
    `;

  // Only use Resend
  try {
    if (process.env.RESEND_API_KEY) {
      const https = await import('https');
      const fromAddress = _chooseFromAddress(adminEmail);
      const payload = JSON.stringify({
        from: fromAddress,
        to: [adminEmail],
        subject: `طلب جديد - ${order.id}`,
        html: htmlBody,
      });

      const options = {
        hostname: 'api.resend.com',
        path: '/emails',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY_SAFE}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      };

      await new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              console.log('✅ Email notification sent via Resend to:', adminEmail);
              resolve(null);
            } else {
              console.error('❌ Resend API error', res.statusCode, body);
              reject(new Error(`Resend error: ${res.statusCode}`));
            }
          });
        });

        req.on('error', (err) => reject(err));
        req.write(payload);
        req.end();
      });

      return;
    }
  } catch (resendErr) {
    console.error('❌ Resend send error:', resendErr && (resendErr.message || JSON.stringify(resendErr)));
  }

  console.warn('⚠️ No Resend API key configured. Skipping email send.');
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

    // Get admin contact info for notifications
    const adminInfo = await getAdminContactInfo();

    // Create order (we'll update it with whatsapp_url after generation)
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

    // Send email with short timeout (don't block too long, but ensure it's sent)
    const emailSendPromise = (async () => {
      try {
        const emailPromise = sendEmailNotification(order, adminInfo.email);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Email timeout')), 8000) // 8 second timeout
        );
        await Promise.race([emailPromise, timeoutPromise]);
        console.log('✅ Email sent for order:', order.id);
      } catch (error) {
        console.error('❌ Email failed for order:', order.id, '-', error.message);
      }
    })();

    // Wait for email with timeout, but don't fail the order
    await Promise.race([
      emailSendPromise,
      new Promise(resolve => setTimeout(resolve, 8000)) // Max 8 seconds wait
    ]);

    // Return response after email attempt
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
