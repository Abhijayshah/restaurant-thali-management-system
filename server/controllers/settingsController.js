import Settings from "../models/Settings.js";

export const getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.findOne();
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      {},
      { ...req.body, updatedBy: req.user.id, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

