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
        name: harbor?.name || "Mangalore Old Port",
        state: harbor?.state || "Karnataka",
        coordinates: [harbor?.lat, harbor?.lng]
      },
      targetPFZ: {
        id: selectedHotspot?.id || "PFZ-1",
        name: selectedHotspot?.name || "Hotspot A",
        species: selectedHotspot?.primary_species || "Indian Mackerel (ಬಾಂಗ್ಡೆ)",
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
      localStorage.setItem('orca_offline_voyage_package', JSON.stringify(bundle));
      setCachedData(bundle);
      setIsSaved(true);
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
      <div className="bg-marine-900/90 border border-marine-700/80 rounded-3xl p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3.5">
        
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-biolum-teal/20 to-marine-800 border border-biolum-teal/40 flex items-center justify-center text-xl shrink-0 shadow-lg">
            🧭
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-white">Deep-Sea Pre-Trip Offline Pass</h4>
              <span className="text-[10px] bg-biolum-teal/20 text-biolum-teal px-2 py-0.5 rounded-full font-mono font-bold">100% Offline</span>
            </div>
            <p className="text-[11px] text-marine-200 mt-0.5">
              {cachedData ? (
                <span className="text-biolum-emerald font-semibold">✓ Pass Saved &bull; Ready for 0-Internet Sea Voyage</span>
              ) : (
                <span>Download visual pass and waypoints before sailing out of harbor.</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          
          {/* Download for Sea Button */}
          <button
            onClick={handleSaveAndDownload}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 text-xs bg-gradient-to-r from-biolum-teal to-marine-500 hover:from-biolum-aqua hover:to-marine-400 text-marine-950 font-black px-4 py-2.5 rounded-2xl transition shadow-lg shadow-biolum-teal/20"
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4 text-marine-950 animate-bounce" /> : <DownloadCloud className="w-4 h-4" />}
            <span>{isSaved ? 'Pass Created!' : 'Get Fisherman Pass 🎫'}</span>
          </button>

          {/* View Pass Button */}
          {cachedData && (
            <button
              onClick={() => setShowPass(true)}
              className="flex items-center gap-1 text-xs bg-marine-950 hover:bg-marine-800 text-biolum-teal px-3 py-2.5 rounded-2xl border border-marine-700 transition font-bold"
              title="View Visual Fisherman Voyage Pass"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Pass</span>
            </button>
          )}

          {/* 0-Internet Simulator */}
          <button
            onClick={onToggleOffline}
            className={`flex items-center justify-center gap-1.5 text-xs px-3 py-2.5 rounded-2xl border transition font-semibold ${
              isOffline
                ? 'bg-biolum-amber/20 border-biolum-amber text-amber-300'
                : 'bg-marine-950 border-marine-700 text-marine-300 hover:text-white'
            }`}
            title="Toggle Deep-Sea No-Internet Simulator"
          >
            {isOffline ? <WifiOff className="w-4 h-4 text-amber-400" /> : <Wifi className="w-4 h-4 text-marine-400" />}
            <span className="hidden md:inline">{isOffline ? 'Offline Active' : 'Simulate 0-Internet'}</span>
          </button>

        </div>

      </div>

      {/* Visual Fisherman Voyage Pass Modal */}
      {showPass && cachedData && (
        <div className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-marine-950 border-2 border-biolum-teal/60 rounded-3xl max-w-md w-full p-5 shadow-2xl shadow-biolum-teal/20 space-y-4 animate-fadeIn text-slate-100">
            
            {/* Header: ISRO Co-Pilot Pass */}
            <div className="flex items-center justify-between border-b border-marine-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-biolum-teal to-marine-600 flex items-center justify-center text-marine-950 text-2xl font-black shadow-lg">
                  🐋
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-wide text-white">FISHERMAN VOYAGE PASS</h3>
                  <p className="text-[10px] text-biolum-teal font-mono">ISRO Safe Navigation Co-Pilot</p>
                </div>
              </div>
              <button
                onClick={() => setShowPass(false)}
                className="p-1.5 rounded-xl text-marine-300 hover:text-white hover:bg-marine-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Catch Card */}
            <div className="bg-gradient-to-br from-marine-900 via-marine-850 to-marine-950 border border-biolum-teal/40 rounded-2xl p-4 space-y-2 shadow-inner">
              <div className="flex items-center justify-between text-xs text-biolum-teal font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="text-base">🐟</span> Target Marine Shoal
                </span>
                <span className="bg-biolum-teal/20 text-biolum-teal px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                  {cachedData.targetPFZ?.confidence} Match
                </span>
              </div>
              <p className="text-base font-black text-white">{cachedData.targetPFZ?.species}</p>
              <div className="flex items-center justify-between text-xs text-marine-200 pt-1.5 border-t border-marine-800">
                <span>📍 Distance: <strong className="text-biolum-teal">{cachedData.targetPFZ?.distance_nm}</strong></span>
                <span>🌡️ Water Temp: <strong className="text-emerald-400">{cachedData.targetPFZ?.sst_celsius}</strong></span>
              </div>
            </div>

            {/* 2 Visual Big Telemetry Badges */}
            <div className="grid grid-cols-2 gap-2.5 text-center">
              
              <div className="bg-marine-900/90 border border-biolum-aqua/40 p-3 rounded-2xl">
                <div className="text-[11px] text-biolum-aqua font-bold flex items-center justify-center gap-1">
                  <Fuel className="w-3.5 h-3.5" /> Diesel Saved
                </div>
                <div className="text-xl font-black text-white font-mono mt-0.5">
                  {cachedData.navigationRoute?.costSavedINR}
                </div>
                <div className="text-[10px] text-biolum-teal font-medium">
                  {cachedData.navigationRoute?.dieselSavedLitres} saved
                </div>
              </div>

              <div className="bg-marine-900/90 border border-emerald-500/40 p-3 rounded-2xl">
                <div className="text-[11px] text-emerald-300 font-bold flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Border Status
                </div>
                <div className="text-xl font-black text-biolum-emerald mt-0.5">
                  SAFE
                </div>
                <div className="text-[10px] text-marine-200 font-medium">
                  Clear of IMBL line
                </div>
              </div>

            </div>

            {/* Simple Step-by-Step Waypoint Instructions */}
            <div className="bg-marine-900/80 border border-marine-800 rounded-2xl p-3.5 space-y-2">
              <h5 className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-biolum-teal" /> Route Navigation Steps
              </h5>
              <div className="space-y-1.5 text-xs text-marine-200 font-mono max-h-28 overflow-y-auto pr-1">
                {cachedData.navigationRoute?.waypoints?.map((w, idx) => (
                  <div key={idx} className="flex items-center justify-between py-0.5 border-b border-marine-800/50 text-[11px]">
                    <span className="text-biolum-teal font-bold">Step {w.step}:</span>
                    <span className="text-slate-100 font-sans">{w.label}</span>
                    <span className="text-marine-400 text-[10px]">{w.lat.toFixed(2)}°, {w.lng.toFixed(2)}°</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Note & Action Buttons */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleClearCache}
                className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl transition font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-biolum-teal to-marine-500 hover:from-biolum-aqua hover:to-marine-400 text-marine-950 font-black px-4 py-2.5 rounded-2xl transition shadow-lg shadow-biolum-teal/20"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save Card 🖨️</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
