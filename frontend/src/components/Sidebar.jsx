import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

/**
 * Sidebar Navigation Component
 * Fixed vertical sidebar with feature navigation buttons
 * Highlights active section based on current route
 */
function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Navigation items with icons and routes
  const navItems = [
    { icon: "🚨", label: "Home", path: "/", visible: true },
    { icon: "📢", label: "Live Alerts", path: "/live-alerts", visible: true },
    { icon: "🛡", label: "Emergency Actions", path: "/emergency-actions", visible: true },
    { icon: "🚗", label: "Smart Evacuation", path: "/smart-evacuation", visible: true },
    { icon: "📊", label: "Area Risk Monitoring", path: "/area-risk", visible: true },
    { icon: "🏠", label: "Register Family", path: "/register-family", visible: true },
    // Only show Admin Dashboard if logged in as Admin
    { icon: "👮", label: "Admin Dashboard", path: "/admin", visible: isAdmin },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsOpen(false); // Close sidebar on mobile when link is clicked
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname === path;
  };

  return (
    <>
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      <div className={`sidebar-overlay ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(false)} />

      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`} aria-label="Main navigation">
        <div className="sidebar-header">
          <h2 className="sidebar-title">SankatMitra Control Panel</h2>
        </div>
        <nav className="sidebar-nav" aria-label="Feature navigation">
          <div style={{ flex: 1 }}>
            <ul className="sidebar-nav-list">
              {navItems.filter(item => item.visible).map((item) => (
                <li key={item.path}>
                  <button
                    type="button"
                    className={`sidebar-nav-item ${isActive(item.path) ? "sidebar-nav-item--active" : ""}`}
                    onClick={() => handleNavClick(item.path)}
                    aria-current={isActive(item.path) ? "page" : undefined}
                  >
                    <span className="sidebar-nav-icon">{item.icon}</span>
                    <span className="sidebar-nav-label">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            {user ? (
              <div style={{ padding: "0 1rem" }}>
                <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.5rem" }}>
                  Logged in as <br />
                  <strong style={{ color: "#fff" }}>{user.name || "User"}</strong>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-secondary"
                  style={{ width: "100%", justifyContent: "center", borderColor: "#ef4444", color: "#fca5a5" }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "0 1rem" }}>
                <Link to="/login" className="btn-primary" onClick={() => setIsOpen(false)} style={{ textDecoration: "none", fontSize: "0.9rem" }}>
                  User Login
                </Link>
                <Link to="/admin/login" className="btn-secondary" onClick={() => setIsOpen(false)} style={{ textDecoration: "none", justifyContent: "center", fontSize: "0.9rem" }}>
                  Admin Access
                </Link>
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
