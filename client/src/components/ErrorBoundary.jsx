import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center text-white">
          <div className="glass-panel p-8 rounded-3xl max-w-md space-y-4 border border-emerald-500/30 shadow-2xl">
            <div className="flex justify-center">
              <img 
                src="/assets/orca_logo.png" 
                alt="Project ORCA Emblem" 
                className="w-16 h-16 rounded-full object-cover border-2 border-emerald-400 shadow-[0_0_25px_rgba(0,245,160,0.5)]"
              />
            </div>
            <h2 className="text-lg font-black text-emerald-400">ORCA System Reconnecting</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              {this.state.error?.message || "Click below to refresh the marine cockpit."}
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 text-xs font-black px-6 py-2.5 rounded-2xl shadow-lg hover:opacity-90 transition"
            >
              Reload Cockpit
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
