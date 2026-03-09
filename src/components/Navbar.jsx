import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiLogOut, FiChevronDown } from "react-icons/fi";

function Navbar({ toggleSidebar }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // Close dropdown when clicking anywhere outside the profile box
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside, true);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside, true);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await fetch(
      "https://leave-management-system.wuaze.com/backend/api/auth/logout.php",
      {
        method: "POST",
        credentials: "include",
      },
    );
    window.location.replace("/");
  };

  return (
    <div className="navbar">
      {/* LEFT SIDE */}
      <div className="navbar-left">
        <FiMenu className="hamburger-icon" onClick={toggleSidebar} />
      </div>

      {/* RIGHT SIDE */}
      <div className="navbar-right" ref={dropdownRef}>
        <div className="profile" onClick={() => setOpen((prev) => !prev)}>
          <div className="avatar">{user?.name?.charAt(0) || "A"}</div>

          <div className="profile-info">
            <strong>{user?.name || "Admin User"}</strong>
            <span>{user?.email || "admin@gmail.com"}</span>
          </div>

          <FiChevronDown className={`chevron ${open ? "rotate" : ""}`} />
        </div>

        {open && (
          <div className="dropdown">
            <button type="button" onClick={handleLogout}>
              <FiLogOut /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
