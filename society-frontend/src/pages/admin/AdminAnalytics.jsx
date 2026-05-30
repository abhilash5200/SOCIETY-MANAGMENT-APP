import { useEffect, useState } from "react";
import {
  BarChart3,
  Building2,
  Calendar,
  DollarSign,
  Clock,
  TrendingUp,
  Users,
  Loader,
  AlertCircle
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../api/axios";

export default function AdminAnalytics() {
  // ==================== STATE ====================

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // ==================== LIFECYCLE ====================

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // ==================== API CALLS ====================

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get("/facilities/admin/analytics");
      setAnalytics(res.data?.data);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to load analytics"
      });
    } finally {
      setLoading(false);
    }
  };

  // ==================== RENDER ====================

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-500">Facility management insights and metrics</p>
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
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{message.text}</p>
          </div>
        )}

        {/* Analytics Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : analytics ? (
          <>
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Facilities */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Total Facilities
                  </h3>
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-bold text-gray-900">
                    {analytics.facilities.total}
                  </p>
                  <p className="text-sm text-green-600">
                    {analytics.facilities.active} active,{" "}
                    {analytics.facilities.inactive} inactive
                  </p>
                </div>
              </div>

              {/* Total Bookings */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Total Bookings
                  </h3>
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-bold text-gray-900">
                    {analytics.bookings.total}
                  </p>
                  <p className="text-sm text-green-600">
                    {analytics.bookings.confirmed} confirmed,{" "}
                    {analytics.bookings.completed} completed
                  </p>
                </div>
              </div>

              {/* Revenue */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Total Revenue
                  </h3>
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-bold text-gray-900">
                    ₹{analytics.revenue.total.toLocaleString()}
                  </p>
                  <p className="text-sm text-yellow-600">
                    From {analytics.bookingTypes.paid} paid bookings
                  </p>
                </div>
              </div>

              {/* Slot Status */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Slot Occupancy
                  </h3>
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-bold text-gray-900">
                    {analytics.slots.total}
                  </p>
                  <p className="text-sm text-orange-600">
                    {analytics.slots.occupiedToday} occupied today
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Status Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Confirmed */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Confirmed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics.bookings.confirmed}
                    </p>
                  </div>
                </div>
              </div>

              {/* Completed */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics.bookings.completed}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cancelled */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cancelled</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics.bookings.cancelled}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Booking Types */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Booking Types
                </h2>

                <div className="space-y-6">
                  {/* Free Bookings */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-gray-700">Free Bookings</p>
                      <span className="text-2xl font-bold text-blue-600">
                        {analytics.bookingTypes.free}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${
                            analytics.bookings.total > 0
                              ? (analytics.bookingTypes.free /
                                  analytics.bookings.total) *
                                100
                              : 0
                          }%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {analytics.bookings.total > 0
                        ? Math.round(
                            (analytics.bookingTypes.free /
                              analytics.bookings.total) *
                              100
                          )
                        : 0}
                      % of total bookings
                    </p>
                  </div>

                  {/* Paid Bookings */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-gray-700">Paid Bookings</p>
                      <span className="text-2xl font-bold text-green-600">
                        {analytics.bookingTypes.paid}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${
                            analytics.bookings.total > 0
                              ? (analytics.bookingTypes.paid /
                                  analytics.bookings.total) *
                                100
                              : 0
                          }%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {analytics.bookings.total > 0
                        ? Math.round(
                            (analytics.bookingTypes.paid /
                              analytics.bookings.total) *
                              100
                          )
                        : 0}
                      % of total bookings
                    </p>
                  </div>
                </div>
              </div>

              {/* Slot Distribution */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Slot Distribution
                </h2>

                <div className="space-y-6">
                  {/* Total Slots */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-gray-700">Total Slots</p>
                      <span className="text-2xl font-bold text-gray-900">
                        {analytics.slots.total}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Across all active facilities
                    </p>
                  </div>

                  {/* Occupied Slots */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-gray-700">
                        Occupied (Today)
                      </p>
                      <span className="text-2xl font-bold text-orange-600">
                        {analytics.slots.occupiedToday}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full"
                        style={{
                          width: `${
                            analytics.slots.total > 0
                              ? (analytics.slots.occupiedToday /
                                  analytics.slots.total) *
                                100
                              : 0
                          }%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {analytics.slots.total > 0
                        ? Math.round(
                            (analytics.slots.occupiedToday /
                              analytics.slots.total) *
                              100
                          )
                        : 0}
                      % occupancy rate
                    </p>
                  </div>

                  {/* Available Slots */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-gray-700">Available</p>
                      <span className="text-2xl font-bold text-green-600">
                        {Math.max(
                          0,
                          analytics.slots.total - analytics.slots.occupiedToday
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Ready for booking
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Today's Activity
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <p className="text-sm text-gray-600">Today's Bookings</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics.bookings.today}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <p className="text-sm text-gray-600">Slots in Use</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics.slots.occupiedToday}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-gray-600">Active Residents</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics.bookings.today}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Unable to load analytics</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
