import express from "express";

import {
  createSlot,
  assignSlot,
  registerVehicle,
  getVehicles,
  getSlots
} from "../controllers/parkingController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= ADMIN ================= */

router.post(
  "/slots",
  verifyToken(["ADMIN"]),
  createSlot
);

router.patch(
  "/slots/:id/assign",
  verifyToken(["ADMIN"]),
  assignSlot
);

/* ================= RESIDENT ================= */

router.post(
  "/vehicles",
  verifyToken(["RESIDENT"]),
  registerVehicle
);

/* ================= GET MY VEHICLES ================= */

router.get(
  "/vehicles",
  verifyToken(["RESIDENT"]),
  getVehicles
);

/* ================= VIEW SLOTS ================= */

router.get(
  "/slots",
  verifyToken([
    "ADMIN",
    "GUARD",
    "RESIDENT"
  ]),
  getSlots
);

export default router;