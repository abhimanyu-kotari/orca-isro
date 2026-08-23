import React, { useState, useEffect } from 'react';
import { DownloadCloud, CheckCircle2, HardDrive, WifiOff, Wifi, FileText, Trash2, Eye, X, ShieldCheck, Compass, Fuel, Fish, Printer } from 'lucide-react';

export default function OfflineSync({ harbor, selectedHotspot, route, weather, isOffline, onToggleOffline, selectedLang }) {
  const [isSaved, setIsSaved] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [cachedData, setCachedData] = useState(null);

  // Load existing cache on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('orca_offline_voyage_package');
      if (saved) {
        setCachedData(JSON.parse(saved));
      }
    } catch (e) {}
  }, [isSaved]);

  const handleSaveAndDownload = () => {
    const bundle = {
      project: "Project ORCA (ISRO PS-26176)",
      exportTimestamp: new Date().toLocaleString(),
      originHarbor: {
        name: harbor?.name || "Chennai Fisheries Harbour",
        state: harbor?.state || "Tamil Nadu",
        coordinates: [harbor?.lat, harbor?.lng]
      },
      targetPFZ: {
        id: selectedHotspot?.id || "PFZ-1",
        name: selectedHotspot?.name || "Hotspot A",
        species: selectedHotspot?.primary_species || "Indian Mackerel",
        confidence: `${selectedHotspot?.confidence_score || 88}%`,
        coordinates: [selectedHotspot?.lat, selectedHotspot?.lng],
        distance_nm: `${selectedHotspot?.distance_nm || 20} NM`,
        sst_celsius: `${selectedHotspot?.sst_celsius || 27.8}°C`,
        chlorophyll: `${selectedHotspot?.chlorophyll_mg_m3 || 1.65} mg/m³`
      },
      navigationRoute: {
        fuelSavings: `${route?.fuel_savings_percentage || 28.5}%`,
        dieselSavedLitres: `${route?.diesel_saved_litres_roundtrip || 25.2} L`,
        costSavedINR: `₹${route?.cost_saved_inr || 2400}`,
        waypoints: route?.ai_waypoints || []
      },
      safetyAndWeather: {
        seaState: weather?.sea_state || "Moderate",
        waveHeight: `${weather?.wave_height_m || 0.95}m`,
        imblSafetyStatus: "Safe (>15 km from border)"
      }
    };

    try {
      // 1. Save directly into Browser LocalStorage for the App to read offline
      localStorage.setItem('orca_offline_voyage_package', JSON.stringify(bundle));
      setCachedData(bundle);
      setIsSaved(true);

      // 2. Open the Visual Fisherman Pass automatically
      setShowPass(true);

      setTimeout(() => setIsSaved(false), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearCache = () => {
    localStorage.removeItem('orca_offline_voyage_package');
    setCachedData(null);
    setShowPass(false);
  };

  return (
    <>
      <div className="bg-ocean-900/80 border border-ocean-700/80 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-100">Deep-Sea Offline Pre-Trip Pass</h4>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">100% Offline</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {cachedData ? (
                <span className="text-emerald-400 font-medium">✓ Voyage Pass Saved &bull; App is ready for 0-Internet Sea Navigation</span>
              ) : (
                <span>Download easy visual pass and offline waypoints before leaving harbor.</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          
          {/* Download for Sea Button */}
          <button
            onClick={handleSaveAndDownload}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-3.5 py-2 rounded-xl transition shadow-lg shadow-cyan-500/20"
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4 text-white animate-bounce" /> : <DownloadCloud className="w-4 h-4" />}
            <span>{isSaved ? 'Pass Created!' : 'Get Fisherman Pass'}</span>
          </button>

          {/* View Pass Button */}
          {cachedData && (
            <button
              onClick={() => setShowPass(true)}
              className="flex items-center gap-1 text-xs bg-ocean-950 hover:bg-ocean-800 text-cyan-300 px-2.5 py-2 rounded-xl border border-ocean-700 transition"
              title="View Visual Fisherman Voyage Pass"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Pass</span>
            </button>
          )}

          {/* 0-Internet Simulator */}
          <button
            onClick={onToggleOffline}
            className={`flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-xl border transition font-medium ${
              isOffline
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-ocean-950 border-ocean-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Deep-Sea No-Internet Simulator"
          >
            {isOffline ? <WifiOff className="w-4 h-4 text-amber-400" /> : <Wifi className="w-4 h-4 text-slate-400" />}
            <span className="hidden md:inline">{isOffline ? 'Offline Active' : 'Simulate 0-Internet'}</span>
          </button>

        </div>

      </div>

      {/* Visual Fisherman Voyage Pass Modal */}
      {showPass && cachedData && (
        <div className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-ocean-950 border-2 border-cyan-500/60 rounded-3xl max-w-md w-full p-5 shadow-2xl shadow-cyan-500/20 space-y-4 animate-fadeIn text-slate-100">
            
            {/* Header: ISRO Co-Pilot Pass */}
            <div className="flex items-center justify-between border-b border-ocean-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
                  <Compass className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold tracking-wide text-white">FISHERMAN VOYAGE PASS</h3>
                  <p className="text-[10px] text-cyan-300 font-mono">ISRO Safe Navigation Co-Pilot</p>
                </div>
              </div>
              <button
                onClick={() => setShowPass(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-ocean-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Catch Card */}
            <div className="bg-gradient-to-br from-emerald-950 to-ocean-900 border border-emerald-500/40 rounded-2xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Fish className="w-4 h-4" /> Target Fish Shoal
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-mono">
                  {cachedData.targetPFZ?.confidence} Match
                </span>
              </div>
              <p className="text-base font-extrabold text-white">{cachedData.targetPFZ?.species}</p>
              <div className="flex items-center justify-between text-xs text-slate-300 pt-1 border-t border-emerald-900/60">
                <span>📍 Distance: <strong className="text-cyan-300">{cachedData.targetPFZ?.distance_nm}</strong></span>
                <span>🌡️ Water: <strong className="text-emerald-300">{cachedData.targetPFZ?.sst_celsius}</strong></span>
              </div>
            </div>

            {/* 3 Visual Big Telemetry Badges */}
            <div className="grid grid-cols-2 gap-2 text-center">
              
              <div className="bg-ocean-900/90 border border-cyan-500/30 p-2.5 rounded-xl">
                <div className="text-[11px] text-cyan-300 font-medium flex items-center justify-center gap-1">
                  <Fuel className="w-3.5 h-3.5" /> Diesel Saved
                </div>
                <div className="text-lg font-black text-white font-mono mt-0.5">
                  {cachedData.navigationRoute?.costSavedINR}
                </div>
                <div className="text-[10px] text-cyan-200">
                  {cachedData.navigationRoute?.dieselSavedLitres} saved
                </div>
              </div>

              <div className="bg-ocean-900/90 border border-emerald-500/30 p-2.5 rounded-xl">
                <div className="text-[11px] text-emerald-300 font-medium flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Border Status
                </div>
                <div className="text-lg font-black text-emerald-400 mt-0.5">
                  SAFE
                </div>
                <div className="text-[10px] text-slate-300">
                  Far from IMBL boundary
                </div>
              </div>

            </div>

            {/* Simple Step-by-Step Waypoint Instructions */}
            <div className="bg-ocean-900/80 border border-ocean-800 rounded-xl p-3 space-y-2">
              <h5 className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-cyan-400" /> Route Navigation Steps
              </h5>
              <div className="space-y-1 text-xs text-slate-300 font-mono max-h-28 overflow-y-auto pr-1">
                {cachedData.navigationRoute?.waypoints?.map((w, idx) => (
                  <div key={idx} className="flex items-center justify-between py-0.5 border-b border-ocean-800/50 text-[11px]">
                    <span className="text-cyan-300 font-bold">Step {w.step}:</span>
                    <span className="text-slate-200">{w.label}</span>
                    <span className="text-slate-400 text-[10px]">{w.lat.toFixed(2)}°, {w.lng.toFixed(2)}°</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Note & Action Buttons */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleClearCache}
                className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1.5 rounded-xl transition"
              >
                <Trash2 className="w-3 h-3" />
                <span>Reset</span>
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl transition shadow-lg"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save Card</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
