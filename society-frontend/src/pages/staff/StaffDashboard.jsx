import { useEffect, useState } from "react";

import {
  ClipboardList,
  Clock,
  CheckCircle,
  Wrench
} from "lucide-react";

import StaffLayout from "../../components/layout/StaffLayout";

import api from "../../api/axios";

export default function StaffDashboard() {

  const [complaints, setComplaints] =
    useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  // ================= FETCH =================

  const fetchComplaints = async () => {

    try {

      const res =
        await api.get("/complaints");

      setComplaints(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {

      console.error(err);

    }
  };

  // ================= STATS =================

  const pending = complaints.filter(
    c => c.status === "IN_PROGRESS"
  );

  const resolved = complaints.filter(
    c => c.status === "RESOLVED"
  );

  return (

    <StaffLayout>

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">

          Staff Dashboard

        </h1>

        <p className="text-gray-500 mt-1">

          Maintenance work overview

        </p>

      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <StatCard
          title="Assigned Complaints"
          value={complaints.length}
          color="bg-indigo-600"
          icon={<ClipboardList />}
        />

        <StatCard
          title="In Progress"
          value={pending.length}
          color="bg-orange-500"
          icon={<Clock />}
        />

        <StatCard
          title="Resolved"
          value={resolved.length}
          color="bg-green-600"
          icon={<CheckCircle />}
        />

        <StatCard
          title="Department"
          value="Maintenance"
          color="bg-purple-600"
          icon={<Wrench />}
          small
        />

      </div>

      {/* RECENT COMPLAINTS */}

      <div className="bg-white rounded-3xl shadow-lg p-6">

        <h2 className="text-2xl font-bold mb-6">

          Recent Complaints

        </h2>

        <div className="space-y-4">

          {complaints.slice(0, 5).map(c => (

            <div
              key={c._id}
              className="border rounded-2xl p-4 flex items-center justify-between"
            >

              <div className="min-w-0">

                <h3 className="font-semibold text-lg break-words">

                  {c.title}

                </h3>

                <p className="text-gray-500">

                  {c.priority}

                </p>

              </div>

              <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap">

                {c.status}

              </span>

            </div>

          ))}

        </div>

      </div>

    </StaffLayout>

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

    <div className="bg-white rounded-3xl shadow-lg p-6 flex items-center gap-5 overflow-hidden">

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