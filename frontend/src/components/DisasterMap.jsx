import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Target, MapPin } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';

// User Location Icon (Blue Pulsing)
const userIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="marker-pin-user"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
});

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper component to center and fit items in view
function MapController({ alerts, userLocation }) {
    const map = useMap();
    useEffect(() => {
        if (userLocation) {
            map.setView([userLocation.lat, userLocation.lng], 12);
        } else if (alerts && alerts.length > 0) {
            const validAlerts = alerts.filter(a => a.coordinates && a.coordinates.lat && a.coordinates.lng);
            if (validAlerts.length > 0) {
                const bounds = L.latLngBounds(validAlerts.map(a => [a.coordinates.lat, a.coordinates.lng]));
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [alerts, map, userLocation]);
    return null;
}

const DisasterMap = ({ alerts }) => {
    const defaultCenter = [20.5937, 78.9629]; // Center of India
    const { location: userLocation } = useGeolocation();
    const [mapInstance, setMapInstance] = useState(null);

    const handleRecenter = () => {
        if (mapInstance && userLocation) {
            mapInstance.setView([userLocation.lat, userLocation.lng], 12);
        } else if (mapInstance && alerts && alerts.length > 0) {
            const validAlerts = alerts.filter(a => a.coordinates && a.coordinates.lat && a.coordinates.lng);
            if (validAlerts.length > 0) {
                const bounds = L.latLngBounds(validAlerts.map(a => [a.coordinates.lat, a.coordinates.lng]));
                mapInstance.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    };

    return (
        <div className="w-full h-[450px] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl bg-[#0f172a] mb-8 relative">
            {/* Recenter Button */}
            {userLocation && (
                <button
                    onClick={handleRecenter}
                    className="map-control-btn group"
                    title="Recenter Map"
                >
                    <Target className="w-5 h-5 text-blue-400 group-hover:text-white" />
                </button>
            )}

            <MapContainer
                center={defaultCenter}
                zoom={5}
                scrollWheelZoom={true}
                className="h-full w-full"
                zoomControl={false}
                ref={setMapInstance}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {/* User Location Marker */}
                {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                        <Popup>
                            <div className="p-1 text-center">
                                <p className="font-bold text-blue-600">Your Current Location</p>
                                <p className="text-[10px] text-gray-400">Live GPS tracking active</p>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {alerts.map((alert) => {
                    if (!alert.coordinates) return null;

                    const { lat, lng } = alert.coordinates;
                    const severity = alert.severity?.toLowerCase() || 'low';

                    // Radius based on severity
                    const radius = severity === 'high' || severity === 'critical' ? 50000 : 25000;
                    const color = severity === 'high' || severity === 'critical' ? '#ff3b3b' : '#ff9f0a';

                    return (
                        <Circle
                            key={alert._id || alert.id}
                            center={[lat, lng]}
                            pathOptions={{
                                fillColor: color,
                                fillOpacity: 0.3,
                                color: color,
                                weight: 2,
                                className: 'animate-pulse'
                            }}
                            radius={radius}
                        >
                            <Popup className="custom-popup">
                                <div className="p-1 min-w-[180px]">
                                    <h4 className="font-extrabold text-white leading-tight mb-2 text-sm">{alert.message?.substring(0, 60)}...</h4>
                                    <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                                        <MapPin className="w-3 h-3 text-blue-500" />
                                        {alert.location}
                                    </p>
                                    <div className="flex flex-col gap-3 mt-3 border-t border-white/10 pt-3">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${severity === 'high' || severity === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-orange-500/20 text-orange-400 border border-orange-500/50'}`}>
                                                {severity} Signal
                                            </span>
                                            {alert.credibility?.verified ? (
                                                <span className="text-[8px] text-emerald-400 font-black tracking-widest uppercase">Verified</span>
                                            ) : (
                                                <span className="text-[8px] text-amber-400 font-black tracking-widest uppercase animate-pulse">Auditing</span>
                                            )}
                                        </div>
                                        <div className="bg-white/5 p-2 rounded-xl border border-white/5 italic text-[9px] text-slate-400 leading-relaxed shadow-inner">
                                            <span className="font-black text-slate-500 not-italic uppercase tracking-tighter mr-1">[AI]:</span> {alert.credibility?.reason || "Analyzing patterns..."}
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </Circle>
                    );
                })}
                <MapController alerts={alerts} userLocation={userLocation} />
            </MapContainer>

            {/* Map Overlay for Premium Look */}
            <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
                <div className="bg-gray-900/80 backdrop-blur-md p-3 rounded-xl border border-gray-700 text-white text-[10px] font-bold shadow-xl">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                        <span>HIGH RISK ZONE</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div>
                        <span>MODERATE RISK</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisasterMap;

