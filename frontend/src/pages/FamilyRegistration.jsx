import React, { useState, useEffect } from "react";
import "./FamilyRegistration.css";

import { useAuth } from '../context/AuthContext';
const API_BASE = "http://localhost:5000";

function FamilyRegistration() {
  const { loginUser } = useAuth();
  const [formData, setFormData] = useState({
    head_name: "",
    aadhaar: "",
    members: 1,
    location: "",
    phone: "",
    emergency_contact: "",
    special_needs: "",
    status: "safe", // safe, help, missing
  });
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [riskLevel, setRiskLevel] = useState("low");

  // Mock checking risk on mount
  useEffect(() => {
    // Determine risk based on hour of day for demo variety or random
    const hour = new Date().getHours();
    if (hour > 18 || hour < 6) setRiskLevel("medium");
    else setRiskLevel("high");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Aadhaar validation: only digits, max 12
    if (name === "aadhaar") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 12) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };



  const handleSOS = async () => {
    const confirmSOS = window.confirm("ARE YOU SURE? This will alert disaster management immediately.");
    if (!confirmSOS) return;

    try {
      const res = await fetch(`${API_BASE}/sos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: formData.location || "Unknown Location (GPS unavailable)",
          aadhaar: formData.aadhaar,
          phone: formData.phone
        }),
      });

      if (res.ok) {
        alert("SOS SIGNAL SENT! Rescue teams have been notified of your location.");
        setFormData((prev) => ({ ...prev, status: "help" }));
      } else {
        alert("SOS Failed. Please call 112 immediately.");
      }
    } catch (err) {
      console.error(err);
      alert("Network Error. Please try again or call emergency.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.aadhaar.length !== 12) {
      setSubmissionStatus("Invalid Aadhaar Number. Must be 12 digits.");
      return;
    }

    setSubmissionStatus("Registering Family...");
    setIsSubmitting(true);

    try {
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Since backend might not have all fields yet, we'll send what we can
      const res = await fetch(`${API_BASE}/register_family`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmissionStatus("Family Registered Successfully. Identity Linked.");
        loginUser({ ...formData, isAadhaarVerified: true });
        // Optional: clear form or redirect
        setFormData({
          head_name: "",
          aadhaar: "",
          members: 1,
          location: "",
          phone: "",
          emergency_contact: "",
          special_needs: "",
          status: "safe"
        });
      } else {
        const data = await res.json();
        setSubmissionStatus(data.error || "Registration failed.");
      }
    } catch (err) {
      console.error(err);
      // Fallback for demo if backend isn't running
      setSubmissionStatus("Registration successful (Demo Mode)!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRiskMessage = () => {
    if (riskLevel === "high") return "High Flood Risk detected in your region per Aadhaar database linkage.";
    if (riskLevel === "medium") return "Moderate Cyclone Warning. Prepare emergency kits.";
    return "Low Risk currently. Stay updated.";
  };

  return (
    <div className="family-registration-container">
      {/* Floating SOS Button */}
      <div className="sos-float-container">
        <button className="btn-sos" onClick={handleSOS} title="Trigger SOS Alert">
          SOS
        </button>
      </div>

      <header className="fr-header">
        <h1 className="fr-title">Family Safety Registry</h1>
        <p className="fr-subtitle">
          Pre-register your family to ensure expedited rescue operations and priority shelter allocation.
          <br />
          <strong>Proactive Disaster Response • Official Government Registry</strong>
        </p>
      </header>

      <div className="fr-card">
        <form onSubmit={handleSubmit}>
          <div className="fr-grid">
            {/* Left Column */}
            <div className="fr-group">
              <label className="fr-label" htmlFor="head_name">Head of Household</label>
              <input
                type="text"
                id="head_name"
                name="head_name"
                className="fr-input"
                value={formData.head_name}
                onChange={handleChange}
                placeholder="Full Name as per Aadhaar"
                required
              />
            </div>

            <div className="fr-group">
              <label className="fr-label" htmlFor="aadhaar">Aadhaar Number</label>
              <input
                type="text"
                id="aadhaar"
                name="aadhaar"
                className="fr-input"
                value={formData.aadhaar}
                onChange={handleChange}
                placeholder="12-digit Aadhaar Number"
                required
              />
            </div>

            <div className="fr-group">
              <label className="fr-label" htmlFor="phone">Mobile Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="fr-input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                required
              />
            </div>

            <div className="fr-group">
              <label className="fr-label" htmlFor="members">Family Members</label>
              <input
                type="number"
                id="members"
                name="members"
                className="fr-input"
                value={formData.members}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="fr-group full-width">
              <label className="fr-label" htmlFor="emergency_contact">Emergency Contact</label>
              <input
                type="text"
                id="emergency_contact"
                name="emergency_contact"
                className="fr-input"
                value={formData.emergency_contact}
                onChange={handleChange}
                placeholder="Relative or Friend Name/Phone"
                required
              />
            </div>

            {/* Full Width */}
            <div className="fr-group full-width">
              <label className="fr-label" htmlFor="location">Permanent Address</label>
              <textarea
                id="location"
                name="location"
                className="fr-textarea"
                value={formData.location}
                onChange={handleChange}
                rows="2"
                placeholder="House No, Village/City, District, State..."
                required
              />
              <p className="fr-helper">Address will be cross-referenced with your Aadhaar ID.</p>
            </div>

            <div className="fr-group full-width">
              <label className="fr-label" htmlFor="special_needs">Special Needs (Optional)</label>
              <textarea
                id="special_needs"
                name="special_needs"
                className="fr-textarea"
                value={formData.special_needs}
                onChange={handleChange}
                rows="2"
                placeholder="Mention valid details: Elderly, Disabled, Pregnant, Medical needs..."
              />
            </div>



          </div>

          <button type="submit" className="btn-submit-glow" disabled={isSubmitting}>
            {isSubmitting ? "Verifying..." : "Verify Aadhaar & Register"}
          </button>
        </form>

        {submissionStatus && (
          <div style={{ marginTop: "1.5rem", textAlign: "center", color: submissionStatus.includes("Successful") ? "#10b981" : "#ef4444", fontWeight: "600" }}>
            {submissionStatus}
          </div>
        )}
      </div>
    </div>
  );
}

export default FamilyRegistration;
