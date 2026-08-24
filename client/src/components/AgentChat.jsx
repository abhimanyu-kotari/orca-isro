import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, Sparkles, Bot, Radio, Cpu, ChevronDown, ChevronUp } from 'lucide-react';

export default function AgentChat({ onSendMessage, messages, isProcessing, collaboratingAgents, activeVoiceScript, selectedLang }) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  // Default closed on mobile so messages have 100% full screen space
  const [showAgentsTrace, setShowAgentsTrace] = useState(false);
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

  // Clean Markdown & Emojis
  const sanitizeText = (str) => {
    if (!str) return '';
    return str
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#/g, '')
      .replace(/•/g, '')
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .trim();
  };

  // High-Reliability Multilingual Speech Synthesizer with Indian Voice Prioritization
  const handlePlayVoice = (msg) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this device.');
      return;
    }

    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const availableVoices = window.speechSynthesis.getVoices();
    
    const langMap = {
      'ta': { code: 'ta-IN', prefix: 'ta', name: 'tamil' },
      'kn': { code: 'kn-IN', prefix: 'kn', name: 'kannada' },
      'tcy': { code: 'kn-IN', prefix: 'kn', name: 'kannada' },
      'te': { code: 'te-IN', prefix: 'te', name: 'telugu' },
      'hi': { code: 'hi-IN', prefix: 'hi', name: 'hindi' },
      'ml': { code: 'ml-IN', prefix: 'ml', name: 'malayalam' },
      'en': { code: 'en-IN', prefix: 'en', name: 'english' }
    };

    const target = langMap[selectedLang] || langMap['en'];

    // 1. Check if device has native voice for target language
    const nativeVoice = availableVoices.find(v => 
      v.lang === target.code || 
      v.lang.toLowerCase().replace('_', '-').startsWith(target.prefix) ||
      v.name.toLowerCase().includes(target.name)
    );

    // 2. Locate Indian female voice
    const indianFemaleVoice = availableVoices.find(v => 
      (v.name.toLowerCase().includes('heera') ||
       v.name.toLowerCase().includes('swara') ||
       v.name.toLowerCase().includes('kalpana') ||
       v.name.toLowerCase().includes('neerja') ||
       (v.lang.includes('IN') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('google'))))
    );

    // 3. Fallback female voice
    const generalFemaleVoice = availableVoices.find(v => 
      v.name.toLowerCase().includes('zira') || 
      v.name.toLowerCase().includes('female') ||
      v.name.toLowerCase().includes('natural')
    );

    let textToSpeak = '';
    let chosenVoice = null;
    let speechLang = target.code;

    if (nativeVoice) {
      textToSpeak = sanitizeText(msg.voiceScript || msg.text);
      chosenVoice = nativeVoice;
      speechLang = target.code;
    } else {
      textToSpeak = sanitizeText(msg.voiceScriptPhonetic || msg.voiceScript || msg.text);
      chosenVoice = indianFemaleVoice || generalFemaleVoice || availableVoices[0];
      speechLang = 'en-IN';
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = speechLang;
    utterance.rate = 0.90;
    utterance.pitch = 1.05;

    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Web Speech Recognition
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
      'ta': 'ta-IN',
      'kn': 'kn-IN',
      'tcy': 'kn-IN',
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
    <div className="glass-panel rounded-2xl sm:rounded-3xl flex flex-col h-[calc(100dvh-170px)] sm:h-[550px] lg:h-[610px] shadow-2xl overflow-hidden w-full border-2 border-white/15">
      
      {/* Header */}
      <div className="bg-[#020b17]/90 border-b border-white/10 p-3 sm:p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <img 
            src="/assets/orca_logo.png" 
            alt="Project ORCA Logo" 
            className="w-9 h-9 rounded-full object-cover border border-emerald-400/60 shadow-[0_0_15px_rgba(0,245,160,0.4)]"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-black text-white tracking-wider uppercase">ORCA AI Co-Pilot</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <p className="text-[10px] text-emerald-400 font-mono">4 Collaborative Agents Active</p>
          </div>
        </div>

        <button
          onClick={() => setShowAgentsTrace(!showAgentsTrace)}
          className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-300 hover:text-white transition bg-white/[0.06] hover:bg-white/[0.12] px-2.5 py-1.5 rounded-xl border border-white/10 font-mono"
        >
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>Agents</span>
          {showAgentsTrace ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Subagents Activity Drawer (Collapsible) */}
      {showAgentsTrace && collaboratingAgents && (
        <div className="bg-slate-950/80 border-b border-white/[0.08] p-2.5 grid grid-cols-2 gap-2 text-[10px] font-mono animate-fadeIn shrink-0">
          {collaboratingAgents.map((ag, i) => (
            <div key={i} className="bg-white/[0.04] border border-white/[0.08] px-2.5 py-1.5 rounded-xl flex items-center justify-between shadow-sm">
              <span className="text-emerald-400 font-bold truncate max-w-[100px]">
                {ag.name.includes('Ocean') ? '🐟 Matsya' : ag.name.includes('Weather') ? '🌊 Vayu' : ag.name.includes('Routing') ? '🧭 Setu' : '🪸 Raksha'}:
              </span>
              <span className="text-slate-300 truncate max-w-[120px]">{ag.summary}</span>
            </div>
          ))}
        </div>
      )}

      {/* Full-Height Messages Thread */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'agent' && (
              <img 
                src="/assets/orca_logo.png" 
                alt="ORCA Assistant" 
                className="w-7 h-7 rounded-full object-cover border border-emerald-500/50 shadow shrink-0 mt-0.5"
              />
            )}
            
            <div className={`max-w-[88%] sm:max-w-[85%] rounded-2xl sm:rounded-3xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs leading-relaxed shadow-lg ${
              m.sender === 'user'
                ? 'bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 font-bold rounded-tr-none shadow-[0_0_20px_rgba(0,245,160,0.25)]'
                : 'bg-white/[0.05] text-slate-100 border border-white/[0.1] rounded-tl-none'
            }`}>
              <div className="whitespace-pre-wrap">{m.text}</div>
              
              {/* Voice playback button for Agent responses */}
              {m.sender === 'agent' && (
                <div className="mt-2.5 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span>🛰️</span> ISRO Synthesis
                  </span>
                  <button
                    onClick={() => handlePlayVoice(m)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border transition font-bold shadow-md ${
                      isSpeaking
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                        : 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border-emerald-500/30 hover:text-white'
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isSpeaking ? 'Stop Audio' : 'Play Voice 🔊'}</span>
                  </button>
                </div>
              )}
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black text-xs shrink-0 mt-0.5 shadow">
                👤
              </div>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 p-2.5 rounded-2xl w-fit font-mono shadow">
            <span className="animate-spin text-sm">🌊</span>
            <span>Reasoning over satellite telemetry...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Query Chips */}
      <div className="px-3 py-2 bg-black/40 border-t border-white/[0.08] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        {suggestedQueries.map((s, i) => (
          <button
            key={i}
            onClick={() => onSendMessage(s.query)}
            className="shrink-0 text-[10px] sm:text-[11px] font-semibold bg-white/[0.05] hover:bg-white/[0.12] text-slate-200 hover:text-emerald-400 px-3 py-1 rounded-full border border-white/[0.1] transition shadow-sm"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Input Box with Microphone */}
      <form onSubmit={handleSend} className="p-2.5 sm:p-3 bg-[#020b17] border-t border-white/10 flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={toggleListening}
          className={`p-2.5 sm:p-3 rounded-2xl border transition shadow shrink-0 ${
            isListening
              ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
              : 'bg-white/[0.06] border-white/15 text-slate-300 hover:text-emerald-400'
          }`}
          title="Speak in Kannada, Tamil, Telugu, Hindi, or English"
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ORCA in Kannada, Tamil, Hindi, or English...`}
          className="flex-1 bg-white/[0.05] border border-white/15 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 outline-none focus:border-emerald-400 font-medium transition shadow-inner"
        />

        <button
          type="submit"
          disabled={!input.trim() || isProcessing}
          className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-500 hover:opacity-90 disabled:opacity-40 text-slate-950 font-black shadow-lg shadow-emerald-500/20 transition shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
