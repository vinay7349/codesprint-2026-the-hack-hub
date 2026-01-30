import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

/**
 * Sidebar Navigation Component
 * Fixed vertical sidebar with feature navigation buttons
 * Highlights active section based on current route
 */
function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation items with icons and routes
  const navItems = [
    { icon: "🚨", label: "Home", path: "/" },
    { icon: "📢", label: "Live Alerts", path: "/live-alerts" },
    { icon: "🛡", label: "Emergency Actions", path: "/emergency-actions" },
    { icon: "🚗", label: "Smart Evacuation", path: "/smart-evacuation" },
    { icon: "📊", label: "Area Risk Monitoring", path: "/area-risk" },
    { icon: "🏠", label: "Register Family", path: "/register-family" },
    { icon: "👮", label: "Admin Dashboard", path: "/admin" },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname === path;
  };

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="sidebar-header">
        <h2 className="sidebar-title">SankatMitra Control Panel</h2>
      </div>
      <nav className="sidebar-nav" aria-label="Feature navigation">
        <ul className="sidebar-nav-list">
          {navItems.map((item) => (
            <li key={item.path}>
              <button
                type="button"
                className={`sidebar-nav-item ${isActive(item.path) ? "sidebar-nav-item--active" : ""}`}
                onClick={() => navigate(item.path)}
                aria-current={isActive(item.path) ? "page" : undefined}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span className="sidebar-nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;

