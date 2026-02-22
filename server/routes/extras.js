import { Router } from "express";
import { auth } from "../middleware/auth.js";
import {
  createExtras,
  getExtrasBySubscription,
  getExtrasByUser,
} from "../controllers/extrasController.js";

const router = Router();

router.use(auth);

router.post("/", createExtras);
router.get("/:userId", getExtrasByUser);
router.get("/subscription/:subscriptionId", getExtrasBySubscription);

export default router;

