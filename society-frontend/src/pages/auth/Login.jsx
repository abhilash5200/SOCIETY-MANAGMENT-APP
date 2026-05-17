import { useState } from "react";

import {
  useNavigate,
  Link
} from "react-router-dom";

import api from "../../api/axios";

import { useAuthStore }
from "../../store/authStore";

export default function Login() {

  const navigate = useNavigate();

  const loginStore =
    useAuthStore((s) => s.login);

  const [form, setForm] =
    useState({

      email: "",
      password: ""

    });

  const handleChange = e =>

    setForm({

      ...form,

      [e.target.name]:
      e.target.value

    });

  const handleSubmit = async e => {

    e.preventDefault();

    try {

      const res = await api.post(
        "/auth/login",
        form
      );

      loginStore(res.data);

      const role =
        res.data.user.role;

      // ================= ROLE ROUTING =================

      if (role === "ADMIN") {

        navigate("/admin");

      }

      else if (role === "RESIDENT") {

        navigate("/resident");

      }

      else if (role === "GUARD") {

        navigate("/guard");

      }

      else if (role === "STAFF") {

        navigate("/staff");

      }

      else {

        navigate("/");

      }

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Login failed"
      );

    }
  };

  return (

    <div className="min-h-screen flex">

      {/* LEFT IMAGE PANEL */}

      <div className="hidden lg:block w-1/2 bg-indigo-600">

        <img
          src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae"
          alt="Login"
          className="h-full w-full object-cover opacity-80"
        />

      </div>

      {/* FORM */}

      <div className="flex w-full lg:w-1/2 items-center justify-center bg-gray-50">

        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md"
        >

          <h2 className="text-3xl font-bold mb-6 text-center">

            Welcome Back

          </h2>

          {/* EMAIL */}

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

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

            Sign In

          </button>

          {/* REGISTER LINK */}

          <p className="mt-6 text-center text-sm text-gray-600">

            Don’t have an account?{" "}

            <Link
              to="/register"
              className="text-indigo-600 font-semibold hover:underline"
            >

              Register

            </Link>

          </p>

        </form>

      </div>

    </div>

  );
}