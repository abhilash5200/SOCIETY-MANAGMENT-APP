import { useEffect, useState } from "react";

import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Phone,
  Building2
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import api from "../../api/axios";

export default function Visitors() {

  const [visitors, setVisitors] =
    useState([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {

    fetchVisitors();

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

      console.error(
        "Visitors error:",
        err
      );

    }
  };

  // ================= FILTER =================

  const filtered =
    visitors.filter(v =>

      v.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )

    );

  // ================= STATS =================

  const approved =
    visitors.filter(
      v => v.status === "APPROVED"
    );

  const pending =
    visitors.filter(
      v => v.status === "PENDING"
    );

  const rejected =
    visitors.filter(
      v => v.status === "REJECTED"
    );

  return (

    <DashboardLayout>

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>

          <h1 className="text-4xl font-bold">

            Visitor Management

          </h1>

          <p className="text-gray-500 mt-2">

            Track society visitor entries and exits

          </p>

        </div>

        {/* SEARCH */}

        <div className="relative w-full lg:w-80">

          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            placeholder="Search visitors..."
            className="w-full border rounded-2xl py-4 pl-12 pr-4"
            value={search}
            onChange={e =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <StatCard
          title="Total Visitors"
          value={visitors.length}
          color="bg-indigo-600"
          icon={<Users />}
        />

        <StatCard
          title="Approved"
          value={approved.length}
          color="bg-green-600"
          icon={<CheckCircle />}
        />

        <StatCard
          title="Pending"
          value={pending.length}
          color="bg-orange-500"
          icon={<Clock />}
        />

        <StatCard
          title="Rejected"
          value={rejected.length}
          color="bg-red-500"
          icon={<XCircle />}
        />

      </div>

      {/* TABLE */}

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="text-2xl font-bold">

            Visitor Records

          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr className="text-left">

                <th className="p-5">
                  Visitor
                </th>

                <th>
                  Phone
                </th>

                <th>
                  Flat
                </th>

                <th>
                  Purpose
                </th>

                <th>
                  Status
                </th>

                <th>
                  Check In
                </th>

                <th>
                  Check Out
                </th>

              </tr>

            </thead>

            <tbody>

              {filtered.map(v => (

                <tr
                  key={v._id}
                  className="border-t hover:bg-gray-50 transition"
                >

                  {/* VISITOR */}

                  <td className="p-5">

                    <div className="flex items-center gap-4">

                      <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">

                        {v.name?.charAt(0)}

                      </div>

                      <div>

                        <h3 className="font-semibold text-lg">

                          {v.name}

                        </h3>

                        <p className="text-sm text-gray-500">

                          Visitor

                        </p>

                      </div>

                    </div>

                  </td>

                  {/* PHONE */}

                  <td>

                    <div className="flex items-center gap-2 text-gray-700">

                      <Phone size={16} />

                      {v.phone}

                    </div>

                  </td>

                  {/* FLAT */}

                  <td>

                    {v.flat ? (

                      <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 w-fit">

                        <Building2 size={14} />

                        {v.flat.block}-
                        {v.flat.flatNumber}

                      </span>

                    ) : (

                      "N/A"

                    )}

                  </td>

                  {/* PURPOSE */}

                  <td>

                    <span className="text-gray-700 font-medium">

                      {v.purpose}

                    </span>

                  </td>

                  {/* STATUS */}

                  <td>

                    <StatusBadge
                      status={v.status}
                    />

                  </td>

                  {/* CHECK IN */}

                  <td>

                    {v.entryTime ? (

                      <div className="text-sm">

                        {new Date(
                          v.entryTime
                        ).toLocaleString(
                          "en-IN",
                          {
                            dateStyle:
                              "medium",

                            timeStyle:
                              "short"
                          }
                        )}

                      </div>

                    ) : (

                      <span className="text-gray-400">

                        -

                      </span>

                    )}

                  </td>

                  {/* CHECK OUT */}

                  <td>

                    {v.exitTime ? (

                      <div className="text-sm">

                        {new Date(
                          v.exitTime
                        ).toLocaleString(
                          "en-IN",
                          {
                            dateStyle:
                              "medium",

                            timeStyle:
                              "short"
                          }
                        )}

                      </div>

                    ) : (

                      <span className="text-gray-400">

                        -

                      </span>

                    )}

                  </td>

                </tr>

              ))}

              {/* EMPTY */}

              {filtered.length === 0 && (

                <tr>

                  <td
                    colSpan="7"
                    className="text-center p-10 text-gray-500"
                  >

                    No visitors found

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


// ================= STATUS BADGE =================

function StatusBadge({
  status
}) {

  const colors = {

    PENDING:
      "bg-yellow-100 text-yellow-700",

    APPROVED:
      "bg-blue-100 text-blue-700",

    INSIDE:
      "bg-green-100 text-green-700",

    EXITED:
      "bg-gray-200 text-gray-700",

    REJECTED:
      "bg-red-100 text-red-700"

  };

  return (

    <span
      className={`px-4 py-2 rounded-xl text-sm font-semibold ${colors[status] || "bg-gray-100 text-gray-700"}`}
    >

      {status}

    </span>

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