import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    month: { type: String, required: true },
    shifts: [{ type: String, enum: ["morning", "evening", "night"], required: true }],
    totalAmount: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ["pending", "partial", "paid"], default: "pending" },
    paymentMethod: { type: String },
    paymentRef: { type: String },
    approvedByOwner: { type: Boolean, default: false },
    thalisAllowed: {
      morning: { type: Number, default: 0 },
      evening: { type: Number, default: 0 },
      night: { type: Number, default: 0 },
    },
    thalisUsed: {
      morning: { type: Number, default: 0 },
      evening: { type: Number, default: 0 },
      night: { type: Number, default: 0 },
    },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;

