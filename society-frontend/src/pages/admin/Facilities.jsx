import { useEffect, useState } from "react";
import {
  Building2,
  Plus,
  Edit2,
  Power,
  X,
  Loader,
  CheckCircle,
  AlertCircle,
  Trash2,
  Clock,
  Users,
  MapPin,
  DollarSign,
  Tag,
  Trash,
  Save
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../api/axios";

export default function AdminFacilities() {
  // ==================== STATE ====================

  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });


  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    facilityType: "OTHER",
    capacity: "",
    bookingType: "FREE",
    price: 0,
    slots: [],
    amenities: []
  });

  const [slotForm, setSlotForm] = useState({
    startTime: "",
    endTime: "",
    capacity: 1
  });

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
      const res = await api.get("/facilities/admin/all");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.name.trim() || !form.location.trim() || !form.capacity) {
      setMessage({
        type: "error",
        text: "Please fill all required fields"
      });
      return;
    }

    if (form.capacity < 1) {
      setMessage({
        type: "error",
        text: "Capacity must be at least 1"
      });
      return;
    }

    if (form.bookingType === "PAID" && (!form.price || form.price <= 0)) {
      setMessage({
        type: "error",
        text: "Price is required for PAID facilities"
      });
      return;
    }

    if (form.slots.length === 0) {
      setMessage({
        type: "error",
        text: "Add at least one slot"
      });
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        ...form,
        capacity: parseInt(form.capacity),
        price: parseInt(form.price) || 0
      };

      if (editingId) {
        // Update
        await api.patch(`/facilities/${editingId}`, payload);
        setMessage({
          type: "success",
          text: "Facility updated successfully!"
        });
      } else {
        // Create
        await api.post("/facilities", payload);
        setMessage({
          type: "success",
          text: "Facility created successfully!"
        });
      }

      setTimeout(() => {
        resetForm();
        fetchFacilities();
      }, 1000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Operation failed"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddSlot = () => {
    if (!slotForm.startTime || !slotForm.endTime) {
      setMessage({
        type: "error",
        text: "Please fill all slot fields"
      });
      return;
    }

    if (slotForm.startTime >= slotForm.endTime) {
    setMessage({
      type: "error",
      text: "Start time must be before end time"
    });
    return;
  }

    const slot = {
      startTime: slotForm.startTime,
      endTime: slotForm.endTime,
      capacity: parseInt(slotForm.capacity) || 1,
      isActive: true
    };

    setForm({
      ...form,
      slots: [...form.slots, slot]
    });

    setSlotForm({ startTime: "", endTime: "", capacity: 1 });
  };

  const handleRemoveSlot = (index) => {
    setForm({
      ...form,
      slots: form.slots.filter((_, i) => i !== index)
    });
  };

  const handleToggleFacility = async (facilityId, currentStatus) => {
    try {
      await api.patch(`/facilities/${facilityId}/toggle`);
      setMessage({
        type: "success",
        text: `Facility ${currentStatus ? "disabled" : "enabled"}`
      });
      fetchFacilities();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to toggle facility"
      });
    }
  };

  const handleDelete = async (facilityId) => {
    if (!window.confirm("Are you sure you want to delete this facility?")) {
      return;
    }

    try {
      await api.delete(`/facilities/${facilityId}`);
      setMessage({
        type: "success",
        text: "Facility deleted successfully"
      });
      fetchFacilities();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to delete facility"
      });
    }
  };

  const handleEdit = (facility) => {
    setEditingId(facility._id);
    setForm({
      name: facility.name,
      description: facility.description,
      location: facility.location,
      facilityType: facility.facilityType || "OTHER",
      capacity: facility.capacity.toString(),
      bookingType: facility.bookingType || "FREE",
      price: facility.price || 0,
      slots: facility.slots || [],
      amenities: facility.amenities || []
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      location: "",
      facilityType: "OTHER",
      capacity: "",
      bookingType: "FREE",
      price: 0,
      slots: [],
      amenities: []
    });
    setEditingId(null);
    setShowForm(false);
  };

  // ==================== RENDER ====================

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Facilities</h1>
              <p className="text-gray-500">Manage facilities, slots, and pricing</p>
            </div>
          </div>
          <button
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
              showForm
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {showForm ? "Cancel" : "New Facility"}
          </button>
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

        {/* Create/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">
              {editingId ? "Edit Facility" : "Create New Facility"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Facility Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  <select
                    value={form.facilityType}
                    onChange={(e) => setForm({ ...form, facilityType: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="GYM">Gym</option>
                    <option value="LIBRARY">Library</option>
                    <option value="HALL">Hall</option>
                    <option value="ROOM">Room</option>
                    <option value="SPORTS">Sports</option>
                    <option value="PARKING">Parking</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                />

                <input
                  type="text"
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Booking Config */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Booking Configuration</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Booking Type
                    </label>
                    <select
                      value={form.bookingType}
                      onChange={(e) => setForm({ ...form, bookingType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="FREE">FREE</option>
                      <option value="PAID">PAID</option>
                    </select>
                  </div>

                  {form.bookingType === "PAID" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="Price"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacity
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Capacity"
                      value={form.capacity}
                      onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Slots */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Slots</h3>

                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input
                      type="time"
                      value={slotForm.startTime}
                      onChange={(e) =>
                        setSlotForm({ ...slotForm, startTime: e.target.value })
                      }
                      placeholder="Start Time"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    <input
                      type="time"
                      value={slotForm.endTime}
                      onChange={(e) =>
                        setSlotForm({ ...slotForm, endTime: e.target.value })
                      }
                      placeholder="End Time"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    <input
                      type="number"
                      min="1"
                      value={slotForm.capacity}
                      onChange={(e) =>
                        setSlotForm({ ...slotForm, capacity: e.target.value })
                      }
                      placeholder="Capacity"
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />

                    <button
                      type="button"
                      onClick={handleAddSlot}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                    >
                      Add Slot
                    </button>
                  </div>

                  {/* Slots List */}
                  {form.slots.length > 0 && (
                    <div className="space-y-2">
                      {form.slots.map((slot, idx) => (
                        <div
                          key={slot._id}
                          className="flex items-center justify-between bg-white p-3 rounded border border-gray-300"
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-600" />
                            <span className="font-medium">
                              {slot.startTime} - {slot.endTime}
                            </span>
                            <span className="text-sm text-gray-500">
                              Capacity: {slot.capacity}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSlot(slot._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 font-medium transition"
              >
                {submitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {editingId ? "Update Facility" : "Create Facility"}
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Facilities List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : facilities.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No facilities created yet</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {facilities.map((facility) => (
              <div
                key={facility._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                  {/* Info */}
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {facility.name}
                    </h3>
                    <p className="text-sm text-gray-500">{facility.facilityType}</p>
                    <div className="flex items-center gap-1 mt-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{facility.location}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Slots</p>
                      <p className="font-bold text-gray-900">
                        {facility.totalSlots || facility.slots?.length || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Booked</p>
                      <p className="font-bold text-gray-900">
                        {facility.bookedSlots || 0}
                      </p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <div className="flex items-center gap-2">
                      {facility.bookingType === "PAID" ? (
                        <>
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-bold">₹{facility.price}</span>
                        </>
                      ) : (
                        <>
                          <Tag className="w-4 h-4 text-blue-600" />
                          <span className="font-bold text-blue-600">FREE</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(facility)}
                      title="Edit"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleToggleFacility(facility._id, facility.isActive)}
                      title={facility.isActive ? "Disable" : "Enable"}
                      className={`p-2 rounded-lg transition ${
                        facility.isActive
                          ? "text-green-600 hover:bg-green-50"
                          : "text-red-600 hover:bg-red-50"
                      }`}
                    >
                      <Power className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleDelete(facility._id)}
                      title="Delete"
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Slots Display */}
                {facility.slots && facility.slots.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Slots:</p>
                    <div className="flex flex-wrap gap-2">
                      {facility.slots.map((slot) => (
                        <span
                          key={slot._id}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                        >
                          {slot.startTime} - {slot.endTime}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <span
                    className={`text-sm font-medium ${
                      facility.isActive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {facility.isActive ? "✓ Active" : "✕ Inactive"}
                  </span>
                  {facility.bookingType === "PAID" && (
                    <span className="text-sm text-gray-600">
                      Revenue: ₹{facility.totalRevenue || 0}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
