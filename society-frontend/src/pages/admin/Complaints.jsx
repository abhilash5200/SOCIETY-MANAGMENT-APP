import { useEffect, useState } from "react";

import {
  ClipboardList,
  Clock,
  CheckCircle,
  AlertTriangle,
  UserPlus
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import api from "../../api/axios";

export default function Complaints() {

  const [complaints, setComplaints] =
    useState([]);

  const [staff, setStaff] =
    useState([]);

  const [openRow, setOpenRow] =
    useState(null);

  useEffect(() => {

    fetchComplaints();

    fetchStaff();

  }, []);

  // ================= FETCH COMPLAINTS =================

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

      console.error(
        "Complaints error:",
        err
      );

    }
  };

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

  // ================= ASSIGN STAFF =================

  const assignStaff = async (
    complaintId,
    staffId
  ) => {

    try {

      await api.patch(
        `/complaints/${complaintId}/assign`,
        { staffId }
      );

      setOpenRow(null);

      fetchComplaints();

    } catch (err) {

      console.error(
        "Assign error:",
        err
      );

      alert(
        "Assignment failed"
      );

    }
  };

  // ================= STATS =================

  const openComplaints =
    complaints.filter(
      c =>
        c.status === "OPEN"
    );

  const progressComplaints =
    complaints.filter(
      c =>
        c.status === "IN_PROGRESS"
    );

  const resolvedComplaints =
    complaints.filter(
      c =>
        c.status === "RESOLVED"
    );

  return (

    <DashboardLayout>

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">

          Complaint Management

        </h1>

        <p className="text-gray-500 mt-2">

          Track and assign resident complaints

        </p>

      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <StatCard
          title="Total Complaints"
          value={complaints.length}
          color="bg-indigo-600"
          icon={<ClipboardList />}
        />

        <StatCard
          title="Open"
          value={openComplaints.length}
          color="bg-red-500"
          icon={<AlertTriangle />}
        />

        <StatCard
          title="In Progress"
          value={progressComplaints.length}
          color="bg-orange-500"
          icon={<Clock />}
        />

        <StatCard
          title="Resolved"
          value={resolvedComplaints.length}
          color="bg-green-600"
          icon={<CheckCircle />}
        />

      </div>

      {/* TABLE */}

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="text-2xl font-bold">

            Complaint Records

          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr className="text-left">

                <th className="p-5">
                  Title
                </th>

                <th>
                  Resident
                </th>

                <th>
                  Flat
                </th>

                <th>
                  Status
                </th>

                <th>
                  Assigned
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {complaints.map(c => (

                <tr
                  key={c._id}
                  className="border-t hover:bg-gray-50 transition"
                >

                  {/* TITLE */}

                  <td className="p-5 font-semibold">

                    {c.title}

                  </td>

                  {/* RESIDENT */}

                  <td>

                    {c.raisedBy?.name ||
                      c.resident?.name ||
                      "N/A"}

                  </td>

                  {/* FLAT */}

                  <td>

                    {c.flat
                      ? `${c.flat.block}-${c.flat.flatNumber}`
                      : "N/A"}

                  </td>

                  {/* STATUS */}

                  <td>

                    <StatusBadge
                      status={c.status}
                    />

                  </td>

                  {/* ASSIGNED */}

                  <td>

                    {c.assignedTo?.name ||
                      c.assignedStaff?.name ||
                      "Unassigned"}

                  </td>

                  {/* ACTION */}

                  <td className="relative">

                    {/* BLOCK ASSIGN AFTER RESOLVED */}

                    {c.status === "RESOLVED" ||
                    c.status === "CLOSED" ? (

                      <button
                        disabled
                        className="bg-gray-300 text-gray-600 px-4 py-2 rounded-xl cursor-not-allowed"
                      >

                        Completed

                      </button>

                    ) : (

                      <>
                        <button
                          onClick={() =>
                            setOpenRow(
                              openRow === c._id
                                ? null
                                : c._id
                            )
                          }
                          className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-4 py-2 rounded-xl flex items-center gap-2"
                        >

                          <UserPlus size={16} />

                          Assign

                        </button>

                        {/* DROPDOWN */}

                        {openRow === c._id && (

                          <div
                            style={{
                              minWidth: "240px"
                            }}
                            className="absolute right-0 top-12 bg-white border rounded-2xl shadow-2xl z-50 overflow-hidden"
                          >

                            {staff.length === 0 && (

                              <div className="p-4 text-gray-500">

                                No staff available

                              </div>

                            )}

                            {staff.map(s => (

                              <div
                                key={s._id}
                                onClick={() =>
                                  assignStaff(
                                    c._id,
                                    s._id
                                  )
                                }
                                className="p-4 hover:bg-gray-100 cursor-pointer border-b transition"
                              >

                                <div className="font-semibold">

                                  {s.name}

                                </div>

                                <div className="text-sm text-gray-500">

                                  {s.department ||
                                    "General Staff"}

                                </div>

                              </div>

                            ))}

                          </div>

                        )}

                      </>

                    )}

                  </td>

                </tr>

              ))}

              {/* EMPTY */}

              {complaints.length === 0 && (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center p-10 text-gray-500"
                  >

                    No complaints found

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

  const styles = {

    OPEN:
      "bg-red-100 text-red-700",

    IN_PROGRESS:
      "bg-orange-100 text-orange-700",

    RESOLVED:
      "bg-green-100 text-green-700",

    CLOSED:
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