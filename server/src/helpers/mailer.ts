import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_GMAIL_ACC,
    pass: process.env.SMTP_GMAIL_PASS,
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  replyTo?: string
): Promise<void> => {
  try {
    const mailOptions: nodemailer.SendMailOptions = {
      from: `"Pawtopia" <${process.env.SMTP_GMAIL_ACC}>`,
      to,
      subject,
      html,
      ...(replyTo && { replyTo }),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};
