import nodemailer from 'nodemailer';
import Admin from '../backend/src/models/admin.js';

export default async function handler(req, res) {
  try {
    // Get admin SMTP credentials
    const admin = await Admin.findOne({ 
      where: { role: 'super-admin' },
      attributes: ['email', 'smtp_email', 'smtp_password']
    });
    
    if (!admin?.smtp_email || !admin?.smtp_password) {
      return res.status(400).json({
        error: 'SMTP credentials not configured',
        solution: 'Please set smtp_email and smtp_password in admin profile',
        current: {
          smtp_email: admin?.smtp_email || 'not set',
          smtp_password: admin?.smtp_password ? 'set (hidden)' : 'not set'
        }
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: admin.smtp_email,
        pass: admin.smtp_password,
      },
    });

    // Verify connection
    try {
      await transporter.verify();
      
      // Try to send a test email
      const info = await transporter.sendMail({
        from: admin.smtp_email,
        to: admin.email,
        subject: 'Test Email from Luxury Perfume Haven',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #d4af37;">Test Email Successful! ✅</h2>
            <p>This is a test email from your Luxury Perfume Haven e-commerce platform.</p>
            <p><strong>SMTP Configuration:</strong></p>
            <ul>
              <li>Server: ${process.env.EMAIL_HOST || 'smtp.gmail.com'}</li>
              <li>Port: ${process.env.EMAIL_PORT || '587'}</li>
              <li>Email: ${admin.smtp_email}</li>
            </ul>
            <p>If you received this email, your email notifications are working correctly! 🎉</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
              Test sent at: ${new Date().toLocaleString()}
            </p>
          </div>
        `,
      });

      res.json({
        success: true,
        message: 'Test email sent successfully!',
        details: {
          messageId: info.messageId,
          from: admin.smtp_email,
          to: admin.email,
          accepted: info.accepted,
          rejected: info.rejected,
          response: info.response
        },
        instructions: 'Check your inbox at ' + admin.email
      });

    } catch (smtpError) {
      res.status(500).json({
        error: 'SMTP Connection or Send Failed',
        details: smtpError.message,
        config: {
          host: process.env.EMAIL_HOST || 'smtp.gmail.com',
          port: process.env.EMAIL_PORT || '587',
          user: admin.smtp_email
        },
        commonIssues: [
          '1. Gmail App Password not configured (use App Password, not regular password)',
          '2. 2-Factor Authentication not enabled on Gmail account',
          '3. Less secure app access blocked (use App Password instead)',
          '4. SMTP credentials incorrect in database'
        ],
        howToFixGmail: [
          '1. Go to https://myaccount.google.com/security',
          '2. Enable 2-Factor Authentication',
          '3. Go to App Passwords',
          '4. Generate password for "Mail"',
          '5. Update admin profile with the 16-character password'
        ]
      });
    }

  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
