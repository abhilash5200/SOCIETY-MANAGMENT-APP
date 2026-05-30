import Facility from "../models/Facility.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import {
  validateFacilityRequest,
  validateBookingRequest,
  validatePaymentData,
  hasActiveFreeBooking,
  formatCurrency,
  formatSlotTime
} from "../validators/bookingValidator.js";

// ==================== FACILITY MANAGEMENT ====================

/**
 * Create Facility (Admin Only)
 * Creates facility with name, description, location, capacity, booking type (FREE/PAID), price, and slots
 */
export const createFacility = async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      facilityType,
      capacity,
      bookingType,
      price,
      slots,
      amenities
    } = req.body;

    // Validation
    const { isValid, errors } = validateFacilityRequest({
      name,
      location,
      capacity,
      bookingType,
      price,
      slots
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    // Create facility
    const facility = await Facility.create({
      name: name.trim(),
      description: description?.trim() || "",
      location: location.trim(),
      facilityType: facilityType || "OTHER",
      capacity: parseInt(capacity),
      bookingType,
      price: bookingType === "PAID" ? parseInt(price) : 0,
      slots: slots || [],
      amenities: amenities || [],
      isActive: true,
      totalRevenue: 0
    });

    res.status(201).json({
      success: true,
      message: "Facility created successfully",
      data: facility
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * Get All Active Facilities (Residents/Public)
 * Shows available facilities with pricing and availability info
 */
export const getFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find({
      isActive: true
    }).sort({ createdAt: -1 });

    // Add availability statistics to each facility
    const facilitiesWithStats = await Promise.all(
      facilities.map(async (facility) => {
        const stats = await getSlotStats(facility._id);
        return {
          ...facility.toObject(),
          totalSlots: stats.totalSlots,
          bookedSlots: stats.bookedSlots,
          availableSlots: stats.availableSlots
        };
      })
    );

    res.status(200).json({
      success: true,
      count: facilitiesWithStats.length,
      data: facilitiesWithStats
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * Get All Facilities (Admin - includes inactive)
 */
export const getAllFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find().sort({ createdAt: -1 });

    // Add availability statistics to each facility
    const facilitiesWithStats = await Promise.all(
      facilities.map(async (facility) => {
        const stats = await getSlotStats(facility._id);
        return {
          ...facility.toObject(),
          totalSlots: stats.totalSlots,
          bookedSlots: stats.bookedSlots,
          availableSlots: stats.availableSlots
        };
      })
    );

    res.status(200).json({
      success: true,
      count: facilitiesWithStats.length,
      data: facilitiesWithStats
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * Get Single Facility by ID with detailed stats
 */
export const getFacilityById = async (req, res) => {
  try {
    const { id } = req.params;

    const facility = await Facility.findById(id);

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Facility not found"
      });
    }

    const stats = await getSlotStats(facility._id);

    res.status(200).json({
      success: true,
      data: {
        ...facility.toObject(),
        totalSlots: stats.totalSlots,
        bookedSlots: stats.bookedSlots,
        availableSlots: stats.availableSlots
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * Update Facility (Admin Only)
 */
export const updateFacility = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      location,
      facilityType,
      capacity,
      bookingType,
      price,
      amenities,
      isActive
    } = req.body;

    const facility = await Facility.findById(id);

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Facility not found"
      });
    }

    // Update fields if provided
    if (name?.trim()) facility.name = name.trim();
    if (description !== undefined) facility.description = description?.trim() || "";
    if (location?.trim()) facility.location = location.trim();
    if (facilityType) facility.facilityType = facilityType;
    if (capacity && capacity >= 1) facility.capacity = parseInt(capacity);
    if (bookingType) facility.bookingType = bookingType;
    if (bookingType === "PAID" && price && price > 0) {
      facility.price = parseInt(price);
    }
    if (amenities && Array.isArray(amenities)) facility.amenities = amenities;
    if (isActive !== undefined) facility.isActive = Boolean(isActive);

    await facility.save();

    const stats = await getSlotStats(facility._id);

    res.status(200).json({
      success: true,
      message: "Facility updated successfully",
      data: {
        ...facility.toObject(),
        totalSlots: stats.totalSlots,
        bookedSlots: stats.bookedSlots,
        availableSlots: stats.availableSlots
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * Toggle Facility Status (Enable/Disable)
 */
export const toggleFacilityStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const facility = await Facility.findById(id);

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Facility not found"
      });
    }

    facility.isActive = !facility.isActive;
    await facility.save();

    const stats = await getSlotStats(facility._id);

    res.status(200).json({
      success: true,
      message: `Facility ${facility.isActive ? "enabled" : "disabled"}`,
      data: {
        ...facility.toObject(),
        totalSlots: stats.totalSlots,
        bookedSlots: stats.bookedSlots,
        availableSlots: stats.availableSlots
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * Delete Facility (Admin Only)
 */
export const deleteFacility = async (req, res) => {
  try {
    const { id } = req.params;

    const facility = await Facility.findByIdAndDelete(id);

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Facility not found"
      });
    }

    // Delete related bookings
    await Booking.deleteMany({ facility: id });

    res.status(200).json({
      success: true,
      message: "Facility deleted successfully",
      data: facility
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ==================== SLOT MANAGEMENT ====================

/**
 * Add Slot to Facility (Admin Only)
 */
export const addSlot = async (req, res) => {
  try {
    const { facilityId } = req.params;
    const { startTime, endTime, capacity } = req.body;

    const facility = await Facility.findById(facilityId);

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Facility not found"
      });
    }

    if (!startTime || !endTime || !capacity) {
      return res.status(400).json({
        success: false,
        message: "Start time, end time, and capacity are required"
      });
    }

    if (capacity < 1) {
      return res.status(400).json({
        success: false,
        message: "Capacity must be at least 1"
      });
    }

    const slot = {
      startTime,
      endTime,
      capacity,
      isActive: true
    };

    facility.slots.push(slot);
    await facility.save();

    res.status(201).json({
      success: true,
      message: "Slot added successfully",
      data: facility
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * Update Slot (Admin Only)
 */
export const updateSlot = async (req, res) => {
  try {
    const { facilityId, slotId } = req.params;
    const { startTime, endTime, capacity, isActive } = req.body;

    const facility = await Facility.findById(facilityId);

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Facility not found"
      });
    }

    const slot = facility.slots.id(slotId);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found"
      });
    }

    if (startTime) slot.startTime = startTime;
    if (endTime) slot.endTime = endTime;
    if (capacity && capacity >= 1) slot.capacity = capacity;
    if (isActive !== undefined) slot.isActive = Boolean(isActive);

    await facility.save();

    res.status(200).json({
      success: true,
      message: "Slot updated successfully",
      data: facility
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * Delete Slot (Admin Only)
 */
export const deleteSlot = async (req, res) => {
  try {
    const { facilityId, slotId } = req.params;

    const facility = await Facility.findById(facilityId);

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Facility not found"
      });
    }

    const slot = facility.slots.id(slotId);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found"
      });
    }

    facility.slots.pull(slotId);
    await facility.save();

    res.status(200).json({
      success: true,
      message: "Slot deleted successfully",
      data: facility
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ==================== BOOKING MANAGEMENT ====================

/**
 * Book Facility (Resident Only)
 * 
 * Validation Rules:
 * 1. Facility must exist and be active
 * 2. Cannot book for past dates
 * 3. No duplicate time slot bookings (same facility, date, time)
 * 4. FREE facility: Resident can only have ONE active booking
 * 5. PAID facility: Multiple bookings allowed
 * 6. Capacity limits must not be exceeded
 * 7. For PAID facilities: Payment required
 */
export const bookFacility = async (req, res) => {
  try {
    const { facilityId, date, slotId, paymentMethod } = req.body;
    const userId = req.user.id;

    // Validation: Required fields
    if (!facilityId || !date || !slotId) {
      return res.status(400).json({
        success: false,
        message: "Facility ID, date, and slot ID are required"
      });
    }

    // Validation: Facility exists
    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Facility not found"
      });
    }

    // Validation: Facility is active
    if (!facility.isActive) {
      return res.status(400).json({
        success: false,
        message: "Facility unavailable"
      });
    }

    // Validation: Slot exists
    const slot = facility.slots.id(slotId);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found"
      });
    }

    // Validation: User exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Validation: Cannot book past dates
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    bookingDate.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: "Cannot book past dates"
      });
    }

    // Validation: No duplicate slot bookings
    const existingSlotBooking = await Booking.findOne({
      facility: facilityId,
      date: bookingDate,
      slotId,
      status: "CONFIRMED"
    });

    if (existingSlotBooking) {
      return res.status(400).json({
        success: false,
        message: "Slot already booked"
      });
    }

    // Validation: FREE Facility - only one active booking per resident
    if (facility.bookingType === "FREE") {
      const hasActive = await hasActiveFreeBooking(facilityId, userId, Booking);
      if (hasActive) {
        return res.status(400).json({
          success: false,
          message: "You already have an active booking for this facility"
        });
      }
    }

    // Validation: Capacity check
    const slotBookingCount = await Booking.countDocuments({
      facility: facilityId,
      date: bookingDate,
      slotId,
      status: "CONFIRMED"
    });

    if (slotBookingCount >= slot.capacity) {
      return res.status(400).json({
        success: false,
        message: "Slot capacity reached"
      });
    }

    // Create booking
    const bookingData = {
      facility: facilityId,
      flat: user.flat,
      bookedBy: userId,
      date: bookingDate,
      slotId,
      timeSlot: `${slot.startTime}-${slot.endTime}`,
      amount: facility.bookingType === "PAID" ? facility.price : 0,
      status: "CONFIRMED"
    };

    // For PAID facilities, set payment to PENDING until payment is processed
    if (facility.bookingType === "PAID") {
      bookingData.paymentStatus = "PENDING";
    } else {
      bookingData.paymentStatus = "PAID";
    }

    const booking = await Booking.create(bookingData);

    // Populate and return
    await booking.populate("facility", "name location bookingType price");
    await booking.populate("bookedBy", "name email");
    await booking.populate("flat", "flatNumber");

    res.status(201).json({
      success: true,
      message: facility.bookingType === "PAID" 
        ? "Booking created. Proceed to payment." 
        : "Facility booked successfully",
      data: booking
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * Process Payment for Booking (PAID facilities)
 */
export const processPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { paymentMethod, transactionId } = req.body;
    const userId = req.user.id;

    if (!paymentMethod || !transactionId) {
      return res.status(400).json({
        success: false,
        message: "Payment method and transaction ID are required"
      });
    }

    const booking = await Booking.findById(bookingId).populate("facility");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Authorization check
    if (booking.bookedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // Check if already paid
    if (booking.paymentStatus === "PAID") {
      return res.status(400).json({
        success: false,
        message: "Payment already processed for this booking"
      });
    }

    // Update payment details
    booking.paymentStatus = "PAID";
    booking.paymentId = transactionId;
    booking.paymentDetails = {
      method: paymentMethod,
      transactionId,
      paidAt: new Date()
    };

    await booking.save();

    // Update facility revenue
    const facility = await Facility.findById(booking.facility);
    if (facility) {
      facility.totalRevenue += booking.amount;
      await facility.save();
    }

    await booking.populate("facility", "name price");

    res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      data: booking
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * Cancel Booking
 * Residents can cancel only their own bookings
 * Admin can cancel any booking
 * Cancelled bookings free the slot
 */
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    const { reason } = req.body;

    const booking = await Booking.findById(id).populate("facility");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Authorization: Residents can only cancel own bookings
    if (userRole === "RESIDENT" && booking.bookedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own bookings"
      });
    }

    // Check if already cancelled
    if (booking.status === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "This booking is already cancelled"
      });
    }

    // Cancel booking
    booking.status = "CANCELLED";
    booking.cancelledAt = new Date();
    if (reason) booking.cancellationReason = reason;

    // Handle refund for PAID bookings
    if (booking.amount > 0 && booking.paymentStatus === "PAID") {
      booking.paymentStatus = "REFUNDED";
      booking.paymentDetails.refundedAt = new Date();
      booking.paymentDetails.refundAmount = booking.amount;

      // Deduct from facility revenue
      const facility = await Facility.findById(booking.facility);
      if (facility) {
        facility.totalRevenue = Math.max(0, facility.totalRevenue - booking.amount);
        await facility.save();
      }
    }

    await booking.save();

    await booking.populate("facility", "name");
    await booking.populate("bookedBy", "name email");

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * Complete Booking (Admin marks as completed after booking time passes)
 */
