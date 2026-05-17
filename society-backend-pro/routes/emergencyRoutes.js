import express from "express";
import {
  raiseEmergency,
  respondEmergency,
  resolveEmergency,
  getEmergencies
} from "../controllers/emergencyController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Resident raises */

router.post("/", verifyToken(["RESIDENT"]), raiseEmergency);

/* Guard responds */

router.patch("/:id/respond", verifyToken(["GUARD"]), respondEmergency);

/* Admin/Guard resolves */

router.patch("/:id/resolve", verifyToken(["ADMIN", "GUARD"]), resolveEmergency);

/* View alerts */

router.get("/", verifyToken(["ADMIN", "GUARD", "RESIDENT"]), getEmergencies);

export default router;