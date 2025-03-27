import { Response, Request } from "express";
import { sendEmail } from "../helpers/mailer";
import { isValidEmail } from "../helpers/validation";
import User from "../models/User";
import crypto from "crypto";
import { AuthRequest } from "../Types/Types";

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

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      res.status(400).json({ error: "Invalid or expired token" });
      return;
    }

    await user.updateOne({
      $set: { verified: true },
      $unset: { verificationToken: "" },
    });

    res
      .status(200)
      .json({ message: "Email verified successfully. You can now log in!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const resendVerificationEmail = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email is required." });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    if (user.verified) {
      res.status(400).json({ error: "Email already verified." });
      return;
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    await user.save();

    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    const emailHtml = `
      <h2>Email Verification</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationLink}">Verify Email</a>
    `;

    await sendEmail(user.email, "Verify Your Email", emailHtml);
    res.status(200).json({ message: "Verification email sent successfully." });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};
export default contact;
