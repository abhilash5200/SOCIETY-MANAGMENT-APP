import { useEffect, useState } from "react";

import {
  UserCog,
  Search,
  Mail,
  Phone,
  Briefcase,
  Users
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import api from "../../api/axios";

export default function Staff() {

  const [staff, setStaff] =
    useState([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {

    fetchStaff();

  }, []);

  // ================= FETCH STAFF =================

  const fetchStaff = async () => {

    try {

      const res =
        await api.get("/staff");

      setStaff(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {

      console.error(
        "Staff error:",
        err
      );

    }
  };

  // ================= FILTER =================

  const filtered =
    staff.filter(s =>

      s.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )

    );

  // ================= DEPARTMENTS =================

  const departments =
    [...new Set(

      staff.map(
        s =>
          s.department ||
          "General"
      )

    )];

  return (

    <DashboardLayout>

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>

          <h1 className="text-4xl font-bold">

            Staff Management

          </h1>

          <p className="text-gray-500 mt-2">

            Manage society maintenance and support staff

          </p>

        </div>

        {/* SEARCH */}

        <div className="relative w-full lg:w-80">

          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            placeholder="Search staff..."
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
          title="Total Staff"
          value={staff.length}
          color="bg-indigo-600"
          icon={<Users />}
        />

        <StatCard
          title="Departments"
          value={departments.length}
          color="bg-green-600"
          icon={<Briefcase />}
        />

        <StatCard
          title="Search Results"
          value={filtered.length}
          color="bg-orange-500"
          icon={<Search />}
        />

        <StatCard
          title="Support Team"
          value="Active"
          color="bg-purple-600"
          icon={<UserCog />}
          small
        />

      </div>

      {/* STAFF TABLE */}

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="text-2xl font-bold">

            Staff Records

          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr className="text-left">

                <th className="p-5">
                  Staff Member
                </th>

                <th>
                  Email
                </th>

                <th>
                  Phone
                </th>

                <th>
                  Department
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {filtered.map(s => (

                <tr
                  key={s._id}
                  className="border-t hover:bg-gray-50 transition"
                >

                  {/* NAME */}

                  <td className="p-5">

                    <div className="flex items-center gap-4">

                      <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">

                        {s.name?.charAt(0)}

                      </div>

                      <div>

                        <h3 className="font-semibold text-lg">

                          {s.name}

                        </h3>

                        <p className="text-sm text-gray-500">

                          Staff Member

                        </p>

                      </div>

                    </div>

                  </td>

                  {/* EMAIL */}

                  <td>

                    <div className="flex items-center gap-2 text-gray-700">

                      <Mail size={16} />

                      {s.email}

                    </div>

                  </td>

                  {/* PHONE */}

                  <td>

                    <div className="flex items-center gap-2 text-gray-700">

                      <Phone size={16} />

                      {s.phone}

                    </div>

                  </td>

                  {/* DEPARTMENT */}

                  <td>

                    <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold">

                      {s.department ||
                        "General"}

                    </span>

                  </td>

                  {/* STATUS */}

                  <td>

                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold">

                      Active

                    </span>

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

                    No staff members found

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