import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const ensureDefaultStaffUsers = async () => {
  const definitions = [
    {
      role: "staff-manager-monthly",
      defaultName: "Monthly Manager",
      defaultPhone: "8888888881",
      defaultPassword: "manager123",
    },
    {
      role: "staff-manager-daily",
      defaultName: "Daily Manager",
      defaultPhone: "8888888882",
      defaultPassword: "manager123",
    },
    {
      role: "staff-worker",
      defaultName: "Staff Worker",
      defaultPhone: "7777777777",
      defaultPassword: "staff123",
    },
  ];

  const createdUsers = [];

  for (const definition of definitions) {
    const existingByRole = await User.findOne({ role: definition.role });
    if (existingByRole) {
      createdUsers.push(existingByRole);
      continue;
    }

    const nameEnvKey = `DEFAULT_${definition.role
      .toUpperCase()
      .replace(/-/g, "_")}_NAME`;
    const phoneEnvKey = `DEFAULT_${definition.role
      .toUpperCase()
      .replace(/-/g, "_")}_PHONE`;
    const passwordEnvKey = `DEFAULT_${definition.role
      .toUpperCase()
      .replace(/-/g, "_")}_PASSWORD`;

    const name = process.env[nameEnvKey] || definition.defaultName;
    const phone = process.env[phoneEnvKey] || definition.defaultPhone;
    const password =
      process.env[passwordEnvKey] || definition.defaultPassword;

    const existingByPhone = await User.findOne({ phone });
    if (existingByPhone) {
      createdUsers.push(existingByPhone);
      continue;
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phone,
      password: hashed,
      role: definition.role,
      status: "active",
    });

    createdUsers.push(user);
  }

  return createdUsers;
};

