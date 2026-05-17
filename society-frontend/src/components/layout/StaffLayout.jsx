import StaffSidebar from "./StaffSidebar";

export default function StaffLayout({
  children
}) {

  return (

    <div className="flex min-h-screen bg-gray-100">

      <StaffSidebar />

      <main className="flex-1 p-6 overflow-x-hidden">

        {children}

      </main>

    </div>

  );
}