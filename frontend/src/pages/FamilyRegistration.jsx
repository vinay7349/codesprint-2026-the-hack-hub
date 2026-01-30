import React, { useState } from "react";
import "../App.css";

const API_BASE = "http://localhost:5000";

function FamilyRegistration() {
  const [formData, setFormData] = useState({
    head_name: "",
    members: 1,
    location: "",
    phone: "",
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Registering...");
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/register_family`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("Registration successful! Authorities have been notified.");
        setFormData({ head_name: "", members: 1, location: "", phone: "" });
      } else {
        setStatus(data.error || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feature-page">
      <div className="feature-header">
        <h1 className="feature-title">🏠 Family Registration</h1>
        <p className="feature-subtitle">
          Register your family to receive early warnings and ensure safety during disasters.
        </p>
      </div>

      <div className="app-main-inner" style={{ gridTemplateColumns: "1fr" }}>
        <section className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div className="card-header">
            <h2 className="card-title">Registration Form</h2>
          </div>

          <form className="report-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="head_name" className="form-label">Head of Household</label>
              <input
                type="text"
                id="head_name"
                name="head_name"
                className="form-input"
                value={formData.head_name}
                onChange={handleChange}
                required
                placeholder="Full Name"
              />
            </div>

            <div className="form-field">
              <label htmlFor="members" className="form-label">Number of Members</label>
              <input
                type="number"
                id="members"
                name="members"
                className="form-input"
                value={formData.members}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="phone" className="form-label">Contact Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Mobile Number"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="location" className="form-label">Location / Address</label>
              <textarea
                id="location"
                name="location"
                className="form-textarea"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your address or nearby landmark..."
                rows="3"
                required
              />
              <p className="form-helper">This helps rescue teams find you quickly.</p>
            </div>

            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register Family"}
            </button>
          </form>

          {status && (
            <div className="status-text" style={{ marginTop: "1rem", textAlign: "center", fontWeight: "600" }}>
              {status}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default FamilyRegistration;
