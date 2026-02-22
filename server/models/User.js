import mongoose from "mongoose";

const roles = [
  "shop-owner",
  "staff-manager-monthly",
  "staff-manager-daily",
  "staff-worker",
  "customer-monthly",
  "customer-daily",
];

const customerTypes = ["monthly", "daily"];

const statuses = ["pending", "approved", "rejected", "active", "inactive"];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: roles, required: true },
    customerType: { type: String, enum: customerTypes, default: null },
    status: { type: String, enum: statuses, default: "pending" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

