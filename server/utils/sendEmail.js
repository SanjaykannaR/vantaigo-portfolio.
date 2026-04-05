const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // If SMTP is not configured, just log the email to the console!
  // This is highly useful for local development before the user configures their Gmail/SendGrid.
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.log('\n=== ⚠️ MOCK EMAIL SYSTEM ===');
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message:\n${options.message}`);
    console.log('=============================\n');
    return;
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Define email options
  const message = {
    from: `${process.env.FROM_NAME || 'Vantaigo Admin'} <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // Add html: options.html if you want fancy emails later
  };

  // Send email
  await transporter.sendMail(message);
};

module.exports = sendEmail;
