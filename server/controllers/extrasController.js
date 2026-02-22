import Extras from "../models/Extras.js";

export const createExtras = async (req, res, next) => {
  try {
    const { items } = req.body;

    let totalExtra = 0;

    if (Array.isArray(items)) {
      totalExtra = items.reduce((sum, item) => {
        const qty = typeof item.qty === "number" ? item.qty : 0;
        const price = typeof item.price === "number" ? item.price : 0;
        return sum + qty * price;
      }, 0);
    }

    const extras = await Extras.create({
      ...req.body,
      totalExtra,
    });
    res.status(201).json(extras);
  } catch (error) {
    next(error);
  }
};

export const getExtrasByUser = async (req, res, next) => {
  try {
    const items = await Extras.find({ userId: req.params.userId });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const getExtrasBySubscription = async (req, res, next) => {
  try {
    const items = await Extras.find({ subscriptionId: req.params.subscriptionId });
    res.json(items);
  } catch (error) {
    next(error);
  }
};
