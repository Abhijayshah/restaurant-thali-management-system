import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const createToken = (id, role) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRE || "7d";

  return jwt.sign({ id, role }, secret, { expiresIn });
};

export const register = async (req, res, next) => {
  try {
    const { name, phone, email, password, role, customerType } = req.body;

    if (!name || !phone || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(400).json({ message: "Phone already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phone,
      email,
      password: hashed,
      role,
      customerType: customerType || null,
    });

    const token = createToken(user._id, user.role);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        customerType: user.customerType,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password required" });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createToken(user._id, user.role);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        customerType: user.customerType,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res) => {
  res.json({ user: req.user });
};

export const logout = async (req, res) => {
  res.json({ message: "Logged out" });
};

