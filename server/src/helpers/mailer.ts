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
  replyTo: string,
  subject: string,
  html: string
) => {
  try {
    await transporter.sendMail({
      from: `"Pawtopia" <${process.env.SMTP_GMAIL_ACC}>`,
      to,
      replyTo,
      subject,
      html,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};
