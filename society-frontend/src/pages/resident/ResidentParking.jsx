import { useEffect, useState } from "react";

import {
  Car,
  Plus,
  ParkingCircle,
  ShieldCheck
} from "lucide-react";

import ResidentLayout from "../../components/layout/ResidentLayout";
import api from "../../api/axios";

export default function ResidentParking() {

  const [slots, setSlots] = useState([]);

  const [vehicles, setVehicles] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    number: "",
    type: "CAR"
  });

  useEffect(() => {
    fetchParking();
  }, []);

  // ================= FETCH =================

  const fetchParking = async () => {

    try {

      const [
        slotsRes,
        vehiclesRes
      ] = await Promise.all([

        api.get("/parking/slots"),
        api.get("/parking/vehicles")

      ]);

      setSlots(
        Array.isArray(slotsRes.data)
          ? slotsRes.data
          : []
      );

      setVehicles(
        Array.isArray(vehiclesRes.data)
          ? vehiclesRes.data
          : []
      );

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  // ================= HANDLE CHANGE =================

  const handleChange = e => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  // ================= REGISTER VEHICLE =================

  const registerVehicle = async e => {

    e.preventDefault();

    try {

      await api.post(
        "/parking/vehicles",
        form
      );

      alert("Vehicle registered");

      setForm({
        number: "",
        type: "CAR"
      });

      setShowForm(false);

      fetchParking();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Vehicle registration failed"
      );

    }
  };

  // ================= SLOT =================

  const mySlot = slots[0];

  return (

    <ResidentLayout>

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-4xl font-bold">
            Parking Management
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your parking slot and vehicles
          </p>

        </div>

        <button
          onClick={() =>
            setShowForm(!showForm)
          }
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg"
        >

          <Plus size={20} />

          Add Vehicle

        </button>

      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <StatCard
          title="Allocated Slot"
          value={
            mySlot
              ? mySlot.slotNumber
              : "Not Assigned"
          }
          color="bg-indigo-600"
          icon={<ParkingCircle />}
        />

        <StatCard
          title="Vehicle Count"
          value={vehicles.length}
          color="bg-green-600"
          icon={<Car />}
        />

        <StatCard
          title="Parking Type"
          value={
            mySlot
              ? mySlot.type
              : "-"
          }
          color="bg-orange-500"
          icon={<ShieldCheck />}
        />

      </div>

      {/* SLOT CARD */}

      <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">

        <div className="flex items-center gap-4 mb-6">

          <div className="bg-indigo-100 p-4 rounded-2xl">

            <ParkingCircle
              className="text-indigo-600"
              size={30}
            />

          </div>

          <div>

            <h2 className="text-2xl font-bold">
              My Parking Slot
            </h2>

            <p className="text-gray-500">
              Society allocated parking information
            </p>

          </div>

        </div>

        {mySlot ? (

          <div className="grid md:grid-cols-3 gap-5">

            <InfoCard
              title="Slot Number"
              value={mySlot.slotNumber}
            />

            <InfoCard
              title="Type"
              value={mySlot.type}
            />

            <InfoCard
              title="Status"
              value="ACTIVE"
            />

          </div>

        ) : (

          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">

            <p className="text-red-600 font-medium">
              No parking slot assigned yet
            </p>

          </div>

        )}

      </div>

      {/* VEHICLE FORM */}

      {showForm && (

        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">

          <h2 className="text-2xl font-bold mb-6">
            Register Vehicle
          </h2>

          <form
            onSubmit={registerVehicle}
            className="space-y-5"
          >

            <div>

              <label className="block font-medium mb-2">

                Vehicle Number

              </label>

              <input
                type="text"
                name="number"
                value={form.number}
                onChange={handleChange}
                placeholder="TS09AB1234"
                className="w-full border rounded-2xl p-4"
                required
              />

            </div>

            <div>

              <label className="block font-medium mb-2">

                Vehicle Type

              </label>

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border rounded-2xl p-4"
              >

                <option value="CAR">
                  CAR
                </option>

                <option value="BIKE">
                  BIKE
                </option>

              </select>

            </div>

            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-semibold"
            >
              Register Vehicle
            </button>

          </form>

        </div>

      )}

      {/* VEHICLES */}

      <div className="space-y-6">

        {loading ? (

          <div className="bg-white rounded-3xl shadow-lg p-10 text-center">

            <p className="text-gray-500">
              Loading vehicles...
            </p>

          </div>

        ) : vehicles.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-lg p-10 text-center">

            <Car
              size={50}
              className="mx-auto text-gray-400 mb-4"
            />

            <h3 className="text-xl font-semibold mb-2">
              No Vehicles Registered
            </h3>

            <p className="text-gray-500">
              Add your first vehicle.
            </p>

          </div>

        ) : (

          vehicles.map(vehicle => (

            <div
              key={vehicle._id}
              className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition"
            >

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-5">

                  <div className="bg-indigo-100 p-4 rounded-2xl">

                    <Car
                      className="text-indigo-600"
                    />

                  </div>

                  <div>

                    <h2 className="text-2xl font-bold">

                      {vehicle.number}

                    </h2>

                    <p className="text-gray-500 mt-1">

                      {vehicle.type}

                    </p>

                  </div>

                </div>

                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold">

                  REGISTERED

                </span>

              </div>

            </div>

          ))

        )}

      </div>

    </ResidentLayout>

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

    <div className="bg-white rounded-3xl shadow-lg p-6 flex items-center gap-5">

      <div className={`${color} text-white p-4 rounded-2xl`}>

        {icon}

      </div>

      <div>

        <p className="text-gray-500">
          {title}
        </p>

        <h2 className="text-2xl font-bold">
          {value}
        </h2>

      </div>

    </div>

  );
}


// ================= INFO CARD =================

function InfoCard({
  title,
  value
}) {

  return (

    <div className="bg-gray-50 rounded-2xl p-5">

      <p className="text-gray-500 text-sm mb-1">

        {title}

      </p>

      <h3 className="font-semibold text-lg">

        {value}

      </h3>

    </div>

  );
}