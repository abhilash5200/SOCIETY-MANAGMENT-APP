/**
 * Booking Validators
 * Validates booking requests according to facility booking module rules
 */

/**
 * Validate booking request
 * @param {Object} data - Booking data
 * @param {string} data.facilityId - Facility ID
 * @param {Date} data.date - Booking date
 * @param {string} data.timeSlot - Time slot
 * @returns {Object} { isValid, errors }
 */
export const validateBookingRequest = (data) => {
  const errors = [];

  // Check required fields
  if (!data.facilityId?.trim()) {
    errors.push("Facility ID is required");
  }

  if (!data.date) {
    errors.push("Date is required");
  }

  if (!data.timeSlot?.trim()) {
    errors.push("Time slot is required");
  }

  // Validate date format and not in past
  if (data.date) {
    const bookingDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    bookingDate.setHours(0, 0, 0, 0);

    if (isNaN(bookingDate.getTime())) {
      errors.push("Invalid date format");
    } else if (bookingDate < today) {
      errors.push("Cannot book for past dates");
    }
  }

  // Validate time slot format
  if (data.timeSlot && !isValidTimeSlot(data.timeSlot)) {
    errors.push("Invalid time slot format");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate facility creation request
 * @param {Object} data - Facility data
 * @returns {Object} { isValid, errors }
 */
export const validateFacilityRequest = (data) => {
  const errors = [];

  // Check required fields
  if (!data.name?.trim()) {
    errors.push("Facility name is required");
  }

  if (!data.location?.trim()) {
    errors.push("Location is required");
  }

  if (!data.capacity) {
    errors.push("Capacity is required");
  }

  if (!data.bookingType) {
    errors.push("Booking type (FREE/PAID) is required");
  }

  // Validate capacity
  if (data.capacity && data.capacity < 1) {
    errors.push("Capacity must be at least 1");
  }

  // Validate booking type
  if (data.bookingType && !["FREE", "PAID"].includes(data.bookingType)) {
    errors.push("Booking type must be FREE or PAID");
  }

  // Validate price for PAID facilities
  if (data.bookingType === "PAID") {
    if (!data.price || data.price <= 0) {
      errors.push("Price is required and must be greater than 0 for PAID facilities");
    }
  }

  // Validate slots
  if (data.slots && Array.isArray(data.slots)) {
    data.slots.forEach((slot, index) => {
      const slotErrors = validateSlot(slot);
      if (slotErrors.length > 0) {
        errors.push(`Slot ${index + 1}: ${slotErrors.join(", ")}`);
      }
    });
  } else if (data.slots && !Array.isArray(data.slots)) {
    errors.push("Slots must be an array");
  }

  // Validate optional fields
  if (data.description && typeof data.description !== "string") {
    errors.push("Description must be a string");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate individual slot
 * @param {Object} slot - Slot data
 * @returns {Array} Array of error messages
 */
export const validateSlot = (slot) => {
  const errors = [];

  if (!slot.startTime) {
    errors.push("Start time is required");
  } else if (!isValidTime(slot.startTime)) {
    errors.push("Invalid start time format (HH:MM)");
  }

  if (!slot.endTime) {
    errors.push("End time is required");
  } else if (!isValidTime(slot.endTime)) {
    errors.push("Invalid end time format (HH:MM)");
  }

  if (!slot.capacity || slot.capacity < 1) {
    errors.push("Slot capacity must be at least 1");
  }

  // Validate start < end
  if (slot.startTime && slot.endTime && isValidTime(slot.startTime) && isValidTime(slot.endTime)) {
    const start = timeToMinutes(slot.startTime);
    const end = timeToMinutes(slot.endTime);
    if (start >= end) {
      errors.push("Start time must be before end time");
    }
  }

  return errors;
};

/**
 * Convert time string to minutes
 * @param {string} time - Time in HH:MM format
 * @returns {number}
 */
export const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * Check if time is valid format HH:MM
 * @param {string} time - Time string
 * @returns {boolean}
 */
export const isValidTime = (time) => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

/**
 * Check if time slot is valid
 * @param {string} timeSlot - Time slot in format HH:MM-HH:MM
 * @returns {boolean}
 */
export const isValidTimeSlot = (timeSlot) => {
  const validSlots = [
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

  return validSlots.includes(timeSlot);
};

/**
 * Get all valid time slots
 * @returns {Array}
 */
export const getValidTimeSlots = () => {
  return [
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
};

/**
 * Validate date is not in past
 * @param {Date|string} date - Date to validate
 * @returns {boolean}
 */
export const isDateNotInPast = (date) => {
  const checkDate = new Date(date);
  const today = new Date();

  checkDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return checkDate >= today;
};

/**
 * Format booking date for display
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
export const formatBookingDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};

/**
 * Get booking status options
 * @returns {Array}
 */
export const getBookingStatuses = () => {
  return ["CONFIRMED", "CANCELLED", "COMPLETED"];
};

/**
 * Validate payment data
 * @param {Object} data - Payment data
 * @returns {Object} { isValid, errors }
 */
export const validatePaymentData = (data) => {
  const errors = [];

  if (!data.bookingId) {
    errors.push("Booking ID is required");
  }

  if (!data.amount || data.amount <= 0) {
    errors.push("Valid amount is required");
  }

  if (!data.paymentMethod) {
    errors.push("Payment method is required");
  }

  const validMethods = ["CARD", "UPI", "WALLET", "BANK_TRANSFER", "CASH"];
  if (data.paymentMethod && !validMethods.includes(data.paymentMethod)) {
    errors.push(`Payment method must be one of: ${validMethods.join(", ")}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Check if resident has active booking for FREE facility
 * Used for FREE facilities where only one active booking is allowed
 * @param {string} facilityId - Facility ID
 * @param {string} residentId - Resident/User ID
 * @param {Object} Booking - Booking model
 * @returns {Promise<boolean>}
 */
export const hasActiveFreeBooking = async (facilityId, residentId, Booking) => {
  const activeBooking = await Booking.findOne({
    facility: facilityId,
    bookedBy: residentId,
    status: "CONFIRMED"
  });

  return !!activeBooking;
};

/**
 * Format currency for display
 * @param {number} amount - Amount in rupees
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0
  }).format(amount);
};

/**
 * Format slot time display
 * @param {string} startTime - Start time in HH:MM
 * @param {string} endTime - End time in HH:MM
 * @returns {string}
 */
export const formatSlotTime = (startTime, endTime) => {
  const convertTo12Hour = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  return `${convertTo12Hour(startTime)} - ${convertTo12Hour(endTime)}`;
};
