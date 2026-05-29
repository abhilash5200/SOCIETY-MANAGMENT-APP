import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../api/axios";
import { Calendar, Users, CheckCircle, XCircle } from "lucide-react";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, [filter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/facilities/bookings/list");
      // Handle both wrapped and unwrapped response formats
      const bookingsData = Array.isArray(res.data) 
        ? res.data 
        : res.data?.data || [];
      setBookings(bookingsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/facilities/admin/stats/bookings");
      setStats(res.data?.data || res.data);
    } catch (err) {
      console.error(err);
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
      fetchBookings();
      alert("Booking cancelled successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "confirmed") return booking.status === "CONFIRMED";
    if (filter === "cancelled") return booking.status === "CANCELLED";
    if (filter === "completed") return booking.status === "COMPLETED";
    return true;
  });

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Bookings</h1>
        <p className="text-gray-500 mt-2">
          Manage and monitor all facility bookings
        </p>
      </div>

      {/* STATS */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.bookings?.total || 0}
                </p>
              </div>
              <Calendar size={32} className="text-blue-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Confirmed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.bookings?.confirmed || 0}
                </p>
              </div>
              <CheckCircle size={32} className="text-green-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Cancelled</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.bookings?.cancelled || 0}
                </p>
              </div>
              <XCircle size={32} className="text-red-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.bookings?.completed || 0}
                </p>
              </div>
              <CheckCircle size={32} className="text-purple-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Today's Bookings</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.bookings?.today || 0}
                </p>
              </div>
              <Calendar size={32} className="text-orange-500 opacity-50" />
            </div>
          </div>
        </div>
      )}

      {/* FILTERS */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: "all", label: "All Bookings" },
          { id: "confirmed", label: "Confirmed" },
          { id: "cancelled", label: "Cancelled" },
          { id: "completed", label: "Completed" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg transition ${
              filter === f.id
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* BOOKINGS TABLE */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading bookings...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No bookings found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-gray-700">
                    Facility
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-700">
                    Resident
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-700">
                    Flat
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-700">
                    Time Slot
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-3">
                      <span className="font-semibold text-gray-800">
                        {booking.facility?.name || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {booking.bookedBy?.name || "N/A"}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {booking.flat?.flatNumber || "N/A"}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {formatDate(booking.date)}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {booking.timeSlot}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      {booking.status === "CONFIRMED" && (
                        <button
                          onClick={() =>
                            handleCancelBooking(booking._id)
                          }
                          disabled={cancellingId === booking._id}
                          className="text-red-600 hover:text-red-800 font-medium text-sm disabled:opacity-50"
                        >
                          {cancellingId === booking._id
                            ? "Cancelling..."
                            : "Cancel"}
                        </button>
                      )}
                      {booking.status !== "CONFIRMED" && (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
