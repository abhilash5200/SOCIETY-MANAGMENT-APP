import { useEffect, useState } from "react";

import {
  Users,
  UserCog,
  Building2,
  Home,
  ClipboardList,
  CheckCircle,
  Truck,
  Package
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import api from "../../api/axios";

import { socket }
from "../../socket/socket";

import { toast }
from "react-hot-toast";

export default function AdminDashboard() {

  const [stats, setStats] =
    useState(null);

  // ================= SOCKET + FETCH =================

  useEffect(() => {

    fetchStats();

    // ================= NEW COMPLAINT =================

    socket.on(
      "newComplaint",
      () => {

        fetchStats();

        toast.success(
          "New complaint received"
        );

      }
    );

    // ================= ASSIGNED =================

    socket.on(
      "complaintAssigned",
      () => {

        fetchStats();

        toast.success(
          "Complaint assigned"
        );

      }
    );

    // ================= RESOLVED =================

    socket.on(
      "complaintResolved",
      () => {

        fetchStats();

        toast.success(
          "Complaint resolved"
        );

      }
    );

    // ================= CLOSED =================

    socket.on(
      "complaintClosed",
      () => {

        fetchStats();

      }
    );

    // ================= CLEANUP =================

    return () => {

      socket.off(
        "newComplaint"
      );

      socket.off(
        "complaintAssigned"
      );

      socket.off(
        "complaintResolved"
      );

      socket.off(
        "complaintClosed"
      );

    };

  }, []);

  // ================= FETCH =================

  const fetchStats = async () => {

    try {

      const res =
        await api.get(
          "/analytics/dashboard"
        );

      setStats(
        res.data
      );

    } catch (err) {

      console.error(
        "Dashboard error:",
        err
      );

    }
  };

  // ================= LOADING =================

  if (!stats) {

    return (

      <DashboardLayout>

        <div className="bg-white rounded-3xl shadow-lg p-10 text-center">

          <p className="text-gray-500 text-lg">

            Loading dashboard...

          </p>

        </div>

      </DashboardLayout>

    );
  }

  return (

    <DashboardLayout>

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">

          Admin Dashboard

        </h1>

        <p className="text-gray-500 mt-2">

          Society management overview

        </p>

      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <StatCard
          title="Residents"
          value={stats.users.residents}
          icon={<Users />}
          color="bg-indigo-600"
        />

        <StatCard
          title="Staff Members"
          value={stats.users.staff}
          icon={<UserCog />}
          color="bg-green-600"
        />

        <StatCard
          title="Occupied Flats"
          value={stats.flats.occupied}
          icon={<Building2 />}
          color="bg-orange-500"
        />

        <StatCard
          title="Vacant Flats"
          value={stats.flats.vacant}
          icon={<Home />}
          color="bg-red-500"
        />

        <StatCard
          title="Visitors Today"
          value={stats.activity.visitorsToday}
          icon={<Truck />}
          color="bg-purple-600"
        />

        <StatCard
          title="Deliveries Today"
          value={stats.activity.deliveriesToday}
          icon={<Package />}
          color="bg-pink-600"
        />

        <StatCard
          title="Open Complaints"
          value={stats.complaints.openComplaints}
          icon={<ClipboardList />}
          color="bg-yellow-500"
        />

        <StatCard
          title="Resolved Complaints"
          value={stats.complaints.resolvedComplaints}
          icon={<CheckCircle />}
          color="bg-emerald-600"
        />

      </div>

      {/* QUICK OVERVIEW */}

      <div className="grid lg:grid-cols-2 gap-6">

        {/* OCCUPANCY */}

        <div className="bg-white rounded-3xl shadow-lg p-6">

          <h2 className="text-2xl font-bold mb-6">

            Flat Occupancy

          </h2>

          <div className="space-y-5">

            <ProgressCard
              label="Occupied"
              value={stats.flats.occupied}
              total={
                stats.flats.occupied +
                stats.flats.vacant
              }
              color="bg-indigo-600"
            />

            <ProgressCard
              label="Vacant"
              value={stats.flats.vacant}
              total={
                stats.flats.occupied +
                stats.flats.vacant
              }
              color="bg-red-500"
            />

          </div>

        </div>

        {/* COMPLAINTS */}

        <div className="bg-white rounded-3xl shadow-lg p-6">

          <h2 className="text-2xl font-bold mb-6">

            Complaint Status

          </h2>

          <div className="space-y-5">

            <ProgressCard
              label="Open"
              value={
                stats.complaints.openComplaints
              }
              total={
                stats.complaints.openComplaints +
                stats.complaints.resolvedComplaints
              }
              color="bg-orange-500"
            />

            <ProgressCard
              label="Resolved"
              value={
                stats.complaints.resolvedComplaints
              }
              total={
                stats.complaints.openComplaints +
                stats.complaints.resolvedComplaints
              }
              color="bg-green-600"
            />

          </div>

        </div>

      </div>

    </DashboardLayout>

  );
}


// ================= STAT CARD =================

function StatCard({
  title,
  value,
  icon,
  color
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


// ================= PROGRESS CARD =================

function ProgressCard({
  label,
  value,
  total,
  color
}) {

  const percentage =

    total > 0

      ? (value / total) * 100

      : 0;

  return (

    <div>

      <div className="flex items-center justify-between mb-2">

        <p className="font-semibold">

          {label}

        </p>

        <p className="text-gray-500">

          {value}

        </p>

      </div>

      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">

        <div
          className={`${color} h-4 rounded-full transition-all`}
          style={{
            width: `${percentage}%`
          }}
        />

      </div>

    </div>

  );
}