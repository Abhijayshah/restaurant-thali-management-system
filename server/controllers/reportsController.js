import Attendance from "../models/Attendance.js";
import Subscription from "../models/Subscription.js";

const getMonthRange = (month) => {
  if (!month) {
    return {};
  }
  const [year, m] = month.split("-");
  const start = new Date(Number(year), Number(m) - 1, 1);
  const end = new Date(Number(year), Number(m), 0, 23, 59, 59, 999);
  return { $gte: start, $lte: end };
};

export const getDailyReport = async (req, res, next) => {
  try {
    const { date } = req.query;
    const filter = {};
    if (date) {
      const selected = new Date(date);
      const start = new Date(
        selected.getFullYear(),
        selected.getMonth(),
        selected.getDate()
      );
      const end = new Date(
        selected.getFullYear(),
        selected.getMonth(),
        selected.getDate(),
        23,
        59,
        59,
        999
      );
      filter.date = { $gte: start, $lte: end };
    }
    const records = await Attendance.find(filter);
    const total = records.reduce((sum, r) => sum + (r.totalCost || 0), 0);
    res.json({ total, count: records.length });
  } catch (error) {
    next(error);
  }
};

export const getMonthlyReport = async (req, res, next) => {
  try {
    const { month } = req.query;
    const dateFilter = getMonthRange(month);
    const records = await Attendance.find(
      Object.keys(dateFilter).length ? { date: dateFilter } : {}
    );
    const total = records.reduce((sum, r) => sum + (r.totalCost || 0), 0);
    res.json({ total, count: records.length });
  } catch (error) {
    next(error);
  }
};

export const getSummaryReport = async (req, res, next) => {
  try {
    const { month } = req.query;
    const dateFilter = getMonthRange(month);

    const subscriptionFilter = {};
    if (month) {
      subscriptionFilter.month = month;
    }

    const subs = await Subscription.find(subscriptionFilter);
    const attendanceFilter = Object.keys(dateFilter).length
      ? { date: dateFilter }
      : {};
    const attendance = await Attendance.find(attendanceFilter);

    const monthlyCustomersTotal = subs.reduce(
      (sum, s) => sum + (s.amountPaid || 0),
      0
    );
    const dailyCustomersTotal = attendance.reduce(
      (sum, r) => sum + (r.totalCost || 0),
      0
    );
    const grandTotal = monthlyCustomersTotal + dailyCustomersTotal;

    res.json({
      monthlyCustomersTotal,
      dailyCustomersTotal,
      grandTotal,
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subs = await Subscription.find({ userId: id });
    const attendance = await Attendance.find({ userId: id });
    res.json({ subscriptions: subs, attendance });
  } catch (error) {
    next(error);
  }
};

