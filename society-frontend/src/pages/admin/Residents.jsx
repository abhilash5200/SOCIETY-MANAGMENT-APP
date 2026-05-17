import { useEffect, useState } from "react";

import {
  Users,
  Search,
  Mail,
  Phone,
  Building2,
  UserCheck
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import api from "../../api/axios";

export default function Residents() {

  const [residents, setResidents] =
    useState([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {

    fetchResidents();

  }, []);

  // ================= FETCH RESIDENTS =================

  const fetchResidents = async () => {

    try {

      const res =
        await api.get(
          "/profile/residents"
        );

      setResidents(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {

      console.error(
        "Residents error:",
        err
      );

    }
  };

  // ================= FILTER =================

  const filtered =
    residents.filter(r =>

      r.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )

    );

  // ================= STATS =================

  const assignedResidents =
    residents.filter(
      r => r.flat
    );

  const unassignedResidents =
    residents.filter(
      r => !r.flat
    );

  return (

    <DashboardLayout>

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>

          <h1 className="text-4xl font-bold">

            Residents Management

          </h1>

          <p className="text-gray-500 mt-2">

            Manage society residents and allocations

          </p>

        </div>

        {/* SEARCH */}

        <div className="relative w-full lg:w-80">

          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            placeholder="Search residents..."
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
          title="Total Residents"
          value={residents.length}
          color="bg-indigo-600"
          icon={<Users />}
        />

        <StatCard
          title="Assigned Flats"
          value={assignedResidents.length}
          color="bg-green-600"
          icon={<Building2 />}
        />

        <StatCard
          title="Pending Allocation"
          value={unassignedResidents.length}
          color="bg-red-500"
          icon={<UserCheck />}
        />

        <StatCard
          title="Search Results"
          value={filtered.length}
          color="bg-orange-500"
          icon={<Search />}
        />

      </div>

      {/* RESIDENT TABLE */}

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="text-2xl font-bold">

            Resident Records

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
                  Phone
                </th>

                <th>
                  Flat
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {filtered.map(r => (

                <tr
                  key={r._id}
                  className="border-t hover:bg-gray-50 transition"
                >

                  {/* NAME */}

                  <td className="p-5">

                    <div className="flex items-center gap-4">

                      <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">

                        {r.name?.charAt(0)}

                      </div>

                      <div>

                        <h3 className="font-semibold text-lg">

                          {r.name}

                        </h3>

                        <p className="text-sm text-gray-500">

                          Resident

                        </p>

                      </div>

                    </div>

                  </td>

                  {/* EMAIL */}

                  <td>

                    <div className="flex items-center gap-2 text-gray-700">

                      <Mail size={16} />

                      {r.email}

                    </div>

                  </td>

                  {/* PHONE */}

                  <td>

                    <div className="flex items-center gap-2 text-gray-700">

                      <Phone size={16} />

                      {r.phone}

                    </div>

                  </td>

                  {/* FLAT */}

                  <td>

                    {r.flat ? (

                      <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold">

                        {r.flat.block} -
                        {r.flat.flatNumber}

                      </span>

                    ) : (

                      <span className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-sm font-semibold">

                        Not Assigned

                      </span>

                    )}

                  </td>

                  {/* STATUS */}

                  <td>

                    {r.flat ? (

                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold">

                        Active

                      </span>

                    ) : (

                      <span className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-sm font-semibold">

                        Pending

                      </span>

                    )}

                  </td>

                </tr>

              ))}

              {/* EMPTY */}

              {filtered.length === 0 && (

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