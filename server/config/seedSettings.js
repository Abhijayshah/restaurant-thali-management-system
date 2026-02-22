import Settings from "../models/Settings.js";

export const ensureDefaultSettings = async () => {
  const existing = await Settings.findOne();
  if (existing) {
    return existing;
  }

  const settings = await Settings.create({
    thaliPricePerShift: 1750,
    dailyThaliPrice: 70,
    maxThalisPerMonth: 60,
    maxThalisPerDay: 2,
  });

  return settings;
};

