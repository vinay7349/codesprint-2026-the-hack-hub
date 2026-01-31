import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  BarChart3,
  MapPin,
  AlertTriangle,
  ShieldCheck,
  Activity,
  TrendingDown,
  Info,
  ChevronRight
} from 'lucide-react';
import "../App.css";

const API_BASE = "http://localhost:5000";

const getSeverityLevel = (severity) => {
  if (!severity) return "low";
  const val = severity.toLowerCase();
  if (val === "high" || val === "critical") return "high";
  if (val === "medium") return "medium";
  return "low";
};

function AreaRisk() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch(`${API_BASE}/alerts`);
        const data = await res.json();
        setAlerts(data.alerts || []);
      } catch (err) {
        console.error("Failed to fetch alerts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();

    const socket = io(API_BASE, {
      transports: ["websocket", "polling"],
    });

    socket.on("new_alert", fetchAlerts);
    return () => socket.disconnect();
  }, []);

  const areaStats = alerts.reduce((acc, alert) => {
    const area = alert.location || "Unknown Area";
    if (!acc[area]) {
      acc[area] = { area, total: 0, high: 0, medium: 0, low: 0 };
    }
    acc[area].total++;
    const level = getSeverityLevel(alert.severity);
    if (level === "high") acc[area].high++;
    else if (level === "medium") acc[area].medium++;
    else acc[area].low++;
    return acc;
  }, {});

  const areaList = Object.values(areaStats).sort((a, b) => b.high - a.high || b.total - a.total);

  const getRiskLevel = (area) => {
    if (area.high > 0) return "high";
    if (area.medium > 2) return "medium";
    return "low";
  };

  const getRiskConfig = (level) => {
    switch (level) {
      case "high": return { label: "High Risk", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" };
      case "medium": return { label: "Medium Risk", color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" };
      default: return { label: "Stable Area", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" };
    }
  };

  if (loading) {
    return (
      <div className="feature-page flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <Activity className="w-12 h-12 text-blue-500 mb-4 animate-spin-slow" />
          <p className="text-gray-400 font-medium">Analyzing regional risks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feature-page">
      <div className="feature-header">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-blue-600/10 p-2 rounded-lg">
            <BarChart3 className="w-6 h-6 text-blue-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Regional Risk Matrix</h1>
        </div>
        <p className="feature-subtitle text-gray-400 max-w-2xl">
          Aggregated data analysis of community reports and sensor networks to determine regional safety status.
        </p>
      </div>

      {areaList.length === 0 ? (
        <section className="card p-12 flex flex-col items-center justify-center text-center opacity-70">
          <ShieldCheck className="w-16 h-16 text-gray-700 mb-4" />
          <h2 className="text-xl font-bold text-white">No active threats detected</h2>
          <p className="text-gray-500 mt-2">All scanned regions are currently operating within safe parameters.</p>
        </section>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areaList.map((area, idx) => {
            const riskLevel = getRiskLevel(area);
            const config = getRiskConfig(riskLevel);

            return (
              <article
                key={idx}
                className="group relative bg-gray-900/40 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`${config.bg} p-2.5 rounded-xl`}>
                      <MapPin className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{area.area}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Activity className="w-3 h-3 text-gray-500" />
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{area.total} reports analyzed</span>
                      </div>
                    </div>
                  </div>
                  <span className={`${config.bg} ${config.color} ${config.border} border px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter`}>
                    {config.label}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Critical Threats</span>
                    <span className={`font-bold ${area.high > 0 ? 'text-red-500' : 'text-gray-400'}`}>{area.high}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Moderate Risk</span>
                    <span className={`font-bold ${area.medium > 0 ? 'text-orange-500' : 'text-gray-400'}`}>{area.medium}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm border-t border-gray-800/50 pt-3">
                    <span className="text-gray-400 font-semibold">Stability Index</span>
                    <span className="text-blue-400 font-black">{Math.max(0, 100 - (area.high * 40 + area.medium * 15))}%</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {riskLevel === 'low' ? (
                      <TrendingDown className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                    )}
                    <span className="text-[11px] text-gray-500 font-medium">
                      {riskLevel === 'low' ? 'Status: Improving' : 'Status: Under Observation'}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-white transition-colors" />
                </div>
              </article>
            );
          })}
        </div>
      )}

      <footer className="mt-12 p-4 bg-blue-900/10 border border-blue-500/10 rounded-xl flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-300/70 leading-relaxed">
          Risk levels are calculated using a weighted system: **High severity alerts** contribute 40 points to the risk index, while **Medium alerts** contribute 15 points. Areas with indices below 50% are automatically prioritized for emergency resource allocation.
        </p>
      </footer>
    </div>
  );
}

export default AreaRisk;
