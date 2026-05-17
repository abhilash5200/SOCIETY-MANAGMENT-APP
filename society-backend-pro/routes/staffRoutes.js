import express from "express";
import {
  createStaff,
  getAllStaff
} from "../controllers/staffController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Admin only */

router.post("/", verifyToken(["ADMIN"]), createStaff);
router.get("/", verifyToken(["ADMIN"]), getAllStaff);

export default router;