import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close sidebar whenever the route changes (nav link clicked)
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <div className="layout">
      <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(false)} />

      {/* Overlay for mobile — tap outside to close */}
      {isOpen && (
        <div className="overlay" onClick={() => setIsOpen(false)}></div>
      )}

      <div className="main">
        <Navbar toggleSidebar={() => setIsOpen((prev) => !prev)} />

        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
