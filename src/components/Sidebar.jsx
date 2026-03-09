import { NavLink } from "react-router-dom";
import { FiGrid, FiUserPlus, FiFileText, FiX } from "react-icons/fi";

function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">LS</div>
          <h2 className="logo-text">LeaveSync</h2>
        </div>

        <FiX className="close-icon" onClick={toggleSidebar} />
      </div>

      <nav className="sidebar-menu">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FiGrid className="menu-icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/add-employee"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FiUserPlus className="menu-icon" />
          <span>Employee Management</span>
        </NavLink>

        <NavLink
          to="/leave-management"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FiFileText className="menu-icon" />
          <span>Leave Management</span>
        </NavLink>

        <NavLink
          to="/pending-leaves"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FiFileText className="menu-icon" />
          <span>Leave Request History</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
