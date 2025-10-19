import Admin from '../backend/src/models/admin.js';

export default async function handler(req, res) {
  try {
    // Get admin from database
    const admin = await Admin.findOne({ 
      where: { role: 'super-admin' },
      attributes: ['email', 'smtp_email', 'smtp_password']
    });
    
    res.json({
      status: 'Email Configuration Status',
      database: {
        admin_email: admin?.email || 'not set',
        smtp_email: admin?.smtp_email || 'not set',
        smtp_password_set: !!admin?.smtp_password
      },
      environment: {
        EMAIL_USER: process.env.EMAIL_USER ? 'set' : 'not set',
        EMAIL_PASS: process.env.EMAIL_PASS ? 'set' : 'not set',
        EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com (default)',
        EMAIL_PORT: process.env.EMAIL_PORT || '587 (default)',
        ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'not set'
      },
      note: 'Email will be sent if SMTP credentials are configured in database or environment variables'
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      note: 'Could not check email configuration'
    });
  }
}
