import { useEffect, useState } from "react";

import {
  Bell,
  CalendarDays,
  Megaphone
} from "lucide-react";

import ResidentLayout from "../../components/layout/ResidentLayout";

import api from "../../api/axios";

export default function ResidentNotices() {

  const [notices, setNotices] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  // ================= FETCH NOTICES =================

  const fetchNotices = async () => {

    try {

      const res = await api.get("/notices");

      setNotices(
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

  return (

    <ResidentLayout>

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Society Notices
        </h1>

        <p className="text-gray-500 mt-1">
          Stay updated with society announcements
        </p>

      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <StatCard
          title="Total Notices"
          value={notices.length}
          color="bg-indigo-600"
          icon={<Bell />}
        />

        <StatCard
          title="Latest Updates"
          value={
            notices.length > 0
              ? "Available"
              : "No Updates"
          }
          color="bg-green-600"
          icon={<Megaphone />}
        />

        <StatCard
          title="Announcements"
          value="Society"
          color="bg-orange-500"
          icon={<CalendarDays />}
        />

      </div>

      {/* NOTICES */}

      <div className="space-y-6">

        {loading ? (

          <div className="bg-white rounded-3xl shadow-lg p-10 text-center">

            <p className="text-gray-500">
              Loading notices...
            </p>

          </div>

        ) : notices.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-lg p-10 text-center">

            <Bell
              size={50}
              className="mx-auto text-gray-400 mb-4"
            />

            <h3 className="text-xl font-semibold mb-2">
              No Notices Available
            </h3>

            <p className="text-gray-500">
              Society announcements will appear here.
            </p>

          </div>

        ) : (

          notices.map(notice => (

            <div
              key={notice._id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition"
            >

              {/* TOP */}

              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">

                <div className="flex items-center gap-4">

                  <div className="bg-white/20 p-4 rounded-2xl">

                    <Megaphone size={28} />

                  </div>

                  <div>

                    <h2 className="text-2xl font-bold">

                      {notice.title}

                    </h2>

                    <p className="text-indigo-100 mt-1">

                      {new Date(
                        notice.createdAt
                      ).toLocaleString()}

                    </p>

                  </div>

                </div>

              </div>

              {/* CONTENT */}

              <div className="p-6">

                <p className="text-gray-700 leading-relaxed text-lg">

                  {notice.content}

                </p>

                {/* FOOTER */}

                <div className="mt-6 pt-5 border-t flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                  <div className="text-sm text-gray-500">

                    Published by:

                    <span className="font-semibold ml-2 text-gray-700">

                      {notice.createdBy?.name ||
                        "Society Admin"}

                    </span>

                  </div>

                  <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold">

                    NOTICE

                  </span>

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

        <h2 className="text-2xl font-bold">
          {value}
        </h2>

      </div>

    </div>

  );
}