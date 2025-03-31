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
      mode,
      experience,
      reason,
      otherMode,
      otherLivingSituation,
    } = req.body;

    const existingRequest = await AdoptRequest.findOne({ petId, userId });
    if (existingRequest) {
      res.status(400).json({
        error: "You have already submitted an adoption request for this pet.",
      });
      return;
    }

    // Store the correct values: If "Other" was selected, save the provided text, otherwise save the selected value
    const finalMode = mode === "Other" ? otherMode : mode;
    const finalLivingSituation =
      livingSituation === "Other" ? otherLivingSituation : livingSituation;
    // Create new adoption request
    const newRequest = new AdoptRequest({
      petId,
      petName,
      userId,
      name,
      email,
      phone,
      address,
      livingSituation: finalLivingSituation,
      mode: finalMode,
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
      { $match: filter },
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

export const approveAdoptRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "No Request ID detected" });
      return;
    }
    const request = await AdoptRequest.findById(id);
    if (!request) {
      res.status(404).json({ error: "Adoption request not found" });
      return;
    }

    if (request.status === "approved") {
      res.status(400).json({ error: "Request is already approved" });
      return;
    }
    request.status = "approved";

    await request.save();
    res.status(200).json({ message: "Adoption request approved", request });
    return;
  } catch (error) {
    console.error("Error approving request:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export const rejectAdoptRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "No Request ID detected" });
      return;
    }

    const request = await AdoptRequest.findById(id);
    if (!request) {
      res.status(404).json({ error: "Adoption request not found" });
      return;
    }

    if (request.status === "rejected") {
      res.status(400).json({ error: "Request is already rejected" });
      return;
    }

    request.status = "rejected";
    await request.save();

    res.status(200).json({ message: "Adoption request rejected", request });
    return;
  } catch (error) {
    console.error("Error rejecting request:", error);
    res.status(500).json({ error: "Server error" });
    return;
  }
};

export const getAdoptHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(403).json({ error: "Please Login to see Order History" });
      return;
    }
    const requests = await AdoptRequest.find({ userId }).sort({
      createdAt: -1,
    });

    res.json(requests);
  } catch (error) {
    console.error("Failed to retrieve Adoption Request History: ", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve Adoption Request History" });
    return;
  }
};
