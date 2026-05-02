import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  try {

    console.log("=== EMAIL DEBUG ===");
    console.log("Sending to:", options.email);
    console.log("From:", process.env.EMAIL_USER);
    console.log("Pass length:", process.env.EMAIL_PASS?.replace(/\s+/g, '').length);
    console.log("==================");
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : '',
      },
      connectionTimeout: 10000,
      socketTimeout: 10000,
    });

    await transporter.verify();
    console.log("✅ SMTP connection verified");

    const message = {
      from: `${process.env.FROM_NAME || 'Portfolio'} <${process.env.EMAIL_USER}>`,
      to: options.email,
      replyTo: options.replyTo,
      subject: options.subject,
      text: options.message,
      html: options.html || `<p>${options.message}</p>`,
    };

    const info = await transporter.sendMail(message);
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;