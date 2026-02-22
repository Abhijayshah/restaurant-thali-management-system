import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { requireRoles } from "../middleware/roleCheck.js";
import {
  createAttendance,
  deleteAttendance,
  listAttendance,
  updateAttendance,
} from "../controllers/attendanceController.js";

const router = Router();

router.use(auth);

router.post(
  "/",
  requireRoles(
    "staff-manager-monthly",
    "staff-manager-daily",
    "staff-worker",
    "shop-owner"
  ),
  createAttendance
);

router.get("/", listAttendance);

router.put("/:id", updateAttendance);
router.delete("/:id", requireRoles("shop-owner", "staff-manager-monthly", "staff-manager-daily"), deleteAttendance);

export default router;

