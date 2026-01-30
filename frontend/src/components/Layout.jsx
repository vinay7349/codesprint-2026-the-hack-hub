import React from "react";
import Sidebar from "./Sidebar";
import "./Layout.css";

/**
 * Main Layout Component
 * Provides 2-column layout: fixed sidebar + dynamic content area
 */
function Layout({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;

