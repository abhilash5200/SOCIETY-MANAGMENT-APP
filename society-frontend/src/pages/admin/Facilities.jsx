import { useEffect, useState } from "react";

import {
  Building2,
  Plus,
  X,
  Trash2,
  Edit2
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import api from "../../api/axios";

export default function Facilities() {

  const [facilities, setFacilities] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    capacity: ""
  });

  useEffect(() => {
    fetchFacilities();
  }, []);

  // ================= FETCH =================

  const fetchFacilities = async () => {

    try {

      const res = await api.get(
        "/facilities/admin/all"
      );

      setFacilities(
        Array.isArray(res.data?.data)
          ? res.data.data
          : res.data
      );

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  // ================= HANDLE CHANGE =================

  const handleChange = e => {

    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : value
    });

  };

  // ================= OPEN FORM =================

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

      setEditingId(null);

      setForm({
        name: "",
        description: "",
        location: "",
        capacity: ""
      });

    }

    setShowForm(true);

  };

  // ================= CREATE/UPDATE =================

  const handleSubmit = async e => {

    e.preventDefault();

    if (!form.name.trim()) {

      alert("Please enter facility name");

      return;

    }

    try {

      if (editingId) {

        await api.patch(
          `/facilities/${editingId}`,
          form
        );

        alert(
          "Facility updated successfully!"
        );

      } else {

        await api.post("/facilities", form);

        alert(
          "Facility created successfully!"
        );

      }

      setForm({
        name: "",
        description: "",
        location: "",
        capacity: ""
      });

      setEditingId(null);

      setShowForm(false);

      fetchFacilities();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Failed to save facility"
      );

    }
  };

  // ================= TOGGLE STATUS =================

  const handleToggleStatus = async facilityId => {

    try {

      await api.patch(
        `/facilities/${facilityId}/toggle-status`
      );

      fetchFacilities();

      alert(
        "Facility status updated successfully!"
      );

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Failed to toggle facility status"
      );

    }
  };

  if (loading) {

    return (

      <DashboardLayout>

        <div className="flex justify-center items-center h-screen">

          <div className="text-gray-500">
            Loading...
          </div>

        </div>

      </DashboardLayout>

    );

  }

  return (

    <DashboardLayout>

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">

          Facility Management

        </h1>

        <p className="text-gray-500 mt-2">

          Create and manage society facilities

        </p>

      </div>

      {/* CREATE BUTTON */}

      <div className="mb-6">

        <button

          onClick={() => openForm()}

          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center gap-2"

        >

          <Plus size={20} />

          Add Facility

        </button>

      </div>

      {/* FACILITIES TABLE */}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">

        {facilities.length === 0 ? (

          <div className="p-8 text-center text-gray-500">

            No facilities yet. Create one to get started!

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-100 border-b">

                <tr>

                  <th className="text-left px-6 py-3 font-semibold text-gray-700">

                    Name

                  </th>

                  <th className="text-left px-6 py-3 font-semibold text-gray-700">

                    Description

                  </th>

                  <th className="text-left px-6 py-3 font-semibold text-gray-700">

                    Location

                  </th>

                  <th className="text-left px-6 py-3 font-semibold text-gray-700">

                    Capacity

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

                {facilities.map(facility => (

                  <tr

                    key={facility._id}

                    className="border-b hover:bg-gray-50 transition"

                  >

                    <td className="px-6 py-3">

                      <div className="flex items-center gap-3">

                        <Building2

                          size={20}

                          className="text-indigo-600"

                        />

                        <span className="font-semibold text-gray-800">

                          {facility.name}

                        </span>

                      </div>

                    </td>

                    <td className="px-6 py-3 text-gray-600">

                      {facility.description ||
                        "-"}

                    </td>

                    <td className="px-6 py-3 text-gray-600">

                      {facility.location || "-"}

                    </td>

                    <td className="px-6 py-3 text-gray-600">

                      {facility.capacity || "-"}

                    </td>

                    <td className="px-6 py-3">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          facility.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >

                        {facility.isActive
                          ? "Active"
                          : "Inactive"}

                      </span>

                    </td>

                    <td className="px-6 py-3">

                      <div className="flex gap-2">

                        <button

                          onClick={() =>
                            openForm(facility)
                          }

                          className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-lg transition"

                        >

                          <Edit2 size={18} />

                        </button>

                        <button

                          onClick={() =>
                            handleToggleStatus(
                              facility._id
                            )
                          }

                          className={`text-white p-2 rounded-lg transition ${
                            facility.isActive
                              ? "bg-red-100 hover:bg-red-200 text-red-600"
                              : "bg-green-100 hover:bg-green-200 text-green-600"
                          }`}

                        >

                          {facility.isActive ? "Disable" : "Enable"}

                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* FORM MODAL */}

      {showForm && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">

            <div className="p-6 sticky top-0 bg-white border-b">

              <div className="flex items-center justify-between">

                <h2 className="text-2xl font-bold text-gray-800">

                  {editingId
                    ? "Edit Facility"
                    : "Add Facility"}

                </h2>

                <button

                  onClick={() => {

                    setShowForm(false);

                    setEditingId(null);

                  }}

                  className="text-gray-500 hover:text-gray-700"

                >

                  <X size={24} />

                </button>

              </div>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-6"
            >

              {/* NAME */}

              <div>

                <label className="block text-gray-700 font-semibold mb-2">

                  Facility Name

                </label>

                <input

                  type="text"

                  name="name"

                  value={form.name}

                  onChange={handleChange}

                  placeholder="e.g., Community Hall"

                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"

                  required

                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="block text-gray-700 font-semibold mb-2">

                  Description

                </label>

                <textarea

                  name="description"

                  value={form.description}

                  onChange={handleChange}

                  placeholder="Brief description of the facility"

                  rows="3"

                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"

                />

              </div>

              {/* LOCATION */}

              <div>

                <label className="block text-gray-700 font-semibold mb-2">

                  Location

                </label>

                <input

                  type="text"

                  name="location"

                  value={form.location}

                  onChange={handleChange}

                  placeholder="e.g., Ground Floor"

                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"

                />

              </div>

              {/* CAPACITY */}

              <div>

                <label className="block text-gray-700 font-semibold mb-2">

                  Capacity

                </label>

                <input

                  type="number"

                  name="capacity"

                  value={form.capacity}

                  onChange={handleChange}

                  placeholder="e.g., 100"

                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"

                />

              </div>

              {/* STATUS */}

              <div className="flex items-center gap-3">

                <input

                  type="checkbox"

                  id="isActive"

                  name="isActive"

                  checked={form.isActive}

                  onChange={handleChange}

                  className="w-4 h-4 text-indigo-600 cursor-pointer"

                />

                <label
                  htmlFor="isActive"
                  className="text-gray-700 font-semibold cursor-pointer"
                >

                  Active

                </label>

              </div>

              {/* PAID/FREE */}

              <div className="flex items-center gap-3">

                <input

                  type="checkbox"

                  id="isPaid"

                  name="isPaid"

                  checked={form.isPaid}

                  onChange={handleChange}

                  className="w-4 h-4 text-indigo-600 cursor-pointer"

                />

                <label
                  htmlFor="isPaid"
                  className="text-gray-700 font-semibold cursor-pointer"
                >

                  Paid Facility

                </label>

              </div>

              {/* PRICE (CONDITIONAL) */}

              {form.isPaid && (

                <div>

                  <label className="block text-gray-700 font-semibold mb-2">

                    Price (₹)

                  </label>

                  <input

                    type="number"

                    name="price"

                    value={form.price}

                    onChange={handleChange}

                    placeholder="e.g., 500"

                    step="0.01"

                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"

                    required={form.isPaid}

                  />

                </div>

              )}

              {/* MAX SLOTS */}

              <div>

                <label className="block text-gray-700 font-semibold mb-2">

                  Max Slots Per Day

                </label>

                <input

                  type="number"

                  name="maxSlotsPerDay"

                  value={form.maxSlotsPerDay}

                  onChange={handleChange}

                  min="1"

                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"

                />

              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 pt-8 pb-2">

                <button

                  type="submit"

                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"

                >

                  {editingId
                    ? "Update Facility"
                    : "Create Facility"}

                </button>

                <button

                  type="button"

                  onClick={() => {

                    setShowForm(false);

                    setEditingId(null);

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

    </DashboardLayout>

  );

}
