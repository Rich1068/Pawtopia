import { Request, Response } from "express";
import Order from "../models/Order";
import Product from "../models/Product";
import AdoptRequest from "../models/AdoptRequest";

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalAdoptions = await AdoptRequest.countDocuments({
      status: "approved",
    });
    const totalPendingAdoptions = await AdoptRequest.countDocuments({
      status: "pending",
    });
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    res.json({
      totalProducts,
      totalOrders,
      totalAdoptions,
      totalPendingAdoptions,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};

export const getAdoptionsPerMonth = async (req: Request, res: Response) => {
  try {
    const adoptions = await AdoptRequest.aggregate([
      { $match: { status: "approved" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(adoptions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching adoption stats" });
  }
};

export const getLatestPendingRequest = async (req: Request, res: Response) => {
  try {
    const latestPendingRequests = await AdoptRequest.find({
      status: "pending",
    }).sort({ createdAt: -1 });

    res.json(latestPendingRequests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching adoption stats" });
  }
};
