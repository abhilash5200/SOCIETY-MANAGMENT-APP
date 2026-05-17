import { Navigate }
from "react-router-dom";

import { useAuthStore }
from "../../store/authStore";

export default function RoleRoute({

  children,

  allowedRoles

}) {

  const user =
    useAuthStore(
      s => s.user
    );

  // ================= NOT LOGGED IN =================

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ================= ROLE CHECK =================

  if (
    !allowedRoles.includes(
      user.role
    )
  ) {

    // redirect based on role

    if (user.role === "ADMIN") {

      return (
        <Navigate
          to="/admin"
          replace
        />
      );
    }

    if (user.role === "RESIDENT") {

      return (
        <Navigate
          to="/resident"
          replace
        />
      );
    }

    if (user.role === "GUARD") {

      return (
        <Navigate
          to="/guard"
          replace
        />
      );
    }

    if (user.role === "STAFF") {

      return (
        <Navigate
          to="/staff"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}