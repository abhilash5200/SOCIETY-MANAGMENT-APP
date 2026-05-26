import Facility from "../models/Facility.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";

/* ================= ADMIN CREATES FACILITY ================= */

export const createFacility = async (req, res) => {
  try {

    const facility =
      await Facility.create(req.body);

    res.status(201).json(facility);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};


/* ================= GET FACILITIES ================= */

export const getFacilities = async (req, res) => {
  try {

    const facilities =
      await Facility.find({
        isActive: true
      });

    res.json(facilities);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};


/* ================= BOOK FACILITY ================= */

export const bookFacility = async (req, res) => {
  try {

    const user =
      await User.findById(
        req.user.id
      );

    const {
      facilityId,
      date,
      timeSlot
    } = req.body;

    const existingBooking =
      await Booking.findOne({
        facility: facilityId,
        date,
        timeSlot,
        status: "CONFIRMED"
      });

    if (existingBooking) {

      return res.status(400).json({
        message:
          "Facility already booked for this slot"
      });

    }

    const booking =
      await Booking.create({
        facility: facilityId,
        flat: user.flat,
        bookedBy: req.user.id,
        date,
        timeSlot
      });

    res.status(201).json(booking);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};


/* ================= CANCEL BOOKING ================= */

export const cancelBooking = async (req, res) => {
  try {

    const booking =
      await Booking.findById(
        req.params.id
      );

    if (!booking) {

      return res.status(404).json({
        message: "Booking not found"
      });

    }

    booking.status =
      "CANCELLED";

    await booking.save();

    res.json({
      message:
        "Booking cancelled"
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};


/* ================= VIEW BOOKINGS ================= */

export const getBookings = async (req, res) => {
  try {

    let bookings;

    if (
      req.user.role === "ADMIN"
    ) {

      bookings =
        await Booking.find()

          .populate(
            "facility"
          )

          .populate(
            "flat"
          )

          .populate(
            "bookedBy",
            "name email"
          );

    }

    else {

      bookings =
        await Booking.find({
          bookedBy:
            req.user.id
        })

          .populate(
            "facility"
          );

    }

    res.json(bookings);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};

/* ================= CHECK SLOT AVAILABILITY ================= */

export const checkSlotAvailability = async (req, res) => {
  try {

    const {
      facilityId,
      date
    } = req.query;

    const facility =
      await Facility.findById(
        facilityId
      );

    if (!facility) {

      return res.status(404).json({
        message: "Facility not found"
      });

    }

    const startDate =
      new Date(date);

    startDate.setHours(
      0, 0, 0, 0
    );

    const endDate =
      new Date(date);

    endDate.setHours(
      23, 59, 59, 999
    );

    const bookedSlots =
      await Booking.find({
        facility: facilityId,
        date: {
          $gte: startDate,
          $lte: endDate
        },
        status: "CONFIRMED"
      }).select("timeSlot");

    const bookedTimeSlots =
      bookedSlots.map(
        b => b.timeSlot
      );

    const timeSlots = [
      "09:00-10:00",
      "10:00-11:00",
      "11:00-12:00",
      "14:00-15:00",
      "15:00-16:00",
      "16:00-17:00",
      "17:00-18:00",
      "18:00-19:00"
    ];

    const availability =
      timeSlots.map(slot => ({
        timeSlot: slot,
        available: !bookedTimeSlots.includes(slot)
      }));

    const totalBooked =
      bookedSlots.length;

    const isFullyBooked =
      totalBooked >= facility.maxSlotsPerDay;

    res.json({
      facility,
      availability,
      isFullyBooked,
      totalBooked,
      maxSlots: facility.maxSlotsPerDay
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};