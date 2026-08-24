import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Compass, Waves, Anchor, Sparkles, MessageSquare, Navigation, Volume2, VolumeX, CheckCircle, ChevronRight, Play, Check } from 'lucide-react';

// Custom Map Controller automatically framing the coastal route and hotspot with perfect zoom
function MapController({ center, targetSpot, onMapReady }) {
  const map = useMap();
  const lat = center?.[0];
  const lng = center?.[1];

  useEffect(() => {
    if (onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  useEffect(() => {
    if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
      if (targetSpot && targetSpot.lat && targetSpot.lng && !isNaN(targetSpot.lat) && !isNaN(targetSpot.lng)) {
        // Fit bounds tightly around Harbour + Target Fish Shoal
        const bounds = L.latLngBounds([
          [lat, lng],
          [targetSpot.lat, targetSpot.lng]
        ]);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10.5, animate: true });
      } else {
        // Center coastal harbor with clear 10x zoom
        map.setView([lat, lng], 10, {
          animate: true,
          duration: 0.8
        });
      }
    }
  }, [lat, lng, targetSpot, map]);

  return null;
}

// Luminous Modern Leaflet Icons
const harborIcon = L.divIcon({
  className: 'custom-harbor-icon',
  html: `<div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-emerald-400 flex items-center justify-center text-white shadow-[0_0_25px_rgba(0,245,160,0.6)] text-xl font-black">⚓</div>`,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
  popupAnchor: [0, -24]
});

const pfzActiveIcon = L.divIcon({
  className: 'custom-pfz-active-icon',
  html: `
    <div class="relative flex items-center justify-center w-12 h-12">
      <div class="bio-pulse-ring w-12 h-12 bg-emerald-400/30 border-2 border-emerald-400"></div>
      <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-white flex items-center justify-center text-slate-950 font-black text-lg shadow-[0_0_25px_rgba(0,245,160,0.9)]">🐟</div>
    </div>
  `,
  iconSize: [48, 48],
  iconAnchor: [24, 24],
  popupAnchor: [0, -26]
});

