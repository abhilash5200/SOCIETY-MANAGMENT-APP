import { useState } from "react";

import {
  User,
  Mail,
  Phone,
  Shield,
  Home,
  Edit
} from "lucide-react";

import ResidentLayout from "../../components/layout/ResidentLayout";

import { useAuthStore } from "../../store/authStore";

export default function ResidentProfile() {

  const user = useAuthStore(
    (s) => s.user
  );

  const [isEditing, setIsEditing] =
    useState(false);

  const [form, setForm] = useState({

    name: user?.name || "",

    email: user?.email || "",

    phone: user?.phone || ""

  });

  // ================= HANDLE CHANGE =================

  const handleChange = e => {

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });

  };

  // ================= SAVE =================

  const handleSave = e => {

    e.preventDefault();

    // BACKEND UPDATE API CAN BE ADDED LATER

    alert(
      "Profile update feature can be connected to backend later"
    );

    setIsEditing(false);

  };

  return (

    <ResidentLayout>

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-4xl font-bold">
            My Profile
          </h1>

          <p className="text-gray-500 mt-1">
            Resident account information
          </p>

        </div>

        <button
          onClick={() =>
            setIsEditing(!isEditing)
          }
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg"
        >

          <Edit size={20} />

          {isEditing
            ? "Cancel"
            : "Edit Profile"}

        </button>

      </div>

      {/* PROFILE CARD */}

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

        {/* TOP SECTION */}

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-10 text-white">

          <div className="flex flex-col md:flex-row md:items-center gap-6">

            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">

              {user?.name?.charAt(0)}

            </div>

            <div>

              <h2 className="text-4xl font-bold">

                {user?.name}

              </h2>

              <p className="text-indigo-100 mt-2 text-lg">

                {user?.role}

              </p>

            </div>

          </div>

        </div>

        {/* DETAILS */}

        <div className="p-8">

          {!isEditing ? (

            <div className="grid md:grid-cols-2 gap-6">

              <InfoCard
                icon={<User />}
                title="Full Name"
                value={user?.name}
              />

              <InfoCard
                icon={<Mail />}
                title="Email"
                value={user?.email}
              />

              <InfoCard
                icon={<Phone />}
                title="Phone"
                value={user?.phone}
              />

              <InfoCard
                icon={<Shield />}
                title="Role"
                value={user?.role}
              />

              <InfoCard
                icon={<Home />}
                title="Flat"
                value={
                  user?.flat
                    ? `${user.flat.block}-${user.flat.flatNumber}`
                    : "Not Allocated"
                }
              />

              <InfoCard
                icon={<Home />}
                title="Floor"
                value={
                  user?.flat?.floor || "-"
                }
              />

            </div>

          ) : (

            <form
              onSubmit={handleSave}
              className="space-y-6"
            >

              <div>

                <label className="block font-medium mb-2">

                  Full Name

                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border rounded-2xl p-4"
                />

              </div>

              <div>

                <label className="block font-medium mb-2">

                  Email

                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border rounded-2xl p-4"
                />

              </div>

              <div>

                <label className="block font-medium mb-2">

                  Phone

                </label>

                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border rounded-2xl p-4"
                />

              </div>

              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-semibold"
              >
                Save Changes
              </button>

            </form>

          )}

        </div>

      </div>

    </ResidentLayout>

  );
}


// ================= INFO CARD =================

function InfoCard({
  icon,
  title,
  value
}) {

  return (

    <div className="bg-gray-50 rounded-2xl p-5 flex items-start gap-4">

      <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl">

        {icon}

      </div>

      <div>

        <p className="text-gray-500 text-sm mb-1">

          {title}

        </p>

        <h3 className="font-semibold text-lg break-all">

          {value || "-"}

        </h3>

      </div>

    </div>

  );
}