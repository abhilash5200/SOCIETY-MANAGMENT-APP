import express from "express";
import {
  addVisitor,
  approveVisitor,
  rejectVisitor,
  allowEntry,
  checkoutVisitor,
  getVisitors
} from "../controllers/visitorController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Guard logs request */

router.post("/", verifyToken(["GUARD"]), addVisitor);

/* Resident decision */

router.patch("/:id/approve", verifyToken(["RESIDENT"]), approveVisitor);
router.patch("/:id/reject", verifyToken(["RESIDENT"]), rejectVisitor);

/* Guard actions */

router.patch("/:id/entry", verifyToken(["GUARD"]), allowEntry);
router.patch("/:id/checkout", verifyToken(["GUARD"]), checkoutVisitor);

/* Viewing */

router.get("/", verifyToken(["ADMIN", "RESIDENT", "GUARD"]), getVisitors);

export default router;