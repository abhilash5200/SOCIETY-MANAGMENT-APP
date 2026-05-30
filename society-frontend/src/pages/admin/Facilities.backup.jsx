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
  Users,
  MapPin
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../api/axios";

export default function AdminFacilities() {
  // ==================== STATE ====================

  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    capacity: ""
  });

  // ==================== LIFECYCLE ====================

  useEffect(() => {
    fetchFacilities();
  }, []);

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

    try {
      setSubmitting(true);

      if (editingId) {
        // Update
        await api.patch(`/facilities/${editingId}`, form);
        setMessage({
          type: "success",
          text: "Facility updated successfully!"
        });
      } else {
        // Create
        await api.post("/facilities", form);
        setMessage({
          type: "success",
          text: "Facility created successfully!"
        });
      }

      setTimeout(() => {
        resetForm();
        fetchFacilities();
      }, 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to save facility"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (facilityId) => {
    try {
      await api.patch(`/facilities/${facilityId}/toggle-status`);
      setMessage({
        type: "success",
        text: "Facility status updated"
      });
      fetchFacilities();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update facility status"
      });
    }
  };

  // ==================== HANDLERS ====================

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const openForm = (facility = null) => {
    if (facility) {
      setEditingId(facility._id);
      setForm({
        name: facility.name,
        description: facility.description || "",
        location: facility.location || "",
        capacity: facility.capacity || ""
      });
    } else {
      resetForm();
    }
    setShowForm(true);
    setMessage({ type: "", text: "" });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      description: "",
      location: "",
      capacity: ""
    });
    setShowForm(false);
    setMessage({ type: "", text: "" });
  };

  // ==================== RENDER ====================

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-gray-600">Loading facilities...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ==================== HEADER ==================== */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Facilities Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage all facility bookings and availability
            </p>
          </div>
          <button
            onClick={() => openForm()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add Facility
          </button>
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

        {/* ==================== FACILITIES TABLE ==================== */}
        {facilities.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-semibold">
              No facilities yet
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Click "Add Facility" to create your first facility
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Facility
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Capacity
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
                  {facilities.map((facility) => (
                    <tr key={facility._id} className="hover:bg-gray-50 transition-colors">
                      {/* Facility Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Building2 size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {facility.name}
                            </p>
                            {facility.description && (
                              <p className="text-sm text-gray-600">
                                {facility.description.substring(0, 40)}...
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin size={18} className="text-gray-500" />
                          <span>{facility.location}</span>
                        </div>
                      </td>

                      {/* Capacity */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Users size={18} className="text-gray-500" />
                          <span className="font-semibold text-gray-800">
                            {facility.capacity}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            facility.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {facility.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openForm(facility)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit facility"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() =>
                              handleToggleStatus(facility._id)
                            }
                            className={`p-2 rounded-lg transition-colors ${
                              facility.isActive
                                ? "text-red-600 hover:bg-red-50"
                                : "text-green-600 hover:bg-green-50"
                            }`}
                            title={
                              facility.isActive
                                ? "Disable facility"
                                : "Enable facility"
                            }
                          >
                            <Power size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== FORM MODAL ==================== */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              {/* Modal Header */}
              <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {editingId ? "Edit Facility" : "Add New Facility"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-white hover:bg-blue-700 p-1 rounded transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Facility Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Community Hall"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Describe the facility..."
                    rows={3}
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Block A, Ground Floor"
                    required
                  />
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Capacity (persons) *
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={form.capacity}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 50"
                    min="1"
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-colors ${
                      submitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader className="w-4 h-4 animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      editingId ? "Update" : "Create"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
