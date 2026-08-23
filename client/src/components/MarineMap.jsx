import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation2, Fish, AlertTriangle, ShieldAlert, Sparkles, Compass, Waves, Anchor } from 'lucide-react';

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

// Custom Leaflet Icons with Marine & Nautical Flair
const harborIcon = L.divIcon({
  className: 'custom-harbor-icon',
  html: `<div class="w-9 h-9 rounded-2xl bg-gradient-to-br from-marine-600 to-marine-900 border-2 border-biolum-teal flex items-center justify-center text-white shadow-xl shadow-biolum-teal/40 text-base font-bold">⚓</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -20]
});

const pfzActiveIcon = L.divIcon({
  className: 'custom-pfz-active-icon',
  html: `
    <div class="relative flex items-center justify-center w-10 h-10">
      <div class="radar-pulse-ring w-10 h-10 bg-biolum-teal/40 border border-biolum-teal"></div>
      <div class="w-8 h-8 rounded-full bg-gradient-to-br from-biolum-teal to-emerald-600 border-2 border-white flex items-center justify-center text-marine-950 font-bold text-sm shadow-xl shadow-biolum-teal/80">🐟</div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -22]
});

const pfzStandardIcon = L.divIcon({
  className: 'custom-pfz-std-icon',
  html: `
    <div class="w-7 h-7 rounded-full bg-marine-800 border-2 border-biolum-teal/70 flex items-center justify-center text-white text-xs shadow-md">🐟</div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -16]
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
    <div className="relative w-full h-[520px] lg:h-[600px] rounded-3xl overflow-hidden border border-biolum-teal/30 shadow-2xl bg-marine-950">
      
      {/* Marine Header Overlay */}
      <div className="absolute top-3 left-3 z-[400] bg-marine-900/95 backdrop-blur-md border border-marine-700/80 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 text-xs shadow-xl">
        <span className="text-base animate-pulse">🌊</span>
        <div>
          <span className="font-bold text-slate-100">Coastal Marine Canvas:</span>
          <span className="ml-1.5 text-biolum-teal font-mono font-semibold">{harbor?.coast || 'Indian EEZ'}</span>
        </div>
      </div>

      {/* Marine Fauna & Telemetry Legend */}
      <div className="absolute bottom-3 left-3 z-[400] bg-marine-900/95 backdrop-blur-md border border-marine-700/80 rounded-2xl p-3 text-[11px] text-marine-100 shadow-2xl space-y-1.5 hidden sm:block">
        <div className="flex items-center gap-2 font-bold text-white border-b border-marine-700 pb-1">
          <span>🧭 Marine Telemetry & Fauna Legend</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-biolum-teal border border-white flex items-center justify-center text-[9px] text-marine-950 font-bold">🐟</span>
          <span>Potential Fishing Zone (PFZ Hotspot)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1.5 bg-biolum-teal rounded-full"></span>
          <span>AI Current-Assisted Route ({route?.fuel_savings_percentage || 28}% Fuel Saved)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-0.5 border-t border-dashed border-slate-400"></span>
          <span>Traditional Direct Course</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1.5 border-t-2 border-dashed border-biolum-coral"></span>
          <span className="text-biolum-coral font-medium">International Maritime Boundary (IMBL)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs">🐢 / 🪸</span>
          <span className="text-biolum-amber font-medium">Marine Protected Sanctuary (No Fishing)</span>
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={8}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapViewController center={center} zoom={8} />

        {/* Dark Marine Voyager Map Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &amp; ISRO Bhuvan'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          maxZoom={18}
        />

        {/* Origin Harbor Marker */}
        {harbor && (
          <Marker position={[harbor.lat, harbor.lng]} icon={harborIcon}>
            <Popup>
              <div className="p-1 space-y-1">
                <p className="text-xs font-bold text-biolum-teal flex items-center gap-1">⚓ {harbor.name}</p>
                <p className="text-[11px] text-marine-200">State: {harbor.state} | {harbor.coast}</p>
                <p className="text-[10px] text-marine-300 font-mono">GPS: {harbor.lat}, {harbor.lng}</p>
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
                <div className="p-1 space-y-2 min-w-[220px]">
                  <div className="flex items-center justify-between border-b border-marine-700 pb-1">
                    <span className="text-xs font-black text-biolum-teal flex items-center gap-1">
                      <span>🐟</span> {h.id} ({h.confidence_score}% Yield)
                    </span>
                    <span className="text-[10px] bg-biolum-teal/20 text-biolum-teal px-2 py-0.5 rounded font-mono font-bold">{h.distance_nm} NM</span>
                  </div>
                  <p className="text-xs font-bold text-white">{h.primary_species}</p>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] text-marine-200 bg-marine-950/80 p-2 rounded-xl font-mono border border-marine-800">
                    <div>🌡️ SST: {h.sst_celsius}°C</div>
                    <div>🌿 Chl-a: {h.chlorophyll_mg_m3} mg/m³</div>
                    <div>🌊 Depth: {h.depth_meters} m</div>
                    <div>📈 Gradient: {h.thermal_front_gradient}</div>
                  </div>
                  <button
                    onClick={() => onSelectHotspot(h)}
                    className="w-full mt-1 bg-gradient-to-r from-biolum-teal to-marine-500 hover:from-biolum-aqua hover:to-marine-400 text-marine-950 text-xs font-extrabold py-1.5 rounded-xl transition shadow-lg shadow-biolum-teal/20"
                  >
                    Plot Fuel-Optimal Route
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* AI Current-Assisted Optimal Route (Bioluminescent Teal) */}
        {aiRoutePoints.length > 0 && (
          <Polyline
            positions={aiRoutePoints}
            color="#00f5c4"
            weight={4.5}
            opacity={0.95}
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

        {/* International Maritime Boundary Lines (IMBL) (Coral Red) */}
        {imblLines.map((line, idx) => (
          <Polyline
            key={`imbl-${idx}`}
            positions={line}
            color="#ff6b6b"
            weight={3.5}
            opacity={0.9}
            dashArray="8, 6"
          />
        ))}

        {/* Marine Protected Areas (Turtle & Coral Sanctuaries) */}
        {boundaries?.protected_areas?.map((mpa) => (
          <Circle
            key={mpa.id}
            center={[mpa.center_lat, mpa.center_lng]}
            radius={mpa.radius_km * 1000}
            pathOptions={{
              color: '#ffb300',
              fillColor: '#ffb300',
              fillOpacity: 0.15,
              dashArray: '5, 5'
            }}
          >
            <Popup>
              <div className="p-1.5 text-xs text-amber-300 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <span className="text-base">{mpa.id.includes('GAHIR') ? '🐢' : '🪸'}</span>
                  <span>{mpa.name}</span>
                </p>
                <p className="text-[10px] text-marine-200">{mpa.type}</p>
                <p className="text-[10px] text-rose-300 font-semibold font-mono">⚠️ Ecological No-Fishing Zone</p>
              </div>
            </Popup>
          </Circle>
        ))}

      </MapContainer>
    </div>
  );
}
