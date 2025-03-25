import { Request, Response } from "express";
import { isValidEmail } from "./validation";
import { isValidPhoneNumber } from "./validation";

export const validateAdoptionRequest = (
  req: Request,
  res: Response
): boolean => {
  const {
    petId,
    petName,
    name,
    email,
    phone,
    address,
    livingSituation,
    experience,
    reason,
  } = req.body;

  if (
    !petId ||
    !petName ||
    !name ||
    !email ||
    !phone ||
    !address ||
    !livingSituation ||
    !experience ||
    !reason
  ) {
    res.status(400).json({ error: "All fields are required" });
    return false;
  }

  if (!isValidEmail(email)) {
    res.status(400).json({ error: "Invalid email format" });
    return false;
  }

  if (!isValidPhoneNumber(phone)) {
    res.status(400).json({ error: "Invalid phone number format" });
    return false;
  }

  if (reason.length < 10) {
    res.status(400).json({ error: "Reason must be at least 10 characters" });
    return false;
  }

  return true;
};

export default validateAdoptionRequest;
