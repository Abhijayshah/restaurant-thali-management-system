import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { requireRoles } from "../middleware/roleCheck.js";
import { getSettings, updateSettings } from "../controllers/settingsController.js";

const router = Router();

router.get("/", getSettings);

router.put(
  "/",
  auth,
  requireRoles("shop-owner"),
  updateSettings
);

export default router;

