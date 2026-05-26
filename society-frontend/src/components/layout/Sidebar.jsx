import {
  LayoutDashboard,
  Building2,
  Users,
  ClipboardList,
  Bell,
  Truck,
  UserCog,
  CreditCard,
  Car,
  CalendarDays
} from "lucide-react";

import {
  Link,
  useLocation
} from "react-router-dom";

export default function Sidebar() {

  const location =
    useLocation();

  const links = [

    {
      name: "Dashboard",
      to: "/admin",
      icon: <LayoutDashboard size={20} />
    },

    {
      name: "Flats",
      to: "/admin/flats",
      icon: <Building2 size={20} />
    },

    {
      name: "Residents",
      to: "/admin/residents",
      icon: <Users size={20} />
    },

    {
      name: "Complaints",
      to: "/admin/complaints",
      icon: <ClipboardList size={20} />
    },

    {
      name: "Notices",
      to: "/admin/notices",
      icon: <Bell size={20} />
    },

    {
      name: "Visitors",
      to: "/admin/visitors",
      icon: <Truck size={20} />
    },

    {
      name: "Staff",
      to: "/admin/staff",
      icon: <UserCog size={20} />
    },

    {
      name: "Billing",
      to: "/admin/bills",
      icon: <CreditCard size={20} />
    },

    {
      name: "Parking",
      to: "/admin/parking",
      icon: <Car size={20} />
    },

    {
      name: "Facilities",
      to: "/admin/facilities",
      icon: <CalendarDays size={20} />
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

          Admin Panel

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

    </aside>

  );
}