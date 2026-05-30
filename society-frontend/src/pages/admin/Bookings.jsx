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
  Clock,
  CreditCard,
  DollarSign,
  TrendingUp,
  Eye
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../api/axios";

export default function AdminBookings() {
  // ==================== STATE ====================

  const [bookings, setBookings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [filter, setFilter] = useState("all"); // all, confirmed, cancelled, completed

  // ==================== LIFECYCLE ====================

  useEffect(() => {
    fetchData();
  }, []);

  // Clear message after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // ==================== API CALLS ====================

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchBookings(), fetchAnalytics()]);
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

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/facilities/admin/analytics");
      setAnalytics(res.data?.data);
    } catch (err) {
      console.error("Failed to load analytics:", err);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      setCancellingId(bookingId);
      await api.patch(`/facilities/bookings/${bookingId}/cancel`);
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

  const handleCompleteBooking = async (bookingId) => {
    try {
      await api.patch(`/facilities/bookings/${bookingId}/complete`);
      setMessage({
        type: "success",
        text: "Booking marked as completed"
      });
      fetchBookings();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to complete booking"
      });
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

  const getStatusBadge = (status, paymentStatus) => {
    if (status === "CONFIRMED") {
      return paymentStatus === "PAID" ? (
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
          Confirmed & Paid
        </span>
      ) : paymentStatus === "PENDING" ? (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
          Pending Payment
        </span>
      ) : (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
          Confirmed
        </span>
      );
    } else if (status === "COMPLETED") {
      return (
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
          Completed
        </span>
      );
    } else if (status === "CANCELLED") {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
          Cancelled
        </span>
      );
    }
  };

  const getPaymentBadge = (paymentStatus) => {
    const badges = {
      PAID: <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded">✓ Paid</span>,
      PENDING: (
        <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded">
          ⏱ Pending
        </span>
      ),
      REFUNDED: (
        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
          ↩ Refunded
        </span>
      ),
      FAILED: <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded">✕ Failed</span>
    };
    return badges[paymentStatus] || <span className="text-xs text-gray-500">-</span>;
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status.toLowerCase() === filter.toLowerCase();
  });

  // ==================== RENDER ====================

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
              <p className="text-gray-500">Manage facility bookings and payments</p>
            </div>
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

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Facilities */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Facilities</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {analytics.facilities.total}
                  </p>
                  <p className="text-xs text-green-600 mt-2">
                    {analytics.facilities.active} Active
                  </p>
                </div>
                <Building2 className="w-12 h-12 text-blue-100" />
              </div>
            </div>

            {/* Total Bookings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {analytics.bookings.total}
                  </p>
                  <p className="text-xs text-green-600 mt-2">
                    {analytics.bookings.confirmed} Confirmed
                  </p>
                </div>
                <Calendar className="w-12 h-12 text-green-100" />
              </div>
            </div>

            {/* Revenue */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    ₹{analytics.revenue.total.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 mt-2">
                    {analytics.bookingTypes.paid} Paid Bookings
                  </p>
                </div>
                <DollarSign className="w-12 h-12 text-yellow-100" />
              </div>
            </div>

            {/* Slots Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Slot Status</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {analytics.slots.total}
                  </p>
                  <p className="text-xs text-orange-600 mt-2">
                    {analytics.slots.occupiedToday} Occupied Today
                  </p>
                </div>
                <Clock className="w-12 h-12 text-orange-100" />
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-2">
          {["all", "confirmed", "cancelled", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition capitalize ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {status === "all" ? "All Bookings" : status}
            </button>
          ))}
        </div>

        {/* Bookings Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No bookings found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Facility
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Resident
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Date & Slot
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {booking.facility?.name || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.facility?.location}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {booking.bookedBy?.name || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            Flat {booking.flat?.flatNumber}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {formatDate(booking.date)}
                          </p>
                          <p className="text-xs text-gray-500">{booking.timeSlot}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          {booking.amount > 0 ? `₹${booking.amount}` : "FREE"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {getPaymentBadge(booking.paymentStatus)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(booking.status, booking.paymentStatus)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {booking.status === "CONFIRMED" && (
                            <button
                              onClick={() => handleCompleteBooking(booking._id)}
                              title="Mark as Completed"
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}

                          {booking.status !== "CANCELLED" && (
                            <button
                              onClick={() => handleCancelBooking(booking._id)}
                              disabled={cancellingId === booking._id}
                              title="Cancel Booking"
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                            >
                              {cancellingId === booking._id ? (
                                <Loader className="w-5 h-5 animate-spin" />
                              ) : (
                                <Trash2 className="w-5 h-5" />
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

            {/* Summary */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredBookings.length}</span> of{" "}
                <span className="font-semibold">{bookings.length}</span> bookings
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
