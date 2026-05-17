import { useEffect, useState } from "react";

import {
  Car,
  ParkingCircle,
  Building2,
  CheckCircle,
  PlusCircle,
  Link2
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import api from "../../api/axios";

export default function Parking() {

  const [slots, setSlots] =
    useState([]);

  const [flats, setFlats] =
    useState([]);

  // ================= CREATE FORM =================

  const [createForm, setCreateForm] =
    useState({

      slotNumber: "",
      type: "RESIDENT"

    });

  // ================= ASSIGN FORM =================

  const [assignForm, setAssignForm] =
    useState({

      slotId: "",
      flatId: ""

    });

  useEffect(() => {

    fetchSlots();

    fetchFlats();

  }, []);

  // ================= FETCH SLOTS =================

  const fetchSlots = async () => {

    try {

      const res =
        await api.get(
          "/parking/slots"
        );

      setSlots(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {

      console.error(
        "Slots error:",
        err
      );

    }
  };

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

      console.error(
        "Flats error:",
        err
      );

    }
  };

  // ================= HANDLE CREATE =================

  const handleCreateChange = e =>

    setCreateForm({

      ...createForm,

      [e.target.name]:
      e.target.value

    });

  // ================= HANDLE ASSIGN =================

  const handleAssignChange = e =>

    setAssignForm({

      ...assignForm,

      [e.target.name]:
      e.target.value

    });

  // ================= CREATE SLOT =================

  const createSlot = async e => {

    e.preventDefault();

    try {

      await api.post(
        "/parking/slots",
        createForm
      );

      setCreateForm({

        slotNumber: "",
        type: "RESIDENT"

      });

      fetchSlots();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Failed to create slot"
      );

    }
  };

  // ================= ASSIGN SLOT =================

  const assignSlot = async e => {

    e.preventDefault();

    if (
      !assignForm.slotId ||
      !assignForm.flatId
    ) {

      alert(
        "Select slot and flat"
      );

      return;
    }

    try {

      await api.patch(

        `/parking/slots/${assignForm.slotId}/assign`,

        {
          flatId:
          assignForm.flatId
        }

      );

      setAssignForm({

        slotId: "",
        flatId: ""

      });

      fetchSlots();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Assignment failed"
      );

    }
  };

  // ================= STATS =================

  const occupiedSlots =
    slots.filter(
      s => s.flat
    );

  const vacantSlots =
    slots.filter(
      s => !s.flat
    );

  const residentSlots =
    slots.filter(
      s => s.type === "RESIDENT"
    );

  return (

    <DashboardLayout>

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">

          Parking Management

        </h1>

        <p className="text-gray-500 mt-2">

          Manage parking slots and flat allocations

        </p>

      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <StatCard
          title="Total Slots"
          value={slots.length}
          color="bg-indigo-600"
          icon={<ParkingCircle />}
        />

        <StatCard
          title="Occupied"
          value={occupiedSlots.length}
          color="bg-green-600"
          icon={<CheckCircle />}
        />

        <StatCard
          title="Vacant"
          value={vacantSlots.length}
          color="bg-red-500"
          icon={<Car />}
        />

        <StatCard
          title="Resident Slots"
          value={residentSlots.length}
          color="bg-orange-500"
          icon={<Building2 />}
        />

      </div>

      {/* CREATE SLOT */}

      <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">

        <div className="flex items-center gap-4 mb-6">

          <div className="bg-indigo-100 text-indigo-600 p-4 rounded-2xl">

            <PlusCircle size={28} />

          </div>

          <div>

            <h2 className="text-2xl font-bold">

              Create Parking Slot

            </h2>

            <p className="text-gray-500">

              Add resident or visitor parking slots

            </p>

          </div>

        </div>

        <form
          onSubmit={createSlot}
          className="grid md:grid-cols-2 xl:grid-cols-3 gap-5"
        >

          {/* SLOT */}

          <input
            name="slotNumber"
            placeholder="Slot Number (A-01)"
            value={createForm.slotNumber}
            onChange={handleCreateChange}
            className="border rounded-2xl p-4"
            required
          />

          {/* TYPE */}

          <select
            name="type"
            value={createForm.type}
            onChange={handleCreateChange}
            className="border rounded-2xl p-4"
          >

            <option value="RESIDENT">

              Resident

            </option>

            <option value="VISITOR">

              Visitor

            </option>

          </select>

          {/* BUTTON */}

          <button
            className="bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-2xl font-semibold p-4"
          >

            Create Slot

          </button>

        </form>

      </div>

      {/* ASSIGN SLOT */}

      <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">

        <div className="flex items-center gap-4 mb-6">

          <div className="bg-green-100 text-green-600 p-4 rounded-2xl">

            <Link2 size={28} />

          </div>

          <div>

            <h2 className="text-2xl font-bold">

              Assign Slot to Flat

            </h2>

            <p className="text-gray-500">

              Allocate parking slots to residents

            </p>

          </div>

        </div>

        <form
          onSubmit={assignSlot}
          className="grid md:grid-cols-2 xl:grid-cols-3 gap-5"
        >

          {/* SLOT */}

          <select
            name="slotId"
            value={assignForm.slotId}
            onChange={handleAssignChange}
            className="border rounded-2xl p-4"
            required
          >

            <option value="">
              Select Slot
            </option>

            {slots.map(s => (

              <option
                key={s._id}
                value={s._id}
              >

                {s.slotNumber}

              </option>

            ))}

          </select>

          {/* FLAT */}

          <select
            name="flatId"
            value={assignForm.flatId}
            onChange={handleAssignChange}
            className="border rounded-2xl p-4"
            required
          >

            <option value="">
              Select Flat
            </option>

            {flats.map(f => (

              <option
                key={f._id}
                value={f._id}
              >

                {f.block}-
                {f.flatNumber}

              </option>

            ))}

          </select>

          {/* BUTTON */}

          <button
            className="bg-green-600 hover:bg-green-700 transition text-white rounded-2xl font-semibold p-4"
          >

            Assign Slot

          </button>

        </form>

      </div>

      {/* SLOT LIST */}

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="text-2xl font-bold">

            Parking Slot Records

          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr className="text-left">

                <th className="p-5">
                  Slot
                </th>

                <th>
                  Type
                </th>

                <th>
                  Assigned Flat
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {slots.map(s => (

                <tr
                  key={s._id}
                  className="border-t hover:bg-gray-50 transition"
                >

                  {/* SLOT */}

                  <td className="p-5 font-semibold">

                    {s.slotNumber}

                  </td>

                  {/* TYPE */}

                  <td>

                    <span className={`px-4 py-2 rounded-xl text-sm font-semibold

                      ${
                        s.type === "RESIDENT"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-orange-100 text-orange-700"
                      }
                    `}>

                      {s.type}

                    </span>

                  </td>

                  {/* FLAT */}

                  <td>

                    {s.flat
                      ? `${s.flat.block}-${s.flat.flatNumber}`
                      : "Vacant"}

                  </td>

                  {/* STATUS */}

                  <td>

                    {s.flat ? (

                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold">

                        Occupied

                      </span>

                    ) : (

                      <span className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm font-semibold">

                        Available

                      </span>

                    )}

                  </td>

                </tr>

              ))}

              {/* EMPTY */}

              {slots.length === 0 && (

                <tr>

                  <td
                    colSpan="4"
                    className="text-center p-10 text-gray-500"
                  >

                    No parking slots available

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