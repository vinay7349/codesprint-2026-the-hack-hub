import React, { useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";
import "../App.css";
import "./AdminDashboard.css";

const API_BASE = "http://localhost:5000";

const getSeverityLevel = (severity) => {
  if (!severity) return "low";
  const val = severity.toLowerCase();
  if (val === "high") return "high";
  if (val === "medium") return "medium";
  return "low";
};


function AdminDashboard() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [query, setQuery] = useState("");
  const [realtimeEnabled, setRealtimeEnabled] = useState(true);
  const [acknowledged, setAcknowledged] = useState(() => new Set());
  const [expanded, setExpanded] = useState(() => new Set());

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


    const socket = io(API_BASE, {
      transports: ["websocket", "polling"],
    });

    socket.on("new_alert", () => {
      if (realtimeEnabled) fetchAlerts();
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

  const filteredAlerts = useMemo(() => {
    return alerts
      .filter((a) => {
        if (filterSeverity === "all") return true;
        const lvl = getSeverityLevel(a.severity);
        return lvl === filterSeverity;
      })
      .filter((a) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          (a.message || "").toLowerCase().includes(q) ||
          (a.location || "").toLowerCase().includes(q)
        );
      });
  }, [alerts, filterSeverity, query]);

  const handleAcknowledge = async (id) => {
    setAcknowledged((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

    // attempt server ack; fail silently if endpoint absent
    try {
      await fetch(`${API_BASE}/alerts/${id}/ack`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      // ignore - optimistic local update already applied
      console.debug("ack failed or endpoint missing", e);
    }
  };

  const toggleExpanded = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="feature-page">
      <div className="feature-header admin-dashboard-header">
        <div>
          <h1 className="feature-title">👮 Admin Dashboard</h1>
          <p className="feature-subtitle">
            Live overview of community-reported alerts — prioritize and respond.
          </p>
        </div>

        <div className="admin-controls">
          <input
            aria-label="Search alerts by message or location"
            placeholder="Search alerts by message or location..."
            className="admin-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="severity-filter">
            <button
              className={`filter-pill ${filterSeverity === "all" ? "active" : ""}`}
              onClick={() => setFilterSeverity("all")}
            >
              All
            </button>
            <button
              className={`filter-pill ${filterSeverity === "high" ? "active" : ""}`}
              onClick={() => setFilterSeverity("high")}
            >
              High
            </button>
            <button
              className={`filter-pill ${filterSeverity === "medium" ? "active" : ""}`}
              onClick={() => setFilterSeverity("medium")}
            >
              Medium
            </button>
            <button
              className={`filter-pill ${filterSeverity === "low" ? "active" : ""}`}
              onClick={() => setFilterSeverity("low")}
            >
              Low
            </button>
          </div>

          <label className="realtime-toggle">
            <input
              type="checkbox"
              checked={realtimeEnabled}
              onChange={(e) => setRealtimeEnabled(e.target.checked)}
            />
            Realtime updates
          </label>
        </div>
      </div>

      {/* Top statistics section */}
      <section aria-label="Alert statistics">
        <div className="stats-grid">
          <div className="stat-card stat-card--total">
            <div className="stat-label">Total Alerts</div>
            <div className="stat-value">{totalAlerts}</div>
            <div className="stat-caption">Total community-reported incidents to date.</div>
          </div>

          <div className="stat-card stat-card--high">
            <div className="stat-label">High Severity</div>
            <div className="stat-value">{highSeverityCount}</div>
            <div className="stat-caption">Incidents that need immediate attention.</div>
          </div>

          <div className="stat-card stat-card--medium">
            <div className="stat-label">Medium Severity</div>
            <div className="stat-value">{mediumSeverityCount}</div>
            <div className="stat-caption">Situations that require monitoring.</div>
          </div>

          <div className="stat-card stat-card--low">
            <div className="stat-label">Low Severity</div>
            <div className="stat-value">{lowSeverityCount}</div>
            <div className="stat-caption">Informational reports and low-impact alerts.</div>
          </div>
        </div>
      </section>

      {/* Families Section */}
      <section aria-label="Registered Families" className="card" style={{ marginTop: "1.5rem" }}>
        <div className="card-header">
          <h2 className="card-title">Registered Families</h2>
          <p className="card-subtitle">
            Families in high-risk areas. Assign shelters to those in need.
          </p>
        </div>
        <FamilyList />
      </section>

      {/* Alerts list */}
      <section aria-label="Alerts list" className="card" style={{ marginTop: "1.5rem" }}>
        <div className="card-header">
          <h2 className="card-title">Alerts</h2>
          <p className="card-subtitle">
            Review incoming reports and take appropriate action.
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
            No alerts reported yet — the dashboard updates in real time as reports arrive.
          </p>
        ) : (
          <div className="admin-alerts-list">
            {filteredAlerts.map((alert) => {
              const level = getSeverityLevel(alert.severity);
              const id = alert._id || alert.timestamp;
              const isAcknowledged = acknowledged.has(id);
              const isExpanded = expanded.has(id);
              return (
                <article
                  key={id}
                  className={`alert-card alert-card--${level} alert-card--dark ${isAcknowledged ? "acknowledged" : ""}`}
                  aria-label={`${alert.severity || "Low"} severity alert: ${alert.message?.slice(0, 80) || "alert"}`}
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

                  <div className="alert-actions-bar">
                    <div className="alert-meta">
                      Reporter: <strong>{alert.reporter || "community"}</strong>
                    </div>

                    <div className="alert-actions">
                      <button
                        className="btn-secondary"
                        onClick={() => toggleExpanded(id)}
                        aria-expanded={isExpanded}
                        aria-controls={`alert-details-${id}`}
                      >
                        {isExpanded ? "Hide details" : "View details"}
                      </button>

                      <button
                        className={`btn-secondary ${isAcknowledged ? "active" : ""}`}
                        onClick={() => handleAcknowledge(id)}
                        aria-pressed={isAcknowledged}
                      >
                        {isAcknowledged ? "Marked acknowledged" : "Mark acknowledged"}
                      </button>
                    </div>
                  </div>

                  <div
                    id={`alert-details-${id}`}
                    className={`alert-actions-panel ${isExpanded ? "open" : ""}`}
                    aria-hidden={!isExpanded}
                  >
                    <div className="alert-actions-panel-inner">
                      <p className="alert-actions-title">Incident details</p>
                      <ul className="alert-actions-list">
                        <li>Severity: {alert.severity || "Low"}</li>
                        <li>Contact: {alert.contact || "—"}</li>
                        <li>Coordinates: {alert.coordinates || "—"}</li>
                        <li>Notes: {alert.extra || "—"}</li>
                      </ul>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div >
  );
}

function FamilyList() {
  const [families, setFamilies] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newShelter, setNewShelter] = useState({ name: "", location: "", capacity: 50 });

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE}/families`).then(r => r.json()),
      fetch(`${API_BASE}/shelters`).then(r => r.json())
    ]).then(([familiesData, sheltersData]) => {
      setFamilies(familiesData || []);
      setShelters(sheltersData || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addShelter = async (e) => {
    e.preventDefault();
    if (!newShelter.name) return;
    try {
      await fetch(`${API_BASE}/shelters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newShelter)
      });
      setNewShelter({ name: "", location: "", capacity: 50 });
      fetchData(); // Refresh list
    } catch (e) { console.error(e); }
  };

  const assignShelter = async (familyId, shelterId) => {
    try {
      const res = await fetch(`${API_BASE}/assign_shelter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ family_id: familyId, shelter_id: shelterId })
      });
      if (res.ok) {
        // Optimistic update
        setFamilies(prev => prev.map(f =>
          f._id === familyId ? { ...f, status: "In Shelter", shelter_id: shelterId } : f
        ));
      }
    } catch (e) {
      console.error(e);
      alert("Failed to assign shelter");
    }
  };

  if (loading) return <p className="admin-status-text">Loading...</p>;

  return (
    <div>
      {/* Mini Shelter Manager */}
      <div style={{ marginBottom: "1rem", padding: "0.8rem", background: "#f0f9ff", borderRadius: "8px", border: "1px dashed #bae6fd" }}>
        <h3 style={{ fontSize: "0.9rem", marginTop: 0, marginBottom: "0.5rem", fontWeight: 600 }}>Manage Shelters</h3>
        <form onSubmit={addShelter} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <input
            placeholder="Shelter Name"
            value={newShelter.name}
            onChange={e => setNewShelter({ ...newShelter, name: e.target.value })}
            style={{ padding: "0.3rem", borderRadius: "4px", border: "1px solid #ccc", fontSize: "0.8rem" }}
          />
          <input
            placeholder="Location"
            value={newShelter.location}
            onChange={e => setNewShelter({ ...newShelter, location: e.target.value })}
            style={{ padding: "0.3rem", borderRadius: "4px", border: "1px solid #ccc", fontSize: "0.8rem" }}
          />
          <input
            type="number"
            placeholder="Cap"
            value={newShelter.capacity}
            onChange={e => setNewShelter({ ...newShelter, capacity: parseInt(e.target.value) })}
            style={{ padding: "0.3rem", borderRadius: "4px", border: "1px solid #ccc", fontSize: "0.8rem", width: "60px" }}
          />
          <button type="submit" className="btn-primary" style={{ padding: "0.3rem 0.8rem", fontSize: "0.8rem", width: "auto" }}>+ Add Shelter</button>
        </form>
        <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "#0369a1" }}>
          Available Shelters: {shelters.map(s => `${s.name} (${s.occupied}/${s.capacity})`).join(", ") || "None"}
        </div>
      </div>

      <div className="admin-alerts-list">
        {families.length === 0 ? <p className="admin-status-text">No families registered.</p> : families.map(family => (
          <div key={family._id} className="alert-card" style={{ borderColor: family.status === "In Shelter" ? "#15803d" : "#e5e7eb" }}>
            <header className="alert-card-header">
              <span className="severity-badge" style={{ backgroundColor: family.status === "In Shelter" ? "#15803d" : "#2563eb", color: "#fff" }}>
                {family.status || "Safe"}
              </span>
              <span className="alert-timestamp">{new Date(family.registered_at).toLocaleDateString()}</span>
            </header>
            <div className="alert-message">{family.head_name} (Members: {family.members})</div>
            <div className="alert-location">Location: <strong>{family.location}</strong></div>
            <div className="alert-meta">Phone: {family.phone}</div>

            {family.status !== "In Shelter" && (
              <div className="alert-actions-panel open" style={{ marginTop: "0.5rem", background: "#f8fafc" }}>
                <p className="alert-actions-title">Assign to Shelter:</p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {shelters.map(s => (
                    <button
                      key={s._id}
                      className="btn-secondary"
                      onClick={() => assignShelter(family._id, s._id)}
                      style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem" }}
                    >
                      {s.name} ({s.occupied}/{s.capacity})
                    </button>
                  ))}
                  {shelters.length === 0 && <span style={{ fontSize: "0.8rem", color: "#666" }}>No shelters available. Add one via API or UI (pending).</span>}
                </div>
              </div>
            )}
            {family.status === "In Shelter" && (
              <div className="alert-meta" style={{ marginTop: "0.5rem", color: "#166534" }}>
                Currently in shelter (ID: {family.shelter_id})
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;

