import express from "express";
import {
  addDelivery,
  approveDelivery,
  rejectDelivery,
  collectDelivery,
  getDeliveries
} from "../controllers/deliveryController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Guard logs delivery */

router.post("/", verifyToken(["GUARD"]), addDelivery);

/* Resident actions */

router.patch("/:id/approve", verifyToken(["RESIDENT"]), approveDelivery);
router.patch("/:id/reject", verifyToken(["RESIDENT"]), rejectDelivery);
router.patch("/:id/collect", verifyToken(["RESIDENT"]), collectDelivery);

/* View deliveries */

router.get("/", verifyToken(["ADMIN", "RESIDENT", "GUARD"]), getDeliveries);

export default router;