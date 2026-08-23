import React from 'react';
import { Fuel, Clock, Shield, CheckCircle2, AlertTriangle, Sparkles, Navigation, Waves } from 'lucide-react';

export default function Telemetry({ route, hotspot, weather, geofence }) {
  const fuelSaved = route?.cost_saved_inr || 2400;
  const litresSaved = route?.diesel_saved_litres_roundtrip || 25.2;
  const savingsPct = route?.fuel_savings_percentage || 28.5;
  const timeSaved = route?.time_saved_minutes_roundtrip || 75;
  const co2Reduction = route?.co2_reduction_kg || 67.5;
  const imblDist = geofence?.nearest_imbl_distance_km || 18.4;
  const imblStatus = geofence?.status || 'SAFE';

  // Format species name cleanly
  const rawSpecies = hotspot?.primary_species || "Indian Mackerel (ಬಾಂಗ್ಡೆ)";
  const cleanSpecies = rawSpecies.includes('/') 
    ? rawSpecies.split('/')[0].trim() + ')'
    : rawSpecies;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      
      {/* 1. TARGET FISH SHOAL CAPSULE */}
      <div className="glass-panel-interactive rounded-3xl p-4 sm:p-5 flex flex-col justify-between min-h-[125px] sm:min-h-[140px] relative overflow-hidden group">
        
        {/* Animated Background Fish Shoal Illustration */}
        <div className="absolute -right-4 -bottom-3 w-32 h-24 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-500">
          <svg viewBox="0 0 160 100" fill="none" className="w-full h-full text-emerald-400 animate-float">
            {/* Swimming Fish 1 */}
            <path d="M40,30 C60,20 90,25 110,35 C125,25 140,20 135,35 C140,50 125,45 110,35 C90,45 60,50 40,40 C30,45 20,50 15,35 C20,20 30,25 40,30 Z" fill="currentColor"/>
            <circle cx="50" cy="33" r="2.5" fill="#020712"/>
            {/* Swimming Fish 2 (Smaller) */}
            <path d="M70,60 C85,52 105,56 120,63 C130,55 142,52 138,63 C142,75 130,71 120,63 C105,71 85,75 70,68 C62,72 55,75 50,63 C55,52 62,55 70,60 Z" fill="currentColor" opacity="0.7"/>
            {/* Swimming Fish 3 */}
            <path d="M10,70 C22,64 38,67 50,73 C58,67 68,64 65,73 C68,82 58,79 50,73 C38,79 22,82 10,77 C4,80 -2,82 -6,73 C-2,64 4,67 10,70 Z" fill="currentColor" opacity="0.5"/>
            {/* Air Bubbles */}
            <circle cx="120" cy="20" r="3" fill="#00f5a0" opacity="0.6"/>
            <circle cx="135" cy="15" r="2" fill="#00f5a0" opacity="0.4"/>
            <circle cx="95" cy="45" r="2" fill="#00f5a0" opacity="0.5"/>
          </svg>
        </div>

        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400/10 rounded-full blur-2xl group-hover:bg-emerald-400/20 transition duration-500"></div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-between gap-1">
          <span className="text-[11px] sm:text-xs font-bold text-emerald-300 flex items-center gap-1.5 drop-shadow">
            <span>🐟</span> <span className="truncate">Marine Shoal</span>
          </span>
          <span className="bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-black shadow-sm">
            {hotspot?.confidence_score || 97}%
          </span>
        </div>

        <div className="relative z-10 my-1">
          <div className="text-xs sm:text-sm font-black text-white line-clamp-2 leading-tight drop-shadow-md">
            {cleanSpecies}
          </div>
        </div>

        <div className="relative z-10 text-[10px] sm:text-[11px] text-slate-300 font-mono flex items-center justify-between border-t border-white/10 pt-1.5 mt-auto">
          <span className="text-cyan-300 font-bold">{hotspot?.distance_nm || 20} NM offshore</span>
          <span className="text-emerald-300 font-bold">{hotspot?.sst_celsius || 27.4}°C</span>
        </div>
      </div>

      {/* 2. DIESEL FUEL SAVINGS CAPSULE */}
      <div className="glass-panel-interactive rounded-3xl p-4 sm:p-5 flex flex-col justify-between min-h-[125px] sm:min-h-[140px] relative overflow-hidden group">
        
        {/* Animated Background Fuel Vector & Hydrodynamic Current Stream */}
        <div className="absolute -right-3 -bottom-2 w-32 h-28 pointer-events-none opacity-20 group-hover:opacity-45 transition-opacity duration-500">
          <svg viewBox="0 0 120 100" fill="none" className="w-full h-full text-cyan-400">
            {/* Hydrodynamic Streamlines */}
            <path d="M-10,30 Q30,10 60,35 T130,25" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6,4" className="animate-pulse-slow"/>
            <path d="M-10,55 Q40,35 75,60 T130,50" stroke="currentColor" strokeWidth="2" strokeDasharray="8,6"/>
            <path d="M-10,80 Q50,60 90,85 T130,75" stroke="currentColor" strokeWidth="1.5"/>
            {/* Fuel Canister Silhouette */}
            <path d="M85,35 L95,35 L95,45 L110,45 L110,85 L75,85 L75,45 L85,45 Z" fill="currentColor" opacity="0.3"/>
            <path d="M90,25 L100,25 L100,35 L90,35 Z" fill="currentColor" opacity="0.5"/>
            <circle cx="92" cy="65" r="8" stroke="#00d2ff" strokeWidth="2" opacity="0.6"/>
          </svg>
        </div>

        {/* Ambient Cyan Glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/10 rounded-full blur-2xl group-hover:bg-cyan-400/25 transition duration-500"></div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-between gap-1">
          <span className="text-[11px] sm:text-xs font-bold text-cyan-300 flex items-center gap-1.5 drop-shadow">
            <Fuel className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-bounce" />
            <span className="truncate">Fuel Saved</span>
          </span>
          <span className="bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-black shadow-sm">
            -{savingsPct}%
          </span>
        </div>

        <div className="relative z-10 my-0.5">
          <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight drop-shadow-md">
            ₹{fuelSaved.toLocaleString()}
          </div>
        </div>

        <div className="relative z-10 text-[10px] sm:text-[11px] text-slate-300 font-mono flex items-center justify-between border-t border-white/10 pt-1.5 mt-auto">
          <span className="text-cyan-300 font-semibold truncate">+{weather?.ocean_current_knots || 1.35} kts assist</span>
          <span className="text-emerald-300 font-bold shrink-0">{litresSaved} L</span>
        </div>
      </div>

      {/* 3. VOYAGE TIME SAVED CAPSULE */}
      <div className="glass-panel-interactive rounded-3xl p-4 sm:p-5 flex flex-col justify-between min-h-[125px] sm:min-h-[140px] relative overflow-hidden group">
        
        {/* Animated Background Nautical Chronometer Dial */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-500">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-emerald-400 animate-spin" style={{ animationDuration: '24s' }}>
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4,3"/>
            <circle cx="50" cy="50" r="36" stroke="currentColor" strokeWidth="1"/>
            <path d="M50,15 L50,50 L75,50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            {/* Compass Compass Rose Points */}
            <polygon points="50,5 53,20 50,16 47,20" fill="currentColor"/>
            <polygon points="95,50 80,53 84,50 80,47" fill="currentColor"/>
            <polygon points="50,95 47,80 50,84 53,80" fill="currentColor"/>
            <polygon points="5,50 20,47 16,50 20,53" fill="currentColor"/>
          </svg>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/25 transition duration-500"></div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-between gap-1">
          <span className="text-[11px] sm:text-xs font-bold text-emerald-300 flex items-center gap-1.5 drop-shadow">
            <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Time Saved</span>
          </span>
          <span className="bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-black shadow-sm">
            🌿 {co2Reduction}kg
          </span>
        </div>

        <div className="relative z-10 my-0.5">
          <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight drop-shadow-md">
            {timeSaved} mins
          </div>
        </div>

        <div className="relative z-10 text-[10px] sm:text-[11px] text-slate-300 font-mono flex items-center justify-between border-t border-white/10 pt-1.5 mt-auto">
          <span className="text-slate-300">Cruising:</span>
          <span className="text-emerald-300 font-bold">{route?.effective_speed_knots || 10.4} kts</span>
        </div>
      </div>

      {/* 4. IMBL BORDER SAFETY CAPSULE */}
      <div className="glass-panel-interactive rounded-3xl p-4 sm:p-5 flex flex-col justify-between min-h-[125px] sm:min-h-[140px] relative overflow-hidden group">
        
        {/* Animated Background Radar Sonar Perimeter Grid */}
        <div className="absolute -right-5 -bottom-5 w-32 h-32 pointer-events-none opacity-20 group-hover:opacity-45 transition-opacity duration-500">
          <svg viewBox="0 0 100 100" fill="none" className={`w-full h-full ${imblDist > 15 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {/* Concentric Radar Rings */}
            <circle cx="65" cy="65" r="45" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6,4" className="animate-pulse"/>
            <circle cx="65" cy="65" r="30" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="65" cy="65" r="15" stroke="currentColor" strokeWidth="2"/>
            {/* Border Shield Icon */}
            <path d="M65,30 L80,35 L80,55 C80,68 65,75 65,75 C65,75 50,68 50,55 L50,35 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2"/>
            <path d="M58,52 L63,57 L72,46" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Ambient Safety Glow */}
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl transition duration-500 ${
          imblDist > 15 ? 'bg-emerald-400/10 group-hover:bg-emerald-400/25' : 'bg-amber-400/15 group-hover:bg-amber-400/30'
        }`}></div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-between gap-1">
          <span className={`text-[11px] sm:text-xs font-bold flex items-center gap-1.5 drop-shadow ${
            imblDist > 15 ? 'text-emerald-300' : 'text-amber-300'
          }`}>
            <Shield className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">IMBL Border</span>
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-black shadow-sm border ${
            imblDist > 15 
              ? 'bg-emerald-500/25 text-emerald-300 border-emerald-400/40' 
              : 'bg-amber-500/25 text-amber-300 border-amber-400/40'
          }`}>
            {imblStatus}
          </span>
        </div>

        <div className="relative z-10 my-0.5">
          <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight drop-shadow-md">
            {imblDist} km
          </div>
        </div>

        <div className="relative z-10 text-[10px] sm:text-[11px] text-slate-300 font-medium flex items-center gap-1 border-t border-white/10 pt-1.5 mt-auto">
          {imblDist > 15 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
          <span className="truncate font-sans font-semibold">Safe territorial waters</span>
        </div>
      </div>

    </div>
  );
}
