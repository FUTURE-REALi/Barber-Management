import mongoose, { Schema } from "mongoose";

const campaignSchema = new Schema({
  store: { type: Schema.Types.ObjectId, ref: "Store", required: true },
  service: { type: String, required: true },
  budget: { type: Number, required: true },
  duration: { type: Number, required: true }, // in days
  paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign;