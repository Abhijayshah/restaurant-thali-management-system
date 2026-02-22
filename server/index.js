import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/db.js";
import { ensureDefaultSettings } from "./config/seedSettings.js";
import { ensureDefaultOwner } from "./config/seedOwner.js";
import { ensureDefaultStaffUsers } from "./config/seedStaff.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import subscriptionRoutes from "./routes/subscriptions.js";
import attendanceRoutes from "./routes/attendance.js";
import menuRoutes from "./routes/menu.js";
import extrasRoutes from "./routes/extras.js";
import reportsRoutes from "./routes/reports.js";
import settingsRoutes from "./routes/settings.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/extras", extrasRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/settings", settingsRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = 4000;

const start = async () => {
  try {
    await connectDB();
    await ensureDefaultSettings();
    await ensureDefaultOwner();
    await ensureDefaultStaffUsers();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed", error);
    process.exit(1);
  }
};

start();
