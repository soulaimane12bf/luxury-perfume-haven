import Admin from './src/models/admin.js';
import sequelize from './src/config/database.js';

const updateSMTP = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    const [admin, created] = await Admin.findOrCreate({
      where: { role: 'super-admin' },
      defaults: {
        email: 'marwanlachhab2002@gmail.com',
        phone: '212600000000',
        smtp_email: 'marwanlachhab2002@gmail.com',
        smtp_password: 'fhpiszqxysllulxw',
        role: 'super-admin'
      }
    });

    if (!created) {
      await admin.update({
        email: 'marwanlachhab2002@gmail.com',
        smtp_email: 'marwanlachhab2002@gmail.com',
        smtp_password: 'fhpiszqxysllulxw'
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
