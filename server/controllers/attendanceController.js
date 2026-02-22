import Attendance from "../models/Attendance.js";
import Settings from "../models/Settings.js";
import Subscription from "../models/Subscription.js";

export const createAttendance = async (req, res, next) => {
  try {
    const { userId, customerType, date, shift, isThali, items } = req.body;

    if (!userId || !customerType || !date || !shift) {
      return res.status(400).json({
        message: "userId, customerType, date and shift are required",
      });
    }

    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(500).json({ message: "Settings not configured" });
    }

    const attendanceDate = new Date(date);

    if (customerType === "monthly" && isThali) {
      const monthKey = `${attendanceDate.getFullYear()}-${String(
        attendanceDate.getMonth() + 1
      ).padStart(2, "0")}`;

      const subscription = await Subscription.findOne({
        userId,
        month: monthKey,
      });

      if (!subscription) {
        return res
          .status(400)
          .json({ message: "Active subscription not found for this month" });
      }

      if (!subscription.shifts.includes(shift)) {
        return res.status(400).json({
          message: "Subscription does not include this shift",
        });
      }

      const used = subscription.thalisUsed[shift] || 0;
      const allowed = subscription.thalisAllowed[shift] || 0;

      if (used >= allowed) {
        return res
          .status(400)
          .json({ message: "No remaining thali allowance for this shift" });
      }

      subscription.thalisUsed[shift] = used + 1;
      await subscription.save();
    }

    if (customerType === "daily" && isThali) {
      const start = new Date(
        attendanceDate.getFullYear(),
        attendanceDate.getMonth(),
        attendanceDate.getDate()
      );
      const end = new Date(
        attendanceDate.getFullYear(),
        attendanceDate.getMonth(),
        attendanceDate.getDate(),
        23,
        59,
        59,
        999
      );

      const thaliCountForDay = await Attendance.countDocuments({
        userId,
        customerType: "daily",
        isThali: true,
        date: { $gte: start, $lte: end },
      });

      if (thaliCountForDay >= settings.maxThalisPerDay) {
        return res.status(400).json({
          message: "Daily thali limit reached for this customer",
        });
      }
    }

    let totalCost = 0;

    if (customerType === "daily") {
      if (isThali) {
        totalCost += settings.dailyThaliPrice;
      }

      if (Array.isArray(items)) {
        totalCost += items.reduce((sum, item) => {
          const quantity = typeof item.quantity === "number" ? item.quantity : 0;
          const price = typeof item.price === "number" ? item.price : 0;
          return sum + quantity * price;
        }, 0);
      }
    }

    const record = await Attendance.create({
      ...req.body,
      date: attendanceDate,
      totalCost,
    });

    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

export const listAttendance = async (req, res, next) => {
  try {
    const { userId, month, shift } = req.query;
    const filter = {};
    if (userId) {
      filter.userId = userId;
    }
    if (shift) {
      filter.shift = shift;
    }
    if (month) {
      const [year, m] = month.split("-");
      const start = new Date(Number(year), Number(m) - 1, 1);
      const end = new Date(Number(year), Number(m), 0, 23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }
    const records = await Attendance.find(filter);
    res.json(records);
  } catch (error) {
    next(error);
  }
};

export const updateAttendance = async (req, res, next) => {
  try {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!record) {
      return res.status(404).json({ message: "Attendance not found" });
    }
    res.json(record);
  } catch (error) {
    next(error);
  }
};

export const deleteAttendance = async (req, res, next) => {
  try {
    const record = await Attendance.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Attendance not found" });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
