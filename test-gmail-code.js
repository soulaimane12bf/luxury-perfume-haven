import nodemailer from 'nodemailer';

// Test Gmail with the provided verification code
const testGmailCode = async () => {
  console.log('🔍 Testing Gmail with verification code...\n');
  
  // The verification code provided
  const verificationCode = 'fhpi szqx ysll ulxw';
  
  // Gmail account (you need to specify this)
  const gmailAccount = process.env.EMAIL_USER || 'your-email@gmail.com';
  
  console.log(`📧 Gmail Account: ${gmailAccount}`);
  console.log(`🔑 Verification Code: ${verificationCode}\n`);
  
  try {
    // Create transporter with the verification code
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: gmailAccount,
        pass: verificationCode.replace(/\s/g, ''), // Remove spaces
      },
    });

    // Verify connection
    console.log('🔄 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!\n');

    // Send test email
    console.log('📨 Sending test email...');
    const info = await transporter.sendMail({
      from: gmailAccount,
      to: gmailAccount, // Send to yourself
      subject: '✅ Gmail Verification Code Test - Success!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #d4af37; text-align: center;">🎉 Email Test Successful!</h2>
          <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d4af37;">
            <p><strong>✓ SMTP Connection:</strong> Verified</p>
            <p><strong>✓ Authentication:</strong> Successful</p>
            <p><strong>✓ Email Sending:</strong> Working</p>
            <p><strong>📧 From:</strong> ${gmailAccount}</p>
            <p><strong>🔑 Code Used:</strong> ${verificationCode}</p>
          </div>
          <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <h3 style="color: #2e7d32; margin-top: 0;">✅ Your Gmail is now ready!</h3>
            <p>You can now use this email configuration for your Luxury Perfume Haven store to send order notifications.</p>
          </div>
          <p style="text-align: center; color: #666; margin-top: 20px; font-size: 12px;">
            Test Date: ${new Date().toLocaleString()}<br>
            Luxury Perfume Haven - Email System Test
          </p>
        </div>
      `,
    });

    console.log('✅ Test email sent successfully!');
    console.log(`📬 Message ID: ${info.messageId}\n`);
    
    console.log('🎉 SUCCESS! Your Gmail verification code works!\n');
    console.log('📝 Next Steps:');
    console.log('1. Check your inbox for the test email');
    console.log('2. Update your admin profile with these credentials');
    console.log('3. Start receiving order notifications!\n');
    
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('1. Make sure 2-Step Verification is enabled on your Gmail');
    console.error('2. This code should be an App Password (not your regular password)');
    console.error('3. Remove any spaces from the code when using it');
    console.error('4. App Passwords are found at: https://myaccount.google.com/apppasswords\n');
    return false;
  }
};

// Run the test
testGmailCode().then(success => {
  process.exit(success ? 0 : 1);
});
