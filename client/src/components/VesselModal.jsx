import React from 'react';
import { Ship, Check, X, Shield, Fuel, Gauge, Award, Sparkles } from 'lucide-react';
import { VESSEL_PROFILES } from '../services/marineEngine';

export default function VesselModal({ isOpen, onClose, selectedVessel, onSelectVessel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#020b17] border border-white/20 rounded-3xl p-5 sm:p-6 shadow-[0_25px_70px_rgba(0,0,0,0.95)] space-y-5 text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/orca_logo.png" 
              alt="Project ORCA Emblem" 
              className="w-11 h-11 rounded-full object-cover border border-emerald-400 shadow-lg shrink-0"
            />
            <div>
              <h3 className="text-sm sm:text-base font-black text-white tracking-wide flex items-center gap-2">
                Fisherman Vessel Profile Setup
              </h3>
              <p className="text-[11px] text-emerald-400 font-mono">Calibrates AI Fuel & Range Computations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Vessel Selection Cards */}
        <div className="space-y-3">
          {Object.entries(VESSEL_PROFILES).map(([key, vessel]) => {
            const isSelected = selectedVessel === key;

            return (
              <div
                key={key}
                onClick={() => {
                  onSelectVessel(key);
                }}
                className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-transparent border-emerald-400 shadow-[0_0_25px_rgba(0,245,160,0.25)]'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{key === 'trawler' ? '🚢' : key === 'fibre' ? '🚤' : '🚣'}</span>
                      <h4 className="text-xs sm:text-sm font-black text-white">{vessel.name}</h4>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[9px] font-black uppercase">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                      <span>Reg: <strong className="text-slate-200">{vessel.vessel_reg}</strong></span>
                      <span>&bull;</span>
                      <span className="truncate">{vessel.gear_type}</span>
                    </div>
                  </div>

                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 ${
                    isSelected ? 'bg-emerald-400 border-emerald-400 text-slate-950' : 'border-white/20 text-transparent'
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>

                {/* Performance & Fuel Specs Grid */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-white/[0.08] text-[10px] font-mono">
                  <div className="bg-white/[0.03] p-2 rounded-xl border border-white/[0.06]">
                    <div className="text-slate-400 flex items-center gap-1"><Fuel className="w-3 h-3 text-cyan-400" /> Fuel Burn</div>
                    <div className="text-xs font-black text-emerald-400 mt-0.5">{vessel.burn_rate_lph} L/hr</div>
                  </div>
                  <div className="bg-white/[0.03] p-2 rounded-xl border border-white/[0.06]">
                    <div className="text-slate-400 flex items-center gap-1"><Gauge className="w-3 h-3 text-amber-400" /> Speed</div>
                    <div className="text-xs font-black text-white mt-0.5">{vessel.cruising_speed_knots} kts</div>
                  </div>
                  <div className="bg-white/[0.03] p-2 rounded-xl border border-white/[0.06]">
                    <div className="text-slate-400 flex items-center gap-1"><Shield className="w-3 h-3 text-rose-400" /> Safe Range</div>
                    <div className="text-xs font-black text-cyan-300 mt-0.5">{vessel.max_range_nm} NM</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info & Confirmation */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <div className="text-[10px] text-slate-400 font-mono">
            <span>🇮🇳 Certified MFV Protocol &bull; Dept of Fisheries</span>
          </div>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:opacity-90 active:scale-95 text-slate-950 font-black text-xs px-5 py-2.5 rounded-2xl shadow-lg shadow-emerald-500/25 transition"
          >
            Apply Vessel Calibration
          </button>
        </div>

      </div>
    </div>
  );
}
