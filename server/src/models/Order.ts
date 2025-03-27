import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true }, // Store product details at the time of order
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    date: { type: String, default: new Date().toLocaleDateString() },
    order_id: String,
    payment_id: String,
    total_amount: String,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