const pfzStandardIcon = L.divIcon({
  className: 'custom-pfz-std-icon',
  html: `
    <div class="w-9 h-9 rounded-xl bg-slate-900/95 border-2 border-emerald-400/80 flex items-center justify-center text-white text-base shadow-[0_0_20px_rgba(0,245,160,0.4)]">🐟</div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -20]
});

// Calculate compass heading degree between 2 GPS coordinates
function calculateBearing(lat1, lon1, lat2, lon2) {
  const y = Math.sin((lon2 - lon1) * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180);
  const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
            Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos((lon2 - lon1) * Math.PI / 180);
  let brng = Math.atan2(y, x) * 180 / Math.PI;
  return Math.round((brng + 360) % 360);
}

function getCompassDirection(deg) {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return directions[Math.round(deg / 22.5) % 16];
}

export default function MarineMap({ harbor, hotspots, selectedHotspot, onSelectHotspot, route, boundaries, onOpenChat, selectedLang = 'en' }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isSpeakingSteer, setIsSpeakingSteer] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const mapRef = useRef(null);

  const center = [harbor?.lat || 13.35, harbor?.lng || 74.69];
  const imblLines = boundaries?.imbl_lines ? Object.values(boundaries.imbl_lines).map(b => b.points.map(p => [p.lat, p.lng])) : [];
  const aiRoutePoints = route?.ai_waypoints ? route.ai_waypoints.map(w => [w.lat, w.lng]) : [];
  const straightPoints = route?.straight_path ? route.straight_path.map(p => [p.lat, p.lng]) : [];

  const rawSpecies = selectedHotspot?.primary_species || "Indian Mackerel";
  const cleanSpecies = rawSpecies.split('(')[0].trim();

  // Compute live compass steer heading for current step
  const waypoints = route?.ai_waypoints || [];
  const targetWaypoint = waypoints[currentStepIdx + 1] || waypoints[waypoints.length - 1] || { lat: selectedHotspot?.lat || center[0], lng: selectedHotspot?.lng || center[1], label: "PFZ Hotspot" };
  const originCoord = currentStepIdx === 0 ? { lat: harbor?.lat || center[0], lng: harbor?.lng || center[1] } : (waypoints[currentStepIdx] || { lat: harbor?.lat || center[0], lng: harbor?.lng || center[1] });
  
  const headingDeg = calculateBearing(originCoord.lat, originCoord.lng, targetWaypoint.lat, targetWaypoint.lng);
  const compassDir = getCompassDirection(headingDeg);
  const distToNextNm = Number((selectedHotspot?.distance_nm ? selectedHotspot.distance_nm / (waypoints.length || 4) : 4.5).toFixed(1));

  // Handle Plot & Steer Click with immediate popup close and HUD activation
  const handlePlotAndSteer = (h, e) => {
    e?.stopPropagation();
    onSelectHotspot(h);
    setIsNavigating(true);
    setCurrentStepIdx(0);
    
    if (mapRef.current) {
      mapRef.current.closePopup();
      const bounds = L.latLngBounds([
        [harbor.lat, harbor.lng],
        [h.lat, h.lng]
      ]);
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 10.5, animate: true });
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  // Speech guidance for fisherman steering
  const handlePlaySteerVoice = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeakingSteer) {
      setIsSpeakingSteer(false);
      return;
    }

    let text = "";
    if (selectedLang === 'kn') {
      text = `ಮೀನುಗಾರರೇ, ನಿಮ್ಮ ದೋಣಿಯನ್ನು ದಿಕ್ಸೂಚಿಯಲ್ಲಿ ${headingDeg} ಡಿಗ್ರಿ ${compassDir} ದಿಕ್ಕಿಗೆ ತಿರುಗಿಸಿ. ${distToNextNm} ನಾಟಿಕಲ್ ಮೈಲಿ ಚಲಿಸಿ.`;
    } else if (selectedLang === 'ta') {
      text = `மீனவர்களே, உங்கள் படகை திசைகாட்டியில் ${headingDeg} டிகிரி ${compassDir} திசையில் செலுத்துங்கள். ${distToNextNm} கடல் மைல் செல்லவும்.`;
    } else if (selectedLang === 'hi') {
      text = `मछुआरों, अपनी नाव को कम्पास में ${headingDeg} डिग्री ${compassDir} दिशा में मोड़ें। ${distToNextNm} समुद्री मील चलें।`;
    } else {
      text = `Captains, steer compass heading ${headingDeg} degrees ${compassDir}. Maintain cruising speed with surface drift for ${distToNextNm} nautical miles.`;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.90;
    utterance.pitch = 1.05;
    utterance.onstart = () => setIsSpeakingSteer(true);
    utterance.onend = () => setIsSpeakingSteer(false);
    utterance.onerror = () => setIsSpeakingSteer(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="relative w-full h-[470px] sm:h-[510px] lg:h-[610px] rounded-3xl overflow-hidden glass-panel shadow-2xl border-2 border-white/20 z-10">
      
      {/* Top Floating Notification Toast */}
      {showToast && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-[500] bg-emerald-500/95 backdrop-blur-xl text-slate-950 font-black text-xs px-4 py-2.5 rounded-2xl shadow-[0_10px_35px_rgba(0,245,160,0.6)] flex items-center gap-2 animate-bounce border border-white/20 whitespace-nowrap">
          <CheckCircle className="w-4 h-4 text-slate-950 shrink-0" />
          <span>From {harbor?.name?.split('(')[0]?.trim() || 'Harbour'}: Steer {headingDeg}° {compassDir} &bull; Next Turn in {distToNextNm} NM</span>
        </div>
      )}

      {/* Map Header Floating Pill */}
      <div className="absolute top-3 left-3 z-[400] bg-[#020b17]/95 backdrop-blur-xl border border-white/25 px-3.5 py-1.5 rounded-2xl flex items-center gap-2 text-[11px] shadow-2xl">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="font-bold text-white truncate max-w-[120px] sm:max-w-none">{harbor?.name?.split('(')[0]?.trim() || 'Coast'}:</span>
        <span className="text-emerald-400 font-mono font-black">{harbor?.coast || 'Indian EEZ'}</span>
      </div>

      {/* Floating Tactical Legend (Desktop) */}
      <div className="absolute top-3 right-3 z-[400] bg-[#020b17]/95 backdrop-blur-xl border border-white/25 p-2.5 rounded-2xl text-[10px] text-slate-200 shadow-2xl space-y-1.5 hidden md:block max-w-[210px]">
        <div className="flex items-center gap-1.5 font-bold text-white border-b border-white/10 pb-1">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>Tactical Marine Layers</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-md bg-emerald-400 border border-white"></span>
          <span>PFZ Hotspot Zone</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-emerald-400 rounded-full"></span>
          <span>AI Current Route (-{route?.fuel_savings_percentage || 28}%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 border-t border-dashed border-rose-500"></span>
          <span className="text-rose-400">IMBL Border Line</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FISHERMAN COMPASS STEER NAVIGATION HUD (100% Mobile Optimized) */}
      {/* ========================================================================= */}
      {isNavigating ? (
        <div className="absolute bottom-3 left-3 right-3 z-[400] bg-[#020b17]/98 backdrop-blur-3xl border-2 border-emerald-400 p-3.5 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,1)] animate-fadeIn text-white ring-2 ring-emerald-400/30">
          
          {/* Top Row: Steer Compass Angle + Distance + Voice Button + Close */}
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
            
            {/* Compass Badge */}
            <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/60 px-3 py-1.5 rounded-xl shadow-inner">
              <Navigation className="w-4 h-4 text-emerald-400 transform -rotate-45 animate-pulse shrink-0" />
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-base sm:text-lg font-black text-white">{headingDeg}°</span>
                <span className="text-xs font-bold text-cyan-300">{compassDir}</span>
              </div>
            </div>

            {/* Next Waypoint Info */}
            <div className="text-left flex-1 min-w-0 px-1">
              <div className="text-xs font-black text-emerald-300 truncate">
                {targetWaypoint.label || "PFZ Hotspot"}
              </div>
              <div className="text-[10px] text-slate-300 font-mono">
                In <strong className="text-cyan-300 font-bold">{distToNextNm} NM</strong> (+1.35 kts)
              </div>
            </div>

            {/* Actions: Voice & Close */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handlePlaySteerVoice}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                  isSpeakingSteer ? 'bg-rose-500/20 text-rose-300 border-rose-500 animate-pulse' : 'bg-emerald-500/25 text-emerald-300 border-emerald-400/50 hover:bg-emerald-500/40'
                }`}
              >
                {isSpeakingSteer ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isSpeakingSteer ? 'Stop' : 'Voice'}</span>
                <span className="sm:hidden">🔊</span>
              </button>

              <button
                type="button"
                onClick={() => setIsNavigating(false)}
                className="text-xs font-mono text-slate-400 hover:text-white px-2 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition"
              >
                ✕
              </button>
            </div>

          </div>

          {/* Stepper Buttons Row */}
          <div className="flex items-center justify-between gap-2 pt-2 text-xs font-mono">
            <button
              disabled={currentStepIdx === 0}
              onClick={() => setCurrentStepIdx(Math.max(0, currentStepIdx - 1))}
              className="px-3.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/15 disabled:opacity-30 text-slate-200 font-bold transition text-xs"
            >
              &larr; Prev
            </button>
            
            <div className="text-center">
              <span className="text-xs text-emerald-400 font-black">
                Step {currentStepIdx + 1} of {waypoints.length || 4}
              </span>
            </div>

            <button
              disabled={currentStepIdx >= (waypoints.length - 2)}
              onClick={() => setCurrentStepIdx(Math.min(waypoints.length - 2, currentStepIdx + 1))}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 hover:opacity-90 disabled:opacity-30 text-slate-950 font-black shadow transition text-xs"
            >
              Next &rarr;
            </button>
          </div>

        </div>
      ) : (
        /* Standard Floating Action HUD */
        <div className="absolute bottom-3 left-3 right-3 z-[400] bg-[#020b17]/95 backdrop-blur-2xl border border-white/25 p-3 rounded-2xl flex items-center justify-between gap-2 shadow-[0_15px_35px_rgba(0,0,0,0.9)] animate-fadeIn">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-black text-sm shrink-0">
              🐟
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-slate-400 font-medium truncate">Target Shoal:</div>
              <div className="text-xs font-black text-white truncate flex items-center gap-1.5">
                <span className="text-emerald-400">{cleanSpecies}</span>
                <span className="text-[10px] text-slate-300 font-mono font-normal">({selectedHotspot?.distance_nm || 20} NM)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Start Live Steer HUD Button */}
            <button
              onClick={() => {
                setIsNavigating(true);
                setCurrentStepIdx(0);
              }}
              className="flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 text-emerald-300 font-bold px-3 py-2 rounded-xl text-xs transition active:scale-95 shadow-md"
              title="Open Fisherman Compass & Heading Steer Guidance"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '16s' }} />
              <span className="hidden sm:inline">Steer Guidance</span>
              <span className="sm:hidden">Steer 🧭</span>
            </button>

            {onOpenChat && (
              <button
                onClick={onOpenChat}
                className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-400 to-cyan-500 hover:opacity-90 active:scale-95 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask AI</span>
              </button>
            )}
          </div>
        </div>
      )}

      <MapContainer
        center={center}
        zoom={10}
        minZoom={8}
        maxZoom={16}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapController center={center} targetSpot={selectedHotspot} onMapReady={(m) => (mapRef.current = m)} />

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
                    type="button"
                    onClick={(e) => handlePlotAndSteer(h, e)}
                    className="w-full mt-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:opacity-90 active:scale-95 text-slate-950 text-xs font-black py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/25"
                  >
                    Plot & Steer Route ⚡
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
            weight={5}
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
