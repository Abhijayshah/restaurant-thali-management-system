import mongoose from "mongoose";

const attendanceItemSchema = new mongoose.Schema(
  {
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const attendanceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    customerType: { type: String, enum: ["monthly", "daily"], required: true },
    date: { type: Date, required: true },
    shift: { type: String, enum: ["morning", "evening", "night"], required: true },
    foodTaken: { type: Boolean, default: false },
    items: [attendanceItemSchema],
    isThali: { type: Boolean, default: false },
    totalCost: { type: Number, default: 0 },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    note: { type: String },
  },
  { timestamps: true }
);

attendanceSchema.index({ userId: 1, date: 1, shift: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;

