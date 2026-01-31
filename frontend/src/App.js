import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import LiveAlerts from "./components/LiveAlerts";
import EmergencyActions from "./components/EmergencyActions";
import SmartEvacuation from "./components/SmartEvacuation";
import AreaRisk from "./components/AreaRisk";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./components/AdminDashboard";
import FamilyRegistration from "./pages/FamilyRegistration";
import Assistant from "./components/Assistant";
import UserLogin from "./pages/UserLogin";
import AdminLogin from "./pages/AdminLogin";
import LiveAlertsFeed from "./components/LiveAlertsFeed";
import { ToastProvider } from "./components/Toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";

const API_BASE = "http://localhost:5000";

// Map severity string to UI level for styling
const getSeverityLevel = (severity) => {
  if (!severity) return "low";
  const val = severity.toLowerCase();
  if (val === "high") return "high";
  if (val === "medium") return "medium";
  return "low";
};

const severityInlineStyles = {
  high: { background: "linear-gradient(135deg,#dc2626,#b91c1c)" },
  medium: { background: "linear-gradient(135deg,#f97316,#c2410c)" },
  low: { background: "linear-gradient(135deg,#22c55e,#15803d)" },
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

/**
 * Report Alert Component
 * Embedded in Live Alerts page for quick reporting
 */
function ReportAlert() {
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("Bengaluru");
  const [severityResponse, setSeverityResponse] = useState(null);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Try to auto-detect location using browser Geolocation API
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation(`Lat ${latitude.toFixed(4)}, Lon ${longitude.toFixed(4)}`);
        },
        (err) => {
          console.warn("Geolocation error:", err);
        },
        {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 600000,
        }
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting alert...");
    setSeverityResponse(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, location }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(data.error || "Failed to submit alert.");
        return;
      }

      setSeverityResponse(data.severity);
      setStatus("Alert submitted successfully.");
      setMessage("");
    } catch (err) {
      console.error("Submit failed", err);
      setStatus("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="card" aria-labelledby="report-alert-heading">
      <div className="card-header">
        <h2 id="report-alert-heading" className="card-title">
          Report an Alert
        </h2>
      </div>

      <form className="report-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="message" className="form-label">
            Message
          </label>
          <textarea
            id="message"
            className="form-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            placeholder="Describe the situation... e.g., Water rising near the river, possible flood."
          />
          <p className="form-helper">
            Share clear, factual details so others can stay informed.
          </p>
        </div>

        <div className="form-field">
          <label htmlFor="location" className="form-label">
            Location
          </label>
          <input
            id="location"
            type="text"
            className="form-input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <p className="form-helper">
            Auto-detected when possible; you can adjust it manually.
          </p>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Alert"}
        </button>
      </form>

      {severityResponse && (
        <div className="status-text">
          Severity:&nbsp;
          <span
            className="severity-pill-inline"
            style={severityInlineStyles[getSeverityLevel(severityResponse)]}
          >
            <span className="severity-icon">
              {severityIcon(getSeverityLevel(severityResponse))}
            </span>
            {severityResponse}
          </span>
        </div>
      )}

      {status && <p className="status-text">{status}</p>}
    </section>
  );
}

/**
 * Live Alerts Page with Report Form
 * Combines alert reporting and live alerts viewing
 */
function LiveAlertsPage() {
  const { isAdmin } = useAuth();

  return (
    <div className="feature-page">
      <div className="feature-header">
        <h1 className="feature-title">📢 Live Alerts</h1>
        <p className="feature-subtitle">
          {isAdmin
            ? "Report new alerts and view real-time community-reported disaster alerts."
            : "View real-time community-reported disaster alerts."}
        </p>
      </div>

      <div className="live-alerts-layout">
        <div className="live-alerts-left">
          {isAdmin ? (
            <ReportAlert />
          ) : (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Report an Incident</h2>
              </div>
              <p style={{ color: "#94a3b8", marginBottom: "1rem" }}>
                Only administrators can report public alerts to ensure accuracy.
              </p>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                If you are witnessing an emergency, please contact local authorities immediately.
              </p>
            </div>
          )}
        </div>
        <div className="live-alerts-right">
          <LiveAlerts />
        </div>
      </div>
    </div>
  );
}

function ProtectedAdminRoute({ children }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}

/**
 * Main App Component
 * Uses Layout wrapper with sidebar navigation
 * Routes to different feature components
 */
function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/live-alerts" element={<LiveAlertsFeed />} />
            <Route path="/emergency-actions" element={<EmergencyActions />} />
            <Route path="/smart-evacuation" element={<SmartEvacuation />} />
            <Route path="/area-risk" element={<AreaRisk />} />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />
            <Route path="/register-family" element={<FamilyRegistration />} />
          </Routes>
          <Assistant />
        </Layout>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

