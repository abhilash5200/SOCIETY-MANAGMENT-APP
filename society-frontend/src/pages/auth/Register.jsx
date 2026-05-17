import { useState } from "react";

import {
  useNavigate,
  Link
} from "react-router-dom";

import api from "../../api/axios";

export default function Register() {

  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({

      name: "",

      email: "",

      phone: "",

      password: ""

    });

  // ================= HANDLE CHANGE =================

  const handleChange = e =>

    setForm({

      ...form,

      [e.target.name]:
        e.target.value

    });

  // ================= SUBMIT =================

  const handleSubmit = async e => {

    e.preventDefault();

    try {

      // ================= RESIDENT ONLY =================

      await api.post(
        "/auth/register",
        {

          ...form,

          role: "RESIDENT"

        }
      );

      alert(
        "Registration successful"
      );

      navigate(
        "/login"
      );

    } catch (err) {

      alert(

        err.response?.data
          ?.message ||

        "Registration failed"

      );

    }
  };

  return (

    <div className="min-h-screen flex">

      {/* ================= LEFT PANEL ================= */}

      <div className="hidden lg:block w-1/2 bg-indigo-700 relative">

        <img
          src="https://images.unsplash.com/photo-1523217582562-09d0def993a6"
          alt="Community"
          className="h-full w-full object-cover opacity-80"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-10">

          <h1 className="text-5xl font-bold mb-4">

            ABHI-SOCIETY

          </h1>

          <p className="text-lg max-w-md opacity-90 leading-relaxed">

            Smart residential society management platform
            for modern communities.

          </p>

        </div>

      </div>

      {/* ================= RIGHT PANEL ================= */}

      <div className="flex w-full lg:w-1/2 items-center justify-center bg-gray-50 p-8">

        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md"
        >

          {/* HEADER */}

          <div className="text-center mb-8">

            <h2 className="text-4xl font-bold mb-2">

              Create Account

            </h2>

            <p className="text-gray-500">

              Register as a resident

            </p>

          </div>

          {/* NAME */}

          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-4 mb-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          {/* EMAIL */}

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full p-4 mb-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          {/* PHONE */}

          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-4 mb-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          {/* PASSWORD */}

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-4 mb-6 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          {/* BUTTON */}

          <button
            className="w-full bg-indigo-600 text-white p-4 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >

            Register

          </button>

          {/* LOGIN LINK */}

          <p className="mt-6 text-center text-sm text-gray-600">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-indigo-600 font-semibold hover:underline"
            >

              Sign In

            </Link>

          </p>

        </form>

      </div>

    </div>

  );
}