export const completeBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (booking.status === "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Booking is already completed"
      });
    }

    booking.status = "COMPLETED";
    await booking.save();

    await booking.populate("facility", "name");
    await booking.populate("bookedBy", "name email");

    res.status(200).json({
      success: true,
      message: "Booking marked as completed",
      data: booking
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ==================== BOOKING QUERIES ====================

/**
 * Get All Bookings
 * Admin: All bookings
 * Resident: Own bookings only
 */
export const getBookings = async (req, res) => {
  try {
    let query = {};

    // Residents see only their own bookings
    if (req.user.role === "RESIDENT") {
      query.bookedBy = req.user.id;
    }

    const bookings = await Booking.find(query)
      .populate("facility", "name location bookingType price")
      .populate("flat", "flatNumber block")
      .populate("bookedBy", "name email phone")
      .sort({ date: -1, timeSlot: 1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * Get Upcoming Bookings (Resident/Admin)
 */
export const getUpcomingBookings = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let query = {
      date: { $gte: today },
      status: "CONFIRMED"
    };

    if (req.user.role === "RESIDENT") {
      query.bookedBy = req.user.id;
    }

    const bookings = await Booking.find(query)
      .populate("facility", "name location bookingType price")
      .populate("flat", "flatNumber block")
      .populate("bookedBy", "name email")
      .sort({ date: 1, timeSlot: 1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * Get Past Bookings (Resident/Admin)
 */
export const getPastBookings = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let query = {
      date: { $lt: today }
    };

    if (req.user.role === "RESIDENT") {
      query.bookedBy = req.user.id;
    }

    const bookings = await Booking.find(query)
      .populate("facility", "name location bookingType price")
      .populate("flat", "flatNumber block")
      .populate("bookedBy", "name email")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * Get Cancelled Bookings (Resident/Admin)
 */
export const getCancelledBookings = async (req, res) => {
  try {
    let query = {
      status: "CANCELLED"
    };

    if (req.user.role === "RESIDENT") {
      query.bookedBy = req.user.id;
    }

    const bookings = await Booking.find(query)
      .populate("facility", "name location bookingType price")
      .populate("flat", "flatNumber block")
      .populate("bookedBy", "name email")
      .sort({ cancelledAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ==================== AVAILABILITY CHECKING ====================

/**
 * Check Slot Availability for a Facility on a Given Date
 */
export const checkSlotAvailability = async (req, res) => {
  try {
    const { facilityId, date } = req.query;

    if (!facilityId || !date) {
      return res.status(400).json({
        success: false,
        message: "Facility ID and date are required"
      });
    }

    const facility = await Facility.findById(facilityId);

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Facility not found"
      });
    }

    if (!facility.isActive) {
      return res.status(400).json({
        success: false,
        message: "Facility is currently unavailable"
      });
    }

    // Check if date is in past
    const checkDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);

    if (checkDate < today) {
      return res.status(400).json({
        success: false,
        message: "Cannot check availability for past dates"
      });
    }

    // Get slot availability
    const slotAvailability = await Promise.all(
      facility.slots.map(async (slot) => {
        const bookedCount = await Booking.countDocuments({
          facility: facilityId,
          date: checkDate,
          slotId: slot._id,
          status: "CONFIRMED"
        });

        return {
          slotId: slot._id,
          startTime: slot.startTime,
          endTime: slot.endTime,
          capacity: slot.capacity,
          booked: bookedCount,
          available: Math.max(0, slot.capacity - bookedCount),
          isAvailable: bookedCount < slot.capacity,
          isActive: slot.isActive
        };
      })
    );

    res.status(200).json({
      success: true,
      date: checkDate,
      facility: {
        id: facility._id,
        name: facility.name,
        bookingType: facility.bookingType,
        price: facility.price
      },
      data: slotAvailability
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ==================== ANALYTICS ====================

/**
 * Get Facility Analytics Dashboard Data (Admin Only)
 */
export const getAnalytics = async (req, res) => {
  try {
    const totalFacilities = await Facility.countDocuments();
    const activeFacilities = await Facility.countDocuments({ isActive: true });

    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: "CONFIRMED" });
    const cancelledBookings = await Booking.countDocuments({ status: "CANCELLED" });
    const completedBookings = await Booking.countDocuments({ status: "COMPLETED" });

    const freeBookings = await Booking.countDocuments({
      status: { $in: ["CONFIRMED", "COMPLETED"] }
    }).populate("facility");

    const paidBookings = await Booking.find({
      status: { $in: ["CONFIRMED", "COMPLETED"] }
    }).populate("facility");

    let paidCount = 0;
    let totalRevenue = 0;

    paidBookings.forEach((booking) => {
      if (booking.facility.bookingType === "PAID" && booking.paymentStatus === "PAID") {
        paidCount++;
        totalRevenue += booking.amount;
      }
    });

    // Calculate total and occupied slots
    const allSlots = await Facility.aggregate([
      {
        $unwind: "$slots"
      },
      {
        $group: {
          _id: null,
          totalSlots: { $sum: "$slots.capacity" },
          activeSlots: { $sum: { $cond: ["$slots.isActive", "$slots.capacity", 0] } }
        }
      }
    ]);

    const slotStats = allSlots.length > 0 ? allSlots[0] : { totalSlots: 0, activeSlots: 0 };

    // Calculate occupied slots for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayBookings = await Booking.countDocuments({
      date: today,
      status: "CONFIRMED"
    });

    res.status(200).json({
      success: true,
      data: {
        facilities: {
          total: totalFacilities,
          active: activeFacilities,
          inactive: totalFacilities - activeFacilities
        },
        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings,
          cancelled: cancelledBookings,
          completed: completedBookings,
          today: todayBookings
        },
        revenue: {
          total: totalRevenue,
          currency: "INR"
        },
        slots: {
          total: slotStats.totalSlots || 0,
          active: slotStats.activeSlots || 0,
          occupiedToday: todayBookings
        },
        bookingTypes: {
          free: freeBookings,
          paid: paidCount
        }
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * Get Facility-wise Analytics (Admin Only)
 */
export const getFacilityAnalytics = async (req, res) => {
  try {
    const { facilityId } = req.params;

    const facility = await Facility.findById(facilityId);

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Facility not found"
      });
    }

    const totalBookings = await Booking.countDocuments({ facility: facilityId });
    const confirmedBookings = await Booking.countDocuments({
      facility: facilityId,
      status: "CONFIRMED"
    });
    const cancelledBookings = await Booking.countDocuments({
      facility: facilityId,
      status: "CANCELLED"
    });

    const stats = await getSlotStats(facilityId);

    res.status(200).json({
      success: true,
      data: {
        facility: {
          id: facility._id,
          name: facility.name,
          type: facility.facilityType,
          bookingType: facility.bookingType,
          price: facility.price
        },
        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings,
          cancelled: cancelledBookings
        },
        slots: stats,
        revenue: {
          total: facility.totalRevenue,
          currency: "INR"
        }
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Calculate slot statistics for a facility
 */
async function getSlotStats(facilityId) {
  const facility = await Facility.findById(facilityId);

  if (!facility) {
    return { totalSlots: 0, bookedSlots: 0, availableSlots: 0 };
  }

  let totalSlots = 0;
  let bookedSlots = 0;

  // Count total slot capacity
  for (const slot of facility.slots) {
    if (slot.isActive) {
      totalSlots += slot.capacity;
    }
  }

  // Count all active bookings
  bookedSlots = await Booking.countDocuments({
    facility: facilityId,
    status: "CONFIRMED"
  });

  return {
    totalSlots,
    bookedSlots,
    availableSlots: Math.max(0, totalSlots - bookedSlots)
  };
}
