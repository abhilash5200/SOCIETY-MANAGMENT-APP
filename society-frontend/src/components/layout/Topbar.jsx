import {
  Bell,
  LogOut
} from "lucide-react";

import { useAuthStore }
from "../../store/authStore";

import { useNavigate }
from "react-router-dom";

export default function Topbar() {

  const logout =
    useAuthStore((s) => s.logout);

  const navigate =
    useNavigate();

  const handleLogout = () => {

    logout();

    navigate("/login");
  };

  return (

    <header className="h-20 bg-white border-b flex items-center justify-between px-6 shadow-sm">

      {/* LEFT */}

      <div>

        <h1 className="text-2xl font-bold text-gray-800">

          Society ERP

        </h1>

        <p className="text-gray-500 text-sm">

          Admin Control Panel

        </p>

      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-5">

        {/* NOTIFICATIONS */}

        <button className="relative bg-gray-100 hover:bg-gray-200 transition p-3 rounded-2xl">

          <Bell size={22} />

          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />

        </button>

        {/* LOGOUT */}

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 transition text-white px-5 py-3 rounded-2xl font-semibold flex items-center gap-2"
        >

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </header>

  );
}