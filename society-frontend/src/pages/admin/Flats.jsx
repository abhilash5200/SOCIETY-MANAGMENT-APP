import { useEffect, useState } from "react";

import {
  Building2,
  Home,
  Users,
  UserCheck,
  PlusCircle
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import api from "../../api/axios";

export default function Flats() {

  const [flats, setFlats] =
    useState([]);

  const [residents, setResidents] =
    useState([]);

  // ================= ADD FLAT =================

  const [form, setForm] =
    useState({

      block: "",
      flatNumber: "",
      floor: ""

    });

  // ================= PER ROW FLAT SELECTION =================

  const [selectedFlats, setSelectedFlats] =
    useState({});

  useEffect(() => {

    fetchFlats();

    fetchResidents();

  }, []);

  // ================= FETCH FLATS =================

  const fetchFlats = async () => {

    try {

      const res =
        await api.get("/flats");

      setFlats(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {

      console.error(err);

    }
  };

  // ================= FETCH RESIDENTS =================

  const fetchResidents = async () => {

    try {

      const res =
        await api.get("/residents");

      setResidents(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {

      console.error(
        "Residents fetch error:",
        err
      );

    }
  };

  // ================= HANDLE FORM =================

  const handleChange = e =>

    setForm({

      ...form,

      [e.target.name]:
      e.target.value

    });

  // ================= ADD FLAT =================

  const handleAddFlat = async e => {

    e.preventDefault();

    try {

      await api.post(
        "/flats",
        form
      );

      setForm({

        block: "",
        flatNumber: "",
        floor: ""

      });

      fetchFlats();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Failed to add flat"
      );

    }
  };

  // ================= ALLOCATE FLAT =================

  const allocateFlat = async residentId => {

    const selectedFlat =
      selectedFlats[residentId];

    if (!selectedFlat) {

      alert("Select a flat");

      return;
    }

    try {

      await api.post(
        "/residents/assign",
        {
          userId: residentId,
          flatId: selectedFlat,
          isOwner: true
        }
      );

      alert(
        "Flat allocated successfully"
      );

      setSelectedFlats(prev => ({

        ...prev,

        [residentId]: ""

      }));

      fetchFlats();

      fetchResidents();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Allocation failed"
      );

    }
  };

  // ================= STATS =================

  const occupied =
    flats.filter(
      f => f.residents?.length > 0
    );

  const vacant =
    flats.filter(
      f => !f.residents?.length
    );

  const pendingResidents =
    residents.filter(
      r => !r.flat
    );

  return (

    <DashboardLayout>

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">

          Flats Management

        </h1>

        <p className="text-gray-500 mt-2">

          Manage society flats and resident allocations

        </p>

      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <StatCard
          title="Total Flats"
          value={flats.length}
          color="bg-indigo-600"
          icon={<Building2 />}
        />

        <StatCard
          title="Occupied"
          value={occupied.length}
          color="bg-green-600"
          icon={<Home />}
        />

        <StatCard
          title="Vacant"
          value={vacant.length}
          color="bg-red-500"
          icon={<Building2 />}
        />

        <StatCard
          title="Pending Allocation"
          value={pendingResidents.length}
          color="bg-orange-500"
          icon={<Users />}
        />

      </div>

      {/* ADD FLAT */}

      <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">

        <div className="flex items-center gap-4 mb-6">

          <div className="bg-indigo-100 text-indigo-600 p-4 rounded-2xl">

            <PlusCircle size={28} />

          </div>

          <div>

            <h2 className="text-2xl font-bold">

              Add New Flat

            </h2>

            <p className="text-gray-500">

              Create and manage society flats

            </p>

          </div>

        </div>

        <form
          onSubmit={handleAddFlat}
          className="grid md:grid-cols-2 xl:grid-cols-4 gap-5"
        >

          <input
            name="block"
            placeholder="Block (A/B/C)"
            value={form.block}
            onChange={handleChange}
            className="border rounded-2xl p-4"
            required
          />

          <input
            name="flatNumber"
            placeholder="Flat Number"
            value={form.flatNumber}
            onChange={handleChange}
            className="border rounded-2xl p-4"
            required
          />

          <input
            name="floor"
            type="number"
            placeholder="Floor"
            value={form.floor}
            onChange={handleChange}
            className="border rounded-2xl p-4"
            required
          />

          <button
            className="bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-2xl font-semibold p-4"
          >

            Add Flat

          </button>

        </form>

      </div>

      {/* RESIDENT ALLOCATION */}

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">

        <div className="p-6 border-b">

          <h2 className="text-2xl font-bold">

            Resident Flat Allocation

          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr className="text-left">

                <th className="p-5">
                  Resident
                </th>

                <th>
                  Email
                </th>

                <th>
                  Status
                </th>

                <th>
                  Select Flat
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {residents.map(r => (

                <tr
                  key={r._id}
                  className="border-t hover:bg-gray-50 transition"
                >

                  {/* NAME */}

                  <td className="p-5 font-semibold">

                    {r.name}

                  </td>

                  {/* EMAIL */}

                  <td>

                    {r.email}

                  </td>

                  {/* STATUS */}

                  <td>

                    {r.flat ? (

                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold">

                        Allocated

                      </span>

                    ) : (

                      <span className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm font-semibold">

                        Not Allocated

                      </span>

                    )}

                  </td>

                  {/* SELECT FLAT */}

                  <td>

                    {!r.flat && (

                      <select
                        className="border rounded-2xl p-3 min-w-[180px]"
                        value={
                          selectedFlats[r._id] || ""
                        }
                        onChange={e =>
                          setSelectedFlats(prev => ({

                            ...prev,

                            [r._id]:
                              e.target.value

                          }))
                        }
                      >

                        <option value="">
                          Select Flat
                        </option>

                        {flats
                          .filter(
                            f =>
                              !f.residents?.length
                          )
                          .map(f => (

                            <option
                              key={f._id}
                              value={f._id}
                            >

                              {f.block}-
                              {f.flatNumber}

                            </option>

                          ))}

                      </select>

                    )}

                  </td>

                  {/* ACTION */}

                  <td>

                    {!r.flat ? (

                      <button
                        onClick={() =>
                          allocateFlat(r._id)
                        }
                        className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-5 py-3 rounded-2xl font-semibold flex items-center gap-2"
                      >

                        <UserCheck size={18} />

                        Allocate

                      </button>

                    ) : (

                      <span className="text-gray-500 font-medium">

                        Completed

                      </span>

                    )}

                  </td>

                </tr>

              ))}

              {residents.length === 0 && (

                <tr>

                  <td
                    colSpan="5"
                    className="text-center p-10 text-gray-500"
                  >

                    No residents found

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* FLATS TABLE */}

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="text-2xl font-bold">

            Flat Records

          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr className="text-left">

                <th className="p-5">
                  Block
                </th>

                <th>
                  Flat No
                </th>

                <th>
                  Floor
                </th>

                <th>
                  Residents
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {flats.map(f => (

                <tr
                  key={f._id}
                  className="border-t hover:bg-gray-50 transition"
                >

                  <td className="p-5 font-semibold">

                    {f.block}

                  </td>

                  <td>

                    {f.flatNumber}

                  </td>

                  <td>

                    {f.floor}

                  </td>

                  <td>

                    {f.residents?.length > 0
                      ? f.residents.length
                      : "None"}

                  </td>

                  <td>

                    {f.residents?.length > 0 ? (

                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold">

                        Occupied

                      </span>

                    ) : (

                      <span className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm font-semibold">

                        Vacant

                      </span>

                    )}

                  </td>

                </tr>

              ))}

              {flats.length === 0 && (

                <tr>

                  <td
                    colSpan="5"
                    className="text-center p-10 text-gray-500"
                  >

                    No flats found

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </DashboardLayout>

  );
}


// ================= STAT CARD =================

function StatCard({
  title,
  value,
  color,
  icon
}) {

  return (

    <div className="bg-white rounded-3xl shadow-lg p-6 flex items-center gap-5 hover:shadow-2xl transition">

      <div className={`${color} text-white p-4 rounded-2xl`}>

        {icon}

      </div>

      <div>

        <p className="text-gray-500">

          {title}

        </p>

        <h2 className="text-3xl font-bold mt-1">

          {value}

        </h2>

      </div>

    </div>

  );
}