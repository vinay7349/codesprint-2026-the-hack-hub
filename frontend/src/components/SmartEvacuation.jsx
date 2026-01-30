import React, { useEffect, useState } from "react";
import "../App.css";

const API_BASE = "http://localhost:5000";

/**
 * Smart Evacuation Component
 * Safe route generator with avoided flooded roads and traffic
 * Displays route steps clearly with color-coded warnings
 */
function SmartEvacuation() {
  const [location, setLocation] = useState("Bengaluru");
  const [evacCurrentLocation, setEvacCurrentLocation] = useState("");
  const [evacDestination, setEvacDestination] = useState("Nearest Shelter");
  const [evacRoute, setEvacRoute] = useState([]);
  const [evacAvoided, setEvacAvoided] = useState({ flooded: [], traffic: [] });
  const [evacMessage, setEvacMessage] = useState("");
  const [evacLoading, setEvacLoading] = useState(false);
  const [evacError, setEvacError] = useState("");

  useEffect(() => {
    // Try to auto-detect location using browser Geolocation API
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const locStr = `Lat ${latitude.toFixed(4)}, Lon ${longitude.toFixed(4)}`;
          setLocation(locStr);
          setEvacCurrentLocation(locStr);
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

  const handleFindSafeRoute = async (e) => {
    e.preventDefault();
    setEvacError("");
    setEvacMessage("");
    setEvacRoute([]);
    setEvacAvoided({ flooded: [], traffic: [] });
    setEvacLoading(true);

    try {
      const res = await fetch(`${API_BASE}/get-safe-route`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_location: evacCurrentLocation || location,
          destination: evacDestination || "Nearest Shelter",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setEvacError(data.error || "Unable to calculate safe route.");
        return;
      }

      setEvacRoute(data.safest_route || []);
      setEvacAvoided(
        data.avoided_roads || {
          flooded: [],
          traffic: [],
        }
      );
      setEvacMessage(data.message || "");
    } catch (err) {
      console.error("Safe route fetch failed", err);
      setEvacError("Network error while requesting safe route.");
    } finally {
      setEvacLoading(false);
    }
  };

  return (
    <div className="feature-page">
      <div className="feature-header">
        <h1 className="feature-title">🚗 Smart Evacuation</h1>
        <p className="feature-subtitle">
          Get the safest evacuation route avoiding flooded roads and heavy traffic.
        </p>
      </div>

      <section className="card" aria-labelledby="safe-evacuation-heading">
        <div className="card-header">
          <h2 id="safe-evacuation-heading" className="card-title evac-card-title">
            <span className="evac-card-title-icon">🛡️</span>
            Smart Evacuation Route (SankatMitra)
          </h2>
        </div>

        <div className="evac-sections">
          <article className="evac-section-item">
            <h3 className="evac-section-title">Avoid Flooded Roads</h3>
            <p className="evac-section-text">
              SankatMitra identifies unsafe flooded roads and excludes them from evacuation routes to reduce accident risk.
            </p>
          </article>
          <article className="evac-section-item">
            <h3 className="evac-section-title">Avoid Traffic Congestion</h3>
            <p className="evac-section-text">
              The system monitors congestion and prefers less crowded roads for faster, more reliable evacuation.
            </p>
          </article>
          <article className="evac-section-item">
            <h3 className="evac-section-title">Suggest Safest Path</h3>
            <p className="evac-section-text">
              Instead of only the shortest route, SankatMitra focuses on the safest path based on simulated safety conditions.
            </p>
          </article>
        </div>

        <form className="evac-form" onSubmit={handleFindSafeRoute}>
          <div className="evac-form-row">
            <label htmlFor="evac-current" className="evac-label">
              Current Location
            </label>
            <input
              id="evac-current"
              type="text"
              className="evac-input"
              value={evacCurrentLocation || location}
              onChange={(e) => setEvacCurrentLocation(e.target.value)}
              placeholder="Your current area"
            />
          </div>
          <div className="evac-form-row">
            <label htmlFor="evac-destination" className="evac-label">
              Destination
            </label>
            <input
              id="evac-destination"
              type="text"
              className="evac-input"
              value={evacDestination}
              onChange={(e) => setEvacDestination(e.target.value)}
              placeholder="Nearest Shelter"
            />
          </div>
          <button type="submit" className="evac-btn" disabled={evacLoading}>
            <span>{evacLoading ? "Calculating..." : "Find Safest Route"}</span>
          </button>
        </form>

        {evacError && (
          <p className="evac-message" style={{ color: "#b91c1c" }}>
            {evacError}
          </p>
        )}

        {(evacRoute.length > 0 || evacMessage) && !evacError && (
          <div className="evac-route-results">
            {evacRoute.length > 0 && (
              <div>
                <span className="evac-chip evac-chip--flood">
                  <span>🛣️</span> Safe Route
                </span>
                <ol className="evac-route-list">
                  {evacRoute.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            <div className="evac-avoided">
              {evacAvoided.flooded && evacAvoided.flooded.length > 0 && (
                <div>
                  <span className="evac-chip evac-chip--flood">
                    <span>🌊</span> Flooded Roads
                  </span>
                  <span style={{ marginLeft: "0.35rem" }}>
                    {evacAvoided.flooded.join(", ")}
                  </span>
                </div>
              )}
              {evacAvoided.traffic && evacAvoided.traffic.length > 0 && (
                <div>
                  <span className="evac-chip evac-chip--traffic">
                    <span>🚗</span> Heavy Traffic
                  </span>
                  <span style={{ marginLeft: "0.35rem" }}>
                    {evacAvoided.traffic.join(", ")}
                  </span>
                </div>
              )}
            </div>

            {evacMessage && <p className="evac-message">{evacMessage}</p>}
          </div>
        )}
      </section>
    </div>
  );
}

export default SmartEvacuation;

