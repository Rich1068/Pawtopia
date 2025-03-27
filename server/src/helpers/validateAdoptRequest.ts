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
    mode,
    experience,
    reason,
    otherMode,
    otherLivingSituation,
  } = req.body;

  // Check for required fields
  if (
    !petId ||
    !petName ||
    !name ||
    !email ||
    !phone ||
    !address ||
    !livingSituation ||
    !mode ||
    !experience ||
    !reason
  ) {
    res.status(400).json({ error: "All fields are required" });
    return false;
  }

  // Email validation
  if (!isValidEmail(email)) {
    res.status(400).json({ error: "Invalid email format" });
    return false;
  }

  // Phone validation
  if (!isValidPhoneNumber(phone)) {
    res.status(400).json({ error: "Invalid phone number format" });
    return false;
  }

  // Reason length validation
  if (reason.length < 10) {
    res.status(400).json({ error: "Reason must be at least 10 characters" });
    return false;
  }

  // Validate "Other" fields when necessary
  if (mode === "Other" && !otherMode?.trim()) {
    res
      .status(400)
      .json({ error: "Please specify your mode of communication" });
    return false;
  }

  if (livingSituation === "Other" && !otherLivingSituation?.trim()) {
    res.status(400).json({ error: "Please specify your living situation" });
    return false;
  }

  return true;
};

export default validateAdoptionRequest;
