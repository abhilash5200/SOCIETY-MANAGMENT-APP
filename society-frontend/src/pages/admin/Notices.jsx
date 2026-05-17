import { useEffect, useState } from "react";

import {
  Bell,
  Megaphone,
  Trash2,
  PlusCircle,
  FileText
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import api from "../../api/axios";

export default function Notices() {

  const [notices, setNotices] =
    useState([]);

  const [form, setForm] =
    useState({

      title: "",
      content: ""

    });

  useEffect(() => {

    fetchNotices();

  }, []);

  // ================= FETCH NOTICES =================

  const fetchNotices = async () => {

    try {

      const res =
        await api.get("/notices");

      setNotices(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {

      console.error(
        "Notices error:",
        err
      );

    }
  };

  // ================= HANDLE CHANGE =================

  const handleChange = e =>

    setForm({

      ...form,

      [e.target.name]:
      e.target.value

    });

  // ================= CREATE NOTICE =================

  const handleSubmit = async e => {

    e.preventDefault();

    if (
      !form.title ||
      !form.content
    ) {

      alert(
        "Title and content are required"
      );

      return;
    }

    try {

      await api.post(
        "/notices",
        form
      );

      setForm({

        title: "",
        content: ""

      });

      fetchNotices();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Failed to create notice"
      );

    }
  };

  // ================= DELETE NOTICE =================

  const deleteNotice = async id => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this notice?"
      );

    if (!confirmDelete)
      return;

    try {

      await api.delete(
        `/notices/${id}`
      );

      fetchNotices();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Delete failed"
      );

    }
  };

  return (

    <DashboardLayout>

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">

          Notices & Announcements

        </h1>

        <p className="text-gray-500 mt-2">

          Publish and manage society announcements

        </p>

      </div>

      {/* STATS */}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">

        <StatCard
          title="Total Notices"
          value={notices.length}
          color="bg-indigo-600"
          icon={<Bell />}
        />

        <StatCard
          title="Announcements"
          value="Society"
          color="bg-purple-600"
          icon={<Megaphone />}
          small
        />

        <StatCard
          title="Published"
          value="Active"
          color="bg-green-600"
          icon={<FileText />}
          small
        />

      </div>

      {/* CREATE NOTICE */}

      <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">

        <div className="flex items-center gap-4 mb-6">

          <div className="bg-indigo-100 text-indigo-600 p-4 rounded-2xl">

            <PlusCircle size={28} />

          </div>

          <div>

            <h2 className="text-2xl font-bold">

              Create New Notice

            </h2>

            <p className="text-gray-500">

              Share important society announcements

            </p>

          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* TITLE */}

          <input
            name="title"
            placeholder="Notice Title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded-2xl p-4"
            required
          />

          {/* CONTENT */}

          <textarea
            name="content"
            placeholder="Notice Content"
            value={form.content}
            onChange={handleChange}
            rows="5"
            className="w-full border rounded-2xl p-4 resize-none"
            required
          />

          {/* BUTTON */}

          <button
            className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-6 py-4 rounded-2xl font-semibold"
          >

            Publish Notice

          </button>

        </form>

      </div>

      {/* NOTICE LIST */}

      <div className="space-y-6">

        {notices.map(n => (

          <div
            key={n._id}
            className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition"
          >

            {/* TOP */}

            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">

              <div className="flex items-center justify-between gap-5">

                <div className="flex items-center gap-4">

                  <div className="bg-white/20 p-4 rounded-2xl">

                    <Megaphone size={28} />

                  </div>

                  <div>

                    <h2 className="text-2xl font-bold">

                      {n.title}

                    </h2>

                    <p className="text-indigo-100 mt-1">

                      {new Date(
                        n.createdAt
                      ).toLocaleString()}

                    </p>

                  </div>

                </div>

                {/* DELETE */}

                <button
                  onClick={() =>
                    deleteNotice(n._id)
                  }
                  className="bg-red-500 hover:bg-red-600 transition text-white px-5 py-3 rounded-2xl font-semibold flex items-center gap-2"
                >

                  <Trash2 size={18} />

                  Delete

                </button>

              </div>

            </div>

            {/* CONTENT */}

            <div className="p-6">

              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">

                {n.content}

              </p>

            </div>

          </div>

        ))}

        {/* EMPTY */}

        {notices.length === 0 && (

          <div className="bg-white rounded-3xl shadow-lg p-10 text-center">

            <Bell
              size={50}
              className="mx-auto text-gray-400 mb-4"
            />

            <h3 className="text-2xl font-bold mb-2">

              No Notices Available

            </h3>

            <p className="text-gray-500">

              Published notices will appear here

            </p>

          </div>

        )}

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