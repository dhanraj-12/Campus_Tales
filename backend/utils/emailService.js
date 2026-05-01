const nodemailer = require("nodemailer");

/**
 * Sends an email using SMTP configurations from environment variables.
 * Required .env variables:
 * SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL
 */
const sendEmail = async (options) => {
  // Check if nodemailer is available (might not be installed due to permissions)
  let transporter;
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } catch (error) {
    console.error("Nodemailer not initialized. Ensure it is installed and configured.");
    return;
  }

  const message = {
    from: `${process.env.FROM_NAME || "Campus Connect"} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(message);
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Email send failed:", error.message);
  }
};

module.exports = sendEmail;
