import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({

    name: "",
    email: "",
    phone: "",
    password: "",
    role: "RESIDENT"

  });

  const handleChange = (e) =>

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await api.post(
        "/auth/register",
        form
      );

      alert("Registration successful");

      navigate("/login");

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Registration failed"
      );

    }
  };

  return (

    <div className="min-h-screen flex">

      {/* LEFT IMAGE PANEL */}

      <div className="hidden lg:block w-1/2 bg-indigo-700 relative">

        <img
          src="https://images.unsplash.com/photo-1523217582562-09d0def993a6"
          alt="Community"
          className="h-full w-full object-cover opacity-80"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-10">

          <h1 className="text-4xl font-bold mb-4">
            ABHI-SOCIETY
          </h1>

          <p className="text-lg max-w-md opacity-90">

            Join your community’s smart management platform
            and simplify everyday living.

          </p>

        </div>

      </div>

      {/* RIGHT FORM PANEL */}

      <div className="flex w-full lg:w-1/2 items-center justify-center bg-gray-50 p-8">

        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md"
        >

          <h2 className="text-3xl font-bold mb-2 text-center">

            Create your account

          </h2>

          <p className="text-center text-gray-500 mb-8">

            Start managing your society today

          </p>

          {/* NAME */}

          <input
            name="name"
            placeholder="Full name"
            onChange={handleChange}
            className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          {/* EMAIL */}

          <input
            name="email"
            type="email"
            placeholder="Email address"
            onChange={handleChange}
            className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          {/* PHONE */}

          <input
            name="phone"
            placeholder="Phone number"
            onChange={handleChange}
            className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          {/* ROLE */}

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >

            <option value="RESIDENT">
              RESIDENT
            </option>

            <option value="GUARD">
              GUARD
            </option>

            <option value="STAFF">
              STAFF
            </option>

            <option value="ADMIN">
              ADMIN
            </option>

          </select>

          {/* PASSWORD */}

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 mb-6 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          {/* BUTTON */}

          <button
            className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >

            Create Account

          </button>

          {/* LOGIN LINK */}

          <p className="mt-6 text-center text-sm text-gray-600">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-indigo-600 font-semibold hover:underline"
            >

              Sign in

            </Link>

          </p>

        </form>

      </div>

    </div>

  );
}