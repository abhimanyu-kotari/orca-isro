import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, Sparkles, Bot, Radio, Cpu, ChevronDown, ChevronUp } from 'lucide-react';

export default function AgentChat({ onSendMessage, messages, isProcessing, collaboratingAgents, activeVoiceScript, selectedLang }) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showAgentsTrace, setShowAgentsTrace] = useState(true);
  const messagesEndRef = useRef(null);

  // Suggested Prompts based on ISRO Problem Statement
  const suggestedQueries = [
    { label: '🐟 Nearest Fish Shoal (PFZ)', query: 'Where is the nearest Potential Fishing Zone today?' },
    { label: '🌊 Sea Waves & Weather', query: 'Is it safe to venture into the sea tomorrow morning?' },
    { label: '🧭 Low-Fuel Current Route', query: 'Calculate the lowest-fuel current-assisted route to the best Mackerel zone.' },
    { label: '🛡️ IMBL Border Status', query: 'Check distance to international maritime boundary line.' },
    { label: '🪸 Marine EcoSystem Shift', query: 'Why has fish productivity declined in this coastal region?' }
  ];

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Web Speech Synthesis (Text to Speech in Regional Languages)
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    
    const langMap = {
      'kn': 'kn-IN',
      'tcy': 'kn-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'hi': 'hi-IN',
      'ml': 'ml-IN',
      'en': 'en-IN'
    };
    utterance.lang = langMap[selectedLang] || 'en-IN';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Web Speech Recognition (Voice to Text)
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    const langMap = {
      'kn': 'kn-IN',
      'tcy': 'kn-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'hi': 'hi-IN',
      'ml': 'ml-IN',
      'en': 'en-IN'
    };
    recognition.lang = langMap[selectedLang] || 'en-IN';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      onSendMessage(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (!input.trim() || isProcessing) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="glass-panel rounded-3xl flex flex-col h-[520px] lg:h-[600px] shadow-2xl overflow-hidden">
      
      {/* Header */}
      <div className="bg-white/[0.03] border-b border-white/[0.08] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-slate-950 text-xl font-black shadow-[0_0_20px_rgba(0,245,160,0.35)]">
            🐋
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-black text-white tracking-wider uppercase">ORCA Conversational Co-Pilot</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <p className="text-[10px] text-emerald-400 font-mono">4 Collaborative Agents Active</p>
          </div>
        </div>

        <button
          onClick={() => setShowAgentsTrace(!showAgentsTrace)}
          className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white transition bg-white/[0.05] hover:bg-white/[0.08] px-3 py-1.5 rounded-xl border border-white/10 font-mono"
        >
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>Agents</span>
          {showAgentsTrace ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Subagents Activity Drawer */}
      {showAgentsTrace && collaboratingAgents && (
        <div className="bg-slate-950/60 border-b border-white/[0.06] p-3 grid grid-cols-2 gap-2 text-[10px] font-mono animate-fadeIn">
          {collaboratingAgents.map((ag, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/[0.06] px-2.5 py-1.5 rounded-xl flex items-center justify-between shadow-sm">
              <span className="text-emerald-400 font-bold truncate max-w-[110px]">
                {ag.name.includes('Ocean') ? '🐟 Matsya' : ag.name.includes('Weather') ? '🌊 Vayu' : ag.name.includes('Routing') ? '🧭 Setu' : '🪸 Raksha'}:
              </span>
              <span className="text-slate-300 truncate max-w-[130px]">{ag.summary}</span>
            </div>
          ))}
        </div>
      )}

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'agent' && (
              <div className="w-8 h-8 rounded-2xl bg-white/[0.06] border border-emerald-500/30 flex items-center justify-center text-lg shadow shrink-0 mt-0.5">
                🐋
              </div>
            )}
            
            <div className={`max-w-[85%] rounded-3xl px-4 py-3 text-xs leading-relaxed shadow-lg ${
              m.sender === 'user'
                ? 'bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 font-bold rounded-tr-none shadow-[0_0_25px_rgba(0,245,160,0.25)]'
                : 'bg-white/[0.04] text-slate-100 border border-white/[0.08] rounded-tl-none'
            }`}>
              <div className="whitespace-pre-wrap">{m.text}</div>
              
              {/* Voice playback button for Agent responses */}
              {m.sender === 'agent' && (
                <div className="mt-3 pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span>🛰️</span> ISRO Evidence-Based Synthesis
                  </span>
                  <button
                    onClick={() => speakText(m.voiceScript || m.text)}
                    className="flex items-center gap-1.5 text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-xl border border-emerald-500/25 transition font-semibold"
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isSpeaking ? 'Stop Audio' : 'Play Voice'}</span>
                  </button>
                </div>
              )}
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black text-sm shrink-0 mt-0.5 shadow">
                👤
              </div>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center gap-2.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-2xl w-fit font-mono shadow">
            <span className="animate-spin text-sm">🌊</span>
            <span>Collaborative marine agents reasoning over satellite telemetry...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Query Chips */}
      <div className="px-4 py-2.5 bg-white/[0.02] border-t border-white/[0.06] flex items-center gap-2 overflow-x-auto no-scrollbar">
        {suggestedQueries.map((s, i) => (
          <button
            key={i}
            onClick={() => onSendMessage(s.query)}
            className="shrink-0 text-[11px] font-semibold bg-white/[0.04] hover:bg-white/[0.09] text-slate-300 hover:text-emerald-400 px-3.5 py-1.5 rounded-full border border-white/[0.08] transition shadow-sm"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Input Box with Microphone */}
      <form onSubmit={handleSend} className="p-3.5 bg-white/[0.03] border-t border-white/[0.08] flex items-center gap-2.5">
        <button
          type="button"
          onClick={toggleListening}
          className={`p-3 rounded-2xl border transition shadow ${
            isListening
              ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
              : 'bg-white/[0.04] border-white/10 text-slate-300 hover:text-emerald-400 hover:border-emerald-400/40'
          }`}
          title="Speak in English, ಕನ್ನಡ, ತುಳು, or mother tongue"
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ORCA in English, ಕನ್ನಡ, ತುಳು, or mother tongue...`}
          className="flex-1 bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-400 font-medium transition shadow-inner"
        />

        <button
          type="submit"
          disabled={!input.trim() || isProcessing}
          className="p-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-500 hover:opacity-90 disabled:opacity-50 text-slate-950 font-black shadow-lg shadow-emerald-500/20 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
