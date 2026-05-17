import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

// ================= PUBLIC =================

import Landing from "./pages/public/Landing";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// ================= AUTH PROTECTION =================

import ProtectedRoute from "./pages/auth/ProtectedRoute";
import RoleRoute from "./pages/auth/RoleRoute";

// ================= ADMIN =================

import AdminDashboard from "./pages/admin/AdminDashboard";
import Residents from "./pages/admin/Residents";
import Flats from "./pages/admin/Flats";
import Visitors from "./pages/admin/Visitors";
import Complaints from "./pages/admin/Complaints";
import Staff from "./pages/admin/Staff";
import Bills from "./pages/admin/Bills";
import Notices from "./pages/admin/Notices";
import Parking from "./pages/admin/Parking";

// ================= RESIDENT =================

import ResidentDashboard from "./pages/resident/ResidentDashboard";
import ResidentComplaints from "./pages/resident/ResidentComplaints";
import ResidentBills from "./pages/resident/ResidentBills";
import ResidentNotices from "./pages/resident/ResidentNotices";
import ResidentVisitors from "./pages/resident/ResidentVisitors";
import ResidentParking from "./pages/resident/ResidentParking";
import ResidentProfile from "./pages/resident/ResidentProfile";

// ================= GUARD =================

import GuardDashboard from "./pages/guard/GuardDashboard";
import GuardVisitors from "./pages/guard/GuardVisitors";

// ================= STAFF =================

import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffComplaints from "./pages/staff/StaffComplaints";

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* ================= PUBLIC ================= */}

        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ================= ADMIN ================= */}

        <Route
          path="/admin"
          element={

            <ProtectedRoute>

              <RoleRoute
                allowedRoles={["ADMIN"]}
              >

                <AdminDashboard />

              </RoleRoute>

            </ProtectedRoute>

          }
        />

        <Route
          path="/admin/residents"
          element={

            <ProtectedRoute>

              <RoleRoute
                allowedRoles={["ADMIN"]}
              >

                <Residents />

              </RoleRoute>

            </ProtectedRoute>

          }
        />

        <Route
          path="/admin/flats"
          element={

            <ProtectedRoute>

              <RoleRoute
                allowedRoles={["ADMIN"]}
              >

                <Flats />

              </RoleRoute>

            </ProtectedRoute>

          }
        />

        <Route
          path="/admin/visitors"
          element={

            <ProtectedRoute>

              <RoleRoute
                allowedRoles={["ADMIN"]}
              >

                <Visitors />

              </RoleRoute>

            </ProtectedRoute>

          }
        />

        <Route
          path="/admin/complaints"
          element={

            <ProtectedRoute>

              <RoleRoute
                allowedRoles={["ADMIN"]}
              >

                <Complaints />

              </RoleRoute>

            </ProtectedRoute>

          }
        />

        <Route
          path="/admin/staff"
          element={

            <ProtectedRoute>

              <RoleRoute
                allowedRoles={["ADMIN"]}
              >

                <Staff />

              </RoleRoute>

            </ProtectedRoute>

          }
        />

        <Route
          path="/admin/bills"
          element={

            <ProtectedRoute>

              <RoleRoute
                allowedRoles={["ADMIN"]}
              >

                <Bills />

              </RoleRoute>

            </ProtectedRoute>

          }
        />

        <Route
          path="/admin/notices"
          element={

            <ProtectedRoute>

              <RoleRoute
                allowedRoles={["ADMIN"]}
              >

                <Notices />

              </RoleRoute>

            </ProtectedRoute>

          }
        />

        <Route
          path="/admin/parking"
          element={

            <ProtectedRoute>

              <RoleRoute
                allowedRoles={["ADMIN"]}
              >

                <Parking />

              </RoleRoute>

            </ProtectedRoute>

          }
        />

        {/* ================= RESIDENT ================= */}

        <Route
          path="/resident"
          element={

            <ProtectedRoute>

              <RoleRoute
                allowedRoles={["RESIDENT"]}
              >

                <ResidentDashboard />

              </RoleRoute>

            </ProtectedRoute>

          }
        />

        <Route
          path="/resident/complaints"
          element={

            <ProtectedRoute>

              <RoleRoute
                allowedRoles={["RESIDENT"]}
              >

                <ResidentComplaints />

              </RoleRoute>

            </ProtectedRoute>

          }
        />

        <Route
          path="/resident/bills"
          element={

            <ProtectedRoute>

              <RoleRoute
                allowedRoles={["RESIDENT"]}
              >

                <ResidentBills />

              </RoleRoute>

            </ProtectedRoute>

          }
        />

        <Route
          path="/resident/notices"
          element={

            <ProtectedRoute>

              <RoleRoute
                allowedRoles={["RESIDENT"]}
              >

                <ResidentNotices />

              </RoleRoute>

            </ProtectedRoute>

          }
        />

        <Route
          path="/resident/visitors"
          element={

            <ProtectedRoute>

              <RoleRoute
                allowedRoles={["RESIDENT"]}
              >

                <ResidentVisitors />

              </RoleRoute>

            </ProtectedRoute>

          }
        />

        <Route
          path="/resident/parking"
          element={

            <ProtectedRoute>

              <RoleRoute
                allowedRoles={["RESIDENT"]}
              >

                <ResidentParking />

              </RoleRoute>

            </ProtectedRoute>

          }
        />

        <Route
          path="/resident/profile"
          element={

            <ProtectedRoute>

              <RoleRoute
                allowedRoles={["RESIDENT"]}
              >

                <ResidentProfile />

              </RoleRoute>

            </ProtectedRoute>

          }
        />

        {/* ================= GUARD ================= */}

        <Route
          path="/guard"
          element={

            <ProtectedRoute>

              <RoleRoute
                allowedRoles={["GUARD"]}
              >

                <GuardDashboard />

              </RoleRoute>

            </ProtectedRoute>

          }
        />

        <Route
          path="/guard/visitors"
          element={

            <ProtectedRoute>

              <RoleRoute
                allowedRoles={["GUARD"]}
              >

                <GuardVisitors />

              </RoleRoute>

            </ProtectedRoute>

          }
        />

        {/* ================= STAFF ================= */}

        <Route
          path="/staff"
          element={

            <ProtectedRoute>

              <RoleRoute
                allowedRoles={["STAFF"]}
              >

                <StaffDashboard />

              </RoleRoute>

            </ProtectedRoute>

          }
        />

        <Route
          path="/staff/complaints"
          element={

            <ProtectedRoute>

              <RoleRoute
                allowedRoles={["STAFF"]}
              >

                <StaffComplaints />

              </RoleRoute>

            </ProtectedRoute>

          }
        />

      </Routes>

    </BrowserRouter>

  );
}