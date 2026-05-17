import express from "express";
import {
  updateProfile,
  getResidents
} from "../controllers/profileController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Update own profile */

router.patch("/", verifyToken(["ADMIN", "RESIDENT", "STAFF", "GUARD"]), updateProfile);

/* Directory */

router.get("/residents", verifyToken(["ADMIN", "RESIDENT"]), getResidents);

export default router;