import React from 'react';
import { Fuel, Clock, Shield, CheckCircle2, AlertTriangle, Sparkles, Navigation, Waves } from 'lucide-react';
import { UI_TRANSLATIONS } from '../services/translations';

export default function Telemetry({ route, hotspot, weather, geofence, selectedLang = 'en' }) {
  const t = UI_TRANSLATIONS[selectedLang] || UI_TRANSLATIONS.en;

  const fuelSaved = route?.cost_saved_inr || 2400;
  const litresSaved = route?.diesel_saved_litres_roundtrip || 25.2;
  const savingsPct = route?.fuel_savings_percentage || 28.5;
  const timeSaved = route?.time_saved_minutes_roundtrip || 75;
  const co2Reduction = route?.co2_reduction_kg || 67.5;
  const imblDist = geofence?.nearest_imbl_distance_km || 18.4;
  const imblStatus = geofence?.status || t.safeStatus;

  // Format species name cleanly
  const rawSpecies = hotspot?.primary_species || "Indian Mackerel (ಬಾಂಗ್ಡೆ)";
  const cleanSpecies = rawSpecies.includes('/') 
    ? rawSpecies.split('/')[0].trim() + ')'
    : rawSpecies;

  return (
    <div id="tour-telemetry" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      
      {/* ========================================================================= */}
      {/* 1. TARGET FISH SHOAL CAPSULE (Ocean Green & Bioluminescent Cyan) */}
      {/* ========================================================================= */}
      <div className="glass-panel-interactive rounded-3xl p-4 sm:p-5 flex flex-col justify-between min-h-[130px] sm:min-h-[145px] relative overflow-hidden group border border-emerald-500/35 hover:border-emerald-400/70 transition-all shadow-[0_15px_30px_rgba(0,245,160,0.08)]">
        
        {/* Animated Background Emerald Fish Shoal */}
        <div className="absolute -right-4 -bottom-3 w-32 h-24 pointer-events-none opacity-25 group-hover:opacity-50 transition-opacity duration-500">
          <svg viewBox="0 0 160 100" fill="none" className="w-full h-full text-emerald-400 animate-float">
            <path d="M40,30 C60,20 90,25 110,35 C125,25 140,20 135,35 C140,50 125,45 110,35 C90,45 60,50 40,40 C30,45 20,50 15,35 C20,20 30,25 40,30 Z" fill="currentColor"/>
            <circle cx="50" cy="33" r="2.5" fill="#020712"/>
            <path d="M70,60 C85,52 105,56 120,63 C130,55 142,52 138,63 C142,75 130,71 120,63 C105,71 85,75 70,68 C62,72 55,75 50,63 C55,52 62,55 70,60 Z" fill="currentColor" opacity="0.7"/>
            <path d="M10,70 C22,64 38,67 50,73 C58,67 68,64 65,73 C68,82 58,79 50,73 C38,79 22,82 10,77 C4,80 -2,82 -6,73 C-2,64 4,67 10,70 Z" fill="currentColor" opacity="0.5"/>
            <circle cx="120" cy="20" r="3" fill="#00f5a0" opacity="0.6"/>
            <circle cx="135" cy="15" r="2" fill="#00f5a0" opacity="0.4"/>
            <circle cx="95" cy="45" r="2" fill="#00f5a0" opacity="0.5"/>
          </svg>
        </div>

        {/* Ambient Emerald Glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/15 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition duration-500"></div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between gap-1">
          <span className="text-[11px] sm:text-xs font-black text-emerald-300 flex items-center gap-1.5 drop-shadow">
            <span>🐟</span> <span className="truncate">{t.targetShoal}</span>
          </span>
          <span className="bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-black shadow">
            {hotspot?.confidence_score || 97}%
          </span>
        </div>

        {/* Species Name */}
        <div className="relative z-10 my-1">
          <div className="text-xs sm:text-sm font-black text-white line-clamp-2 leading-tight drop-shadow-md">
            {cleanSpecies}
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="relative z-10 text-[10px] sm:text-[11px] text-slate-300 font-mono flex items-center justify-between border-t border-emerald-500/20 pt-1.5 mt-auto">
          <span className="text-emerald-300 font-bold">{hotspot?.distance_nm || 20} NM offshore</span>
          <span className="text-emerald-400 font-black">{hotspot?.sst_celsius || 27.4}°C</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DIESEL FUEL SAVINGS CAPSULE (Vibrant Amber Gold & Energy Stream) */}
      {/* ========================================================================= */}
      <div className="glass-panel-interactive rounded-3xl p-4 sm:p-5 flex flex-col justify-between min-h-[130px] sm:min-h-[145px] relative overflow-hidden group border border-amber-500/35 hover:border-amber-400/70 transition-all shadow-[0_15px_30px_rgba(245,158,11,0.08)]">
        
        {/* Animated Background Amber Fuel Canister & Hydrodynamic Streamlines */}
        <div className="absolute -right-3 -bottom-2 w-32 h-28 pointer-events-none opacity-25 group-hover:opacity-50 transition-opacity duration-500">
          <svg viewBox="0 0 120 100" fill="none" className="w-full h-full text-amber-400">
            <path d="M-10,30 Q30,10 60,35 T130,25" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6,4" className="animate-pulse-slow"/>
            <path d="M-10,55 Q40,35 75,60 T130,50" stroke="currentColor" strokeWidth="2" strokeDasharray="8,6"/>
            <path d="M-10,80 Q50,60 90,85 T130,75" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M85,35 L95,35 L95,45 L110,45 L110,85 L75,85 L75,45 L85,45 Z" fill="currentColor" opacity="0.35"/>
            <path d="M90,25 L100,25 L100,35 L90,35 Z" fill="currentColor" opacity="0.6"/>
            <circle cx="92" cy="65" r="8" stroke="#fbbf24" strokeWidth="2" opacity="0.8"/>
          </svg>
        </div>

        {/* Ambient Amber Glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/15 rounded-full blur-2xl group-hover:bg-amber-500/30 transition duration-500"></div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between gap-1">
          <span className="text-[11px] sm:text-xs font-black text-amber-300 flex items-center gap-1.5 drop-shadow">
            <Fuel className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-bounce" />
            <span className="truncate">{t.dieselSaved}</span>
          </span>
          <span className="bg-amber-500/25 text-amber-300 border border-amber-400/50 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-black shadow">
            -{savingsPct}%
          </span>
        </div>

        {/* Rupee Value */}
        <div className="relative z-10 my-0.5">
          <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono tracking-tight drop-shadow-md">
            ₹{fuelSaved.toLocaleString()}
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="relative z-10 text-[10px] sm:text-[11px] text-slate-300 font-mono flex items-center justify-between border-t border-amber-500/20 pt-1.5 mt-auto">
          <span className="text-amber-300 font-semibold truncate">+{weather?.ocean_current_knots || 1.35} kts {t.currentDrift}</span>
          <span className="text-amber-400 font-black shrink-0">{litresSaved} L</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. VOYAGE TIME SAVED CAPSULE (Electric Cyan / Sky Blue & Chronometer) */}
      {/* ========================================================================= */}
      <div className="glass-panel-interactive rounded-3xl p-4 sm:p-5 flex flex-col justify-between min-h-[130px] sm:min-h-[145px] relative overflow-hidden group border border-cyan-500/35 hover:border-cyan-400/70 transition-all shadow-[0_15px_30px_rgba(6,182,212,0.08)]">
        
        {/* Animated Background Nautical Chronometer Dial */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 pointer-events-none opacity-25 group-hover:opacity-50 transition-opacity duration-500">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-cyan-400 animate-spin" style={{ animationDuration: '24s' }}>
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4,3"/>
            <circle cx="50" cy="50" r="36" stroke="currentColor" strokeWidth="1"/>
            <path d="M50,15 L50,50 L75,50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            <polygon points="50,5 53,20 50,16 47,20" fill="currentColor"/>
            <polygon points="95,50 80,53 84,50 80,47" fill="currentColor"/>
            <polygon points="50,95 47,80 50,84 53,80" fill="currentColor"/>
            <polygon points="5,50 20,47 16,50 20,53" fill="currentColor"/>
          </svg>
        </div>

        {/* Ambient Cyan Glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/15 rounded-full blur-2xl group-hover:bg-cyan-500/30 transition duration-500"></div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between gap-1">
          <span className="text-[11px] sm:text-xs font-black text-cyan-300 flex items-center gap-1.5 drop-shadow">
            <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">{t.timeSaved}</span>
          </span>
          <span className="bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-black shadow">
            🌿 {co2Reduction}kg
          </span>
        </div>

        {/* Time Value */}
        <div className="relative z-10 my-0.5">
          <div className="text-xl sm:text-2xl font-black text-cyan-300 font-mono tracking-tight drop-shadow-md">
            {timeSaved} mins
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="relative z-10 text-[10px] sm:text-[11px] text-slate-300 font-mono flex items-center justify-between border-t border-cyan-500/20 pt-1.5 mt-auto">
          <span className="text-slate-300">{t.cruisingSpeed}:</span>
          <span className="text-cyan-300 font-black">{route?.effective_speed_knots || 10.4} kts</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. IMBL BORDER SAFETY CAPSULE (Crimson Red / Coral Rose Geofence Guard) */}
      {/* ========================================================================= */}
      <div className="glass-panel-interactive rounded-3xl p-4 sm:p-5 flex flex-col justify-between min-h-[130px] sm:min-h-[145px] relative overflow-hidden group border border-rose-500/40 hover:border-rose-400/80 transition-all shadow-[0_15px_30px_rgba(244,63,94,0.12)]">
        
        {/* Animated Background Crimson Radar Sonar Perimeter Grid */}
        <div className="absolute -right-5 -bottom-5 w-32 h-32 pointer-events-none opacity-25 group-hover:opacity-50 transition-opacity duration-500">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-rose-400">
            <circle cx="65" cy="65" r="45" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6,4" className="animate-pulse"/>
            <circle cx="65" cy="65" r="30" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="65" cy="65" r="15" stroke="currentColor" strokeWidth="2"/>
            <path d="M65,30 L80,35 L80,55 C80,68 65,75 65,75 C65,75 50,68 50,55 L50,35 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.25"/>
            <path d="M58,52 L63,57 L72,46" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Ambient Crimson Rose Glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/20 rounded-full blur-2xl group-hover:bg-rose-500/35 transition duration-500"></div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between gap-1">
          <span className="text-[11px] sm:text-xs font-black text-rose-300 flex items-center gap-1.5 drop-shadow">
            <Shield className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">{t.borderSafety}</span>
          </span>
          <span className="bg-rose-500/25 text-rose-300 border border-rose-400/50 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-black shadow">
            {imblStatus}
          </span>
        </div>

        {/* Border Distance Value */}
        <div className="relative z-10 my-0.5">
          <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight drop-shadow-md">
            {imblDist} km
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="relative z-10 text-[10px] sm:text-[11px] text-slate-300 font-medium flex items-center gap-1 border-t border-rose-500/20 pt-1.5 mt-auto">
          <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className="truncate font-sans font-bold text-rose-300">{t.bufferDistance}: &gt; 15 km</span>
        </div>
      </div>

    </div>
  );
}
