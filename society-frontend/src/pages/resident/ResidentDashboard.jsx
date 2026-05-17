import { useEffect, useState } from "react";
import {
  Home,
  AlertCircle,
  CreditCard,
  Car,
  Users,
  Bell,
  User,
  ArrowRight
} from "lucide-react";

import { Link } from "react-router-dom";

import ResidentLayout from "../../components/layout/ResidentLayout";
import api from "../../api/axios";
import { useAuthStore } from "../../store/authStore";

export default function ResidentDashboard() {

  const user = useAuthStore((s) => s.user);

  const [bills, setBills] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [notices, setNotices] = useState([]);
  const [parking, setParking] = useState([]);
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {

    if (user) {
      fetchData();
    }

  }, [user]);

  // ================= FETCH DATA =================

  const fetchData = async () => {

    try {

      const [
        billsRes,
        complaintsRes,
        noticesRes,
        parkingRes,
        visitorsRes
      ] = await Promise.all([

        api.get("/bills"),
        api.get("/complaints"),
        api.get("/notices"),
        api.get("/parking/slots"),
        api.get("/visitors")

      ]);

      setBills(
        Array.isArray(billsRes.data)
          ? billsRes.data
          : []
      );

      setComplaints(
        Array.isArray(complaintsRes.data)
          ? complaintsRes.data
          : []
      );

      setNotices(
        Array.isArray(noticesRes.data)
          ? noticesRes.data
          : []
      );

      setParking(
        Array.isArray(parkingRes.data)
          ? parkingRes.data
          : []
      );

      setVisitors(
        Array.isArray(visitorsRes.data)
          ? visitorsRes.data
          : []
      );

    } catch (err) {

      console.error(
        "Resident dashboard error:",
        err
      );

    }
  };

  // ================= STATS =================

  const unpaidBills = bills.filter(
    b => !b.paid
  );

  const activeComplaints = complaints.filter(
    c =>
      c.status !== "RESOLVED" &&
      c.status !== "CLOSED"
  );

  const pendingVisitors = visitors.filter(
    v => v.status === "PENDING"
  );

  const residentParking = parking[0];

  return (
    <ResidentLayout>

      {/* ================= HERO ================= */}

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl mb-8">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div>

            <h1 className="text-4xl font-bold mb-2">
              Welcome Back, {user?.name}
            </h1>

            <p className="text-indigo-100 text-lg">
              Smart Community Resident Portal
            </p>

          </div>

          {/* <div className="bg-white/20 backdrop-blur-lg px-6 py-4 rounded-2xl">

            <p className="text-sm text-indigo-100">
              Flat Details
            </p>

            <h3 className="text-2xl font-bold">

              {user?.flat
                ? `${user.flat.block}-${user.flat.flatNumber}`
                : "Not Allocated"}

            </h3>

          </div> */}

        </div>

      </div>

      {/* ================= ALERT ================= */}

      {unpaidBills.length > 0 && (

        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-8 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className="bg-red-100 p-3 rounded-xl">

              <AlertCircle className="text-red-600" />

            </div>

            <div>

              <h3 className="font-bold text-red-700">
                Pending Bills Alert
              </h3>

              <p className="text-red-500">
                You have {unpaidBills.length} unpaid bills
              </p>

            </div>

          </div>

          <Link
            to="/resident/bills"
            className="bg-red-600 text-white px-5 py-2 rounded-xl hover:bg-red-700"
          >
            View Bills
          </Link>

        </div>

      )}

      {/* ================= STATS ================= */}

      <div className="grid md:grid-cols-4 gap-6 mb-8">

        <StatCard
          icon={<CreditCard />}
          title="Pending Bills"
          value={unpaidBills.length}
          color="bg-indigo-600"
        />

        <StatCard
          icon={<AlertCircle />}
          title="Complaints"
          value={activeComplaints.length}
          color="bg-orange-500"
        />

        <StatCard
          icon={<Bell />}
          title="Notices"
          value={notices.length}
          color="bg-green-600"
        />

        <StatCard
          icon={<Users />}
          title="Visitors"
          value={pendingVisitors.length}
          color="bg-pink-600"
        />

      </div>

      {/* ================= QUICK ACTIONS ================= */}

      <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-2xl font-bold">
            Quick Actions
          </h2>

        </div>

        <div className="grid md:grid-cols-5 gap-5">

          <QuickCard
            to="/resident/complaints"
            icon={<AlertCircle />}
            title="Raise Complaint"
          />

          <QuickCard
            to="/resident/bills"
            icon={<CreditCard />}
            title="My Bills"
          />

          <QuickCard
            to="/resident/visitors"
            icon={<Users />}
            title="Visitors"
          />

          <QuickCard
            to="/resident/parking"
            icon={<Car />}
            title="Parking"
          />

          <QuickCard
            to="/resident/profile"
            icon={<User />}
            title="My Profile"
          />

        </div>

      </div>

      {/* ================= MAIN GRID ================= */}

      <div className="grid lg:grid-cols-3 gap-8">

        {/* LEFT */}

        <div className="lg:col-span-2 space-y-8">

          {/* RECENT NOTICES */}

          <div className="bg-white rounded-3xl shadow-lg p-6">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-2xl font-bold">
                Recent Notices
              </h2>

              <Link
                to="/resident/notices"
                className="text-indigo-600 flex items-center gap-1"
              >
                View All
                <ArrowRight size={18} />
              </Link>

            </div>

            <div className="space-y-5">

              {notices.slice(0, 3).map(n => (

                <div
                  key={n._id}
                  className="border rounded-2xl p-5 hover:bg-gray-50 transition"
                >

                  <h3 className="font-bold text-lg mb-2">
                    {n.title}
                  </h3>

                  <p className="text-gray-600">
                    {n.content}
                  </p>

                </div>

              ))}

              {notices.length === 0 && (

                <p className="text-gray-500">
                  No notices available
                </p>

              )}

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="space-y-8">

          {/* PARKING */}

          <div className="bg-white rounded-3xl shadow-lg p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="bg-indigo-100 p-3 rounded-xl">
                <Car className="text-indigo-600" />
              </div>

              <h2 className="text-xl font-bold">
                My Parking
              </h2>

            </div>

            {residentParking ? (

              <div className="space-y-3">

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Slot
                  </span>

                  <span className="font-semibold">
                    {residentParking.slotNumber}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Type
                  </span>

                  <span className="font-semibold">
                    {residentParking.type}
                  </span>

                </div>

              </div>

            ) : (

              <p className="text-gray-500">
                No parking assigned
              </p>

            )}

          </div>

          {/* PROFILE */}

          <div className="bg-white rounded-3xl shadow-lg p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="bg-purple-100 p-3 rounded-xl">
                <Home className="text-purple-600" />
              </div>

              <h2 className="text-xl font-bold">
                Resident Details
              </h2>

            </div>

            <div className="space-y-3">

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Name
                </span>

                <span className="font-semibold">
                  {user?.name}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Email
                </span>

                <span className="font-semibold text-sm">
                  {user?.email}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Role
                </span>

                <span className="font-semibold">
                  {user?.role}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </ResidentLayout>
  );
}


// ================= STAT CARD =================

function StatCard({
  icon,
  title,
  value,
  color
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

        <h3 className="text-3xl font-bold">
          {value}
        </h3>

      </div>

    </div>

  );
}


// ================= QUICK ACTION =================

function QuickCard({
  icon,
  title,
  to
}) {

  return (

    <Link
      to={to}
      className="bg-gray-50 hover:bg-indigo-50 border rounded-2xl p-5 transition group"
    >

      <div className="mb-4 text-indigo-600">
        {icon}
      </div>

      <h3 className="font-semibold group-hover:text-indigo-600">
        {title}
      </h3>

    </Link>

  );
}