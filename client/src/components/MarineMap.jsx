import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Compass, Waves, Anchor, Sparkles } from 'lucide-react';

// Custom Map Centering Controller with smooth coordinate listener
function MapViewController({ center, zoom }) {
  const map = useMap();
  const lat = center?.[0];
  const lng = center?.[1];

  useEffect(() => {
    if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
      map.flyTo([lat, lng], zoom || 9, {
        animate: true,
        duration: 1.2
      });
    }
  }, [lat, lng, zoom, map]);

  return null;
}

// Luminous Modern Leaflet Icons
const harborIcon = L.divIcon({
  className: 'custom-harbor-icon',
  html: `<div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-emerald-400 flex items-center justify-center text-white shadow-[0_0_20px_rgba(0,245,160,0.4)] text-lg font-bold">⚓</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -22]
});

const pfzActiveIcon = L.divIcon({
  className: 'custom-pfz-active-icon',
  html: `
    <div class="relative flex items-center justify-center w-11 h-11">
      <div class="bio-pulse-ring w-11 h-11 bg-emerald-400/30 border border-emerald-400"></div>
      <div class="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-white flex items-center justify-center text-slate-950 font-black text-base shadow-[0_0_25px_rgba(0,245,160,0.8)]">🐟</div>
    </div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
  popupAnchor: [0, -24]
});

const pfzStandardIcon = L.divIcon({
  className: 'custom-pfz-std-icon',
  html: `
    <div class="w-8 h-8 rounded-xl bg-slate-900/90 border border-emerald-400/70 flex items-center justify-center text-white text-sm shadow-[0_0_15px_rgba(0,245,160,0.3)]">🐟</div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -18]
});

export default function MarineMap({ harbor, hotspots, selectedHotspot, onSelectHotspot, route, boundaries }) {
  const center = [harbor?.lat || 13.125, harbor?.lng || 80.298];

  const imblLines = boundaries?.imbl_lines ? Object.values(boundaries.imbl_lines).map(b => b.points.map(p => [p.lat, p.lng])) : [];
  const aiRoutePoints = route?.ai_waypoints ? route.ai_waypoints.map(w => [w.lat, w.lng]) : [];
  const straightPoints = route?.straight_path ? route.straight_path.map(p => [p.lat, p.lng]) : [];

  return (
    <div className="relative w-full h-[520px] lg:h-[600px] rounded-3xl overflow-hidden glass-panel shadow-2xl border border-white/10">
      
      {/* Map Header Floating Pill */}
      <div className="absolute top-4 left-4 z-[400] glass-panel px-4 py-2 rounded-2xl flex items-center gap-2.5 text-xs shadow-xl">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="font-bold text-white tracking-wide">{harbor?.name?.split('(')[0]?.trim() || 'Coast'}:</span>
        <span className="text-emerald-400 font-mono font-bold">{harbor?.coast || 'Indian EEZ'}</span>
      </div>

      {/* Modern Sleek Map Legend */}
      <div className="absolute bottom-4 left-4 z-[400] glass-panel p-3.5 rounded-2xl text-[11px] text-slate-200 shadow-2xl space-y-2 hidden sm:block max-w-xs">
        <div className="flex items-center gap-2 font-extrabold text-white border-b border-white/10 pb-1.5">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>Tactical Marine Layers</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-lg bg-emerald-400 border border-white shadow-[0_0_10px_rgba(0,245,160,0.8)]"></span>
          <span>Potential Fishing Zone (PFZ Hotspot)</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-4 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#00d2ff]"></span>
          <span>AI Current-Assisted Route ({route?.fuel_savings_percentage || 28}% Fuel Saved)</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-4 h-0.5 border-t border-dashed border-slate-500"></span>
          <span className="text-slate-400">Traditional Direct Path</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-4 h-1.5 border-t-2 border-dashed border-rose-500"></span>
          <span className="text-rose-400 font-medium">International Maritime Boundary (IMBL)</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs">🐢 / 🪸</span>
          <span className="text-amber-300 font-medium">Marine Ecological Sanctuary</span>
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={9}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapViewController center={center} zoom={9} />

        {/* Seamless Dark Matter Map Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &amp; ISRO Bhuvan'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={18}
        />

        {/* Origin Harbor Marker */}
        {harbor && (
          <Marker position={[harbor.lat, harbor.lng]} icon={harborIcon}>
            <Popup>
              <div className="p-2 space-y-1.5">
                <p className="text-xs font-black text-emerald-400 flex items-center gap-1.5">⚓ {harbor.name}</p>
                <p className="text-[11px] text-slate-300">{harbor.state} &bull; {harbor.coast}</p>
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
                <div className="p-2 space-y-2.5 min-w-[230px]">
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                    <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                      <span>🐟</span> {h.id} ({h.confidence_score}% Match)
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold">{h.distance_nm} NM</span>
                  </div>
                  <p className="text-xs font-bold text-white">{h.primary_species}</p>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-300 bg-white/[0.04] p-2 rounded-xl font-mono border border-white/10">
                    <div>🌡️ SST: <strong className="text-white">{h.sst_celsius}°C</strong></div>
                    <div>🌿 Chl-a: <strong className="text-emerald-400">{h.chlorophyll_mg_m3}</strong></div>
                    <div>🌊 Depth: <strong className="text-cyan-400">{h.depth_meters}m</strong></div>
                    <div>📈 Front: <strong className="text-slate-200">{h.thermal_front_gradient}</strong></div>
                  </div>
                  <button
                    onClick={() => onSelectHotspot(h)}
                    className="w-full mt-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:opacity-90 text-slate-950 text-xs font-black py-2 rounded-xl transition shadow-lg shadow-emerald-500/20"
                  >
                    Plot Fuel-Optimal Route ⚡
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* AI Current-Assisted Optimal Route (Bioluminescent Cyan Glow) */}
        {aiRoutePoints.length > 0 && (
          <Polyline
            positions={aiRoutePoints}
            color="#00f5a0"
            weight={4.5}
            opacity={0.95}
          />
        )}

        {/* Straight Naive Line */}
        {straightPoints.length > 0 && (
          <Polyline
            positions={straightPoints}
            color="#64748b"
            weight={2}
            opacity={0.5}
            dashArray="6, 8"
          />
        )}

        {/* International Maritime Boundary Lines (IMBL) */}
        {imblLines.map((line, idx) => (
          <Polyline
            key={`imbl-${idx}`}
            positions={line}
            color="#f43f5e"
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
              color: '#f59e0b',
              fillColor: '#f59e0b',
              fillOpacity: 0.12,
              dashArray: '5, 5'
            }}
          >
            <Popup>
              <div className="p-2 text-xs text-amber-300 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <span className="text-base">{mpa.id.includes('GAHIR') ? '🐢' : '🪸'}</span>
                  <span>{mpa.name}</span>
                </p>
                <p className="text-[10px] text-slate-300">{mpa.type}</p>
                <p className="text-[10px] text-rose-400 font-semibold font-mono">⚠️ Ecological No-Fishing Sanctuary</p>
              </div>
            </Popup>
          </Circle>
        ))}

      </MapContainer>
    </div>
  );
}
