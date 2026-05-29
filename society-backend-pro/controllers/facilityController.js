import Facility from "../models/Facility.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";

/* ================= FACILITY MANAGEMENT ================= */

// Create Facility (Admin)
export const createFacility = async (req, res) => {
  try {
    const { name, description, location, capacity } = req.body;

    if (!name || !location || !capacity) {
      return res.status(400).json({
        message: "Name, location, and capacity are required"
      });
    }

    const facility = await Facility.create({
      name,
      description,
      location,
      capacity,
      isActive: true
    });

    res.status(201).json({
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

// Get All Facilities (Public/Active)
export const getFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find({
      isActive: true
    });

    res.json({
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

// Get All Facilities (Admin - includes inactive)
export const getAllFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find();

    res.json({
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

// Get Single Facility
export const getFacilityById = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Facility not found"
      });
    }

    res.json({
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

// Update Facility (Admin)
export const updateFacility = async (req, res) => {
  try {
    const { name, description, location, capacity, isActive } = req.body;

    const facility = await Facility.findById(req.params.id);

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Facility not found"
      });
    }

    if (name) facility.name = name;
    if (description) facility.description = description;
    if (location) facility.location = location;
    if (capacity) facility.capacity = capacity;
    if (isActive !== undefined) facility.isActive = isActive;

    await facility.save();

    res.json({
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

// Toggle Facility Status (Admin)
export const toggleFacilityStatus = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Facility not found"
      });
    }

    facility.isActive = !facility.isActive;
    await facility.save();

    res.json({
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

/* ================= BOOKING MANAGEMENT ================= */

// Book Facility (Resident)
export const bookFacility = async (req, res) => {
  try {
    const { facilityId, date, timeSlot } = req.body;
    const userId = req.user.id;

    // Validation
    if (!facilityId || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: "Facility ID, date, and time slot are required"
      });
    }

    // Get facility
    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Facility not found"
      });
    }

    // Check if facility is active
    if (!facility.isActive) {
      return res.status(400).json({
        success: false,
        message: "Facility is currently unavailable"
      });
    }

    // Get user and flat info
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Rule 1: Check if past date
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: "Cannot book for past dates"
      });
    }

    // Rule 2: Check duplicate booking - same facility, date, time, different resident
    const existingTimeSlotBooking = await Booking.findOne({
      facility: facilityId,
      date: {
        $gte: new Date(bookingDate.setHours(0, 0, 0, 0)),
        $lte: new Date(bookingDate.setHours(23, 59, 59, 999))
      },
      timeSlot,
      status: { $in: ["CONFIRMED"] }
    });

    if (existingTimeSlotBooking) {
      return res.status(400).json({
        success: false,
        message: "Facility already booked for this slot"
      });
    }

    // Rule 3: Check if same resident already booked same facility on same date
    const existingResidentBooking = await Booking.findOne({
      facility: facilityId,
      bookedBy: userId,
      date: {
        $gte: new Date(bookingDate.setHours(0, 0, 0, 0)),
        $lte: new Date(bookingDate.setHours(23, 59, 59, 999))
      },
      status: { $in: ["CONFIRMED"] }
    });

    if (existingResidentBooking) {
      return res.status(400).json({
        success: false,
        message: "You have already booked this facility for this date"
      });
    }

    // Rule 4: Check capacity if enabled
    const slotBookings = await Booking.countDocuments({
      facility: facilityId,
      date: {
        $gte: new Date(bookingDate.setHours(0, 0, 0, 0)),
        $lte: new Date(bookingDate.setHours(23, 59, 59, 999))
      },
      timeSlot,
      status: "CONFIRMED"
    });

    if (slotBookings >= facility.capacity) {
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
    await booking.populate("facility");
    await booking.populate("bookedBy", "name email");

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

// Cancel Booking
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

    // Check authorization - resident can only cancel own booking
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

    booking.status = "CANCELLED";
    await booking.save();

    res.json({
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

// Get All Bookings (Admin) / My Bookings (Resident)
export const getBookings = async (req, res) => {
  try {
    let bookings;

    if (req.user.role === "ADMIN") {
      bookings = await Booking.find()
        .populate("facility")
        .populate("flat")
        .populate("bookedBy", "name email")
        .sort({ createdAt: -1 });
    } else {
      // Resident - get own bookings
      bookings = await Booking.find({
        bookedBy: req.user.id
      })
        .populate("facility")
        .populate("flat")
        .sort({ date: 1 });
    }

    res.json({
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

// Get My Upcoming Bookings (Resident)
export const getUpcomingBookings = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookings = await Booking.find({
      bookedBy: req.user.id,
      date: { $gte: today },
      status: "CONFIRMED"
    })
      .populate("facility")
      .populate("flat")
      .sort({ date: 1 });

    res.json({
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

// Get My Past Bookings (Resident)
export const getPastBookings = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookings = await Booking.find({
      bookedBy: req.user.id,
      date: { $lt: today }
    })
      .populate("facility")
      .populate("flat")
      .sort({ date: -1 });

    res.json({
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

// Get Cancelled Bookings (Resident)
export const getCancelledBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      bookedBy: req.user.id,
      status: "CANCELLED"
    })
      .populate("facility")
      .populate("flat")
      .sort({ updatedAt: -1 });

    res.json({
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

// Check Slot Availability
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

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Check if date is in past
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      return res.status(400).json({
        success: false,
        message: "Cannot check availability for past dates"
      });
    }

    const bookedSlots = await Booking.find({
      facility: facilityId,
      date: {
        $gte: startDate,
        $lte: endDate
      },
      status: "CONFIRMED"
    }).select("timeSlot");

    const bookedTimeSlots = bookedSlots.map(b => b.timeSlot);

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

    const availability = timeSlots.map(slot => {
      const bookingCount = bookedSlots.filter(b => b.timeSlot === slot).length;
      return {
        timeSlot: slot,
        available: bookingCount < facility.capacity,
        booked: bookingCount,
        capacity: facility.capacity
      };
    });

    const totalBooked = bookedSlots.length;
    const isFullyBooked = availability.every(slot => !slot.available);

    res.json({
      success: true,
      data: {
        facility: {
          id: facility._id,
          name: facility.name,
          capacity: facility.capacity,
          isActive: facility.isActive
        },
        availability,
        isFullyBooked,
        totalBooked,
        maxSlots: facility.capacity * timeSlots.length
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Get Booking Statistics (Admin)
export const getBookingStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalFacilities = await Facility.countDocuments();
    const activeFacilities = await Facility.countDocuments({ isActive: true });
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: "CONFIRMED" });
    const cancelledBookings = await Booking.countDocuments({ status: "CANCELLED" });
    const completedBookings = await Booking.countDocuments({ status: "COMPLETED" });
    const todayBookings = await Booking.countDocuments({
      date: {
        $gte: today,
        $lte: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      },
      status: "CONFIRMED"
    });

    res.json({
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