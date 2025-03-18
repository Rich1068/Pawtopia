import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    date: { type: String, default: new Date().toLocaleDateString() },
    order_id: String,
    payment_id: String,
    total_amount: String,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
