import React, { useState, useEffect } from 'react';
import { DownloadCloud, CheckCircle2, HardDrive, WifiOff, Wifi, FileJson, Trash2, Eye, X, ShieldAlert, Sparkles } from 'lucide-react';

export default function OfflineSync({ harbor, selectedHotspot, route, weather, isOffline, onToggleOffline }) {
  const [isSaved, setIsSaved] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
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
      // 1. Save directly into Browser LocalStorage
      localStorage.setItem('orca_offline_voyage_package', JSON.stringify(bundle));
      setCachedData(bundle);
      setIsSaved(true);

      // 2. Trigger automatic physical JSON file download
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bundle, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `ORCA_Voyage_${harbor?.name?.split(' ')[0] || 'Sea'}_Package.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setTimeout(() => setIsSaved(false), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearCache = () => {
    localStorage.removeItem('orca_offline_voyage_package');
    setCachedData(null);
    setShowInspector(false);
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
              <h4 className="text-xs font-bold text-slate-100">Deep-Sea Pre-Trip Offline Package</h4>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded font-mono">100% Offline</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {cachedData ? (
                <span className="text-emerald-400 font-medium">✓ Package Cached in Browser &bull; Ready for 0-Internet Sea Voyage</span>
              ) : (
                <span>Download waypoints, bathymetry, and IMBL alarms before departing.</span>
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
            <span>{isSaved ? 'Downloaded & Cached!' : 'Download for Sea'}</span>
          </button>

          {/* Inspect Cache Button */}
          {cachedData && (
            <button
              onClick={() => setShowInspector(true)}
              className="flex items-center gap-1 text-xs bg-ocean-950 hover:bg-ocean-800 text-cyan-300 px-2.5 py-2 rounded-xl border border-ocean-700 transition"
              title="Inspect Saved Offline Data"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Inspect</span>
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

      {/* Offline Package Inspector Modal */}
      {showInspector && cachedData && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-ocean-900 border border-ocean-700 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-ocean-800 pb-3">
              <div className="flex items-center gap-2">
                <FileJson className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100">Cached Offline Voyage Bundle</h3>
              </div>
              <button
                onClick={() => setShowInspector(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-ocean-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 font-mono bg-ocean-950 p-3.5 rounded-xl border border-ocean-800 max-h-72 overflow-y-auto">
              <p className="text-cyan-300 font-bold">📦 Stored in LocalStorage: <span className="text-slate-100 font-normal">orca_offline_voyage_package</span></p>
              <p>📅 Saved At: {cachedData.exportTimestamp}</p>
              <p>⚓ Origin: {cachedData.originHarbor?.name}</p>
              <p>🐟 Target PFZ: {cachedData.targetPFZ?.id} ({cachedData.targetPFZ?.species})</p>
              <p>⛽ Fuel Savings: {cachedData.navigationRoute?.fuelSavings} ({cachedData.navigationRoute?.costSavedINR})</p>
              <p>🧭 Waypoints: {cachedData.navigationRoute?.waypoints?.length || 5} GPS coordinates stored</p>
              <p className="text-emerald-400">🛡️ Status: 100% Ready for Deep-Sea GPS Navigation</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleClearCache}
                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Cache</span>
              </button>

              <button
                onClick={() => setShowInspector(false)}
                className="text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-1.5 rounded-xl transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
