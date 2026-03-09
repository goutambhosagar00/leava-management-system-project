import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";

function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!user || !pass) {
      setToast({
        type: "error",
        text: "Email and password required",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://leave-management-system.wuaze.com/backend/api/auth/adminLogin.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: user,
            password: pass,
          }),
        },
      );

      const text = await res.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON");
      }

      if (data.status === "success") {
        setToast({
          type: "success",
          text: "Login successful 🎉",
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setToast({
          type: "error",
          text: data.message || "Login failed",
        });
      }
    } catch (err) {
      console.error(err);

      setToast({
        type: "error",
        text: "Server connection failed",
      });
    }

    setLoading(false);
  };

  return (
    <>
      <div className="login-container">
        <motion.div
          className="login-card"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="login-icon">
            <FiLogIn size={28} />
          </div>

          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to your admin dashboard</p>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <FiMail className="input-icon" />
              <input
                type="email"
                placeholder="Email Address"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <FiLock className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </motion.div>
      </div>

      {toast && <div className={`ae-toast ${toast.type}`}>{toast.text}</div>}
    </>
  );
}

export default Login;
