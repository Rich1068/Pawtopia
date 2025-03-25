import validateAdoptionRequest from "../helpers/validateAdoptRequest";
import AdoptRequest from "../models/AdoptRequest";
import { AuthRequest } from "../Types/Types";
import { Response, Request } from "express";

export const createAdoptRequest = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res
        .status(403)
        .json({ error: "Please login to submit an Adoption Request" });
      return;
    }
    if (!validateAdoptionRequest(req, res)) return;
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
    const newRequest = new AdoptRequest({
      petId,
      petName,
      userId,
      name,
      email,
      phone,
      address,
      livingSituation,
      experience,
      reason,
    });

    // Save request to database
    await newRequest.save();

    res
      .status(201)
      .json({ message: "Adoption request submitted successfully!" });
  } catch (error) {
    console.error("Error submitting adoption request:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

export const getAdoptRequests = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;

    let filter: Record<string, any> = {};
    if (status) {
      filter.status = status; // Apply status filter if provided
    }

    const requests = await AdoptRequest.aggregate([
      { $match: filter }, // ✅ Apply status filtering here
      {
        $addFields: {
          sortOrder: {
            $cond: { if: { $eq: ["$status", "pending"] }, then: 0, else: 1 },
          },
        },
      },
      { $sort: { sortOrder: 1, createdAt: -1 } },
      { $project: { sortOrder: 0 } },
    ]);

    res.json(requests);
  } catch (error) {
    console.error("Error fetching adoption requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};
