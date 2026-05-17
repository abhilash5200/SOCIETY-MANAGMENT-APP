import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-6 bg-white shadow">
        <h1 className="text-2xl font-bold text-indigo-600">
          ABHI-SOCIETY
        </h1>

        <div className="space-x-6">
          <Link to="/login" className="text-gray-700 hover:text-indigo-600">
            Login
          </Link>

          <Link
            to="/register"
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="grid lg:grid-cols-2 items-center px-10 py-16">

        {/* TEXT */}
        <div>
          <h2 className="text-5xl font-bold mb-6 text-gray-900">
            Smart Society Management Platform
          </h2>

          <p className="text-lg text-gray-600 mb-8">
            Manage visitors, billing, complaints, security,
            facilities and community operations — all in one place.
          </p>

          <Link
            to="/register"
            className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700"
          >
            Get Started
          </Link>
        </div>

        {/* IMAGE */}
        <div className="hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1556157382-97eda2d62296"
            alt="Society"
            className="rounded-xl shadow-xl"
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-10 py-16 bg-white">
        <h3 className="text-3xl font-bold text-center mb-12">
          Everything Your Community Needs
        </h3>

        <div className="grid md:grid-cols-3 gap-8">

          <Feature
            title="Visitor Management"
            text="Approve visitors, track entries, ensure security."
          />

          <Feature
            title="Billing & Payments"
            text="Automated maintenance billing and tracking."
          />

          <Feature
            title="Complaints & Services"
            text="Report issues and monitor resolution status."
          />
        </div>
      </section>
    </div>
  );
}

function Feature({ title, text }) {
  return (
    <div className="p-6 border rounded-xl shadow-sm hover:shadow-lg transition">
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}