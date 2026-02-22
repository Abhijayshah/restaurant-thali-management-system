import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    thaliPricePerShift: { type: Number, required: true },
    dailyThaliPrice: { type: Number, required: true },
    maxThalisPerMonth: { type: Number, required: true },
    maxThalisPerDay: { type: Number, default: 2 },
    qrCode: { type: String },
    upiId: { type: String },
    restaurantName: { type: String },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;

