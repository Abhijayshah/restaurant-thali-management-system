import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { login, logout, me, register } from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/me", auth, me);

export default router;

