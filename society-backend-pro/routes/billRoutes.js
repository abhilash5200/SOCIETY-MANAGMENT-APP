import express from "express";
import {
  createBill,
  payBill,
  getBills
} from "../controllers/billController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Admin creates bill */

router.post("/", verifyToken(["ADMIN"]), createBill);

/* Resident pays bill */

router.patch("/:id/pay", verifyToken(["RESIDENT"]), payBill);

/* Role-based viewing */

router.get("/", verifyToken(["ADMIN", "RESIDENT"]), getBills);

export default router;