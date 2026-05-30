import Facility from "../models/Facility.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";

// ==================== FACILITY MANAGEMENT ====================

/**
 * Create Facility (Admin Only)
 * Rule: Admin creates facility with name, description, location, capacity
 */
export const createFacility = async (req, res) => {
  try {
    const { name, description, location, capacity } = req.body;

    // Validation
    if (!name?.trim() || !location?.trim() || !capacity) {
      return res.status(400).json({
        success: false,
        message: "Name, location, and capacity are required"
      });
    }

    if (capacity < 1) {
      return res.status(400).json({
        success: false,
        message: "Capacity must be at least 1"
      });
    }

    const facility = await Facility.create({
      name: name.trim(),
      description: description?.trim() || "",
      location: location.trim(),
      capacity: parseInt(capacity),
      isActive: true
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
 */
export const getFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find({
      isActive: true
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: facilities.length,
      data: facilities
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

    res.status(200).json({
      success: true,
      count: facilities.length,
      data: facilities
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * Get Single Facility by ID
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

    res.status(200).json({
      success: true,
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
 * Update Facility (Admin Only)
 */
export const updateFacility = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, location, capacity, isActive } = req.body;

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
    if (capacity && capacity >= 1) facility.capacity = parseInt(capacity);
    if (isActive !== undefined) facility.isActive = Boolean(isActive);

    await facility.save();

    res.status(200).json({
      success: true,
      message: "Facility updated successfully",
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

    res.status(200).json({
      success: true,
      message: `Facility ${facility.isActive ? "enabled" : "disabled"}`,
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
 * 4. Same resident cannot book same facility twice on same date
 * 5. Capacity limits must not be exceeded
 * 6. Cancelled bookings free the slot
 */
export const bookFacility = async (req, res) => {
  try {
    const { facilityId, date, timeSlot } = req.body;
    const userId = req.user.id;

    // Validation: Required fields
    if (!facilityId || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: "Facility ID, date, and time slot are required"
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

    // Validation: Facility is active (Rule 5: Facility Availability)
    if (!facility.isActive) {
      return res.status(400).json({
        success: false,
        message: "Facility unavailable"
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

    // Validation: Cannot book past dates (Date Validation Rule)
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

    // Validation: Duplicate Booking Prevention - Rule 1
    // Two residents cannot book same facility at same date and time slot
    const existingSlotBooking = await Booking.findOne({
      facility: facilityId,
      date: bookingDate,
      timeSlot,
      status: "CONFIRMED"
    });

    if (existingSlotBooking) {
      return res.status(400).json({
        success: false,
        message: "Facility already booked for this slot"
      });
    }

    // Validation: Duplicate Booking Prevention - Rule 2
    // Same resident cannot book same facility twice on same date
    const existingResidentBooking = await Booking.findOne({
      facility: facilityId,
      bookedBy: userId,
      date: bookingDate,
      status: "CONFIRMED"
    });

    if (existingResidentBooking) {
      return res.status(400).json({
        success: false,
        message: "You have already booked this facility for this date"
      });
    }

    // Validation: Capacity Rules
    const slotBookingCount = await Booking.countDocuments({
      facility: facilityId,
      date: bookingDate,
      timeSlot,
      status: "CONFIRMED"
    });

    if (slotBookingCount >= facility.capacity) {
      return res.status(400).json({
        success: false,
        message: "Facility capacity reached for this slot"
      });
    }

    // Create booking
    const booking = await Booking.create({
      facility: facilityId,
      flat: user.flat,
      bookedBy: userId,
      date: bookingDate,
      timeSlot,
      status: "CONFIRMED"
    });

    // Populate and return
    await booking.populate("facility", "name location capacity");
    await booking.populate("bookedBy", "name email");
    await booking.populate("flat", "flatNumber");

    res.status(201).json({
      success: true,
      message: "Facility booked successfully",
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
 * Cancelled bookings free the slot (Rule 3)
 */
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const booking = await Booking.findById(id);

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

    // Cancel booking (frees the slot for others)
    booking.status = "CANCELLED";
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
      .populate("facility", "name location capacity")
      .populate("flat", "flatNumber block")
      .populate("bookedBy", "name email phone")
      .sort({ createdAt: -1 });

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
 * Get Upcoming Bookings (Resident)
 */
export const getUpcomingBookings = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookings = await Booking.find({
      bookedBy: req.user.id,
      date: { $gte: today },
      status: "CONFIRMED"
    })
      .populate("facility", "name location capacity")
      .populate("flat", "flatNumber block")
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
 * Get Past Bookings (Resident)
 */
export const getPastBookings = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookings = await Booking.find({
      bookedBy: req.user.id,
      date: { $lt: today }
    })
      .populate("facility", "name location capacity")
      .populate("flat", "flatNumber block")
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
 * Get Cancelled Bookings (Resident)
 */
export const getCancelledBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      bookedBy: req.user.id,
      status: "CANCELLED"
    })
      .populate("facility", "name location capacity")
      .populate("flat", "flatNumber block")
      .sort({ updatedAt: -1 });

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
 * Shows which time slots are available or booked
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

    // Define time slots
    const timeSlots = [
      "09:00-10:00",
      "10:00-11:00",
      "11:00-12:00",
      "12:00-13:00",
      "14:00-15:00",
      "15:00-16:00",
      "16:00-17:00",
      "17:00-18:00",
      "18:00-19:00",
      "19:00-20:00",
      "20:00-21:00"
    ];

    // Get all bookings for this facility on this date
    const bookings = await Booking.find({
      facility: facilityId,
      date: checkDate,
      status: "CONFIRMED"
    }).select("timeSlot");

    // Build availability array
    const availability = timeSlots.map(slot => {
      const booked = bookings.filter(b => b.timeSlot === slot).length;
      return {
        timeSlot: slot,
        available: booked < facility.capacity,
        booked: booked,
        capacity: facility.capacity,
        spotsLeft: Math.max(0, facility.capacity - booked)
      };
    });

    const totalBooked = bookings.length;
    const totalCapacity = facility.capacity * timeSlots.length;
    const fullyBooked = availability.every(slot => !slot.available);

    res.status(200).json({
      success: true,
      data: {
        facility: {
          id: facility._id,
          name: facility.name,
          capacity: facility.capacity,
          isActive: facility.isActive
        },
        date: checkDate,
        availability,
        summary: {
          totalBooked,
          totalCapacity,
          fullyBooked,
          availableSlots: availability.filter(s => s.available).length,
          bookedSlots: availability.filter(s => !s.available).length
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

// ==================== ADMIN STATISTICS ====================

/**
 * Get Booking Statistics (Admin Dashboard)
 */
export const getBookingStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Facility stats
    const totalFacilities = await Facility.countDocuments();
    const activeFacilities = await Facility.countDocuments({ isActive: true });
    const inactiveFacilities = totalFacilities - activeFacilities;

    // Booking stats
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: "CONFIRMED" });
    const cancelledBookings = await Booking.countDocuments({ status: "CANCELLED" });
    const completedBookings = await Booking.countDocuments({ status: "COMPLETED" });

    // Today's bookings
    const todayBookings = await Booking.countDocuments({
      date: {
        $gte: today,
        $lt: tomorrow
      },
      status: "CONFIRMED"
    });

    res.status(200).json({
      success: true,
      data: {
        facilities: {
          total: totalFacilities,
          active: activeFacilities,
          inactive: inactiveFacilities
        },
        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings,
          cancelled: cancelledBookings,
          completed: completedBookings,
          today: todayBookings
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
