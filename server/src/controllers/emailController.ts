import { Response, Request } from "express";
import { sendEmail } from "../helpers/mailer";
import { isValidEmail } from "../helpers/validation";
import dotenv from "dotenv";

dotenv.config();

export const contact = async (req: Request, res: Response) => {
  const { fullname, email, message } = req.body;
  if (!fullname || !email || !message) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }
  if (!isValidEmail(email)) {
    res.status(400).json({ error: "Invalid Email Format" });
    return;
  }

  try {
    await sendEmail(
      process.env.SMTP_GMAIL_ACC
        ? process.env.SMTP_GMAIL_ACC
        : "pawtopia21@gmail.com",
      "Contact Form Submission",
      `<h1>New Message from ${fullname}</h1>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>`,
      email
    );
    res.json({ success: "Message sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email." });
  }
};
export default contact;
