import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: [
        "Thali",
        "Sabji",
        "Dal",
        "Rice",
        "Roti",
        "Snacks",
        "Beverages",
        "Extras",
        "Desserts",
      ],
      required: true,
    },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    available: { type: Boolean, default: true },
    shift: [{ type: String, enum: ["morning", "evening", "night"], required: true }],
    image: { type: String },
  },
  { timestamps: true }
);

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;

