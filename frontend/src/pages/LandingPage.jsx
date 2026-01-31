import React from "react";
import { Link } from "react-router-dom";
import { Activity, Navigation, Shield, Zap, Users, ShieldCheck, Map as MapIcon, ChevronRight } from "lucide-react";
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
                                <Activity className="w-5 h-5 mr-2" /> Live Dashboard
                            </Link>
                            <Link to="/smart-evacuation" className="btn-modern btn-glass">
                                <Navigation className="w-5 h-5 mr-2" /> Smart Evacuation
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
                                <span className="card-badge">LIVE ENGINE</span>
                                <h3>⚡ Command Center Feed</h3>
                                <p>Real-time, distance-sorted alerts with proximity intelligence. Stay ahead of every hazard.</p>
                            </div>
                            <div className="card-visual visual-graph"></div>
                        </div>

                        {/* Medium Card */}
                        <div className="bento-card card-medium">
                            <div className="card-content">
                                <span className="card-badge accent">GOOGLE MAPS</span>
                                <h3>🧭 Smart Routing AI</h3>
                                <p>Precision pathfinding using Google Maps Satellite & Traffic tiles.</p>
                            </div>
                            <div className="card-visual visual-map"></div>
                        </div>

                        {/* Medium Card */}
                        <div className="bento-card card-medium">
                            <div className="card-content">
                                <span className="card-badge safety">FAMILY HUB</span>
                                <h3>👨‍👩‍👧‍👦 Rapid Assistance</h3>
                                <p>One-click SOS signaling and secure family protection network.</p>
                            </div>
                            <div className="card-visual visual-users"></div>
                        </div>

                        {/* Wide Card */}
                        <div className="bento-card card-wide">
                            <div className="card-content">
                                <h3>📡 Operations Terminal</h3>
                                <p>Full-spectrum disaster management for community leads and administration.</p>
                            </div>
                            <Link to="/admin" className="btn-modern btn-white text-xs py-2 px-4">
                                Enter Terminal <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
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
