import React, { useState } from 'react';
import { DownloadCloud, CheckCircle2, HardDrive, WifiOff, Wifi, Sparkles } from 'lucide-react';

export default function OfflineSync({ harbor, selectedHotspot, route, weather, isOffline, onToggleOffline }) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveToLocalStorage = () => {
    const bundle = {
      timestamp: new Date().toISOString(),
      harbor,
      selectedHotspot,
      route,
      weather
    };
    try {
      localStorage.setItem('orca_offline_voyage_package', JSON.stringify(bundle));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-ocean-900/80 border border-ocean-700/80 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
      
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
          <HardDrive className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
            <span>Deep-Sea Pre-Trip Offline Package</span>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded font-mono">100% Offline</span>
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Pre-cache waypoints, bathymetry, and IMBL alarms before departing harbor.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          onClick={handleSaveToLocalStorage}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 text-xs bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold px-3.5 py-2 rounded-xl transition shadow-lg shadow-cyan-500/20"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4 text-slate-950" /> : <DownloadCloud className="w-4 h-4" />}
          <span>{isSaved ? 'Package Saved!' : 'Download for Sea'}</span>
        </button>

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
          <span className="hidden md:inline">{isOffline ? 'Offline Mode Active' : 'Simulate 0-Internet'}</span>
        </button>
      </div>

    </div>
  );
}
