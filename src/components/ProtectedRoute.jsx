import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    fetch(
      "https://leave-management-system.wuaze.com/backend/api/auth/checkAuth.php",
      { credentials: "include" },
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "authenticated") {
          setAuth(true);
        } else {
          setAuth(false);
        }
      })
      .catch(() => {
        setAuth(false);
      });
  }, []);

  if (auth === null) {
    return <div>Loading...</div>; // wait until auth checked
  }

  if (auth === false) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
