import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { requireRoles } from "../middleware/roleCheck.js";
import {
  createSubscription,
  getSubscriptionsByUser,
  listSubscriptions,
  markSubscriptionPaid,
  updateSubscription,
} from "../controllers/subscriptionController.js";

const router = Router();

router.use(auth);

router.post(
  "/",
  requireRoles("staff-manager-monthly", "shop-owner"),
  createSubscription
);

router.get(
  "/",
  requireRoles("shop-owner", "staff-manager-monthly"),
  listSubscriptions
);

router.get("/:userId", getSubscriptionsByUser);
router.put("/:id/pay", markSubscriptionPaid);
router.put("/:id", updateSubscription);

export default router;

