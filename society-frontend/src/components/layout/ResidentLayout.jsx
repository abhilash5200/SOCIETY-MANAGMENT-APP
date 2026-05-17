// ================= ResidentLayout.jsx =================

import ResidentSidebar from "./ResidentSidebar";

export default function ResidentLayout({ children }) {

  return (

    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <ResidentSidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 overflow-x-hidden">

        {children}

      </main>

    </div>

  );
}