import express from "express";
import {
  // Facility Management
  createFacility,
  getFacilities,
  getAllFacilities,
  getFacilityById,
  updateFacility,
  toggleFacilityStatus,
  deleteFacility,
  // Slot Management
  addSlot,
  updateSlot,
  deleteSlot,
  // Booking Management
  bookFacility,
  processPayment,
  cancelBooking,
  completeBooking,
  // Booking Queries
  getBookings,
  getUpcomingBookings,
  getPastBookings,
  getCancelledBookings,
  // Availability
  checkSlotAvailability,
  // Analytics
  getAnalytics,
  getFacilityAnalytics
} from "../controllers/facilityController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==================== FACILITY LISTING ====================

/**
 * GET /facilities
 * Get all active facilities with availability stats
 * Access: ADMIN, RESIDENT, GUARD
 */
router.get("/", verifyToken(["ADMIN", "RESIDENT", "GUARD"]), getFacilities);

// ==================== FACILITY MANAGEMENT (ADMIN) ====================

/**
 * POST /facilities
 * Create new facility with slots
 * Access: ADMIN only
 */
router.post("/", verifyToken(["ADMIN"]), createFacility);

/**
 * GET /facilities/admin/all
 * Get all facilities including inactive (Admin view)
 * Access: ADMIN only
 */
router.get("/admin/all", verifyToken(["ADMIN"]), getAllFacilities);

/**
 * GET /facilities/admin/analytics
 * Get overall analytics dashboard
 * Access: ADMIN only
 */
router.get("/admin/analytics", verifyToken(["ADMIN"]), getAnalytics);

/**
 * GET /facilities/admin/analytics/:facilityId
 * Get facility-specific analytics
 * Access: ADMIN only
 */
router.get(
  "/admin/analytics/:facilityId",
  verifyToken(["ADMIN"]),
  getFacilityAnalytics
);

/**
 * GET /facilities/:id
 * Get single facility details with availability stats
 * Access: ADMIN, RESIDENT, GUARD
 */
router.get("/:id", verifyToken(["ADMIN", "RESIDENT", "GUARD"]), getFacilityById);

/**
 * PATCH /facilities/:id
 * Update facility details
 * Access: ADMIN only
 */
router.patch("/:id", verifyToken(["ADMIN"]), updateFacility);

/**
 * PATCH /facilities/:id/toggle
 * Toggle facility active/inactive status
 * Access: ADMIN only
 */
router.patch(
  "/:id/toggle",
  verifyToken(["ADMIN"]),
  toggleFacilityStatus
);

/**
 * DELETE /facilities/:id
 * Delete facility (admin only)
 * Access: ADMIN only
 */
router.delete("/:id", verifyToken(["ADMIN"]), deleteFacility);

// ==================== SLOT MANAGEMENT ====================

/**
 * POST /facilities/:facilityId/slots
 * Add slot to facility
 * Access: ADMIN only
 */
router.post(
  "/:facilityId/slots",
  verifyToken(["ADMIN"]),
  addSlot
);

/**
 * PATCH /facilities/:facilityId/slots/:slotId
 * Update slot details
 * Access: ADMIN only
 */
router.patch(
  "/:facilityId/slots/:slotId",
  verifyToken(["ADMIN"]),
  updateSlot
);

/**
 * DELETE /facilities/:facilityId/slots/:slotId
 * Delete slot from facility
 * Access: ADMIN only
 */
router.delete(
  "/:facilityId/slots/:slotId",
  verifyToken(["ADMIN"]),
  deleteSlot
);

// ==================== BOOKING MANAGEMENT ====================

/**
 * POST /facilities/bookings/create
 * Create new booking
 * Access: RESIDENT only
 */
router.post(
  "/bookings/create",
  verifyToken(["RESIDENT"]),
  bookFacility
);

/**
 * POST /facilities/bookings/:bookingId/payment
 * Process payment for booking (PAID facilities)
 * Access: RESIDENT (own booking) / ADMIN
 */
router.post(
  "/bookings/:bookingId/payment",
  verifyToken(["RESIDENT", "ADMIN"]),
  processPayment
);

/**
 * GET /facilities/bookings/availability
 * Check slot availability for date
 * Access: RESIDENT, ADMIN
 */
router.get(
  "/bookings/availability",
  verifyToken(["ADMIN", "RESIDENT"]),
  checkSlotAvailability
);

/**
 * GET /facilities/bookings/list
 * Get all bookings (ADMIN) or own bookings (RESIDENT)
 * Access: ADMIN, RESIDENT
 */
router.get(
  "/bookings/list",
  verifyToken(["ADMIN", "RESIDENT"]),
  getBookings
);

/**
 * GET /facilities/bookings/upcoming
 * Get upcoming bookings
 * Access: RESIDENT, ADMIN
 */
router.get(
  "/bookings/upcoming",
  verifyToken(["RESIDENT", "ADMIN"]),
  getUpcomingBookings
);

/**
 * GET /facilities/bookings/past
 * Get past bookings
 * Access: RESIDENT, ADMIN
 */
router.get(
  "/bookings/past",
  verifyToken(["RESIDENT", "ADMIN"]),
  getPastBookings
);

/**
 * GET /facilities/bookings/cancelled
 * Get cancelled bookings
 * Access: RESIDENT, ADMIN
 */
router.get(
  "/bookings/cancelled",
  verifyToken(["RESIDENT", "ADMIN"]),
  getCancelledBookings
);

/**
 * PATCH /facilities/bookings/:id/cancel
 * Cancel booking
 * Access: RESIDENT (own) / ADMIN (any)
 */
router.patch(
  "/bookings/:id/cancel",
  verifyToken(["RESIDENT", "ADMIN"]),
  cancelBooking
);

/**
 * PATCH /facilities/bookings/:id/complete
 * Mark booking as completed
 * Access: ADMIN only
 */
router.patch(
  "/bookings/:id/complete",
  verifyToken(["ADMIN"]),
  completeBooking
);

export default router;
