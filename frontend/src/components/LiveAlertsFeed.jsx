import React, { useState } from 'react';
import {
    Flame,
    Droplets,
    Wind,
    MapPin,
    ThumbsUp,
    ThumbsDown,
    Phone,
    AlertTriangle,
    Volume2,
    Navigation,
    Radio,
    CloudRain,
    Wind as WindIcon
} from 'lucide-react';

// Mock data for demonstration
const mockAlerts = [
    {
        id: 1,
        type: 'flood',
        title: 'Flash Flood Warning',
        message: 'Heavy rainfall has caused rapid water level rise in the Nethravathi River. Residents near the riverbank should evacuate immediately.',
        location: 'Udupi, Karnataka',
        environment: { precipitation: '42mm/hr', wind: '25km/h' },
        severity: 'high',
        timestamp: '2 mins ago',
        confirmVotes: 24,
        fakeVotes: 1,
        verified: true,
        aiRisk: 'High',
        safeZone: "St. Mary's School"
    },
    {
        id: 2,
        type: 'fire',
        title: 'Forest Fire Alert',
        message: 'Forest fire detected in the Western Ghats region. Smoke visible from multiple locations.',
        location: 'Coorg, Karnataka',
        environment: { precipitation: '0mm/hr', wind: '18km/h' },
        severity: 'high',
        timestamp: '15 mins ago',
        confirmVotes: 18,
        fakeVotes: 0,
        verified: true,
        aiRisk: 'High',
        safeZone: "Community Center Block B"
    },
    {
        id: 3,
        type: 'cyclone',
        title: 'Cyclone Warning',
        message: 'Moderate cyclonic activity expected along the coast. Strong winds and heavy rain likely.',
        location: 'Mangalore, Karnataka',
        environment: { precipitation: '15mm/hr', wind: '55km/h' },
        severity: 'medium',
        timestamp: '32 mins ago',
        confirmVotes: 12,
        fakeVotes: 2,
        verified: true,
        aiRisk: 'Medium',
        safeZone: "Town Hall"
    },
    {
        id: 4,
        type: 'flood',
        title: 'Water Logging',
        message: 'Moderate water logging reported in low-lying areas. Traffic movement affected.',
        location: 'Bengaluru, Karnataka',
        environment: { precipitation: '8mm/hr', wind: '12km/h' },
        severity: 'medium',
        timestamp: '1 hour ago',
        confirmVotes: 8,
        fakeVotes: 1,
        verified: true,
        aiRisk: 'Medium',
        safeZone: "Primary Health Center"
    },
    {
        id: 5,
        type: 'storm',
        title: 'Thunderstorm Advisory',
        message: 'Light to moderate thunderstorms expected. Stay indoors and avoid using electrical appliances.',
        location: 'Mysore, Karnataka',
        environment: { precipitation: '5mm/hr', wind: '20km/h' },
        severity: 'low',
        timestamp: '1 hour ago',
        confirmVotes: 5,
        fakeVotes: 0,
        verified: true,
        aiRisk: 'Low',
        safeZone: "Public Library"
    },
    {
        id: 6,
        type: 'flood',
        title: 'River Water Level Normal',
        message: 'Water levels in Cauvery River are within normal limits. No immediate danger.',
        location: 'Mandya, Karnataka',
        environment: { precipitation: '0mm/hr', wind: '5km/h' },
        severity: 'low',
        timestamp: '2 hours ago',
        confirmVotes: 15,
        fakeVotes: 0,
        verified: true,
        aiRisk: 'Low',
        safeZone: "N/A"
    }
];

