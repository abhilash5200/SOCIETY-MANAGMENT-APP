import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  LogOut
} from "lucide-react";

import { useAuthStore }
from "../../store/authStore";

export default function GuardSidebar() {

  const location = useLocation();

  const navigate = useNavigate();

  const logoutStore =
    useAuthStore((s) => s.logout);

  const logout = () => {

    logoutStore();

    navigate("/login");
  };

  const links = [

    {
      name: "Dashboard",
      to: "/guard",
      icon: <LayoutDashboard size={20} />
    },

    {
      name: "Visitors",
      to: "/guard/visitors",
      icon: <Users size={20} />
    }

  ];

  return (

    <aside className="w-64 min-h-screen sticky top-0 bg-indigo-700 text-white flex flex-col shadow-2xl overflow-y-auto">

      {/* BRAND */}

      <div className="p-6 border-b border-indigo-500">

        <h1 className="text-2xl font-bold">
          ABHI-SOCIETY
        </h1>

        <p className="text-indigo-200 text-sm mt-1">

          Guard Panel

        </p>

      </div>

      {/* LINKS */}

      <nav className="flex-1 p-4 space-y-2">

        {links.map(link => (

          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all

              ${
                location.pathname === link.to
                  ? "bg-white text-indigo-700 font-semibold shadow-lg"
                  : "hover:bg-indigo-600"
              }
            `}
          >

            {link.icon}

            <span>
              {link.name}
            </span>

          </Link>

        ))}

      </nav>

      {/* LOGOUT */}

      <div className="p-4 border-t border-indigo-500">

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 transition p-3 rounded-xl font-semibold"
        >

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </aside>

  );
}