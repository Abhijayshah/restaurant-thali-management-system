import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { requireRoles } from "../middleware/roleCheck.js";
import {
  approveUser,
  createUser,
  deleteUser,
  getUser,
  listUsers,
  rejectUser,
  updateUser,
} from "../controllers/userController.js";

const router = Router();

router.use(auth);

router.get(
  "/",
  requireRoles("shop-owner", "staff-manager-monthly", "staff-manager-daily"),
  listUsers
);

router.post(
  "/",
  requireRoles("staff-manager-monthly", "staff-manager-daily"),
  createUser
);

router.get("/:id", getUser);
router.put("/:id", updateUser);

router.delete("/:id", requireRoles("shop-owner"), deleteUser);
router.put("/:id/approve", requireRoles("shop-owner"), approveUser);
router.put("/:id/reject", requireRoles("shop-owner"), rejectUser);

export default router;

