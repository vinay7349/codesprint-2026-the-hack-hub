import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import "./LandingPage.css";

function LandingPage() {
    const [hoveredFeature, setHoveredFeature] = useState(null);

    const features = [
        {
            icon: "⚡",
            title: "Real-Time Alerts",
            description: "Instant community reports verified and ranked by AI severity detection.",
            cta: "View Live Alerts",
            link: "/live-alerts",
        },
        {
            icon: "📍",
            title: "Smart Evacuation",
            description: "AI-powered routes that dynamically avoid hazard zones and optimize safety.",
            cta: "Plan Route",
            link: "/smart-evacuation",
        },
        {
            icon: "🛡️",
            title: "Family Safety",
            description: "Keep loved ones connected and track family member status during events.",
            cta: "Register Family",
            link: "/register-family",
        },
        {
            icon: "📊",
            title: "Area Risk Dashboard",
            description: "Visualize hazard zones, risk levels, and incident hotspots in real time.",
            cta: "View Dashboard",
            link: "/area-risk",
        },
    ];

    return (
        <div className="landing-container">
            {/* Hero Section */}
            <section className="landing-hero fade-in">
                <div className="hero-background">
                    <div className="gradient-blur"></div>
                </div>

                <div className="hero-content">
                    <div className="hero-radar animate-float">
                        <span>🚨</span>
                    </div>

                    <h1 className="hero-title">SankatMitra</h1>
                    <p className="hero-subtitle">
                        Advanced AI-powered disaster management system — all-in-one safety companion
                    </p>

                    <div className="hero-actions">
                        <Link to="/live-alerts" className="btn-hero-primary">
                            <span>🚀 Get Started</span>
                        </Link>
                        <Link to="/register-family" className="btn-hero-secondary">
                            <span>👥 Register Family</span>
                        </Link>
                    </div>

                    <div className="hero-meta">
                        <div className="meta-item">
                            <span className="meta-value">500+</span>
                            <span className="meta-label">Alerts Managed</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-value">24/7</span>
                            <span className="meta-label">Live Monitoring</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-value">AI-Powered</span>
                            <span className="meta-label">Smart Analysis</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-header">
                    <h2>Powerful Features Built for Safety</h2>
                    <p>Everything you need to stay informed and protected.</p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`feature-card ${hoveredFeature === index ? "hovered" : ""}`}
                            onMouseEnter={() => setHoveredFeature(index)}
                            onMouseLeave={() => setHoveredFeature(null)}
                        >
                            <div className="feature-icon">{feature.icon}</div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                            <Link to={feature.link} className="feature-cta">
                                {feature.cta} →
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Trust & Stats Section */}
            <section className="trust-section">
                <h2>Why Choose SankatMitra?</h2>
                <div className="trust-grid">
                    <div className="trust-card">
                        <span className="trust-icon">✅</span>
                        <h4>Verified Reports</h4>
                        <p>AI cross-references reports from multiple sources to eliminate false alerts.</p>
                    </div>
                    <div className="trust-card">
                        <span className="trust-icon">⚡</span>
                        <h4>Instant Response</h4>
                        <p>Get emergency updates in seconds, not minutes — when every second counts.</p>
                    </div>
                    <div className="trust-card">
                        <span className="trust-icon">🗺️</span>
                        <h4>Smart Routing</h4>
                        <p>Evacuation paths dynamically calculated to avoid active hazard zones.</p>
                    </div>
                    <div className="trust-card">
                        <span className="trust-icon">🤝</span>
                        <h4>Community Powered</h4>
                        <p>Crowdsourced intelligence from thousands of community members in real time.</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>Take Action Now</h2>
                    <p>Join thousands keeping their communities safe. Start reporting and monitoring today.</p>
                    <Link to="/live-alerts" className="btn-cta-large">
                        Launch Dashboard
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;
