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
  replyTo?: string // Marked as optional with "?"
) => {
  try {
    const mailOptions: any = {
      from: `"Pawtopia" <${process.env.SMTP_GMAIL_ACC}>`,
      to,
      subject,
      html,
      ...(replyTo && { replyTo }),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};
