import React, { useState, useEffect } from "react";
import { Download, CheckCircle, RefreshCw, ChevronDown, ChevronRight } from "lucide-react";
import "../App.css";

/**
 * Emergency Actions Component
 * Shows interactive safety guidelines organized by disaster type.
 * Persists progress to localStorage and allows offline download.
 */
function EmergencyActions() {
  const [expandedCategory, setExpandedCategory] = useState("flood");
  const [checkedItems, setCheckedItems] = useState({});

  // Load progress from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("emergencyChecklist");
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load checklist progress", e);
      }
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("emergencyChecklist", JSON.stringify(checkedItems));
  }, [checkedItems]);

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

  const toggleCheck = (category, index) => {
    const key = `${category}-${index}`;
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getProgress = (category) => {
    const actions = disasterGuidelines[category].actions;
    const completed = actions.filter((_, idx) => checkedItems[`${category}-${idx}`]).length;
    return { completed, total: actions.length, percent: (completed / actions.length) * 100 };
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all checklists?")) {
      setCheckedItems({});
    }
  };

  const handleDownload = () => {
    let content = "OFFICIAL EMERGENCY GUIDE & CHECKLIST\nGenerated by SankatMitra\n\n";

    Object.entries(disasterGuidelines).forEach(([key, guide]) => {
      content += `\n${guide.title.toUpperCase()}\n`;
      content += "=".repeat(guide.title.length) + "\n";
      guide.actions.forEach((action, idx) => {
        content += `[ ] ${action}\n`;
      });
    });

    content += "\n\nStay Safe. Call 112 for Emergencies.";

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "SankatMitra_Emergency_Guide.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="feature-page">
      <div className="feature-header">
        <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-5xl mx-auto mb-6">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="feature-title">🛡 Emergency Actions</h1>
            <p className="feature-subtitle text-gray-300">
              Interactive checklists. Progress is saved automatically.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600 rounded-lg flex items-center gap-2 transition-all text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" /> Reset
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all font-medium"
            >
              <Download className="w-4 h-4" /> Download Guide
            </button>
          </div>
        </div>
      </div>

      <section className="card max-w-5xl mx-auto bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm">
        <div className="emergency-actions-container space-y-4">
          {Object.entries(disasterGuidelines).map(([key, guideline]) => {
            const isExpanded = expandedCategory === key;
            const progress = getProgress(key);

            return (
              <article key={key} className="border border-slate-700 rounded-xl overflow-hidden bg-slate-800/40 transition-all duration-300">
                <button
                  type="button"
                  className={`w-full flex items-center justify-between p-4 md:p-6 text-left hover:bg-slate-700/30 transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/50 ${isExpanded ? "bg-slate-700/30" : ""}`}
                  onClick={() => toggleCategory(key)}
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{guideline.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-slate-100">{guideline.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${progress.percent === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${progress.percent}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-400 font-medium">
                          {progress.completed}/{progress.total}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-slate-400">
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </span>
                </button>

                {isExpanded && (
                  <div className="p-4 md:p-6 pt-0 border-t border-slate-700/50 bg-slate-900/20">
                    <ul className="space-y-3 mt-4">
                      {guideline.actions.map((action, idx) => {
                        const isChecked = checkedItems[`${key}-${idx}`];
                        return (
                          <li
                            key={idx}
                            className={`flex items-start gap-3 p-3 rounded-lg transition-all cursor-pointer ${isChecked ? 'bg-green-900/20 border border-green-800/30' : 'hover:bg-slate-700/30 border border-transparent'}`}
                            onClick={() => toggleCheck(key, idx)}
                          >
                            <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isChecked ? 'bg-green-500 border-green-500' : 'border-slate-500 bg-transparent'}`}>
                              {isChecked && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <span className={`text-sm md:text-base ${isChecked ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                              {action}
                            </span>
                          </li>
                        );
                      })}
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

