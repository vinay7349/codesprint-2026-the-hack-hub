import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "../App.css";

const API_BASE = "http://localhost:5000";

// Map severity string to UI level for styling
const getSeverityLevel = (severity) => {
  if (!severity) return "low";
  const val = severity.toLowerCase();
  if (val === "high") return "high";
  if (val === "medium") return "medium";
  return "low";
};

const severityIcon = (level) => {
  switch (level) {
    case "high":
      return "⚠️";
    case "medium":
      return "⚡";
    default:
      return "✅";
  }
};

const safetyActionsForSeverity = (level) => {
  if (level === "high") {
    return [
      "Move to higher and safer ground immediately if flooding or water rise is reported.",
      "Avoid bridges, underpasses, and low-lying areas prone to water logging.",
      "Keep emergency numbers and important documents accessible.",
      "Follow instructions from local authorities and official channels.",
    ];
  }
  if (level === "medium") {
    return [
      "Monitor local news and official alerts for status updates.",
      "Prepare an emergency kit with water, first-aid, and essential supplies.",
      "Inform family members and coordinate a safe meeting point.",
    ];
  }
  return [
    "Stay aware of your surroundings and watch for any changes.",
    "Share important information only from verified sources.",
    "Keep your phone charged and location services enabled for quick response.",
  ];
};

/**
 * Live Alerts Component
 * Displays real-time alert cards with severity color coding
 * Shows expandable safety actions for each alert
 */
function LiveAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [expandedAlertId, setExpandedAlertId] = useState(null);

  useEffect(() => {
    // Fetch initial alerts
    const fetchAlerts = async () => {
      try {
        const res = await fetch(`${API_BASE}/alerts`);
        const data = await res.json();
        setAlerts(data.alerts || []);
      } catch (err) {
        console.error("Failed to fetch alerts", err);
      }
    };

    fetchAlerts();

    // Connect to Socket.IO backend for real-time updates
    const socket = io(API_BASE, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("new_alert", async (alert) => {
      // Mark alert as "new" for fade-in animation
      const enriched = { ...alert, _isNew: true };
      setAlerts((prev) => [enriched, ...prev]);

      // Show browser notification when new alert is received
      if ("Notification" in window && Notification.permission === "granted") {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          const title = `New ${alert.severity} alert`;
          const options = {
            body: `${alert.location}: ${alert.message}`,
            tag: alert._id || alert.timestamp,
          };
          if (registration && registration.showNotification) {
            registration.showNotification(title, options);
          } else {
            new Notification(title, options);
          }
        } catch (err) {
          console.error("Failed to show notification:", err);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const toggleSafetyActions = (id) => {
    setExpandedAlertId((current) => (current === id ? null : id));
  };

  return (
    <section className="card" aria-labelledby="live-alerts-heading" aria-live="polite">
        <div className="alerts-section">
          {alerts.length === 0 ? (
            <p className="alerts-empty">
              No alerts yet. Be the first to report if you notice something important.
            </p>
          ) : (
            <ul className="alerts-list">
              {alerts.map((alert) => {
                const id = alert._id || alert.timestamp;
                const level = getSeverityLevel(alert.severity);
                const isExpanded = expandedAlertId === id;
                const actions = safetyActionsForSeverity(level);

                return (
                  <li key={id}>
                    <article
                      className={`alert-card alert-card--${level}`}
                      aria-label={`${alert.severity || "Low"} severity alert`}
                    >
                      <header className="alert-card-header">
                        <span className={`severity-badge severity-badge--${level}`}>
                          <span className="severity-icon">{severityIcon(level)}</span>
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

                      <div className="alert-actions-bar">
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => toggleSafetyActions(id)}
                          aria-expanded={isExpanded}
                        >
                          <span className="btn-secondary-icon">🛡️</span>
                          {isExpanded ? "Hide Safety Actions" : "View Safety Actions"}
                        </button>
                        <span className="alert-meta">Community-reported alert</span>
                      </div>

                      {isExpanded && (
                        <div className="alert-actions-panel">
                          <div className="alert-actions-icon">⚠️</div>
                          <div className="alert-actions-panel-inner">
                            <p className="alert-actions-title">Suggested safety actions</p>
                            <ul className="alert-actions-list">
                              {actions.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </article>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
  );
}

export default LiveAlerts;

