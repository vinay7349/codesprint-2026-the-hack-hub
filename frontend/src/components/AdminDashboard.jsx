import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "../App.css";

const API_BASE = "http://localhost:5000";

const getSeverityLevel = (severity) => {
  if (!severity) return "low";
  const val = severity.toLowerCase();
  if (val === "high") return "high";
  if (val === "medium") return "medium";
  return "low";
};

/**
 * Admin Dashboard Component
 * Shows overall statistics and alert list for authority review
 */
function AdminDashboard() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch(`${API_BASE}/alerts`);
        const data = await res.json();
        setAlerts(data.alerts || []);
      } catch (err) {
        console.error("Failed to fetch alerts", err);
        setError("Failed to load alerts.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();

    // Connect to Socket.IO for real-time updates
    const socket = io(API_BASE, {
      transports: ["websocket", "polling"],
    });

    socket.on("new_alert", () => {
      fetchAlerts();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const totalAlerts = alerts.length;
  const highSeverityCount = alerts.filter((a) => a.severity === "High").length;
  const mediumSeverityCount = alerts.filter((a) => a.severity === "Medium").length;
  const lowSeverityCount = alerts.filter(
    (a) => a.severity === "Low" || !a.severity
  ).length;

  return (
    <div className="feature-page">
      <div className="feature-header">
        <h1 className="feature-title">👮 Admin Dashboard</h1>
        <p className="feature-subtitle">
          Overview of community-reported disaster alerts for authority review.
        </p>
      </div>

      {/* Top statistics section */}
      <section aria-label="Alert statistics">
        <div className="stats-grid">
          <div className="stat-card stat-card--total">
            <div className="stat-label">Total Alerts</div>
            <div className="stat-value">{totalAlerts}</div>
            <div className="stat-caption">All community-reported incidents so far.</div>
          </div>

          <div className="stat-card stat-card--high">
            <div className="stat-label">High Severity</div>
            <div className="stat-value">{highSeverityCount}</div>
            <div className="stat-caption">Alerts requiring urgent review.</div>
          </div>

          <div className="stat-card stat-card--medium">
            <div className="stat-label">Medium Severity</div>
            <div className="stat-value">{mediumSeverityCount}</div>
            <div className="stat-caption">Situations to monitor closely.</div>
          </div>

          <div className="stat-card stat-card--low">
            <div className="stat-label">Low Severity</div>
            <div className="stat-value">{lowSeverityCount}</div>
            <div className="stat-caption">Informational and minor alerts.</div>
          </div>
        </div>
      </section>

      {/* Alerts list */}
      <section aria-label="Alerts list" className="card">
        <div className="card-header">
          <h2 className="card-title">Alerts</h2>
          <p className="card-subtitle">
            Review incident details and prioritize based on severity.
          </p>
        </div>

        {loading ? (
          <p className="admin-status-text">Loading alerts...</p>
        ) : error ? (
          <p className="admin-status-text" style={{ color: "#b91c1c" }}>
            {error}
          </p>
        ) : alerts.length === 0 ? (
          <p className="admin-status-text">
            No alerts reported yet. Dashboard will update in real time as community reports arrive.
          </p>
        ) : (
          <div className="admin-alerts-list">
            {alerts.map((alert) => {
              const level = getSeverityLevel(alert.severity);
              const id = alert._id || alert.timestamp;
              return (
                <article
                  key={id}
                  className={`alert-card alert-card--${level}`}
                  aria-label={`${alert.severity || "Low"} severity alert`}
                >
                  <header className="alert-card-header">
                    <span className={`severity-badge severity-badge--${level}`}>
                      {alert.severity || "Low"}
                    </span>
                    <time className="alert-timestamp">
                      {alert.timestamp
                        ? new Date(alert.timestamp).toLocaleString()
                        : ""}
                    </time>
                  </header>
                  <div className="alert-message">{alert.message}</div>
                  <div className="alert-location">
                    Location: <strong>{alert.location}</strong>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;

