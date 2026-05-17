import express from "express";
import {
  createComplaint,
  assignComplaint,
  resolveComplaint,
  closeComplaint,
  getComplaints
} from "../controllers/complaintController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Resident raises */

router.post("/", verifyToken(["RESIDENT"]), createComplaint);

/* Admin assigns */

router.patch("/:id/assign", verifyToken(["ADMIN"]), assignComplaint);

/* Staff resolves */

router.patch("/:id/resolve", verifyToken(["STAFF"]), resolveComplaint);

/* Admin closes */

router.patch("/:id/close", verifyToken(["ADMIN"]), closeComplaint);

/* View complaints */

router.get("/", verifyToken(["ADMIN", "RESIDENT", "STAFF"]), getComplaints);

export default router;