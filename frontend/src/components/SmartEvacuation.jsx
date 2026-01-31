import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  Circle
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useGeolocation } from '../hooks/useGeolocation';
import "../App.css";

import {
  Navigation,
  ShieldCheck,
  Clock,
  MapPin,
  AlertOctagon,
  TrafficCone,
  Info,
  Maximize2,
  Layers,
  Map as MapIcon,
  ExternalLink,
  Zap,
  Activity
} from 'lucide-react';

const API_BASE = "http://localhost:5000";

// User Location Icon (Blue Pulsing)
const userIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="marker-pin-user"></div>`,
  iconSize: [30, 42],
  iconAnchor: [15, 42]
});

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper component to center and zoom map when route changes
function RouteView({ steps, userLocation }) {
  const map = useMap();
  useEffect(() => {
    if (steps && steps.length > 0) {
      const bounds = L.latLngBounds(steps.map(s => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 14);
    }
  }, [steps, map, userLocation]);
  return null;
}

const MAP_LAYERS = {
  streets: "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
  satellite: "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  hybrid: "http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",
  traffic: "http://{s}.google.com/vt/lyrs=m,traffic&x={x}&y={y}&z={z}"
};

function SmartEvacuation() {
  const { location: userLocation } = useGeolocation();
  const [location, setLocation] = useState("Bengaluru City");
  const [evacCurrentLocation, setEvacCurrentLocation] = useState("");
  const [evacDestination, setEvacDestination] = useState("Koramangala Safe Shelter");
  const [routeData, setRouteData] = useState(null);
  const [evacLoading, setEvacLoading] = useState(false);
  const [evacError, setEvacError] = useState("");
  const [mapType, setMapType] = useState('streets');

  const defaultCenter = [12.9716, 77.5946]; // Bengaluru

  useEffect(() => {
    if (userLocation && !evacCurrentLocation) {
      setEvacCurrentLocation(`Live GPS: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`);
    }
  }, [userLocation, evacCurrentLocation]);

  const handleFindSafeRoute = async (e) => {
    e.preventDefault();
    setEvacError("");
    setRouteData(null);
    setEvacLoading(true);

    // Artificial delay to show the professional radar animation
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      const res = await fetch(`${API_BASE}/get-safe-route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_location: evacCurrentLocation || location,
          destination: evacDestination,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setEvacError(data.error || "Unable to calculate safe route.");
        return;
      }
      setRouteData(data);
    } catch (err) {
      setEvacError("Network error. Could not reach routing AI.");
    } finally {
      setEvacLoading(false);
    }
  };

  const navigateToGoogleMaps = () => {
    if (!routeData) return;
    const origin = userLocation ? `${userLocation.lat},${userLocation.lng}` : encodeURIComponent(evacCurrentLocation || location);
    const destination = encodeURIComponent(evacDestination);
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <div className="feature-page">
      <div className="feature-header flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="feature-title flex items-center gap-3">
            <Zap className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            Smart Evacuation AI
          </h1>
          <p className="feature-subtitle text-gray-400 max-w-xl">
            Generating safe, hazard-free routes using satellite imagery, real-time hydrology, and traffic patterns.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="bg-gray-800/50 p-1.5 rounded-xl border border-white/5 flex gap-1">
            {Object.keys(MAP_LAYERS).map(type => (
              <button
                key={type}
                onClick={() => setMapType(type)}
                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mapType === type ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Configuration Form */}
        <div className="lg:col-span-4 space-y-6">
          <section className="card p-6 border border-gray-800 bg-gray-900/50 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldCheck className="w-16 h-16" />
            </div>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              Route Parameters
            </h2>

            <form onSubmit={handleFindSafeRoute} className="space-y-4">
              <div className="form-field">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-tighter">Your Position</label>
                <div className="relative">
                  <input
                    type="text"
                    className="form-input bg-gray-800 border-gray-700 text-white mt-1 pr-10 focus:border-blue-500"
                    value={evacCurrentLocation || location}
                    onChange={(e) => setEvacCurrentLocation(e.target.value)}
                    placeholder="Auto-detecting GPS..."
                  />
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                </div>
                {userLocation && (
                  <p className="text-[10px] text-emerald-400 mt-1.5 font-black uppercase flex items-center gap-1.5">
                    <Activity className="w-3 h-3 animate-pulse" /> Live Tracker Online
                  </p>
                )}
              </div>

              <div className="form-field">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-tighter">Target Shelter</label>
                <div className="relative">
                  <input
                    type="text"
                    className="form-input bg-gray-800 border-gray-700 text-white mt-1 pr-10 focus:border-blue-500"
                    value={evacDestination}
                    onChange={(e) => setEvacDestination(e.target.value)}
                    placeholder="Search closest safe point..."
                  />
                  <Navigation className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 ${evacLoading ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-[0_4px_20px_rgba(37,99,235,0.3)] hover:-translate-y-0.5'
                  }`}
                disabled={evacLoading}
              >
                {evacLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Scanning Hazards...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    Calculate Safe Path
                  </>
                )}
              </button>
            </form>

            {evacError && (
              <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-bold animate-shake">
                {evacError}
              </div>
            )}
          </section>

          {routeData && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="card p-6 border border-gray-800 bg-gray-900/50">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Hazard Avoidance Engine</h3>
                <div className="space-y-3">
                  {routeData.avoided_roads.flooded.map(road => (
                    <div key={road} className="flex items-center gap-3 text-sm group">
                      <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all">
                        <AlertOctagon className="w-4 h-4" />
                      </div>
                      <span className="text-gray-300 font-medium">{road} <span className="text-rose-400 font-black ml-1">BYPASSED</span></span>
                    </div>
                  ))}
                  {routeData.avoided_roads.traffic.map(road => (
                    <div key={road} className="flex items-center gap-3 text-sm group">
                      <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                        <TrafficCone className="w-4 h-4" />
                      </div>
                      <span className="text-gray-300 font-medium">{road} <span className="text-orange-400 font-black ml-1">AVOIDED</span></span>
                    </div>
                  ))}
                </div>
              </section>

              <button
                onClick={navigateToGoogleMaps}
                className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-3 transition-all"
              >
                <MapIcon className="w-5 h-5 text-gray-400" />
                Navigate in Google Maps
                <ExternalLink className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Map & Results */}
        <div className="lg:col-span-8">
          {evacLoading ? (
            <div className="evac-radar-container bg-slate-950/80 rounded-3xl border border-white/5 shadow-2xl overflow-hidden relative">
              {/* Scanline Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-10"></div>

              <div className="radar relative w-64 h-64 rounded-full border border-blue-500/20 bg-blue-500/5 mb-8">
                {/* Conic Gradient Sweep */}
                <div className="absolute inset-0 rounded-full animate-[spin_3s_linear_infinite]"
                  style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(37, 99, 235, 0.5) 300deg, transparent 360deg)' }}
                />
                {/* Decorative Circles */}
                <div className="absolute inset-[15%] rounded-full border border-white/5" />
                <div className="absolute inset-[30%] rounded-full border border-white/5" />
                <div className="absolute inset-[45%] rounded-full border border-white/5" />
                {/* Center Point */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,1)] z-20" />
              </div>

              <div className="relative z-20">
                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">AI Pathfinding Active</h3>
                <div className="flex items-center justify-center gap-2 text-blue-400 font-mono text-xs uppercase tracking-[0.3em] animate-pulse">
                  <Activity className="w-4 h-4" />
                  Analyzing Hazard Vectors
                </div>
              </div>
            </div>
          ) : routeData ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
              {/* Analytics Header */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800/20 border border-white/5 p-4 rounded-2xl text-center">
                  <span className="block text-2xl font-black text-emerald-400 leading-none">{routeData.analytics.safety_score}%</span>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Safety Index</span>
                </div>
                <div className="bg-gray-800/20 border border-white/5 p-4 rounded-2xl text-center">
                  <span className="block text-2xl font-black text-blue-400 leading-none">{routeData.analytics.eta_minutes}m</span>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">ETA</span>
                </div>
                <div className="bg-gray-800/20 border border-white/5 p-4 rounded-2xl text-center">
                  <span className="block text-2xl font-black text-purple-400 leading-none">{routeData.analytics.total_distance_km}km</span>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Distance</span>
                </div>
              </div>

              {/* Map Layout */}
              <div className="evac-map-container relative">
                <MapContainer
                  center={defaultCenter}
                  zoom={14}
                  className="h-full w-full"
                  zoomControl={false}
                >
                  <TileLayer
                    url={MAP_LAYERS[mapType]}
                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                    attribution='&copy; Google Maps'
                  />

                  {/* User Location Marker */}
                  {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                      <Popup className="custom-popup">
                        <div className="p-1">
                          <p className="font-bold text-gray-900">Live GPS Signal</p>
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  {/* Draw Polyline */}
                  <Polyline
                    positions={routeData.steps.map(s => [s.lat, s.lng])}
                    pathOptions={{ color: '#3b82f6', weight: 8, opacity: 0.9, lineJoin: 'round' }}
                  />

                  {/* Add Markers & Hazard Circles */}
                  {routeData.steps.map((step, idx) => (
                    <React.Fragment key={idx}>
                      {step.type !== 'path' && (
                        <Marker position={[step.lat, step.lng]}>
                          <Popup className="custom-popup">
                            <div className="p-1">
                              <p className="font-bold text-gray-900">{step.instruction}</p>
                              {step.type === 'avoid' && <p className="text-[10px] text-rose-600 font-black uppercase mt-1.5 flex items-center gap-1"><AlertOctagon className="w-3 h-3" /> Hazard Zone</p>}
                            </div>
                          </Popup>
                        </Marker>
                      )}
                      {step.type === 'avoid' && (
                        <Circle
                          center={[step.lat, step.lng]}
                          radius={300}
                          pathOptions={{ fillColor: '#f43f5e', color: '#f43f5e', fillOpacity: 0.3, weight: 2 }}
                          className="animate-pulse"
                        />
                      )}
                    </React.Fragment>
                  ))}

                  <RouteView steps={routeData.steps} userLocation={userLocation} />
                </MapContainer>

                {/* Floating Map Overlay */}
                <div className="absolute bottom-6 left-6 right-6 bg-gray-900/40 backdrop-blur-xl p-5 rounded-3xl border border-white/10 z-[1000] flex items-center justify-between shadow-2xl">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/40">
                      <Navigation className="w-5 h-5 text-white fill-white" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest leading-none mb-1.5">Immediate Manoeuvre</p>
                      <p className="text-base font-bold text-white leading-none truncate max-w-[280px]">{routeData.steps[0].instruction}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">SAFE PATH</span>
                    <button className="bg-white/5 p-2 rounded-xl hover:bg-white/10 transition-colors">
                      <Maximize2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Step by Step List */}
              <div className="card p-6 bg-gray-900/30 border border-gray-800">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Execution Log</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {routeData.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 group">
                      <div className="flex flex-col items-center">
                        <div className={`w-3.5 h-3.5 rounded-md z-10 transition-transform group-hover:scale-125 ${step.type === 'start' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' :
                          step.type === 'end' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                            step.type === 'avoid' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-gray-700'
                          }`} />
                      </div>
                      <div className="flex-1 border-b border-white/5 pb-2">
                        <p className={`text-xs font-bold leading-relaxed ${step.type === 'avoid' ? 'text-rose-400' : 'text-gray-300'}`}>
                          {step.instruction}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 bg-gray-900/20 rounded-3xl border-2 border-dashed border-gray-800/50 text-center">
              <div className="bg-blue-500/10 p-8 rounded-full mb-8 relative">
                <MapPin className="w-12 h-12 text-blue-500 animate-bounce" />
                <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full animate-ping" />
              </div>
              <h3 className="text-3xl font-black text-white mb-3 tracking-tight">Deployment Ready</h3>
              <p className="text-gray-500 max-w-sm font-medium leading-relaxed">
                Connect your GPS signal and set a destination to activate high-precision safe pathfinding.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SmartEvacuation;
