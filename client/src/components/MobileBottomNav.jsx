import React from 'react';
import { Map, MessageSquare, Waves, FileText, Mic } from 'lucide-react';

export default function MobileBottomNav({ activeTab, onTabChange, hasUnreadMessages, onVoiceTap }) {
  const navItems = [
    { id: 'map', label: 'Map & Route', icon: Map, emoji: '🗺️' },
    { id: 'chat', label: 'AI Co-Pilot', icon: MessageSquare, emoji: '💬', badge: true },
    { id: 'weather', label: 'Sea Weather', icon: Waves, emoji: '🌊' },
    { id: 'pass', label: 'Voyage Pass', icon: FileText, emoji: '🎫' }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[500] px-3 pb-3 pt-1.5 bg-slate-950/90 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 shadow-[0_0_15px_rgba(0,245,160,0.2)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
                {item.badge && hasUnreadMessages && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'font-black text-emerald-300' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