const LiveAlertsFeed = () => {
    const [hoveredSafeZone, setHoveredSafeZone] = useState(null);

    // Get appropriate icon based on alert type
    const getAlertIcon = (type) => {
        const iconProps = { className: "w-5 h-5" };

        switch (type) {
            case 'flood':
                return <Droplets {...iconProps} />;
            case 'fire':
                return <Flame {...iconProps} />;
            case 'cyclone':
            case 'storm':
                return <Wind {...iconProps} />;
            default:
                return <AlertTriangle {...iconProps} />;
        }
    };

    // Get severity color classes
    const getSeverityStyles = (severity) => {
        switch (severity) {
            case 'high':
                return {
                    border: 'border-l-4 border-red-600',
                    badge: 'bg-red-100 text-red-700',
                    aiRiskBadge: 'bg-red-50 text-red-700 border border-red-200'
                };
            case 'medium':
                return {
                    border: 'border-l-4 border-orange-500',
                    badge: 'bg-orange-100 text-orange-700',
                    aiRiskBadge: 'bg-orange-50 text-orange-700 border border-orange-200'
                };
            default:
                return {
                    border: 'border-l-4 border-green-600',
                    badge: 'bg-green-100 text-green-700',
                    aiRiskBadge: 'bg-green-50 text-green-700 border border-green-200'
                };
        }
    };

    const handleVote = (alertId, voteType) => {
        console.log(`Voted ${voteType} on alert ${alertId}`);
    };

    const handleEmergencyCall = (alertId) => {
        console.log(`Emergency call initiated for alert ${alertId}`);
    };

    const handleViewSafeZone = (alertId) => {
        console.log(`Navigating to safe zone for alert ${alertId}`);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 transition-all duration-300">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <span>🚨 Live Community Alerts</span>
                </h1>
                <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full border border-red-200">
                    <Volume2 className="w-4 h-4 animate-pulse" />
                    <span className="text-sm font-semibold uppercase tracking-wide">Live</span>
                </div>
            </div>

            {/* Feature 4: Global Urgency Bar */}
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-red-700 uppercase tracking-widest flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3" />
                        CRITICAL: Regional Emergency Protocol Active
                    </span>
                    <span className="text-xs font-bold text-red-700">80%</span>
                </div>
                <div className="w-full bg-red-200 rounded-full h-3 overflow-hidden">
                    <div
                        className="bg-red-600 h-full transition-all duration-1000 ease-out animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                        style={{ width: '80%' }}
                    ></div>
                </div>
            </div>

            {/* Scrollable Alerts Feed */}
            <div className="h-[600px] overflow-y-auto pr-3 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {mockAlerts.map((alert) => {
                    const styles = getSeverityStyles(alert.severity);

                    return (
                        <div
                            key={alert.id}
                            className={`
                                relative bg-white rounded-lg shadow-md hover:shadow-2xl transition-all duration-300
                                p-5 ${styles.border} group
                            `}
                        >
                            {/* Header Row */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${styles.badge}`}>
                                        {getAlertIcon(alert.type)}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                                        {alert.title}
                                    </h3>
                                </div>
                                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                                    {alert.timestamp}
                                </span>
                            </div>

                            {/* Message Body */}
                            <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                                {alert.message}
                            </p>

                            {/* Feature 1: Location & Environmental Context */}
                            <div className="mb-4">
                                <div className="flex items-center gap-2 text-gray-700 mb-1">
                                    <MapPin className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm font-semibold">{alert.location}</span>
                                </div>
                                <div className="text-[11px] font-medium text-gray-400 italic flex items-center gap-3 pl-6">
                                    <span className="flex items-center gap-1">
                                        <CloudRain className="w-3 h-3" /> Precipitation: {alert.environment.precipitation}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <WindIcon className="w-3 h-3" /> Wind: {alert.environment.wind}
                                    </span>
                                </div>
                            </div>

                            {/* Badges Section */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {alert.severity === 'high' && (
                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold ${styles.aiRiskBadge}`}>
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                        <span>AI RISK: {alert.aiRisk}</span>
                                    </div>
                                )}

                                {alert.verified && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-[11px] font-bold">
                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>COMMUNITY VERIFIED</span>
                                    </div>
                                )}
                            </div>

                            {/* Action Bar */}
                            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                                {/* Vote Buttons */}
                                <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-gray-100">
                                    <button
                                        onClick={() => handleVote(alert.id, 'confirm')}
                                        className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white rounded-md transition-all text-[11px] font-bold text-green-700"
                                    >
                                        <ThumbsUp className="w-3.5 h-3.5" />
                                        <span>CONFIRM ({alert.confirmVotes})</span>
                                    </button>
                                    <div className="w-px h-4 bg-gray-200 mx-0.5"></div>
                                    <button
                                        onClick={() => handleVote(alert.id, 'fake')}
                                        className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white rounded-md transition-all text-[11px] font-bold text-red-600"
                                    >
                                        <ThumbsDown className="w-3.5 h-3.5" />
                                        <span>FAKE ({alert.fakeVotes})</span>
                                    </button>
                                </div>

                                {/* Feature 2: Actionable Safety (View Safe Zone) */}
                                <div className="relative ml-auto flex gap-2">
                                    <button
                                        onMouseEnter={() => setHoveredSafeZone(alert.id)}
                                        onMouseLeave={() => setHoveredSafeZone(null)}
                                        onClick={() => handleViewSafeZone(alert.id)}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-blue-500 bg-white hover:bg-blue-50 transition-all text-[11px] font-bold text-blue-600 outline-none"
                                    >
                                        <Navigation className="w-3.5 h-3.5" />
                                        <span>VIEW SAFE ZONE</span>

                                        {/* Tooltip */}
                                        {hoveredSafeZone === alert.id && alert.safeZone !== "N/A" && (
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded-md shadow-xl z-10 animate-in fade-in zoom-in duration-200">
                                                <div className="font-bold border-b border-gray-700 pb-1 mb-1 italic">Navigation Route Ready</div>
                                                Navigating to nearest Govt Shelter ({alert.safeZone})
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
                                            </div>
                                        )}
                                    </button>

                                    {/* Emergency Call Button */}
                                    {alert.severity === 'high' && (
                                        <button
                                            onClick={() => handleEmergencyCall(alert.id)}
                                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all text-[11px] font-bold text-white shadow-lg shadow-red-200"
                                        >
                                            <Phone className="w-3.5 h-3.5" />
                                            <span>EMERGENCY</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Feature 3: Resilience Tech Badge */}
                            <div className="absolute bottom-2 right-2 flex items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity">
                                <span className="text-[10px] font-black uppercase text-gray-300 flex items-center gap-1 tracking-tighter">
                                    <Radio className="w-3 h-3" />
                                    SMS MESH LINK
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .scrollbar-thin::-webkit-scrollbar {
                  width: 6px;
                }
                .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
                  background-color: #e5e7eb;
                  border-radius: 99px;
                }
                .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb:hover {
                  background-color: #d1d5db;
                }
                .scrollbar-track-gray-100::-webkit-scrollbar-track {
                  background-color: transparent;
                }
            `}</style>
        </div>
    );
};

export default LiveAlertsFeed;
