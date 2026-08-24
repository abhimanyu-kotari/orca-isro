import React from 'react';
import { Ship, Check, X, Shield, Fuel, Gauge, Award, Sparkles } from 'lucide-react';
import { VESSEL_PROFILES } from '../services/marineEngine';

export default function VesselModal({ isOpen, onClose, selectedVessel, onSelectVessel }) {
  if (!isOpen) return null;

  // Vessel image mapping
  const vesselImages = {
    trawler: '/assets/vessel_trawler.png',
    fibre: '/assets/vessel_fibre.png',
    country: '/assets/vessel_country.png'
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#020b17] border-2 border-white/20 rounded-3xl p-5 sm:p-6 shadow-[0_25px_80px_rgba(0,0,0,0.98)] space-y-4 text-white ring-1 ring-emerald-500/20">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/15 pb-3.5">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/orca_logo.png" 
              alt="Project ORCA Emblem" 
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shadow-[0_0_20px_rgba(0,245,160,0.4)] shrink-0"
            />
            <div>
              <h3 className="text-sm sm:text-base font-black text-white tracking-wide flex items-center gap-2">
                Fisherman Vessel Profile Setup
              </h3>
              <p className="text-[11px] text-emerald-400 font-mono">Calibrates AI Fuel Burn, Speed & Safe Coastal Range</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vessel Selection Cards with Custom Image Backgrounds */}
        <div className="space-y-3">
          {Object.entries(VESSEL_PROFILES).map(([key, vessel]) => {
            const isSelected = selectedVessel === key;
            const bgImg = vesselImages[key] || vesselImages.trawler;

            return (
              <div
                key={key}
                onClick={() => {
                  onSelectVessel(key);
                }}
                className={`cursor-pointer rounded-2xl transition-all duration-300 relative overflow-hidden p-4 ${
                  isSelected
                    ? 'border-2 border-emerald-400 shadow-[0_0_30px_rgba(0,245,160,0.35)] ring-1 ring-emerald-400/50'
                    : 'border border-white/20 hover:border-emerald-400/60 hover:shadow-lg'
                }`}
                style={{
                  backgroundImage: isSelected
                    ? `linear-gradient(90deg, rgba(2, 11, 23, 0.98) 0%, rgba(2, 11, 23, 0.88) 55%, rgba(0, 245, 160, 0.22) 100%), url('${bgImg}')`
                    : `linear-gradient(90deg, rgba(2, 11, 23, 0.96) 0%, rgba(2, 11, 23, 0.82) 58%, rgba(2, 11, 23, 0.35) 100%), url('${bgImg}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'right center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {/* Top Row: Vessel Title & Registration */}
                <div className="flex items-start justify-between gap-3 relative z-10">
                  <div className="space-y-1 max-w-[85%]">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{key === 'trawler' ? '🚢' : key === 'fibre' ? '🚤' : '🚣'}</span>
                      <h4 className="text-xs sm:text-sm font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
                        {vessel.name}
                      </h4>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[9px] font-black uppercase shadow">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono flex items-center gap-2 drop-shadow">
                      <span>Reg: <strong className="text-emerald-300 font-bold">{vessel.vessel_reg}</strong></span>
                      <span>&bull;</span>
                      <span className="truncate text-slate-200">{vessel.gear_type}</span>
                    </div>
                  </div>

                  {/* Radio / Check Circle */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 transition-all ${
                    isSelected ? 'bg-emerald-400 border-emerald-400 text-slate-950 shadow-[0_0_15px_rgba(0,245,160,0.8)]' : 'border-white/30 bg-black/40 text-transparent'
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>

                {/* Performance & Fuel Specs Grid with High-Contrast Solid Badges */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-white/15 text-[10px] font-mono relative z-10">
                  <div className="bg-black/80 backdrop-blur-md p-2 rounded-xl border border-white/15 shadow-sm">
                    <div className="text-slate-300 flex items-center gap-1 font-bold">
                      <Fuel className="w-3 h-3 text-cyan-400" /> Fuel Burn
                    </div>
                    <div className="text-xs font-black text-emerald-400 mt-0.5">{vessel.burn_rate_lph} L/hr</div>
                  </div>

                  <div className="bg-black/80 backdrop-blur-md p-2 rounded-xl border border-white/15 shadow-sm">
                    <div className="text-slate-300 flex items-center gap-1 font-bold">
                      <Gauge className="w-3 h-3 text-amber-400" /> Speed
                    </div>
                    <div className="text-xs font-black text-white mt-0.5">{vessel.cruising_speed_knots} kts</div>
                  </div>

                  <div className="bg-black/80 backdrop-blur-md p-2 rounded-xl border border-white/15 shadow-sm">
                    <div className="text-slate-300 flex items-center gap-1 font-bold">
                      <Shield className="w-3 h-3 text-rose-400" /> Safe Range
                    </div>
                    <div className="text-xs font-black text-cyan-300 mt-0.5">{vessel.max_range_nm} NM</div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Footer info & Confirmation */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/10">
          <div className="text-[10px] text-slate-300 font-mono">
            <span>🇮🇳 Certified MFV Protocol &bull; Dept of Fisheries</span>
          </div>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:opacity-90 active:scale-95 text-slate-950 font-black text-xs px-6 py-2.5 rounded-2xl shadow-xl shadow-emerald-500/25 transition"
          >
            Apply Vessel Calibration
          </button>
        </div>

      </div>
    </div>
  );
}
