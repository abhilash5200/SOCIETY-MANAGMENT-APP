import { useEffect, useState } from "react";

import {
  Building2,
  Users,
  MapPin,
  Plus,
  X,
  Check,
  Trash2,
  AlertCircle,
  Lock,
  DollarSign
} from "lucide-react";

import ResidentLayout from "../../components/layout/ResidentLayout";
import api from "../../api/axios";

export default function ResidentFacilities() {

  const [facilities, setFacilities] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showBookingForm, setShowBookingForm] = useState(false);

  const [selectedFacility, setSelectedFacility] = useState(null);

  const [slotAvailability, setSlotAvailability] = useState(null);

  const [loadingSlots, setLoadingSlots] = useState(false);

  const [form, setForm] = useState({
    facilityId: "",
    date: "",
    timeSlot: ""
  });

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

  useEffect(() => {
    fetchFacilitiesAndBookings();
  }, []);

  // ================= FETCH =================

  const fetchFacilitiesAndBookings = async () => {

    try {

      const facilitiesRes = await api.get("/facilities");

      setFacilities(
        Array.isArray(facilitiesRes.data)
          ? facilitiesRes.data
          : facilitiesRes.data?.data || []
      );

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  // ================= CHECK SLOT AVAILABILITY =================

  const checkAvailability = async (facilityId, date) => {

    setLoadingSlots(true);

    try {

      const res = await api.get(
        "/facilities/availability/check",
        {
          params: {
            facilityId,
            date
          }
        }
      );

      setSlotAvailability(res.data);

    } catch (err) {

      console.error(err);

      setSlotAvailability(null);

    } finally {

      setLoadingSlots(false);

    }
  };

  // ================= OPEN BOOKING FORM =================

  const openBookingForm = facility => {

    setSelectedFacility(facility);

    setForm({
      facilityId: facility._id,
      date: "",
      timeSlot: ""
    });

    setSlotAvailability(null);

    setShowBookingForm(true);

  };

  // ================= HANDLE CHANGE =================

  const handleChange = e => {

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

    // Check availability when date changes
    if (
      name === "date" &&
      value &&
      form.facilityId
    ) {

      checkAvailability(
        form.facilityId,
        value
      );

    }
  };

  // ================= CREATE BOOKING =================

  const handleBooking = async e => {

    e.preventDefault();

    if (
      !form.date ||
      !form.timeSlot
    ) {

      alert(
        "Please select date and time slot"
      );

      return;

    }

    try {

      const bookingData = {
        facilityId: form.facilityId,
        date: form.date,
        timeSlot: form.timeSlot
      };

      await api.post(
        "/facilities/book/create",
        bookingData
      );

      setForm({
        facilityId: "",
        date: "",
        timeSlot: ""
      });

      setShowBookingForm(false);

      setSelectedFacility(null);

      await fetchFacilitiesAndBookings();

      alert(
        "Facility booked successfully!"
      );

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Failed to book facility"
      );

    }
  };

  // ================= CANCEL BOOKING =================

  const handleCancelBooking = async bookingId => {

    if (
      !window.confirm(
        "Are you sure you want to cancel this booking?"
      )
    ) {

      return;

    }

    try {

      await api.patch(
        `/facilities/cancel/${bookingId}`
      );

      fetchFacilitiesAndBookings();

      alert("Booking cancelled successfully!");

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Failed to cancel booking"
      );

    }
  };

  if (loading) {

    return (

      <ResidentLayout>

        <div className="flex justify-center items-center h-screen">

          <div className="text-gray-500">
            Loading...
          </div>

        </div>

      </ResidentLayout>

    );

  }

  return (

    <ResidentLayout>

      <div className="space-y-6">

        {/* ================= HEADER ================= */}

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Facility Booking
          </h1>

          <p className="text-gray-600 mt-2">
            Browse and book society facilities
          </p>

        </div>

        {/* ================= AVAILABLE FACILITIES ================= */}

        <div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">

            Available Facilities

          </h2>

          {facilities.length === 0 ? (

            <div className="bg-gray-100 p-6 rounded-lg text-center text-gray-600">

              No facilities available

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

              {facilities.map(facility => {

                return (

                  <div

                    key={facility._id}

                    className={`rounded-lg shadow-md p-6 hover:shadow-lg transition bg-white`}

                  >

                    <div className="flex items-start justify-between mb-3">

                      <Building2

                        size={32}

                        className="text-blue-600"

                      />

                    </div>

                    <h3 className="text-lg font-semibold text-gray-800">

                      {facility.name}

                    </h3>

                    {facility.description && (

                      <p className="text-gray-600 text-sm mt-2">

                        {facility.description}

                      </p>

                    )}

                    {facility.location && (

                      <div className="flex items-center gap-2 text-gray-600 mt-3">

                        <MapPin size={16} />

                        <span>
                          {facility.location}
                        </span>

                      </div>

                    )}

                    {facility.capacity && (

                      <div className="flex items-center gap-2 text-gray-600 mt-2">

                        <Users size={16} />

                        <span>
                          Capacity: {facility.capacity}
                        </span>

                      </div>

                    )}

                    <button

                      onClick={() =>
                        openBookingForm(facility)
                      }

                      disabled={!facility.isActive}

                      className={`mt-4 w-full font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2 ${
                        !facility.isActive
                          ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}

                    >

                      {!facility.isActive
                        ? "Unavailable"
                        : "Book Now"}

                    </button>

                  </div>

                );

              })}

            </div>

          )}

        </div>

        {/* ================= BOOKING MODAL ================= */}

        {showBookingForm && (

          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

            <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-h-96 overflow-y-auto">

              <div className="flex items-center justify-between mb-4">

                <div>

                  <h2 className="text-2xl font-bold text-gray-800">

                    Book {selectedFacility?.name}

                  </h2>

                  {selectedFacility?.isPaid && (

                    <p className="text-blue-600 font-semibold text-lg mt-1">

                      ₹{selectedFacility.price}

                    </p>

                  )}

                </div>

                <button

                  onClick={() => {

                    setShowBookingForm(false);

                    setSelectedFacility(null);

                    setSlotAvailability(null);

                  }}

                  className="text-gray-500 hover:text-gray-700"

                >

                  <X size={24} />

                </button>

              </div>

              <form
                onSubmit={handleBooking}
                className="space-y-4"
              >

                {/* DATE */}

                <div>

                  <label className="block text-gray-700 font-semibold mb-2">

                    Date

                  </label>

                  <input

                    type="date"

                    name="date"

                    value={form.date}

                    onChange={handleChange}

                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }

                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"

                    required

                  />

                </div>

                {/* TIME SLOT */}

                <div>

                  <label className="block text-gray-700 font-semibold mb-2">

                    Time Slot

                  </label>

                  {loadingSlots ? (

                    <p className="text-gray-600 text-sm">
                      Loading available slots...
                    </p>

                  ) : slotAvailability ? (

                    <div className="space-y-2 max-h-48 overflow-y-auto">

                      {slotAvailability.availability.map(
                        slot => (

                          <label

                            key={
                              slot.timeSlot
                            }

                            className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition ${
                              slot.available
                                ? "border-gray-300 hover:border-blue-600 hover:bg-blue-50"
                                : "border-red-300 bg-red-50 cursor-not-allowed"
                            }`}

                          >

                            <input

                              type="radio"

                              name="timeSlot"

                              value={
                                slot.timeSlot
                              }

                              checked={
                                form.timeSlot ===
                                slot.timeSlot
                              }

                              onChange={
                                handleChange
                              }

                              disabled={
                                !slot.available
                              }

                              className="w-4 h-4"

                            />

                            <span
                              className={`ml-3 font-semibold ${
                                slot.available
                                  ? "text-gray-800"
                                  : "text-gray-500 line-through"
                              }`}
                            >

                              {slot.timeSlot}

                            </span>

                            {!slot.available && (

                              <span className="ml-auto text-red-600 text-xs font-semibold">

                                BOOKED

                              </span>

                            )}

                          </label>

                        )
                      )}

                    </div>

                  ) : (

                    <p className="text-gray-600 text-sm">

                      Please select a date first

                    </p>

                  )}

                </div>

                {/* BUTTONS */}

                <div className="flex gap-3 pt-4">

                  <button

                    type="submit"

                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"

                  >

                    Confirm Booking

                  </button>

                  <button

                    type="button"

                    onClick={() => {

                      setShowBookingForm(false);

                      setSelectedFacility(null);

                      setSlotAvailability(null);

                    }}

                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition"

                  >

                    Cancel

                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </div>

    </ResidentLayout>

  );

}
