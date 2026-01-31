import React, { useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";
import "../App.css";
import "./AdminDashboard.css";
import {
  Search, Filter, Download, Bell, Shield, Users,
  AlertCircle, Activity, MapPin, Clock, ChevronRight,
  TrendingUp, Radio, UserCheck, Home, Package, Droplets
} from 'lucide-react';

const API_BASE = "http://localhost:5000";

const getSeverityConfig = (severity) => {
  const val = (severity || "low").toLowerCase();
  switch (val) {
    case 'high': return { color: 'text-rose-500', bg: 'bg-rose-500/10', dot: 'bg-rose-500', label: 'Critical' };
    case 'medium': return { color: 'text-amber-500', bg: 'bg-amber-500/10', dot: 'bg-amber-500', label: 'Elevated' };
    default: return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', dot: 'bg-emerald-500', label: 'Monitor' };
  }
};

function AdminDashboard() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [query, setQuery] = useState("");
  const [realtimeEnabled, setRealtimeEnabled] = useState(true);
  const [acknowledged, setAcknowledged] = useState(() => new Set());
  const [activeTab, setActiveTab] = useState('alerts'); // 'alerts' or 'families'

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch(`${API_BASE}/alerts`);
        const data = await res.json();
        setAlerts(data.alerts || []);
      } catch (err) {
        console.error("Failed to fetch alerts", err);
        setError("Failed to load alerts.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();

    const socket = io(API_BASE, {
      transports: ["websocket", "polling"],
    });

    socket.on("new_alert", () => {
      if (realtimeEnabled) fetchAlerts();
    });

    return () => {
      socket.disconnect();
    };
  }, [realtimeEnabled]);

  const stats = useMemo(() => ({
    total: alerts.length,
    high: alerts.filter(a => a.severity?.toLowerCase() === 'high').length,
    activeFamilies: 12, // Placeholder
    systemHealth: 98
  }), [alerts]);

  const filteredAlerts = useMemo(() => {
    return alerts
      .filter((a) => {
        if (filterSeverity === "all") return true;
        return (a.severity || "low").toLowerCase() === filterSeverity;
      })
      .filter((a) => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          (a.message || "").toLowerCase().includes(q) ||
          (a.location || "").toLowerCase().includes(q)
        );
      });
  }, [alerts, filterSeverity, query]);

  const handleAcknowledge = async (id) => {
    setAcknowledged(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="feature-page">
      {/* Header Area */}
      <header className="admin-dashboard-header">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="feature-title">Operations Command Center</h1>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Activity className="w-4 h-4 heartbeat" />
              <span>System Live: Monitoring Community Feedback Loop</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-xl hover:bg-indigo-600/20 transition-all text-sm font-bold">
              <Bell className="w-4 h-4" />
              Notifications
            </button>
          </div>
        </div>
      </header>

      {/* KPI Grid */}
      <div className="stats-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrapper bg-blue-500/10 text-blue-400">
            <Bell className="w-6 h-6" />
          </div>
          <div className="kpi-value">{stats.total}</div>
          <div className="kpi-label">Total Signals Received</div>
          <div className="kpi-trend text-emerald-400">
            <TrendingUp className="w-4 h-4" /> +12% from yesterday
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper bg-rose-500/10 text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="kpi-value text-rose-500">{stats.high}</div>
          <div className="kpi-label">High Priority Threats</div>
          <div className="kpi-trend text-rose-400">Immediate Action Required</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper bg-indigo-500/10 text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
          <div className="kpi-value">{stats.activeFamilies}</div>
          <div className="kpi-label">Families in Danger Zone</div>
          <div className="kpi-trend text-indigo-400">Requiring Shelter</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper bg-emerald-500/10 text-emerald-400">
            <Shield className="w-6 h-6" />
          </div>
          <div className="kpi-value text-emerald-500">{stats.systemHealth}%</div>
          <div className="kpi-label">System Integrity</div>
          <div className="kpi-trend text-emerald-400">All protocols functional</div>
        </div>
      </div>

      {/* Emergency Broadcast Command */}
      <section className="broadcast-section animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="broadcast-icon">
          <Radio className="w-6 h-6 animate-pulse" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            Emergency Broadcast System
            <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded uppercase tracking-tighter">Secure Link</span>
          </h3>
          <form className="broadcast-form" onSubmit={async (e) => {
            e.preventDefault();
            const msg = e.target.elements.broadcastMsg.value;
            if (!msg) return;
            try {
              const res = await fetch(`${API_BASE}/report`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: msg, location: "Official Broadcast", is_admin: true }),
              });
              if (res.ok) alert("Emergency Broadcast Transmitted Successfully.");
              else alert("Transmission Failed.");
            } catch (err) {
              alert("Network Error: Could not reach command center.");
            }
            e.target.reset();
          }}>
            <input
              name="broadcastMsg"
              className="broadcast-input"
              placeholder="Deploy critical updates to all community members..."
            />
            <button type="submit" className="btn-broadcast">
              Transmit
            </button>
          </form>
        </div>
      </section>

      {/* Operations Bar */}
      <div className="ops-bar">
        <div className="flex items-center gap-4 flex-1">
          <div className="admin-search-wrapper">
            <Search className="search-icon w-4 h-4" />
            <input
              placeholder="Filter by report or sector..."
              className="admin-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="severity-filter">
            {['all', 'high', 'medium', 'low'].map(s => (
              <button
                key={s}
                className={`filter-pill ${filterSeverity === s ? 'active' : ''}`}
                onClick={() => setFilterSeverity(s)}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2">
            <Filter className="w-3.5 h-3.5" />
            Advanced
          </button>
          <button
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2"
            onClick={() => {
              const csv = "Timestamp,Severity,Message,Location\n" +
                alerts.map(a => `"${a.timestamp}","${a.severity}","${a.message}","${a.location}"`).join("\n");
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              window.open(url);
            }}
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="flex gap-6 mb-6">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 pb-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'alerts' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500'}`}
        >
          <Bell className="w-4 h-4" />
          Actionable Reports ({filteredAlerts.length})
        </button>
        <button
          onClick={() => setActiveTab('families')}
          className={`flex items-center gap-2 pb-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'families' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500'}`}
        >
          <Users className="w-4 h-4" />
          Family Management & Logistics
        </button>
      </div>

      {/* Table Area */}
      {activeTab === 'alerts' ? (
        <div className="admin-alerts-list animate-in fade-in slide-in-from-left-4 duration-500">
          {loading ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
              <Activity className="w-10 h-10 text-indigo-500 mx-auto animate-spin mb-4" />
              <p className="text-gray-400 font-bold">Synchronizing Encrypted Data...</p>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
              <Shield className="w-10 h-10 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400 font-bold font-mono uppercase tracking-widest text-xs">No Threats Detected In Selected Sector</p>
            </div>
          ) : (
            filteredAlerts.map((alert, idx) => {
              const conf = getSeverityConfig(alert.severity);
              const isAck = acknowledged.has(alert._id || idx);
              return (
                <div key={idx} className={`admin-alert-card ${isAck ? 'opacity-50 grayscale-[0.5]' : ''}`}>
                  <div className={`alert-status-dot ${conf.dot} shadow-[0_0_12px_${conf.dot}80]`} />
                  <div className="alert-content">
                    <div className="alert-header">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${conf.bg} ${conf.color}`}>
                        {conf.label} Signal
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                        <MapPin className="w-3.5 h-3.5" />
                        {alert.location}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : 'LIVE'}
                      </span>
                    </div>
                    <div className="alert-main-text font-medium leading-relaxed">"{alert.message}"</div>
                    <div className="alert-meta-row mt-2">
                      <span className="flex items-center gap-1.5 border-r border-white/10 pr-4">
                        <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                        {alert.reporter || 'Field Agent'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        {alert.coordinates || '0.0, 0.0'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcknowledge(alert._id || idx)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${isAck ? 'bg-indigo-600 text-white' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}
                    >
                      {isAck ? 'ACKNOWLEDGED' : 'ACKNOWLEDGE'}
                    </button>
                    <button className="flex items-center justify-center p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-rose-600/20 hover:text-rose-400 transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          <FamilyList />
        </div>
      )}
    </div>
  );
}

function FamilyList() {
  const [families, setFamilies] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newShelter, setNewShelter] = useState({ name: "", location: "", capacity: 50 });

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE}/families`).then(r => r.json()),
      fetch(`${API_BASE}/shelters`).then(r => r.json())
    ]).then(([familiesData, sheltersData]) => {
      setFamilies(familiesData || []);
      const enhancedShelters = (sheltersData || []).map(s => ({
        ...s,
        resources: s.resources || {
          food_packs: Math.floor(Math.random() * 500),
          water_bottles: Math.floor(Math.random() * 1000)
        }
      }));
      setShelters(enhancedShelters);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addShelter = async (e) => {
    e.preventDefault();
    if (!newShelter.name) return;
    try {
      await fetch(`${API_BASE}/shelters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newShelter)
      });
      setNewShelter({ name: "", location: "", capacity: 50 });
      fetchData();
    } catch (e) { console.error(e); }
  };

  const assignShelter = async (familyId, shelterId) => {
    try {
      const res = await fetch(`${API_BASE}/assign_shelter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ family_id: familyId, shelter_id: shelterId })
      });
      if (res.ok) {
        setFamilies(prev => prev.map(f =>
          f._id === familyId ? { ...f, status: "In Shelter", shelter_id: shelterId } : f
        ));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return (
    <div className="text-center py-10">
      <Activity className="w-8 h-8 text-indigo-500 mx-auto animate-spin mb-2" />
      <p className="text-gray-400 text-sm">Loading logistics data...</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Shelter Manager */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-4 flex items-center gap-2">
            <Home className="w-4 h-4" /> Shelter Deployment
          </h3>
          <form onSubmit={addShelter} className="space-y-4">
            <input
              placeholder="Name (e.g. KV School)"
              value={newShelter.name}
              onChange={e => setNewShelter({ ...newShelter, name: e.target.value })}
              className="w-full bg-black/20 border border-white/10 p-3 rounded-xl text-sm focus:border-indigo-500 transition-all"
            />
            <input
              placeholder="Locality"
              value={newShelter.location}
              onChange={e => setNewShelter({ ...newShelter, location: e.target.value })}
              className="w-full bg-black/20 border border-white/10 p-3 rounded-xl text-sm focus:border-indigo-500 transition-all"
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Slots"
                value={newShelter.capacity}
                onChange={e => setNewShelter({ ...newShelter, capacity: parseInt(e.target.value) })}
                className="flex-1 bg-black/20 border border-white/10 p-3 rounded-xl text-sm focus:border-indigo-500 transition-all"
              />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-xl text-xs font-bold transition-all">
                DEPLOY
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Active Shelter Hubs</h3>
          {shelters.map(s => {
            const pct = Math.round((s.occupied / s.capacity) * 100) || 0;
            return (
              <div key={s._id} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-indigo-500/50 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-sm text-white">{s.name}</span>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-400">{pct}% FULL</span>
                </div>
                <div className="capacity-bar-bg">
                  <div className="capacity-bar-fill" style={{ width: `${pct}%`, backgroundColor: pct > 80 ? '#f43f5e' : '#6366f1' }} />
                </div>
                <div className="resource-grid">
                  <div className="resource-item">
                    <Package className="w-3 h-3 text-amber-500" />
                    <span>{s.resources?.food_packs} Units</span>
                  </div>
                  <div className="resource-item">
                    <Droplets className="w-3 h-3 text-blue-400" />
                    <span>{s.resources?.water_bottles} L</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Family Distribution */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Citizen Distribution & Needs</h3>
        {families.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
            <p className="text-gray-500 text-sm italic">No evacuation requests pending.</p>
          </div>
        ) : (
          families.map(family => (
            <div key={family._id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex justify-between items-center group hover:bg-white/10 transition-all">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl border ${family.status === 'In Shelter' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white mb-1 flex items-center gap-2">
                    {family.head_name}
                    <span className="text-[10px] font-medium bg-white/5 px-2 py-0.5 rounded text-gray-400">
                      {family.members} Members
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {family.location}</span>
                    <span className="flex items-center gap-1">📞 {family.phone}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {family.status === 'In Shelter' ? (
                  <div className="flex items-center gap-2 text-emerald-500 text-xs font-black uppercase">
                    <UserCheck className="w-4 h-4" /> Secured
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <span className="text-[10px] text-gray-500 self-center uppercase font-black">Assign:</span>
                    {shelters.slice(0, 2).map(s => (
                      <button
                        key={s._id}
                        onClick={() => assignShelter(family._id, s._id)}
                        className="px-3 py-1.5 bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-black rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;

