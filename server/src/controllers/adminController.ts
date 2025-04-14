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
    })
      .limit(5)
      .sort({ createdAt: -1 })
      .lean();

    res.json(latestPendingRequests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching adoption stats" });
  }
};

export const getEarningsPerMonth = async (req: Request, res: Response) => {
  try {
    const earnings = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(earnings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching earning stats" });
  }
};

export const getMostSoldProducts = async (req: Request, res: Response) => {
  try {
    const products = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.productId",
          totalSold: { $sum: "$products.quantity" },
          name: { $first: "$products.name" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 1,
          totalSold: 1,
          name: "$name",
        },
      },
    ]);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching most sold products" });
  }
};

export const getRecentOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email")
      .lean();

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recent orders" });
  }
};
