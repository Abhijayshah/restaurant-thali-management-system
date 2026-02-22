import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { requireRoles } from "../middleware/roleCheck.js";
import {
  createMenuItem,
  deleteMenuItem,
  listMenu,
  updateMenuItem,
} from "../controllers/menuController.js";

const router = Router();

router.get("/", listMenu);

router.use(auth);

router.post(
  "/",
  requireRoles("shop-owner", "staff-manager-monthly", "staff-manager-daily"),
  createMenuItem
);

router.put("/:id", requireRoles("shop-owner", "staff-manager-monthly"), updateMenuItem);
router.delete("/:id", requireRoles("shop-owner", "staff-manager-monthly"), deleteMenuItem);

export default router;

