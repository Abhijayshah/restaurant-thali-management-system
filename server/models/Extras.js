import mongoose from "mongoose";

const extraItemSchema = new mongoose.Schema(
  {
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
    name: { type: String, required: true },
    qty: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const extrasSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },
    date: { type: Date, required: true },
    shift: { type: String, enum: ["morning", "evening", "night"], required: true },
    items: [extraItemSchema],
    totalExtra: { type: Number, required: true },
    paid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Extras = mongoose.model("Extras", extrasSchema);

export default Extras;

