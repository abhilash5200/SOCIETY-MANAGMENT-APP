import express from "express";
import {
  createFacility,
  getFacilities,
  getAllFacilities,
  getFacilityById,
  updateFacility,
  toggleFacilityStatus,
  bookFacility,
  cancelBooking,
  getBookings,
  getUpcomingBookings,
  getPastBookings,
  getCancelledBookings,
  checkSlotAvailability,
  getBookingStats
} from "../controllers/facilityController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= FACILITY MANAGEMENT (ADMIN) ================= */

// Create facility
router.post("/", verifyToken(["ADMIN"]), createFacility);

// Get all facilities (admin - includes inactive)
router.get("/admin/all", verifyToken(["ADMIN"]), getAllFacilities);

// Get single facility
router.get("/:id", verifyToken(["ADMIN", "RESIDENT", "GUARD"]), getFacilityById);

// Update facility
router.patch("/:id", verifyToken(["ADMIN"]), updateFacility);

// Toggle facility status (enable/disable)
router.patch("/:id/toggle-status", verifyToken(["ADMIN"]), toggleFacilityStatus);

// Get booking stats
router.get("/admin/stats/bookings", verifyToken(["ADMIN"]), getBookingStats);

/* ================= FACILITY LISTING (PUBLIC) ================= */

// Get all active facilities
router.get("/", verifyToken(["ADMIN", "RESIDENT", "GUARD"]), getFacilities);

/* ================= BOOKING MANAGEMENT ================= */

// Book facility (resident)
router.post("/book/create", verifyToken(["RESIDENT"]), bookFacility);

// Check slot availability
router.get("/availability/check", verifyToken(["ADMIN", "RESIDENT"]), checkSlotAvailability);

/* ================= BOOKING OPERATIONS ================= */

// Cancel booking
router.patch("/booking/:id/cancel", verifyToken(["RESIDENT", "ADMIN"]), cancelBooking);

// Get all bookings (admin) or my bookings (resident)
router.get("/bookings/list", verifyToken(["ADMIN", "RESIDENT"]), getBookings);

// Get my upcoming bookings (resident)
router.get("/bookings/upcoming", verifyToken(["RESIDENT"]), getUpcomingBookings);

// Get my past bookings (resident)
router.get("/bookings/past", verifyToken(["RESIDENT"]), getPastBookings);

// Get my cancelled bookings (resident)
router.get("/bookings/cancelled", verifyToken(["RESIDENT"]), getCancelledBookings);

export default router;