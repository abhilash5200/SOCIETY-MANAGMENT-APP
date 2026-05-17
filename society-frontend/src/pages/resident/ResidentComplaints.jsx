import { useEffect, useState } from "react";

import {
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Plus
} from "lucide-react";

import ResidentLayout from "../../components/layout/ResidentLayout";
import api from "../../api/axios";

export default function ResidentComplaints() {

  const [complaints, setComplaints] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM"
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  // ================= FETCH =================

  const fetchComplaints = async () => {

    try {

      const res = await api.get("/complaints");

      setComplaints(
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

  // ================= HANDLE CHANGE =================

  const handleChange = e => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  // ================= CREATE =================

  const handleSubmit = async e => {

    e.preventDefault();

    try {

      await api.post(
        "/complaints",
        form
      );

      setForm({
        title: "",
        description: "",
        priority: "MEDIUM"
      });

      setShowForm(false);

      fetchComplaints();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Failed to raise complaint"
      );

    }
  };

  // ================= STATS =================

  const activeComplaints = complaints.filter(
    c =>
      c.status !== "RESOLVED" &&
      c.status !== "CLOSED"
  );

  const resolvedComplaints = complaints.filter(
    c =>
      c.status === "RESOLVED"
  );

  const closedComplaints = complaints.filter(
    c =>
      c.status === "CLOSED"
  );

  return (

    <ResidentLayout>

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-4xl font-bold">
            My Complaints
          </h1>

          <p className="text-gray-500 mt-1">
            Track and manage society issues
          </p>

        </div>

        <button
          onClick={() =>
            setShowForm(!showForm)
          }
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg"
        >

          <Plus size={20} />

          Raise Complaint

        </button>

      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-4 gap-6 mb-8">

        <StatCard
          title="Total"
          value={complaints.length}
          color="bg-indigo-600"
          icon={<AlertCircle />}
        />

        <StatCard
          title="Active"
          value={activeComplaints.length}
          color="bg-orange-500"
          icon={<Clock />}
        />

        <StatCard
          title="Resolved"
          value={resolvedComplaints.length}
          color="bg-green-600"
          icon={<CheckCircle />}
        />

        <StatCard
          title="Closed"
          value={closedComplaints.length}
          color="bg-gray-700"
          icon={<XCircle />}
        />

      </div>

      {/* FORM */}

      {showForm && (

        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">

          <h2 className="text-2xl font-bold mb-6">
            Raise New Complaint
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>

              <label className="block font-medium mb-2">
                Complaint Title
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Water leakage, lift issue..."
                className="w-full border rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />

            </div>

            <div>

              <label className="block font-medium mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="5"
                placeholder="Describe the issue..."
                className="w-full border rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />

            </div>

            <div>

              <label className="block font-medium mb-2">
                Priority
              </label>

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full border rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >

                <option value="LOW">
                  LOW
                </option>

                <option value="MEDIUM">
                  MEDIUM
                </option>

                <option value="HIGH">
                  HIGH
                </option>

              </select>

            </div>

            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-semibold"
            >
              Submit Complaint
            </button>

          </form>

        </div>

      )}

      {/* COMPLAINTS */}

      <div className="space-y-6">

        {loading ? (

          <div className="bg-white rounded-3xl p-10 text-center shadow-lg">

            <p className="text-gray-500">
              Loading complaints...
            </p>

          </div>

        ) : complaints.length === 0 ? (

          <div className="bg-white rounded-3xl p-10 text-center shadow-lg">

            <AlertCircle
              size={50}
              className="mx-auto text-gray-400 mb-4"
            />

            <h3 className="text-xl font-semibold mb-2">
              No Complaints Found
            </h3>

            <p className="text-gray-500">
              You haven’t raised any complaints yet.
            </p>

          </div>

        ) : (

          complaints.map(c => (

            <div
              key={c._id}
              className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition"
            >

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">

                <div>

                  <h2 className="text-2xl font-bold">
                    {c.title}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    {new Date(
                      c.createdAt
                    ).toLocaleString()}
                  </p>

                </div>

                <div className="flex gap-3 flex-wrap">

                  <StatusBadge
                    status={c.status}
                  />

                  <PriorityBadge
                    priority={c.priority}
                  />

                </div>

              </div>

              <p className="text-gray-700 leading-relaxed mb-5">

                {c.description}

              </p>

              <div className="grid md:grid-cols-2 gap-4">

                <div className="bg-gray-50 rounded-2xl p-4">

                  <p className="text-gray-500 text-sm">
                    Assigned Staff
                  </p>

                  <h3 className="font-semibold mt-1">

                    {c.assignedTo?.name ||
                      "Not Assigned Yet"}

                  </h3>

                </div>

                <div className="bg-gray-50 rounded-2xl p-4">

                  <p className="text-gray-500 text-sm">
                    Resolution Date
                  </p>

                  <h3 className="font-semibold mt-1">

                    {c.resolvedAt
                      ? new Date(
                          c.resolvedAt
                        ).toLocaleString()
                      : "Pending"}

                  </h3>

                </div>

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

function StatusBadge({ status }) {

  const styles = {

    OPEN:
      "bg-red-100 text-red-700",

    IN_PROGRESS:
      "bg-yellow-100 text-yellow-700",

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


// ================= PRIORITY BADGE =================

function PriorityBadge({
  priority
}) {

  const styles = {

    LOW:
      "bg-blue-100 text-blue-700",

    MEDIUM:
      "bg-orange-100 text-orange-700",

    HIGH:
      "bg-red-100 text-red-700"

  };

  return (

    <span
      className={`px-4 py-2 rounded-xl text-sm font-semibold ${styles[priority]}`}
    >

      {priority}

    </span>

  );
}