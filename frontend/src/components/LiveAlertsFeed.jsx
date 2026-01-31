import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { io } from "socket.io-client";
import {
    Flame,
    Droplets,
    Wind,
    MapPin,
    ThumbsUp,
    ThumbsDown,
    AlertTriangle,
    Navigation,
    Clock,
    ShieldAlert,
    Activity,
    CloudRain,
    Map as MapIcon,
    List
} from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { useAuth } from '../context/AuthContext';
import DisasterMap from './DisasterMap';
const API_BASE = "http://localhost:5000";

const ReportAlert = () => {
    const [message, setMessage] = useState("");
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user, isAdmin } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Strict Aadhaar Registration Check
        if (!user?.isAadhaarVerified && !isAdmin) {
            setStatus("🔴 Access Denied: Aadhaar Registration Required for Emergency Dispatch.");
            return;
        }

        setIsSubmitting(true);
        setStatus("SankatMitra AI Sentry is analyzing your report...");
        try {
            const res = await fetch(`${API_BASE}/report`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message,
                    location,
                    is_registered: !!user,
                    is_admin: isAdmin
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setStatus(`Broadcast Success! AI Trust Score: ${data.alert.credibility.score}%`);
                setMessage("");
                setLocation("");
            } else {
                setStatus(data.error || "Failed to report alert.");
            }
        } catch (err) {
            setStatus("Network error. Could not connect to Command Center.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none"></div>
            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-blue-500 animate-pulse" />
                Dispatch Emergency Intelligence
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Target Sector / Location</label>
                        <input
                            type="text"
                            placeholder="e.g. Bridge Road, Sector 7"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all shadow-inner"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Intelligence Description</label>
                        <textarea
                            placeholder="Describe the hazard in detail for AI verification..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all shadow-inner min-h-[60px]"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${status.includes("Success") ? 'bg-emerald-500' : 'bg-blue-500 animate-ping'}`}></div>
                        <p className={`text-xs font-bold ${status.includes("Denied") ? 'text-red-400' : 'text-slate-400'}`}>{status || "SankatMitra System Ready"}</p>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-xl shadow-blue-900/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {isSubmitting ? "Processing..." : "Initial Broadcast"}
                        <Navigation className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};

// Helper for distance in KM
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const LiveAlertsFeed = () => {
    const [alerts, setAlerts] = useState([]);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
    const { location: userLocation } = useGeolocation();
    const { user, isAdmin } = useAuth();

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const res = await fetch(`${API_BASE}/alerts`);
                const data = await res.json();
                processAndSetAlerts(data.alerts);
            } catch (err) {
                console.error("Failed to fetch alerts:", err);
            }
        };

        const processAndSetAlerts = (rawAlerts) => {
            let processedAlerts = rawAlerts;
            if (userLocation) {
                processedAlerts = rawAlerts.map(alert => {
                    if (alert.coordinates?.lat && alert.coordinates?.lng) {
                        const dist = calculateDistance(
                            userLocation.lat, userLocation.lng,
                            alert.coordinates.lat, alert.coordinates.lng
                        );
                        return { ...alert, distance: dist };
                    }
                    return alert;
                }).sort((a, b) => (a.distance || 999999) - (b.distance || 999999));
            }
            setAlerts(processedAlerts);
        };

        fetchAlerts();

        // Socket.IO for real-time updates
        const socket = io(API_BASE);

        socket.on("new_alert", (newAlert) => {
            setAlerts(prev => {
                const updated = [newAlert, ...prev];
                return updated.sort((a, b) => (a.distance || 999999) - (b.distance || 999999));
            });
        });

        socket.on("alert_updated", (updatedData) => {
            setAlerts(prev => prev.map(a =>
                a._id === updatedData._id
                    ? { ...a, credibility: updatedData.credibility, votes_up: updatedData.votes_up, votes_down: updatedData.votes_down }
                    : a
            ));
        });

        return () => {
            socket.disconnect();
        };
    }, [userLocation]);

    const handleVote = async (alertId, type) => {
        try {
            const res = await fetch(`${API_BASE}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ alert_id: alertId, vote_type: type }),
            });
            if (!res.ok) {
                const data = await res.json();
                alert(data.error || "Failed to record vote.");
            }
        } catch (err) {
            console.error("Voting error:", err);
        }
    };

    // Get appropriate icon based on alert type
    const getAlertIcon = (type, severity) => {
        const iconProps = { className: "w-6 h-6" };
        if (severity?.toLowerCase() === 'critical') return <ShieldAlert {...iconProps} className="text-red-600" />;

        switch (type?.toLowerCase()) {
            case 'flood': return <Droplets {...iconProps} />;
            case 'fire': return <Flame {...iconProps} />;
            case 'cyclone':
            case 'storm': return <Wind {...iconProps} />;
            default: return <AlertTriangle {...iconProps} />;
        }
    };

    // Severity configurations with more vibrant colors
    const getSeverityConfig = (severity) => {
        const s = severity?.toLowerCase();
        switch (s) {
            case 'high':
            case 'critical':
                return {
                    color: 'red',
                    border: 'border-red-500/30',
                    bg: 'bg-slate-900/40',
                    badge: 'bg-red-500 text-white border-red-400',
                    iconBg: 'bg-red-600 text-white',
                    shadow: 'shadow-red-500/20',
                    indicator: 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]'
                };
            case 'medium':
                return {
                    color: 'orange',
                    border: 'border-orange-500/30',
                    bg: 'bg-slate-900/40',
                    badge: 'bg-orange-500 text-white border-orange-400',
                    iconBg: 'bg-orange-500 text-white',
                    shadow: 'shadow-orange-500/20',
                    indicator: 'bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.6)]'
                };
            default:
                return {
                    color: 'blue',
                    border: 'border-blue-500/30',
                    bg: 'bg-slate-900/40',
                    badge: 'bg-blue-500 text-white border-blue-400',
                    iconBg: 'bg-blue-600 text-white',
                    shadow: 'shadow-blue-500/20',
                    indicator: 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]'
                };
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-8">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-8">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4">
                        <div className="bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-900/40">
                            <Activity className="w-8 h-8 text-white" />
                        </div>
                        Signals Hub
                    </h1>
                    <p className="text-slate-500 mt-2 pl-1 font-bold tracking-tight uppercase text-[10px]">Quantum Emergency Response & Intelligence Matrix</p>
                </div>

                <div className="flex items-center gap-5">
                    {/* View Switcher */}
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 shadow-inner">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 ${viewMode === 'list' ? 'bg-blue-600 shadow-lg text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <List className="w-3 h-3" />
                            Feed
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`px-4 py-2 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 ${viewMode === 'map' ? 'bg-blue-600 shadow-lg text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <MapIcon className="w-3 h-3" />
                            Map
                        </button>
                    </div>

                    <div className="flex items-center gap-3 bg-red-50 px-4 py-2 rounded-2xl border border-red-100 shadow-sm">
                        <span className="flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
                        </span>
                        <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">
                            Live System
                        </span>
                    </div>
                </div>
            </div>

            {user ? (
                <ReportAlert />
            ) : (
                <div className="bg-slate-900 border border-white/10 rounded-3xl p-10 mb-10 shadow-2xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                        <ShieldAlert className="w-48 h-48 text-blue-500" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Access Restricted: Sentinel Protocol</h3>
                            <p className="text-slate-400 text-sm max-w-md font-medium leading-relaxed">Identity verification required. Please synchronize your Aadhaar-verified credentials to access the emergency intelligence uplink.</p>
                        </div>
                        <Link
                            to="/login"
                            className="bg-blue-600 hover:bg-blue-500 text-white font-black py-5 px-10 rounded-2xl transition-all shadow-xl shadow-blue-900/40 hover:-translate-y-1 active:scale-95 whitespace-nowrap uppercase tracking-widest text-xs"
                        >
                            Link Identity
                        </Link>
                    </div>
                </div>
            )}

            {/* Map View */}
            {viewMode === 'map' && (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
                    <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-2xl flex items-center gap-3 text-blue-700 text-sm font-bold shadow-sm backdrop-blur-sm">
                        <MapIcon className="w-5 h-5" />
                        Interactive Impact Analysis & Buffer Zones
                    </div>
                    <DisasterMap alerts={alerts} />
                </div>
            )}

            {/* Alerts Feed */}
            <div className={`space-y-6 ${viewMode === 'map' ? 'hidden md:block' : ''}`}>
                {alerts.length === 0 ? (
                    <div className="text-center py-24 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
                        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldAlert className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-gray-400 font-bold text-xl tracking-tight">System Status: Nominal</p>
                        <p className="text-gray-400 text-sm mt-1">No active incidents detected in monitored sectors.</p>
                    </div>
                ) : (
                    alerts.map((alert, idx) => {
                        const style = getSeverityConfig(alert.severity);
                        const isSos = alert.severity?.toLowerCase() === 'critical';

                        return (
                            <div
                                key={idx}
                                className={`
                                    relative w-full ${style.bg} rounded-3xl overflow-hidden
                                    shadow-xl hover:shadow-2xl transition-all duration-500 border ${style.border}
                                    flex flex-col md:flex-row group
                                `}
                            >
                                {/* Left Indicator Line */}
                                <div className={`absolute top-0 left-0 bottom-0 w-1 ${style.indicator}`}></div>

                                {/* Left: Alert Icon */}
                                <div className="p-6 md:w-28 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5 bg-white/5">
                                    <div className={`p-4 rounded-2xl ${style.iconBg} shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                                        {getAlertIcon(alert.type, alert.severity)}
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="flex-1 p-5 md:p-6 flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${style.badge} uppercase`}>
                                                {alert.severity || 'LOW'}
                                            </span>
                                            {alert.distance && (
                                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center gap-1">
                                                    <Navigation className="w-3 h-3" />
                                                    {alert.distance.toFixed(1)} km
                                                </span>
                                            )}
                                            {alert.distance && idx === 0 && (
                                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-green-500 text-white animate-pulse">
                                                    NEAREST
                                                </span>
                                            )}
                                            <h3 className={`text-xl font-bold tracking-tight ${isSos ? 'text-red-600' : 'text-gray-900'}`}>
                                                {isSos ? '🚨 CRITICAL SOS' : 'Live Emergency Alert'}
                                            </h3>
                                        </div>

                                        <div className="flex items-center gap-6 text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
                                            <span className="flex items-center gap-2">
                                                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                                                {alert.location}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5" />
                                                {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'REALTIME'}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-slate-300 text-base leading-relaxed bg-white/5 p-5 rounded-2xl border-l-[6px] border-white/10 italic">
                                        "{alert.message}"
                                    </p>

                                    {/* AI Verification Section */}
                                    <div className="mt-2 flex flex-col lg:flex-row items-center gap-6 bg-black/20 border border-white/5 p-5 rounded-2xl animate-in slide-in-from-bottom-2 duration-700">
                                        <div className="flex items-center gap-4 shrink-0">
                                            <div className="relative flex items-center justify-center">
                                                <svg className="w-14 h-14 rotate-[-90deg]">
                                                    <circle
                                                        cx="28" cy="28" r="24"
                                                        className="stroke-white/10 fill-none"
                                                        strokeWidth="4"
                                                    />
                                                    <circle
                                                        cx="28" cy="28" r="24"
                                                        className={`${alert.credibility?.verified ? 'stroke-emerald-500' : 'stroke-amber-500'} fill-none`}
                                                        strokeWidth="4"
                                                        strokeDasharray={150}
                                                        strokeDashoffset={150 - (150 * (alert.credibility?.score || 0)) / 100}
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center font-black text-xs text-white">
                                                    {alert.credibility?.score || 0}%
                                                </div>
                                            </div>
                                            <div>
                                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${alert.credibility?.verified ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                    {alert.credibility?.verified ? 'Verified Intelligence' : 'Awaiting Full Consensus'}
                                                </span>
                                                <div className="text-[9px] text-slate-600 font-black uppercase tracking-tighter mt-1">SankatMitra AI Confidence</div>
                                            </div>
                                        </div>
                                        <div className="h-10 w-px bg-white/5 hidden lg:block"></div>
                                        <div className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-lg">
                                            <span className="font-black text-slate-600 not-italic mr-2 uppercase tracking-tighter">[AI AUDIT LOG]:</span>
                                            {alert.credibility?.reason || "Synthesizing cross-channel intelligence data..."}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions & Voting */}
                                <div className="p-6 border-t md:border-t-0 md:border-l border-white/5 md:w-64 flex flex-row md:flex-col gap-4 justify-center bg-black/20">
                                    <button
                                        onClick={() => setViewMode('map')}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-3 px-5 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black transition-all active:scale-95 uppercase tracking-widest shadow-xl shadow-blue-900/20"
                                    >
                                        <MapIcon className="w-3.5 h-3.5" />
                                        <span>Locate</span>
                                    </button>

                                    <div className="flex flex-1 md:flex-none gap-3">
                                        <button
                                            onClick={() => handleVote(alert._id, "up")}
                                            className="group flex-1 flex flex-col items-center justify-center gap-2 p-3 bg-white/5 border border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/50 text-slate-400 hover:text-emerald-500 rounded-2xl transition-all duration-300"
                                        >
                                            <ThumbsUp className="w-5 h-5 group-active:scale-125 transition-transform" />
                                            <span className="text-[9px] font-black">{alert.votes_up || 0}</span>
                                        </button>
                                        <button
                                            onClick={() => handleVote(alert._id, "down")}
                                            className="group flex-1 flex flex-col items-center justify-center gap-2 p-3 bg-white/5 border border-white/10 hover:bg-rose-500/10 hover:border-rose-500/50 text-slate-400 hover:text-rose-500 rounded-2xl transition-all duration-300"
                                        >
                                            <ThumbsDown className="w-5 h-5 group-active:scale-125 transition-transform" />
                                            <span className="text-[9px] font-black">{alert.votes_down || 0}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};


export default LiveAlertsFeed;
