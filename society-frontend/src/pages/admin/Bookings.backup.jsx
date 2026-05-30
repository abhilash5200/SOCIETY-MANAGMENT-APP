import { useEffect, useState } from "react";
import {
  Calendar,
  Users,
  Building2,
  CheckCircle,
  XCircle,
  Trash2,
  Loader,
  AlertCircle,
  BarChart3,
  Clock
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../api/axios";

export default function AdminBookings() {
  // ==================== STATE ====================

  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  // ==================== LIFECYCLE ====================

  useEffect(() => {
    fetchData();
  }, []);

  // ==================== API CALLS ====================

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchBookings(), fetchStats()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await api.get("/facilities/bookings/list");
      setBookings(res.data?.data || []);
    } catch (err) {
      setMessage({
        type: "error",
        text: "Failed to load bookings"
      });
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/facilities/admin/stats/bookings");
      setStats(res.data?.data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this booking?"
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
      fetchBookings();
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
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ==================== HEADER ==================== */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Bookings Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor all facility bookings and manage reservations
          </p>
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
              <AlertCircle size={20} />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* ==================== STATISTICS ==================== */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Total Facilities */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Facilities</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.facilities?.total}
                  </p>
                </div>
                <Building2 className="w-12 h-12 text-blue-100" />
              </div>
            </div>

            {/* Active Facilities */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.facilities?.active}
                  </p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-100" />
              </div>
            </div>

            {/* Total Bookings */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.bookings?.total}
                  </p>
                </div>
                <Calendar className="w-12 h-12 text-purple-100" />
              </div>
            </div>

            {/* Confirmed Bookings */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Confirmed</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.bookings?.confirmed}
                  </p>
                </div>
                <Users className="w-12 h-12 text-yellow-100" />
              </div>
            </div>

            {/* Today's Bookings */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Today's Bookings</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.bookings?.today}
                  </p>
                </div>
                <Clock className="w-12 h-12 text-red-100" />
              </div>
            </div>
          </div>
        )}

        {/* ==================== BOOKINGS TABLE ==================== */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">
              All Bookings
            </h2>
          </div>

          {bookings.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-semibold">
                No bookings yet
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Facility
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Resident
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Flat
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                      {/* Facility */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 size={18} className="text-blue-600" />
                          <span className="font-semibold text-gray-800">
                            {booking.facility?.name}
                          </span>
                        </div>
                      </td>

                      {/* Resident */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {booking.bookedBy?.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.bookedBy?.email}
                          </p>
                        </div>
                      </td>

                      {/* Flat */}
                      <td className="px-6 py-4 text-gray-700">
                        {booking.flat?.flatNumber}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-gray-700">
                        {formatDate(booking.date)}
                      </td>

                      {/* Time */}
                      <td className="px-6 py-4 text-gray-700">
                        {booking.timeSlot}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {getStatusIcon(booking.status)}
                          {booking.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end">
                          {booking.status === "CONFIRMED" && (
                            <button
                              onClick={() =>
                                handleCancelBooking(booking._id)
                              }
                              disabled={cancellingId === booking._id}
                              className={`p-2 rounded-lg transition-colors ${
                                cancellingId === booking._id
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-red-600 hover:bg-red-50"
                              }`}
                              title="Cancel booking"
                            >
                              {cancellingId === booking._id ? (
                                <Loader className="w-5 h-5 animate-spin" />
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ==================== STATS SUMMARY ==================== */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Booking Status Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 size={20} />
                Booking Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Confirmed</span>
                  <span className="font-bold text-green-600">
                    {stats.bookings?.confirmed}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Cancelled</span>
                  <span className="font-bold text-red-600">
                    {stats.bookings?.cancelled}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-bold text-blue-600">
                    {stats.bookings?.completed}
                  </span>
                </div>
              </div>
            </div>

            {/* Facility Availability */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 size={20} />
                Facility Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total</span>
                  <span className="font-bold text-gray-800">
                    {stats.facilities?.total}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active</span>
                  <span className="font-bold text-green-600">
                    {stats.facilities?.active}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Inactive</span>
                  <span className="font-bold text-red-600">
                    {stats.facilities?.inactive}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
