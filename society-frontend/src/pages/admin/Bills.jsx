import { useEffect, useState } from "react";

import {
  CreditCard,
  CircleDollarSign,
  CheckCircle,
  AlertCircle,
  Receipt
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import api from "../../api/axios";

export default function Bills() {

  const [bills, setBills] =
    useState([]);

  const [flats, setFlats] =
    useState([]);

  const [form, setForm] =
    useState({

      flatId: "",
      amount: "",
      dueDate: ""

    });

  useEffect(() => {

    fetchBills();

    fetchFlats();

  }, []);

  // ================= FETCH BILLS =================

  const fetchBills = async () => {

    try {

      const res =
        await api.get("/bills");

      setBills(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {

      console.error(
        "Bills error:",
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

  // ================= HANDLE CHANGE =================

  const handleChange = e =>

    setForm({

      ...form,

      [e.target.name]:
      e.target.value

    });

  // ================= CREATE BILL =================

  const handleSubmit = async e => {

    e.preventDefault();

    if (!form.flatId) {

      alert(
        "Please select a flat"
      );

      return;
    }

    try {

      await api.post(
        "/bills",
        form
      );

      setForm({

        flatId: "",
        amount: "",
        dueDate: ""

      });

      fetchBills();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Failed to create bill"
      );

    }
  };

  // ================= STATS =================

  const paidBills = bills.filter(
    b => b.paid
  );

  const unpaidBills = bills.filter(
    b => !b.paid
  );

  const totalRevenue =
    bills.reduce(
      (sum, bill) =>
        sum + bill.amount,
      0
    );

  return (

    <DashboardLayout>

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">

          Maintenance Billing

        </h1>

        <p className="text-gray-500 mt-2">

          Manage society maintenance payments

        </p>

      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <StatCard
          title="Total Bills"
          value={bills.length}
          color="bg-indigo-600"
          icon={<Receipt />}
        />

        <StatCard
          title="Paid Bills"
          value={paidBills.length}
          color="bg-green-600"
          icon={<CheckCircle />}
        />

        <StatCard
          title="Unpaid Bills"
          value={unpaidBills.length}
          color="bg-red-500"
          icon={<AlertCircle />}
        />

        <StatCard
          title="Revenue"
          value={`₹${totalRevenue}`}
          color="bg-orange-500"
          icon={<CircleDollarSign />}
          small
        />

      </div>

      {/* CREATE BILL */}

      <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">

        <div className="flex items-center gap-4 mb-6">

          <div className="bg-indigo-100 text-indigo-600 p-4 rounded-2xl">

            <CreditCard size={28} />

          </div>

          <div>

            <h2 className="text-2xl font-bold">

              Generate New Bill

            </h2>

            <p className="text-gray-500">

              Create maintenance bills for residents

            </p>

          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 xl:grid-cols-4 gap-5"
        >

          {/* FLAT */}

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

          {/* AMOUNT */}

          <input
            name="amount"
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            className="border rounded-2xl p-4"
            required
          />

          {/* DATE */}

          <input
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            className="border rounded-2xl p-4"
            required
          />

          {/* BUTTON */}

          <button
            className="bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-2xl font-semibold p-4"
          >

            Generate Bill

          </button>

        </form>

      </div>

      {/* BILL TABLE */}

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="text-2xl font-bold">

            Billing Records

          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr className="text-left">

                <th className="p-5">
                  Flat
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Due Date
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {bills.map(b => (

                <tr
                  key={b._id}
                  className="border-t hover:bg-gray-50 transition"
                >

                  <td className="p-5 font-semibold">

                    {b.flat
                      ? `${b.flat.block}-${b.flat.flatNumber}`
                      : "N/A"}

                  </td>

                  <td className="font-medium">

                    ₹ {b.amount}

                  </td>

                  <td>

                    {new Date(
                      b.dueDate
                    ).toLocaleDateString()}

                  </td>

                  <td>

                    {b.paid ? (

                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold">

                        Paid

                      </span>

                    ) : (

                      <span className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm font-semibold">

                        Unpaid

                      </span>

                    )}

                  </td>

                </tr>

              ))}

              {bills.length === 0 && (

                <tr>

                  <td
                    colSpan="4"
                    className="text-center p-10 text-gray-500"
                  >

                    No bills found

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
  icon,
  small
}) {

  return (

    <div className="bg-white rounded-3xl shadow-lg p-6 flex items-center gap-5 hover:shadow-2xl transition overflow-hidden">

      <div className={`${color} text-white p-4 rounded-2xl flex-shrink-0`}>

        {icon}

      </div>

      <div className="min-w-0">

        <p className="text-gray-500 truncate">

          {title}

        </p>

        <h2
          className={`font-bold break-words

            ${
              small
                ? "text-xl"
                : "text-3xl"
            }
          `}
        >

          {value}

        </h2>

      </div>

    </div>

  );
}