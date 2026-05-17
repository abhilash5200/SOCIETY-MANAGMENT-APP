import { useEffect, useState } from "react";

import {
  Users,
  Clock,
  CheckCircle,
  ShieldCheck
} from "lucide-react";

import GuardLayout from "../../components/layout/GuardLayout";

import api from "../../api/axios";

export default function GuardDashboard() {

  const [visitors, setVisitors] =
    useState([]);

  useEffect(() => {
    fetchVisitors();
  }, []);

  // ================= FETCH =================

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

  // ================= STATS =================

  const pending = visitors.filter(
    v => v.status === "PENDING"
  );

  const approved = visitors.filter(
    v => v.status === "APPROVED"
  );

  const inside = visitors.filter(
    v => v.status === "INSIDE"
  );

  return (

    <GuardLayout>

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">

          Guard Dashboard

        </h1>

        <p className="text-gray-500 mt-1">

          Society security overview

        </p>

      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-4 gap-6 mb-8">

        <StatCard
          title="Total Visitors"
          value={visitors.length}
          color="bg-indigo-600"
          icon={<Users />}
        />

        <StatCard
          title="Pending"
          value={pending.length}
          color="bg-orange-500"
          icon={<Clock />}
        />

        <StatCard
          title="Approved"
          value={approved.length}
          color="bg-green-600"
          icon={<CheckCircle />}
        />

        <StatCard
          title="Inside"
          value={inside.length}
          color="bg-purple-600"
          icon={<ShieldCheck />}
        />

      </div>

      {/* RECENT VISITORS */}

      <div className="bg-white rounded-3xl shadow-lg p-6">

        <h2 className="text-2xl font-bold mb-6">

          Recent Visitors

        </h2>

        <div className="space-y-4">

          {visitors.slice(0, 5).map(v => (

            <div
              key={v._id}
              className="border rounded-2xl p-4 flex items-center justify-between"
            >

              <div>

                <h3 className="font-semibold text-lg">

                  {v.name}

                </h3>

                <p className="text-gray-500">

                  {v.purpose}

                </p>

              </div>

              <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold">

                {v.status}

              </span>

            </div>

          ))}

        </div>

      </div>

    </GuardLayout>

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

        <h2 className="text-3xl font-bold">

          {value}

        </h2>

      </div>

    </div>

  );
}