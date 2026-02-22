import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { requireRoles } from "../middleware/roleCheck.js";
import {
  getCustomerReport,
  getDailyReport,
  getMonthlyReport,
  getSummaryReport,
} from "../controllers/reportsController.js";

const router = Router();

router.use(auth);
router.use(requireRoles("shop-owner", "staff-manager-monthly", "staff-manager-daily"));

router.get("/daily", getDailyReport);
router.get("/monthly", getMonthlyReport);
router.get("/summary", getSummaryReport);
router.get("/customer/:id", getCustomerReport);

export default router;

