import { useEffect, useState } from "react";

import {
  Users,
  CheckCircle,
  ShieldCheck,
  LogOut
} from "lucide-react";

import GuardLayout from "../../components/layout/GuardLayout";

import api from "../../api/axios";

export default function GuardVisitors() {

  const [visitors, setVisitors] =
    useState([]);

  const [flats, setFlats] =
    useState([]);

  const [form, setForm] = useState({

    name: "",
    phone: "",
    vehicleNumber: "",
    purpose: "",
    flatId: ""

  });

  useEffect(() => {

    fetchVisitors();

    fetchFlats();

  }, []);

  // ================= FETCH VISITORS =================

  const fetchVisitors = async () => {

    try {

      const res =
        await api.get("/visitors");

      setVisitors(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {

      console.error(err);

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

      console.error(err);

    }
  };

  // ================= HANDLE CHANGE =================

  const handleChange = e => {

    setForm({

      ...form,

      [e.target.name]:
      e.target.value

    });

  };

  // ================= ADD VISITOR =================

  const addVisitor = async e => {

    e.preventDefault();

    try {

      await api.post(
        "/visitors",
        form
      );

      alert("Visitor added");

      setForm({

        name: "",
        phone: "",
        vehicleNumber: "",
        purpose: "",
        flatId: ""

      });

      fetchVisitors();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Failed to add visitor"
      );

    }
  };

  // ================= ENTRY =================

  const allowEntry = async id => {

    try {

      await api.patch(
        `/visitors/${id}/entry`
      );

      fetchVisitors();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Entry failed"
      );

    }
  };

  // ================= CHECKOUT =================

  const checkout = async id => {

    try {

      await api.patch(
        `/visitors/${id}/checkout`
      );

      fetchVisitors();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Checkout failed"
      );

    }
  };

  return (

    <GuardLayout>

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">

          Visitor Management

        </h1>

        <p className="text-gray-500 mt-1">

          Manage visitor entries and exits

        </p>

      </div>

      {/* ADD FORM */}

      <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">

        <h2 className="text-2xl font-bold mb-6">

          Add Visitor

        </h2>

        <form
          onSubmit={addVisitor}
          className="grid md:grid-cols-2 gap-5"
        >

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Visitor Name"
            className="border rounded-2xl p-4"
            required
          />

          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="border rounded-2xl p-4"
            required
          />

          <input
            type="text"
            name="vehicleNumber"
            value={form.vehicleNumber}
            onChange={handleChange}
            placeholder="Vehicle Number"
            className="border rounded-2xl p-4"
          />

          <input
            type="text"
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            placeholder="Purpose"
            className="border rounded-2xl p-4"
            required
          />

          <select
            name="flatId"
            value={form.flatId}
            onChange={handleChange}
            className="border rounded-2xl p-4"
            required
          >

            <option value="">
              Select Flat
            </option>

            {flats.map(flat => (

              <option
                key={flat._id}
                value={flat._id}
              >

                {flat.block}-
                {flat.flatNumber}

              </option>

            ))}

          </select>

          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl p-4 font-semibold"
          >

            Add Visitor

          </button>

        </form>

      </div>

      {/* VISITORS */}

      <div className="space-y-6">

        {visitors.map(visitor => (

          <div
            key={visitor._id}
            className="bg-white rounded-3xl shadow-lg p-6"
          >

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              {/* LEFT */}

              <div>

                <h2 className="text-2xl font-bold mb-2">

                  {visitor.name}

                </h2>

                <div className="space-y-1 text-gray-600">

                  <p>
                    📞 {visitor.phone}
                  </p>

                  <p>
                    🚗 {visitor.vehicleNumber || "No Vehicle"}
                  </p>

                  <p>
                    🎯 {visitor.purpose}
                  </p>

                </div>

              </div>

              {/* RIGHT */}

              <div className="flex flex-col items-start lg:items-end gap-4">

                <StatusBadge
                  status={visitor.status}
                />

                {/* ACTIONS */}

                {visitor.status === "APPROVED" && (

                  <button
                    onClick={() =>
                      allowEntry(visitor._id)
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-2xl font-semibold flex items-center gap-2"
                  >

                    <ShieldCheck size={18} />

                    Allow Entry

                  </button>

                )}

                {visitor.status === "INSIDE" && (

                  <button
                    onClick={() =>
                      checkout(visitor._id)
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl font-semibold flex items-center gap-2"
                  >

                    <LogOut size={18} />

                    Checkout

                  </button>

                )}

              </div>

            </div>

          </div>

        ))}

      </div>

    </GuardLayout>

  );
}


// ================= STATUS BADGE =================

function StatusBadge({
  status
}) {

  const styles = {

    PENDING:
      "bg-yellow-100 text-yellow-700",

    APPROVED:
      "bg-green-100 text-green-700",

    REJECTED:
      "bg-red-100 text-red-700",

    INSIDE:
      "bg-indigo-100 text-indigo-700",

    EXITED:
      "bg-gray-200 text-gray-700"

  };

  return (

    <span
      className={`px-4 py-2 rounded-xl text-sm font-semibold ${styles[status]}`}
    >

      {status}

    </span>

  );
}