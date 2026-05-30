import { useEffect, useState } from "react";
import {
  Building2,
  Users,
  MapPin,
  Calendar,
  Clock,
  X,
  CheckCircle,
  AlertCircle,
  Loader,
  DollarSign,
  Tag,
  CreditCard,
  AlertTriangle
} from "lucide-react";

import ResidentLayout from "../../components/layout/ResidentLayout";
import api from "../../api/axios";

export default function ResidentFacilities() {
  // ==================== STATE ====================

  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);

  const [form, setForm] = useState({
    date: "",
    slotId: ""
  });

  const [paymentForm, setPaymentForm] = useState({
    paymentMethod: "CARD",
    transactionId: ""
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeFreeBooking, setActiveFreeBooking] = useState(null);

  // ==================== LIFECYCLE ====================

  useEffect(() => {
    fetchFacilities();
  }, []);

  // Clear message after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // ==================== API CALLS ====================

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const res = await api.get("/facilities");

console.log("FACILITIES:", res.data);

setFacilities(
  Array.isArray(res.data)
    ? res.data
    : res.data?.data || []
);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to load facilities"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async (facilityId, bookingDate) => {
    try {
      setCheckingAvailability(true);
      const res = await api.get("/facilities/bookings/availability", {
        params: {
          facilityId,
          date: bookingDate
        }
      });
      setAvailability(res.data?.data);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to check availability"
      });
      setAvailability(null);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();

    if (!form.date || !form.slotId) {
      setMessage({
        type: "error",
        text: "Please select both date and time slot"
      });
      return;
    }

    try {
      setBookingLoading(true);
      const res = await api.post("/facilities/bookings/create", {
        facilityId: selectedFacility._id,
        date: form.date,
        slotId: form.slotId
      });

      setCurrentBooking(res.data?.data);

      // For PAID facilities, show payment modal
      if (selectedFacility.bookingType === "PAID") {
        setShowBookingModal(false);
        setShowPaymentModal(true);
        setMessage({
          type: "success",
          text: "Booking created! Now proceed to payment"
        });
      } else {
        // For FREE facilities, booking is confirmed immediately
        setMessage({
          type: "success",
          text: "Facility booked successfully!"
        });
        setTimeout(() => {
          resetModal();
          fetchFacilities();
        }, 1500);
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Booking failed"
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();

    if (!paymentForm.transactionId) {
      setMessage({
        type: "error",
        text: "Please enter transaction ID"
      });
      return;
    }

    try {
      setProcessingPayment(true);
      await api.post(`/facilities/bookings/${currentBooking._id}/payment`, {
        paymentMethod: paymentForm.paymentMethod,
        transactionId: paymentForm.transactionId
      });

      setMessage({
        type: "success",
        text: "Payment processed! Booking confirmed"
      });

      setTimeout(() => {
        resetModal();
        fetchFacilities();
      }, 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Payment processing failed"
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  const resetModal = () => {
    setShowBookingModal(false);
    setShowPaymentModal(false);
    setSelectedFacility(null);
    setSelectedSlot(null);
    setAvailability(null);
    setForm({ date: "", slotId: "" });
    setPaymentForm({ paymentMethod: "CARD", transactionId: "" });
    setCurrentBooking(null);
  };

  const openBookingModal = (facility) => {
    // Check if resident already has active booking for FREE facility
    if (facility.bookingType === "FREE") {
      // This would be checked from the availability data
      setActiveFreeBooking(null); // Will be set from API response
    }

    setSelectedFacility(facility);
    setShowBookingModal(true);
  };

  const handleDateChange = (date) => {
    setForm({ ...form, date });
    if (date && selectedFacility) {
      checkAvailability(selectedFacility._id, date);
    }
  };

  // ==================== HELPERS ====================

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getSlotDisplay = (slot) => {
    const convertTo12Hour = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      const period = hours >= 12 ? "PM" : "AM";
      const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
      return `${displayHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;
    };
    return `${convertTo12Hour(slot.startTime)} - ${convertTo12Hour(slot.endTime)}`;
  };

  // ==================== RENDER ====================

  return (
    <ResidentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Building2 className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Facilities</h1>
            <p className="text-gray-500">Browse and book facilities</p>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`flex items-center gap-3 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <p>{message.text}</p>
          </div>
        )}

        {/* Facilities Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : facilities.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No facilities available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility) => (
              <div
                key={facility._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-xl font-bold">{facility.name}</h2>
                    {facility.bookingType === "PAID" ? (
                      <DollarSign className="w-5 h-5" />
                    ) : (
                      <Tag className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-1 text-blue-100">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{facility.location}</span>
                    </div>
                    {facility.description && (
                      <p className="text-sm">{facility.description}</p>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  {/* Booking Type & Price */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Booking Type</p>
                    {facility.bookingType === "PAID" ? (
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">PAID</span>
                        <span className="text-xl font-bold text-green-600">₹{facility.price}</span>
                      </div>
                    ) : (
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        FREE
                      </span>
                    )}
                  </div>

                  {/* Slots Info */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500">Total Slots</p>
                      <p className="font-bold text-gray-900 text-lg">
                        {facility.totalSlots || facility.slots?.length || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Available</p>
                      <p className="font-bold text-green-600 text-lg">
                        {facility.availableSlots || 0}
                      </p>
                    </div>
                  </div>

                  {/* Availability */}
                  {facility.availableSlots > 0 ? (
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-green-700 font-medium">
                        {facility.availableSlots} slots available
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <span className="text-sm text-red-700 font-medium">
                        No slots available
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={() => openBookingModal(facility)}
                    disabled={!facility.isActive}
                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition ${
                      facility.isActive
                        ? facility.bookingType === "PAID"
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {facility.isActive ?  (
                      <>
                        <Calendar className="w-4 h-4" />
                        {facility.bookingType === "PAID" ? "Book & Pay" : "Book Now"}
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4" />
                        Not Available
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedFacility && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedFacility.bookingType === "PAID" ? "Book & Pay" : "Book Facility"}
              </h2>
              <button
                onClick={resetModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4">
              {/* Facility Info */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {selectedFacility.name}
                </h3>
                {selectedFacility.bookingType === "PAID" && (
                  <p className="text-lg font-bold text-green-600">
                    Amount: ₹{selectedFacility.price}
                  </p>
                )}
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  min={getTodayDate()}
                  value={form.date}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Slot Selection */}
              {availability && form.date && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time Slot
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {checkingAvailability ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader className="w-5 h-5 animate-spin text-blue-600" />
                      </div>
                    ) : availability.length === 0 ? (
                      <p className="text-gray-500 text-sm">No slots available for this date</p>
                    ) : (
                      availability.map((slot) => (
                        <button
                          key={slot.slotId}
                          type="button"
                          onClick={() => setForm({ ...form, slotId: slot.slotId })}
                          disabled={!slot.isAvailable}
                          className={`w-full p-3 rounded-lg border-2 text-left transition ${
                            form.slotId === slot.slotId
                              ? "border-blue-600 bg-blue-50"
                              : slot.isAvailable
                              ? "border-gray-300 hover:border-blue-400"
                              : "border-gray-200 bg-gray-50 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">
                                {getSlotDisplay(slot)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {slot.available} of {slot.capacity} available
                              </p>
                            </div>
                            {slot.isAvailable ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetModal}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    bookingLoading || !form.date || !form.slotId || checkingAvailability
                  }
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 font-medium transition"
                >
                  {bookingLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      {selectedFacility.bookingType === "PAID"
                        ? "Proceed to Payment"
                        : "Confirm Booking"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && currentBooking && selectedFacility && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Payment</h2>
              <button
                onClick={resetModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div>
                <p className="text-sm text-gray-500">Facility</p>
                <p className="font-semibold text-gray-900">{selectedFacility.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date & Slot</p>
                <p className="font-semibold text-gray-900">
                  {form.date} - {selectedSlot?.startTime}
                </p>
              </div>
              <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                <p className="text-lg text-gray-700">Amount</p>
                <p className="text-2xl font-bold text-green-600">₹{selectedFacility.price}</p>
              </div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleProcessPayment} className="space-y-4">
              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentForm.paymentMethod}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="CARD">Credit/Debit Card</option>
                  <option value="UPI">UPI</option>
                  <option value="WALLET">Digital Wallet</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                </select>
              </div>

              {/* Transaction ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction ID / Reference
                </label>
                <input
                  type="text"
                  placeholder="Enter transaction ID from payment gateway"
                  value={paymentForm.transactionId}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, transactionId: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetModal}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processingPayment || !paymentForm.transactionId}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 font-medium transition"
                >
                  {processingPayment ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Confirm Payment
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ResidentLayout>
  );
}
