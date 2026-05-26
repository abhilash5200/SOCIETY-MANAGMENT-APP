import { useEffect, useState } from "react";

import {
  Building2,
  Users,
  MapPin,
  Plus,
  X,
  Check,
  Trash2
} from "lucide-react";

import ResidentLayout from "../../components/layout/ResidentLayout";
import api from "../../api/axios";

export default function ResidentFacilities() {

  const [facilities, setFacilities] = useState([]);

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showBookingForm, setShowBookingForm] = useState(false);

  const [selectedFacility, setSelectedFacility] = useState(null);

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

      const [facilitiesRes, bookingsRes] =
        await Promise.all([
          api.get("/facilities"),
          api.get("/facilities/bookings")
        ]);

      setFacilities(
        Array.isArray(facilitiesRes.data)
          ? facilitiesRes.data
          : []
      );

      setBookings(
        Array.isArray(bookingsRes.data)
          ? bookingsRes.data
          : []
      );

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

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

    setShowBookingForm(true);

  };

  // ================= HANDLE CHANGE =================

  const handleChange = e => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  // ================= CREATE BOOKING =================

  const handleBooking = async e => {

    e.preventDefault();

    if (!form.date || !form.timeSlot) {

      alert("Please select date and time slot");

      return;

    }

    try {

      const bookingData = {
        facilityId: form.facilityId,
        date: new Date(form.date).toISOString(),
        timeSlot: form.timeSlot
      };

      await api.post(
        "/facilities/book",
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

      alert("Facility booked successfully!");

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

  // ================= FILTER BOOKINGS =================

  const myBookings = bookings.filter(
    b => b.status === "CONFIRMED"
  );

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

              {facilities.map(facility => (

                <div

                  key={facility._id}

                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"

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

                      <span>{facility.location}</span>

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

                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"

                  >

                    <Plus size={18} />

                    Book Now

                  </button>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* ================= MY BOOKINGS ================= */}

        <div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">

            My Bookings

          </h2>

          {myBookings.length === 0 ? (

            <div className="bg-gray-100 p-6 rounded-lg text-center text-gray-600">

              No bookings yet

            </div>

          ) : (

            <div className="space-y-3">

              {myBookings.map(booking => (

                <div

                  key={booking._id}

                  className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between hover:shadow-lg transition"

                >

                  <div className="flex-1">

                    <h3 className="text-lg font-semibold text-gray-800">

                      {booking.facility.name}

                    </h3>

                    <p className="text-gray-600 text-sm mt-1">

                      📅 {new Date(
                        booking.date
                      ).toLocaleDateString()}

                    </p>

                    <p className="text-gray-600 text-sm">

                      ⏰ {booking.timeSlot}

                    </p>

                  </div>

                  <div className="flex items-center gap-3">

                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">

                      <Check size={16} />

                      {booking.status}

                    </span>

                    <button

                      onClick={() =>
                        handleCancelBooking(booking._id)
                      }

                      className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition"

                    >

                      <Trash2 size={18} />

                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* ================= BOOKING MODAL ================= */}

        {showBookingForm && (

          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

            <div className="bg-white rounded-lg shadow-lg p-6 w-96">

              <div className="flex items-center justify-between mb-4">

                <h2 className="text-2xl font-bold text-gray-800">

                  Book {selectedFacility?.name}

                </h2>

                <button

                  onClick={() => {

                    setShowBookingForm(false);

                    setSelectedFacility(null);

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

                  <select

                    name="timeSlot"

                    value={form.timeSlot}

                    onChange={handleChange}

                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"

                    required

                  >

                    <option value="">
                      Select a time slot
                    </option>

                    {timeSlots.map(slot => (

                      <option
                        key={slot}
                        value={slot}
                      >

                        {slot}

                      </option>

                    ))}

                  </select>

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
