import express from "express";
import {
  createFacility,
  getFacilities,
  bookFacility,
  cancelBooking,
  getBookings
} from "../controllers/facilityController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Admin */

router.post("/", verifyToken(["ADMIN"]), createFacility);

/* Everyone */

router.get("/", verifyToken(["ADMIN", "RESIDENT", "GUARD"]), getFacilities);

/* Resident booking */

router.post("/book", verifyToken(["RESIDENT"]), bookFacility);
router.patch("/cancel/:id", verifyToken(["RESIDENT"]), cancelBooking);

/* View bookings */

router.get("/bookings", verifyToken(["ADMIN", "RESIDENT"]), getBookings);

export default router;