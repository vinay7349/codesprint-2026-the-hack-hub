import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import "./LandingPage.css";

function LandingPage() {
    return (
        <div className="landing-wrapper">
            {/* Ambient Background */}
            <div className="ambient-glows">
                <div className="glow glow-1"></div>
                <div className="glow glow-2"></div>
            </div>

            {/* Navbar Placeholder (if needed specifically for landing, otherwise uses global Layout) */}

            <main className="landing-main">
                {/* HERO SECTION */}
                <section className="hero-section">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <span className="pulsing-dot"></span>
                            Live Disaster Monitoring 24/7
                        </div>
                        <h1 className="hero-heading">
                            Disaster Response <br />
                            <span className="gradient-text">Reimagined.</span>
                        </h1>
                        <p className="hero-subtext">
                            SankatMitra uses AI to predict hazards, route evacuations,
                            and keeping families connected when it matters most.
                        </p>
                        <div className="hero-cta-group">
                            <Link to="/live-alerts" className="btn-modern btn-primary-glow">
                                View Live Map
                            </Link>
                            <Link to="/register-family" className="btn-modern btn-glass">
                                Join Protection Network
                            </Link>
                        </div>
                        <div className="hero-trust">
                            <span>Trusted by 50+ Communities</span>
                            <div className="avatar-stack">
                                {[1, 2, 3, 4].map(i => <div key={i} className="avatar-circle"></div>)}
                            </div>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="glass-panel-3d">
                            <div className="radar-sweep"></div>
                            <div className="map-grid"></div>
                            <div className="floating-pin pin-1">📍</div>
                            <div className="floating-pin pin-2">⚠️</div>
                            <div className="floating-pin pin-3">🏠</div>
                            <div className="stats-floater">
                                <span className="stat-label">System Status</span>
                                <span className="stat-val active">Operational</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* BENTO GRID FEATURES */}
                <section className="bento-section">
                    <div className="section-head">
                        <h2>Critical Tools for Crisis Management</h2>
                        <p>Everything you need to stay ahead of the curve.</p>
                    </div>

                    <div className="bento-grid">
                        {/* Large Card */}
                        <div className="bento-card card-large">
                            <div className="card-content">
                                <h3>⚡ Real-Time Alerts</h3>
                                <p>AI-verified updates instantly delivered to your device.</p>
                            </div>
                            <div className="card-visual visual-graph"></div>
                        </div>

                        {/* Medium Card */}
                        <div className="bento-card card-medium">
                            <div className="card-content">
                                <h3>🧭 Smart Routing</h3>
                                <p>Dynamic evacuation paths avoiding flood zones.</p>
                            </div>
                            <div className="card-visual visual-map"></div>
                        </div>

                        {/* Medium Card */}
                        <div className="bento-card card-medium">
                            <div className="card-content">
                                <h3>👨‍👩‍👧‍👦 Family Safety</h3>
                                <p>Instant location tracking for registered members.</p>
                            </div>
                            <div className="card-visual visual-users"></div>
                        </div>

                        {/* Wide Card */}
                        <div className="bento-card card-wide">
                            <div className="card-content">
                                <h3>📡 Offline-Ready Mode</h3>
                                <p>Works even when network connectivity is intermittent (SMS fallback).</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* HOW IT WORKS STEPS */}
                <section className="steps-section">
                    <div className="steps-container">
                        <div className="step-item">
                            <div className="step-num">01</div>
                            <h4>Register</h4>
                            <p>Sign up your family with secure Aadhaar verification.</p>
                        </div>
                        <div className="step-divider"></div>
                        <div className="step-item">
                            <div className="step-num">02</div>
                            <h4>Monitor</h4>
                            <p>Receive localized alerts for your specific region.</p>
                        </div>
                        <div className="step-divider"></div>
                        <div className="step-item">
                            <div className="step-num">03</div>
                            <h4>Survivability</h4>
                            <p>Follow AI-guided routes to the nearest safe shelter.</p>
                        </div>
                    </div>
                </section>

                {/* CALL TO ACTION */}
                <section className="final-cta">
                    <div className="cta-box">
                        <h2>Ready to secure your community?</h2>
                        <p>Join the SankatMitra network today.</p>
                        <Link to="/register-family" className="btn-modern btn-white">
                            Get Started Now
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default LandingPage;
