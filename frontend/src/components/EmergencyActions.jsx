import React, { useState } from "react";
import "../App.css";

/**
 * Emergency Actions Component
 * Shows categorized safety guidelines organized by disaster type
 * Uses expandable accordion layout
 */
function EmergencyActions() {
  const [expandedCategory, setExpandedCategory] = useState("flood");

  const disasterGuidelines = {
    flood: {
      title: "🌊 Flood Safety",
      icon: "🌊",
      actions: [
        "Move to higher ground immediately. Do not wait for instructions.",
        "Avoid walking or driving through floodwaters. Just 6 inches of moving water can knock you down.",
        "Stay away from bridges over fast-moving water. They can collapse without warning.",
        "If trapped in a building, go to the highest level. Do not climb into a closed attic.",
        "Turn off electricity at the main breaker if water is entering your home.",
        "Do not touch electrical equipment if you are wet or standing in water.",
        "Listen to local radio or TV stations for updates and evacuation orders.",
        "Keep emergency supplies ready: water, non-perishable food, flashlight, first aid kit.",
      ],
    },
    cyclone: {
      title: "🌀 Cyclone Safety",
      icon: "🌀",
      actions: [
        "Stay indoors and away from windows, skylights, and glass doors.",
        "Take refuge in a small interior room, closet, or hallway on the lowest level.",
        "If you are in a mobile home, evacuate immediately to a designated shelter.",
        "Secure outdoor objects that could become projectiles in high winds.",
        "Fill bathtubs and containers with water for drinking and sanitation.",
        "Keep battery-powered radio and extra batteries for weather updates.",
        "Avoid using elevators during a cyclone warning.",
        "If caught outside, lie flat in a ditch or low-lying area away from trees and buildings.",
      ],
    },
    earthquake: {
      title: "🌍 Earthquake Safety",
      icon: "🌍",
      actions: [
        "Drop, Cover, and Hold On. Drop to your hands and knees immediately.",
        "Cover your head and neck with your arms. Crawl under a sturdy table or desk if nearby.",
        "Hold on to your shelter until the shaking stops.",
        "Stay away from windows, glass, and anything that could fall.",
        "If you are in bed, stay there and cover your head with a pillow.",
        "If outdoors, move away from buildings, streetlights, and utility wires.",
        "If in a vehicle, pull over to a clear location and stay inside.",
        "After shaking stops, check for injuries and hazards before moving.",
      ],
    },
    fire: {
      title: "🔥 Fire Safety",
      icon: "🔥",
      actions: [
        "If you see smoke or fire, alert others immediately and call emergency services.",
        "Stay low to the ground where the air is cleaner. Smoke rises.",
        "Feel closed doors before opening. If hot, do not open.",
        "Use stairs, never elevators during a fire emergency.",
        "If your clothes catch fire, stop, drop, and roll to smother flames.",
        "If trapped, seal gaps around doors and vents with wet cloths.",
        "Signal for help from a window using a light-colored cloth or flashlight.",
        "Have a fire escape plan and practice it with your family regularly.",
      ],
    },
    general: {
      title: "🆘 General Emergency Preparedness",
      icon: "🆘",
      actions: [
        "Create an emergency kit with water, food, first aid supplies, and important documents.",
        "Develop a family communication plan with meeting points and contact information.",
        "Stay informed through official channels: radio, TV, and emergency alert systems.",
        "Know your evacuation routes and have multiple options planned.",
        "Keep important documents in a waterproof, portable container.",
        "Maintain a list of emergency contacts including family, doctors, and local authorities.",
        "Practice emergency drills regularly with all family members.",
        "Stay calm and follow instructions from emergency responders and authorities.",
      ],
    },
  };

  const toggleCategory = (category) => {
    setExpandedCategory((current) => (current === category ? null : category));
  };

  return (
    <div className="feature-page">
      <div className="feature-header">
        <h1 className="feature-title">🛡 Emergency Actions</h1>
        <p className="feature-subtitle">
          Categorized safety guidelines for different disaster types. Click to expand and view detailed actions.
        </p>
      </div>

      <section className="card">
        <div className="emergency-actions-container">
          {Object.entries(disasterGuidelines).map(([key, guideline]) => {
            const isExpanded = expandedCategory === key;
            return (
              <article key={key} className="emergency-action-category">
                <button
                  type="button"
                  className={`emergency-action-header ${isExpanded ? "emergency-action-header--expanded" : ""}`}
                  onClick={() => toggleCategory(key)}
                  aria-expanded={isExpanded}
                >
                  <span className="emergency-action-icon">{guideline.icon}</span>
                  <span className="emergency-action-title">{guideline.title}</span>
                  <span className="emergency-action-arrow">{isExpanded ? "▼" : "▶"}</span>
                </button>
                {isExpanded && (
                  <div className="emergency-action-content">
                    <ul className="emergency-action-list">
                      {guideline.actions.map((action, idx) => (
                        <li key={idx}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default EmergencyActions;

