import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation2, Fish, AlertTriangle, ShieldAlert, Sparkles, Compass } from 'lucide-react';

// Custom Map Centering Controller
function MapViewController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      map.flyTo(center, zoom || 8, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

// Custom Leaflet Icons
const harborIcon = L.divIcon({
  className: 'custom-harbor-icon',
  html: `<div class="w-8 h-8 rounded-full bg-blue-600 border-2 border-cyan-300 flex items-center justify-center text-white shadow-lg shadow-blue-500/50 text-xs font-bold font-mono">⚓</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -18]
});

const pfzActiveIcon = L.divIcon({
  className: 'custom-pfz-active-icon',
  html: `
    <div class="relative flex items-center justify-center w-9 h-9">
      <div class="radar-pulse-ring w-9 h-9 bg-emerald-500/40 border border-emerald-400"></div>
      <div class="w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/80">🐟</div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18]
});

const pfzStandardIcon = L.divIcon({
  className: 'custom-pfz-std-icon',
  html: `
    <div class="w-6 h-6 rounded-full bg-emerald-700/80 border border-emerald-400 flex items-center justify-center text-white text-[10px] shadow">🐟</div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -14]
});

export default function MarineMap({ harbor, hotspots, selectedHotspot, onSelectHotspot, route, boundaries }) {
  const center = harbor ? [harbor.lat, harbor.lng] : [13.125, 80.298];

  // IMBL coordinates polyline arrays
  const imblLines = boundaries?.imbl_lines ? Object.values(boundaries.imbl_lines).map(b => b.points.map(p => [p.lat, p.lng])) : [];
  
  // AI Waypoints polyline
  const aiRoutePoints = route?.ai_waypoints ? route.ai_waypoints.map(w => [w.lat, w.lng]) : [];
  
  // Straight baseline polyline
  const straightPoints = route?.straight_path ? route.straight_path.map(p => [p.lat, p.lng]) : [];

  return (
    <div className="relative w-full h-[520px] lg:h-[600px] rounded-2xl overflow-hidden border border-ocean-700/70 shadow-2xl bg-ocean-950">
      
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 z-[400] bg-ocean-900/90 backdrop-blur-md border border-ocean-700 rounded-xl px-3.5 py-2 flex items-center gap-2.5 text-xs shadow-lg">
        <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
        <div>
          <span className="font-semibold text-slate-200">Satellite Tactical View:</span>
          <span className="ml-1 text-cyan-300 font-mono">{harbor?.coast || 'Indian EEZ'}</span>
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-3 left-3 z-[400] bg-ocean-900/95 backdrop-blur-md border border-ocean-700 rounded-xl p-2.5 text-[11px] text-slate-300 shadow-xl space-y-1.5 hidden sm:block">
        <div className="flex items-center gap-2 font-semibold text-slate-200 border-b border-ocean-800 pb-1">
          <span>Map Telemetry Legend</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white"></span>
          <span>Potential Fishing Zone (PFZ Hotspot)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1 bg-cyan-400 rounded-full"></span>
          <span>AI Current-Assisted Route ({route?.fuel_savings_percentage || 25}% Fuel Saved)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-0.5 border-t border-dashed border-slate-400"></span>
          <span>Traditional Straight Course</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1 border-t-2 border-dashed border-rose-500"></span>
          <span className="text-rose-300">International Maritime Boundary (IMBL)</span>
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={8}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapViewController center={center} zoom={8} />

        {/* Dark CartoDB Map Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &amp; ISRO Bhuvan / OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          maxZoom={18}
        />

        {/* Origin Harbor Marker */}
        {harbor && (
          <Marker position={[harbor.lat, harbor.lng]} icon={harborIcon}>
            <Popup>
              <div className="p-1 space-y-1">
                <p className="text-xs font-bold text-cyan-300">⚓ {harbor.name}</p>
                <p className="text-[11px] text-slate-300">State: {harbor.state} | {harbor.coast}</p>
                <p className="text-[10px] text-slate-400 font-mono">GPS: {harbor.lat}, {harbor.lng}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Potential Fishing Zone (PFZ) Hotspots */}
        {hotspots?.map((h) => {
          const isSelected = selectedHotspot?.id === h.id;
          return (
            <Marker
              key={h.id}
              position={[h.lat, h.lng]}
              icon={isSelected ? pfzActiveIcon : pfzStandardIcon}
              eventHandlers={{
                click: () => onSelectHotspot(h)
              }}
            >
              <Popup>
                <div className="p-1 space-y-1.5 min-w-[210px]">
                  <div className="flex items-center justify-between border-b border-ocean-700 pb-1">
                    <span className="text-xs font-bold text-emerald-400">{h.id} ({h.confidence_score}% Match)</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">{h.distance_nm} NM</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-100">{h.primary_species}</p>
                  <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-300 bg-ocean-950/60 p-1.5 rounded-lg font-mono">
                    <div>🌡️ SST: {h.sst_celsius}°C</div>
                    <div>🌿 Chl-a: {h.chlorophyll_mg_m3} mg/m³</div>
                    <div>🌊 Depth: {h.depth_meters} m</div>
                    <div>📈 Front: {h.thermal_front_gradient}</div>
                  </div>
                  <button
                    onClick={() => onSelectHotspot(h)}
                    className="w-full mt-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-[11px] font-semibold py-1 rounded-md transition shadow"
                  >
                    Plot Fuel-Optimal Route
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* AI Current-Assisted Optimal Route */}
        {aiRoutePoints.length > 0 && (
          <Polyline
            positions={aiRoutePoints}
            color="#00f0ff"
            weight={4}
            opacity={0.9}
            dashArray={null}
          />
        )}

        {/* Straight Naive Line */}
        {straightPoints.length > 0 && (
          <Polyline
            positions={straightPoints}
            color="#94a3b8"
            weight={2}
            opacity={0.6}
            dashArray="6, 8"
          />
        )}

        {/* International Maritime Boundary Lines (IMBL) */}
        {imblLines.map((line, idx) => (
          <Polyline
            key={`imbl-${idx}`}
            positions={line}
            color="#ef4444"
            weight={3}
            opacity={0.85}
            dashArray="8, 6"
          />
        ))}

        {/* Marine Protected Areas (MPA Circles) */}
        {boundaries?.protected_areas?.map((mpa) => (
          <Circle
            key={mpa.id}
            center={[mpa.center_lat, mpa.center_lng]}
            radius={mpa.radius_km * 1000}
            pathOptions={{
              color: '#f59e0b',
              fillColor: '#f59e0b',
              fillOpacity: 0.12,
              dashArray: '4, 4'
            }}
          >
            <Popup>
              <div className="p-1 text-xs text-amber-300">
                <p className="font-bold flex items-center gap-1">⚠️ {mpa.name}</p>
                <p className="text-[10px] text-slate-300">{mpa.type}</p>
              </div>
            </Popup>
          </Circle>
        ))}

      </MapContainer>
    </div>
  );
}
