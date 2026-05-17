import GuardSidebar from "./GuardSidebar";

export default function GuardLayout({
  children
}) {

  return (

    <div className="flex min-h-screen bg-gray-100">

      <GuardSidebar />

      <main className="flex-1 p-6 overflow-x-hidden">

        {children}

      </main>

    </div>

  );
}