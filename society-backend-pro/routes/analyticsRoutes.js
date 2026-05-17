import express from "express";
import { getDashboardStats } from "../controllers/analyticsController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Admin only */

router.get("/dashboard", verifyToken(["ADMIN"]), getDashboardStats);

export default router;