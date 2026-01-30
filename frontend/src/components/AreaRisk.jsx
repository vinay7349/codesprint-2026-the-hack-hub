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
 * Area Risk Monitoring Component
 * Shows risk cards by area with total alerts, high severity count, and risk level badge
 * Includes pulse animation for High risk areas
 */
function AreaRisk() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch(`${API_BASE}/alerts`);
        const data = await res.json();
        setAlerts(data.alerts || []);
      } catch (err) {
        console.error("Failed to fetch alerts", err);
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

  // Group alerts by location/area
  const areaStats = alerts.reduce((acc, alert) => {
    const area = alert.location || "Unknown Area";
    if (!acc[area]) {
      acc[area] = {
        area,
        total: 0,
        high: 0,
        medium: 0,
        low: 0,
      };
    }
    acc[area].total++;
    const level = getSeverityLevel(alert.severity);
    if (level === "high") acc[area].high++;
    else if (level === "medium") acc[area].medium++;
    else acc[area].low++;
    return acc;
  }, {});

  const areaList = Object.values(areaStats).sort((a, b) => {
    // Sort by high severity count first, then total
    if (b.high !== a.high) return b.high - a.high;
    return b.total - a.total;
  });

  const getRiskLevel = (area) => {
    if (area.high > 0) return "high";
    if (area.medium > 0) return "medium";
    return "low";
  };

  const getRiskLabel = (level) => {
    switch (level) {
      case "high":
        return "High Risk";
      case "medium":
        return "Medium Risk";
      default:
        return "Low Risk";
    }
  };

  if (loading) {
    return (
      <div className="feature-page">
        <div className="feature-header">
          <h1 className="feature-title">📊 Area Risk Monitoring</h1>
          <p className="feature-subtitle">Loading area risk data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feature-page">
      <div className="feature-header">
        <h1 className="feature-title">📊 Area Risk Monitoring</h1>
        <p className="feature-subtitle">
          Monitor disaster risk levels by area based on reported alerts. High risk areas are highlighted.
        </p>
      </div>

      <section className="card">
        {areaList.length === 0 ? (
          <p className="alerts-empty">No area data available yet.</p>
        ) : (
          <div className="area-risk-grid">
            {areaList.map((area, idx) => {
              const riskLevel = getRiskLevel(area);
              return (
                <article
                  key={idx}
                  className={`area-risk-card area-risk-card--${riskLevel}`}
                >
                  <div className="area-risk-header">
                    <h3 className="area-risk-name">{area.area}</h3>
                    <span
                      className={`area-risk-badge area-risk-badge--${riskLevel}`}
                    >
                      {getRiskLabel(riskLevel)}
                    </span>
                  </div>
                  <div className="area-risk-stats">
                    <div className="area-risk-stat">
                      <span className="area-risk-stat-label">Total Alerts</span>
                      <span className="area-risk-stat-value">{area.total}</span>
                    </div>
                    <div className="area-risk-stat">
                      <span className="area-risk-stat-label">High Severity</span>
                      <span className="area-risk-stat-value area-risk-stat-value--high">
                        {area.high}
                      </span>
                    </div>
                    <div className="area-risk-stat">
                      <span className="area-risk-stat-label">Medium</span>
                      <span className="area-risk-stat-value area-risk-stat-value--medium">
                        {area.medium}
                      </span>
                    </div>
                    <div className="area-risk-stat">
                      <span className="area-risk-stat-label">Low</span>
                      <span className="area-risk-stat-value area-risk-stat-value--low">
                        {area.low}
                      </span>
                    </div>
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

export default AreaRisk;

