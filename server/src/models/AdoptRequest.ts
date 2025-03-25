import mongoose, { Schema, Document } from "mongoose";

const AdoptionRequestSchema = new Schema(
  {
    petId: { type: String, required: true },
    petName: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    livingSituation: { type: String, required: true },
    experience: { type: String, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("AdoptionRequest", AdoptionRequestSchema);
