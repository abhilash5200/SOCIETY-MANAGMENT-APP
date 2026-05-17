import Sidebar from "./Sidebar";

import Topbar from "./Topbar";

export default function DashboardLayout({
  children
}) {

  return (

    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">

        <Topbar />

        <main className="flex-1 overflow-y-auto p-6">

          {children}

        </main>

      </div>

    </div>

  );
}