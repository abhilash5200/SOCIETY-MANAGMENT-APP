import express from "express";
import { assignResident } from "../controllers/residentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getResidents } from "../controllers/residentController.js";

const router = express.Router();

/* Admin Only */

router.post("/assign", verifyToken(["ADMIN"]), assignResident);
router.get(
  "/",
  verifyToken(["ADMIN"]),
  getResidents
);

export default router;