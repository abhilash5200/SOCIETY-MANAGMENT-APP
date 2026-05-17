import { useEffect, useState } from "react";

import {
  CheckCircle
} from "lucide-react";

import StaffLayout from "../../components/layout/StaffLayout";

import api from "../../api/axios";

export default function StaffComplaints() {

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

  // ================= RESOLVE =================

  const resolveComplaint = async id => {

    try {

      await api.patch(
        `/complaints/${id}/resolve`
      );

      fetchComplaints();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Failed to resolve complaint"
      );

    }
  };

  return (

    <StaffLayout>

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">

          Assigned Complaints

        </h1>

        <p className="text-gray-500 mt-1">

          Resolve society maintenance issues

        </p>

      </div>

      {/* COMPLAINTS */}

      <div className="space-y-6">

        {complaints.map(c => (

          <div
            key={c._id}
            className="bg-white rounded-3xl shadow-lg p-6"
          >

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              {/* LEFT */}

              <div>

                <h2 className="text-2xl font-bold mb-2">

                  {c.title}

                </h2>

                <div className="space-y-1 text-gray-600">

                  <p>
                    📝 {c.description}
                  </p>

                  <p>
                    ⚡ Priority: {c.priority}
                  </p>

                  <p>
                    📌 Status: {c.status}
                  </p>

                </div>

              </div>

              {/* RIGHT */}

              <div>

                {c.status !== "RESOLVED" && (

                  <button
                    onClick={() =>
                      resolveComplaint(c._id)
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-2xl font-semibold flex items-center gap-2"
                  >

                    <CheckCircle size={18} />

                    Mark Resolved

                  </button>

                )}

              </div>

            </div>

          </div>

        ))}

      </div>

    </StaffLayout>

  );
}