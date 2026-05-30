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
  Loader
} from "lucide-react";

import ResidentLayout from "../../components/layout/ResidentLayout";
import api from "../../api/axios";

export default function ResidentFacilities() {
  // ==================== STATE ====================

  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  const [form, setForm] = useState({
    date: "",
    timeSlot: ""
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  // ==================== LIFECYCLE ====================

  useEffect(() => {
    fetchFacilities();
  }, []);

  // ==================== API CALLS ====================

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const res = await api.get("/facilities");
      setFacilities(res.data?.data || []);
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
      const res = await api.get("/facilities/availability/check", {
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

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!form.date || !form.timeSlot) {
      setMessage({
        type: "error",
        text: "Please select both date and time slot"
      });
      return;
    }

    try {
      setBookingLoading(true);
      await api.post("/facilities/book/create", {
        facilityId: selectedFacility._id,
        date: form.date,
        timeSlot: form.timeSlot
      });

      setMessage({
        type: "success",
        text: "Facility booked successfully!"
      });

      setTimeout(() => {
        closeModal();
        fetchFacilities();
      }, 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to book facility"
      });
    } finally {
      setBookingLoading(false);
    }
  };

  // ==================== HANDLERS ====================

  const openBookingModal = (facility) => {
    setSelectedFacility(facility);
    setForm({ date: "", timeSlot: "" });
    setAvailability(null);
    setMessage({ type: "", text: "" });
    setShowBookingModal(true);
  };

  const closeModal = () => {
    setShowBookingModal(false);
    setSelectedFacility(null);
    setForm({ date: "", timeSlot: "" });
    setAvailability(null);
    setMessage({ type: "", text: "" });
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setForm({ ...form, date, timeSlot: "" });
    if (date && selectedFacility) {
      checkAvailability(selectedFacility._id, date);
    }
  };

  const handleTimeSlotChange = (timeSlot) => {
    setForm({ ...form, timeSlot });
  };

  // ==================== RENDER ====================

  if (loading) {
    return (
      <ResidentLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-gray-600">Loading facilities...</p>
          </div>
        </div>
      </ResidentLayout>
    );
  }

  return (
    <ResidentLayout>
      <div className="space-y-6">
        {/* ==================== HEADER ==================== */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Facility Booking
          </h1>
          <p className="text-gray-600 mt-2">
            Browse and book society facilities for your convenience
          </p>
        </div>

        {/* ==================== AVAILABLE FACILITIES ==================== */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Available Facilities
          </h2>

          {facilities.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No facilities available at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {facilities.map((facility) => (
                <div
                  key={facility._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <Building2 size={28} />
                      <div>
                        <h3 className="text-lg font-semibold">
                          {facility.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    {facility.description && (
                      <p className="text-gray-600 text-sm">
                        {facility.description}
                      </p>
                    )}

                    {facility.location && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin size={18} className="text-blue-600" />
                        <span className="text-sm">
                          {facility.location}
                        </span>
                      </div>
                    )}

                    {facility.capacity && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Users size={18} className="text-green-600" />
                        <span className="text-sm">
                          Capacity: {facility.capacity} person(s)
                        </span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-gray-200">
                      <button
                        onClick={() => openBookingModal(facility)}
                        disabled={!facility.isActive}
                        className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                          facility.isActive
                            ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                            : "bg-gray-300 text-gray-600 cursor-not-allowed"
                        }`}
                      >
                        {facility.isActive ? "Book Now" : "Currently Unavailable"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ==================== BOOKING MODAL ==================== */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-blue-600 text-white p-4 flex items-center justify-between sticky top-0">
                <div>
                  <h2 className="text-xl font-bold">
                    {selectedFacility?.name}
                  </h2>
                  <p className="text-blue-100 text-sm">Booking</p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:bg-blue-700 p-1 rounded transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                {/* Message */}
                {message.text && (
                  <div
                    className={`p-3 rounded-lg flex items-gap-2 ${
                      message.type === "success"
                        ? "bg-green-50 border border-green-200 text-green-700"
                        : "bg-red-50 border border-red-200 text-red-700"
                    }`}
                  >
                    {message.type === "success" ? (
                      <CheckCircle size={20} className="mr-2 flex-shrink-0" />
                    ) : (
                      <AlertCircle size={20} className="mr-2 flex-shrink-0" />
                    )}
                    <span className="text-sm">{message.text}</span>
                  </div>
                )}

                <form onSubmit={handleBooking} className="space-y-4">
                  {/* Date Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar size={18} />
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={handleDateChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Time Slot Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Clock size={18} />
                      Select Time Slot
                    </label>

                    {checkingAvailability ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader className="w-6 h-6 animate-spin text-blue-600" />
                        <span className="ml-2 text-gray-600">Checking availability...</span>
                      </div>
                    ) : availability ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {availability.availability.map((slot) => (
                          <label
                            key={slot.timeSlot}
                            className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                              slot.available
                                ? "border-gray-300 hover:border-blue-600 hover:bg-blue-50"
                                : "border-red-300 bg-red-50 cursor-not-allowed"
                            }`}
                          >
                            <input
                              type="radio"
                              name="timeSlot"
                              value={slot.timeSlot}
                              checked={form.timeSlot === slot.timeSlot}
                              onChange={() =>
                                handleTimeSlotChange(slot.timeSlot)
                              }
                              disabled={!slot.available}
                              className="w-4 h-4"
                            />
                            <span
                              className={`ml-3 font-medium flex-grow ${
                                slot.available
                                  ? "text-gray-800"
                                  : "text-gray-500 line-through"
                              }`}
                            >
                              {slot.timeSlot}
                            </span>
                            {slot.available && (
                              <span className="text-xs text-green-600 font-semibold">
                                {slot.spotsLeft} spots
                              </span>
                            )}
                            {!slot.available && (
                              <span className="text-xs text-red-600 font-semibold">
                                BOOKED
                              </span>
                            )}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-sm p-3 bg-gray-50 rounded-lg">
                        Please select a date to see available time slots
                      </p>
                    )}
                  </div>

                  {/* Form Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={bookingLoading || !form.date || !form.timeSlot}
                      className={`flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-colors ${
                        bookingLoading || !form.date || !form.timeSlot
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {bookingLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader className="w-4 h-4 animate-spin" />
                          Booking...
                        </span>
                      ) : (
                        "Book Now"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </ResidentLayout>
  );
}
