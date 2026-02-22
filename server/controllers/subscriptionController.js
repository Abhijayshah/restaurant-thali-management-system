import Subscription from "../models/Subscription.js";
import Settings from "../models/Settings.js";

export const createSubscription = async (req, res, next) => {
  try {
    const { userId, month, shifts } = req.body;

    if (!userId || !month || !Array.isArray(shifts) || shifts.length === 0) {
      return res.status(400).json({ message: "userId, month and shifts are required" });
    }

    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(500).json({ message: "Settings not configured" });
    }

    const uniqueShifts = Array.from(new Set(shifts));

    const thalisAllowed = {
      morning: uniqueShifts.includes("morning") ? settings.maxThalisPerMonth : 0,
      evening: uniqueShifts.includes("evening") ? settings.maxThalisPerMonth : 0,
      night: uniqueShifts.includes("night") ? settings.maxThalisPerMonth : 0,
    };

    const totalAmount = settings.thaliPricePerShift * uniqueShifts.length;

    const [yearString, monthString] = month.split("-");
    const year = Number(yearString);
    const monthIndex = Number(monthString) - 1;

    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

    const subscription = await Subscription.create({
      userId,
      month,
      shifts: uniqueShifts,
      totalAmount,
      amountPaid: 0,
      paymentStatus: "pending",
      thalisAllowed,
      startDate,
      endDate,
    });

    res.status(201).json(subscription);
  } catch (error) {
    next(error);
  }
};

export const listSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionsByUser = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.params.userId });
    res.json(subscriptions);
  } catch (error) {
    next(error);
  }
};

export const markSubscriptionPaid = async (req, res, next) => {
  try {
    const { amountPaid, paymentMethod, paymentRef, approvedByOwner } = req.body;

    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    const paidAmount = typeof amountPaid === "number" ? amountPaid : subscription.amountPaid;

    let paymentStatus = "pending";
    if (paidAmount >= subscription.totalAmount) {
      paymentStatus = "paid";
    } else if (paidAmount > 0) {
      paymentStatus = "partial";
    }

    subscription.amountPaid = paidAmount;
    subscription.paymentStatus = paymentStatus;

    if (paymentMethod) {
      subscription.paymentMethod = paymentMethod;
    }
    if (paymentRef) {
      subscription.paymentRef = paymentRef;
    }
    if (typeof approvedByOwner === "boolean") {
      subscription.approvedByOwner = approvedByOwner;
    }

    await subscription.save();

    res.json(subscription);
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.json(subscription);
  } catch (error) {
    next(error);
  }
};
