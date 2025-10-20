import Admin from './src/models/admin.js';
import sequelize from './src/config/database.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const updateSMTP = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Get credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    const smtpEmail = process.env.EMAIL_USER;
    const smtpPassword = process.env.EMAIL_PASS;

    if (!adminEmail || !smtpEmail || !smtpPassword) {
      console.error('❌ Error: Missing required environment variables');
      console.error('   Please set: ADMIN_EMAIL (or EMAIL_USER), EMAIL_USER, EMAIL_PASS');
      process.exit(1);
    }

    const [admin, created] = await Admin.findOrCreate({
      where: { role: 'super-admin' },
      defaults: {
        email: adminEmail,
        phone: process.env.ADMIN_WHATSAPP || '212600000000',
        smtp_email: smtpEmail,
        smtp_password: smtpPassword,
        role: 'super-admin'
      }
    });

    if (!created) {
      await admin.update({
        email: adminEmail,
        smtp_email: smtpEmail,
        smtp_password: smtpPassword
      });
      console.log('✅ Admin SMTP credentials updated!');
    } else {
      console.log('✅ Admin created with SMTP credentials!');
    }

    console.log('\n📧 Email Configuration:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   SMTP Email: ${admin.smtp_email}`);
    console.log(`   SMTP Password: ${admin.smtp_password ? '✓ Set' : '✗ Not set'}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

updateSMTP();

