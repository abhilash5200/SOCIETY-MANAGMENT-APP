import { useEffect, useState } from "react";

import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  ShieldCheck
} from "lucide-react";

import ResidentLayout from "../../components/layout/ResidentLayout";
import api from "../../api/axios";

export default function ResidentVisitors() {

  const [visitors, setVisitors] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitors();
  }, []);

  // ================= FETCH VISITORS =================

  const fetchVisitors = async () => {

    try {

      const res = await api.get("/visitors");

      setVisitors(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  // ================= APPROVE =================

  const approveVisitor = async id => {

    try {

      await api.patch(
        `/visitors/${id}/approve`
      );

      fetchVisitors();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Approval failed"
      );

    }
  };

  // ================= REJECT =================

  const rejectVisitor = async id => {

    try {

      await api.patch(
        `/visitors/${id}/reject`
      );

      fetchVisitors();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Rejection failed"
      );

    }
  };

  // ================= STATS =================

  const pendingVisitors = visitors.filter(
    v => v.status === "PENDING"
  );

  const approvedVisitors = visitors.filter(
    v => v.status === "APPROVED"
  );

  const insideVisitors = visitors.filter(
    v => v.status === "INSIDE"
  );

  const exitedVisitors = visitors.filter(
    v => v.status === "EXITED"
  );

  return (

    <ResidentLayout>

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Visitor Management
        </h1>

        <p className="text-gray-500 mt-1">
          Approve and track society visitors
        </p>

      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-4 gap-6 mb-8">

        <StatCard
          title="Pending"
          value={pendingVisitors.length}
          color="bg-orange-500"
          icon={<Clock />}
        />

        <StatCard
          title="Approved"
          value={approvedVisitors.length}
          color="bg-green-600"
          icon={<CheckCircle />}
        />

        <StatCard
          title="Inside"
          value={insideVisitors.length}
          color="bg-indigo-600"
          icon={<ShieldCheck />}
        />

        <StatCard
          title="Exited"
          value={exitedVisitors.length}
          color="bg-gray-700"
          icon={<XCircle />}
        />

      </div>

      {/* VISITORS */}

      <div className="space-y-6">

        {loading ? (

          <div className="bg-white rounded-3xl shadow-lg p-10 text-center">

            <p className="text-gray-500">
              Loading visitors...
            </p>

          </div>

        ) : visitors.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-lg p-10 text-center">

            <Users
              size={50}
              className="mx-auto text-gray-400 mb-4"
            />

            <h3 className="text-xl font-semibold mb-2">
              No Visitors Found
            </h3>

            <p className="text-gray-500">
              No visitor requests available.
            </p>

          </div>

        ) : (

          visitors.map(visitor => (

            <div
              key={visitor._id}
              className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition"
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

                  {visitor.status === "PENDING" && (

                    <div className="flex gap-3">

                      <button
                        onClick={() =>
                          approveVisitor(
                            visitor._id
                          )
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-semibold"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          rejectVisitor(
                            visitor._id
                          )
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-semibold"
                      >
                        Reject
                      </button>

                    </div>

                  )}

                </div>

              </div>

              {/* TIMELINE */}

              <div className="grid md:grid-cols-3 gap-4 mt-6">

                <InfoCard
                  title="Entry Time"
                  value={
                    visitor.entryTime
                      ? new Date(
                          visitor.entryTime
                        ).toLocaleString()
                      : "Not Entered"
                  }
                />

                <InfoCard
                  title="Exit Time"
                  value={
                    visitor.exitTime
                      ? new Date(
                          visitor.exitTime
                        ).toLocaleString()
                      : "Not Exited"
                  }
                />

                <InfoCard
                  title="Approved By"
                  value={
                    visitor.approvedBy?.name ||
                    "Pending"
                  }
                />

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

        <h2 className="text-3xl font-bold">
          {value}
        </h2>

      </div>

    </div>

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


// ================= INFO CARD =================

function InfoCard({
  title,
  value
}) {

  return (

    <div className="bg-gray-50 rounded-2xl p-4">

      <p className="text-sm text-gray-500 mb-1">
        {title}
      </p>

      <h3 className="font-semibold">
        {value}
      </h3>

    </div>

  );
}