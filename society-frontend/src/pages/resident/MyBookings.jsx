import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  Building2,
  Trash2,
  CheckCircle,
  XCircle,
  Loader
} from "lucide-react";

import ResidentLayout from "../../components/layout/ResidentLayout";
import api from "../../api/axios";

export default function MyBookings() {
  // ==================== STATE ====================

  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const tabs = [
    { id: "upcoming", label: "Upcoming" },
    { id: "past", label: "Past" },
    { id: "cancelled", label: "Cancelled" }
  ];

  // ==================== LIFECYCLE ====================

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  // ==================== API CALLS ====================

  const fetchBookings = async () => {
    try {
      setLoading(true);
      let endpoint = "/facilities/bookings/upcoming";

      if (activeTab === "past") {
        endpoint = "/facilities/bookings/past";
      } else if (activeTab === "cancelled") {
        endpoint = "/facilities/bookings/cancelled";
      }

      const res = await api.get(endpoint);
      setBookings(res.data?.data || []);
      setMessage({ type: "", text: "" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to load bookings"
      });
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this booking? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setCancellingId(bookingId);
      await api.patch(`/facilities/booking/${bookingId}/cancel`);

      setMessage({
        type: "success",
        text: "Booking cancelled successfully"
      });

      setTimeout(() => {
        fetchBookings();
      }, 1000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to cancel booking"
      });
    } finally {
      setCancellingId(null);
    }
  };

  // ==================== HELPERS ====================

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-300";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle size={18} />;
      case "CANCELLED":
        return <XCircle size={18} />;
      default:
        return null;
    }
  };

  // ==================== RENDER ====================

  return (
    <ResidentLayout>
      <div className="space-y-6">
        {/* ==================== HEADER ==================== */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            My Bookings
          </h1>
          <p className="text-gray-600 mt-2">
            View and manage all your facility bookings
          </p>
        </div>

        {/* ==================== TABS ==================== */}
        <div className="flex gap-2 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-semibold transition-colors ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ==================== MESSAGE ==================== */}
        {message.text && (
          <div
            className={`p-4 rounded-lg flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <XCircle size={20} />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* ==================== CONTENT ==================== */}
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-gray-600">Loading bookings...</p>
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-semibold">
              No {activeTab} bookings
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {activeTab === "upcoming" &&
                "You don't have any upcoming bookings yet"}
              {activeTab === "past" &&
                "You don't have any past bookings yet"}
              {activeTab === "cancelled" &&
                "You don't have any cancelled bookings yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 size={24} />
                    <div>
                      <h3 className="text-lg font-semibold">
                        {booking.facility?.name}
                      </h3>
                      <p className="text-blue-100 text-sm">
                        {booking.flat?.flatNumber}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full border text-sm font-semibold flex items-center gap-1 ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {getStatusIcon(booking.status)}
                    {booking.status}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Date Info */}
                  <div className="flex items-start gap-3">
                    <Calendar size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-600 text-sm">Date</p>
                      <p className="font-semibold text-gray-800">
                        {formatDate(booking.date)}
                      </p>
                    </div>
                  </div>

                  {/* Time Slot Info */}
                  <div className="flex items-start gap-3">
                    <Clock size={20} className="text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-600 text-sm">Time Slot</p>
                      <p className="font-semibold text-gray-800">
                        {booking.timeSlot}
                      </p>
                    </div>
                  </div>

                  {/* Location Info */}
                  <div className="flex items-start gap-3">
                    <Building2 size={20} className="text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-600 text-sm">Location</p>
                      <p className="font-semibold text-gray-800">
                        {booking.facility?.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                {activeTab === "upcoming" && booking.status === "CONFIRMED" && (
                  <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end">
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={cancellingId === booking._id}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancellingId === booking._id ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <Trash2 size={18} />
                          Cancel Booking
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </ResidentLayout>
  );
}
