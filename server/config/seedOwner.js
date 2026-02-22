import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const ensureDefaultOwner = async () => {
  const existingOwner = await User.findOne({ role: "shop-owner" });
  if (existingOwner) {
    return existingOwner;
  }

  const name = process.env.DEFAULT_OWNER_NAME || "Owner";
  const phone = process.env.DEFAULT_OWNER_PHONE || "9999999999";
  const password = process.env.DEFAULT_OWNER_PASSWORD || "owner123";

  const existingByPhone = await User.findOne({ phone });
  if (existingByPhone) {
    return existingByPhone;
  }

  const hashed = await bcrypt.hash(password, 10);

  const owner = await User.create({
    name,
    phone,
    password: hashed,
    role: "shop-owner",
    status: "active",
  });

  return owner;
};

