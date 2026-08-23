import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, Sparkles, User, Radio, Cpu, ChevronDown, ChevronUp, Compass, Waves, Fish, Shield } from 'lucide-react';

export default function AgentChat({ onSendMessage, messages, isProcessing, collaboratingAgents, activeVoiceScript, selectedLang }) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showAgentsTrace, setShowAgentsTrace] = useState(true);
  const messagesEndRef = useRef(null);

  // Suggested Prompts themed for Marine & Coastal Fishermen
  const suggestedQueries = [
    { label: '🐟 Nearest Fish Shoal (PFZ)', query: 'Where is the nearest Potential Fishing Zone today?' },
    { label: '🌊 Sea Waves & Weather', query: 'Is it safe to venture into the sea tomorrow morning?' },
    { label: '🧭 Low-Fuel Current Route', query: 'Calculate the lowest-fuel current-assisted route to the best Mackerel zone.' },
    { label: '🛡️ IMBL Border Clearance', query: 'Check distance to international maritime boundary line.' },
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
    <div className="bg-marine-900/90 border border-marine-700/80 rounded-3xl flex flex-col h-[520px] lg:h-[600px] shadow-2xl overflow-hidden">
      
      {/* Marine Co-Pilot Header */}
      <div className="bg-marine-950/95 border-b border-marine-800 p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-biolum-teal to-marine-600 flex items-center justify-center text-marine-950 font-black text-xl shadow-lg shadow-biolum-teal/20">
            🐋
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-black text-white tracking-wider uppercase">ORCA Ocean Co-Pilot</h2>
              <span className="w-2 h-2 rounded-full bg-biolum-teal animate-ping"></span>
            </div>
            <p className="text-[10px] text-biolum-teal font-mono">4 Marine EcoSystem Agents Active</p>
          </div>
        </div>

        <button
          onClick={() => setShowAgentsTrace(!showAgentsTrace)}
          className="flex items-center gap-1 text-[11px] text-marine-300 hover:text-biolum-teal transition bg-marine-900 px-2.5 py-1 rounded-xl border border-marine-700 font-mono"
        >
          <span>Eco Agents</span>
          {showAgentsTrace ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Subagents Activity Drawer */}
      {showAgentsTrace && collaboratingAgents && (
        <div className="bg-marine-950/95 border-b border-marine-800 p-2.5 grid grid-cols-2 gap-2 text-[10px] font-mono animate-fadeIn">
          {collaboratingAgents.map((ag, i) => (
            <div key={i} className="bg-marine-900/80 border border-marine-800 px-2.5 py-1.5 rounded-xl flex items-center justify-between shadow-sm">
              <span className="text-biolum-teal font-bold truncate max-w-[110px]">
                {ag.name.includes('Ocean') ? '🐟 Matsya' : ag.name.includes('Weather') ? '🌊 Vayu' : ag.name.includes('Routing') ? '🧭 Setu' : '🪸 Raksha'}:
              </span>
              <span className="text-marine-200 truncate max-w-[130px]">{ag.summary}</span>
            </div>
          ))}
        </div>
      )}

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'agent' && (
              <div className="w-8 h-8 rounded-2xl bg-marine-800 border border-biolum-teal/40 flex items-center justify-center text-lg shadow shrink-0 mt-0.5">
                🐋
              </div>
            )}
            
            <div className={`max-w-[85%] rounded-3xl px-4 py-3 text-xs leading-relaxed shadow-lg ${
              m.sender === 'user'
                ? 'bg-gradient-to-r from-marine-600 to-biolum-teal text-marine-950 font-bold rounded-tr-none shadow-biolum-teal/20'
                : 'bg-marine-950/95 text-slate-100 border border-marine-700/80 rounded-tl-none'
            }`}>
              <div className="whitespace-pre-wrap">{m.text}</div>
              
              {/* Voice playback button for Agent responses */}
              {m.sender === 'agent' && (
                <div className="mt-2.5 pt-2.5 border-t border-marine-800 flex items-center justify-between text-[11px] text-marine-300">
                  <span className="text-[10px] font-mono text-biolum-teal flex items-center gap-1">
                    <span>🛰️</span> ISRO Marine Synthesis
                  </span>
                  <button
                    onClick={() => speakText(m.voiceScript || m.text)}
                    className="flex items-center gap-1.5 text-biolum-teal hover:text-white bg-biolum-teal/15 hover:bg-biolum-teal/30 px-2.5 py-1 rounded-lg border border-biolum-teal/30 transition font-semibold"
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isSpeaking ? 'Stop Audio' : 'Play Voice'}</span>
                  </button>
                </div>
              )}
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-biolum-aqua to-marine-500 flex items-center justify-center text-marine-950 font-black text-sm shrink-0 mt-0.5 shadow">
                👤
              </div>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center gap-2.5 text-xs text-biolum-teal bg-marine-950/80 border border-biolum-teal/30 p-3 rounded-2xl w-fit font-mono shadow">
            <span className="animate-spin text-sm">🌊</span>
            <span>Collaborative marine agents reasoning over satellite telemetry...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Marine Query Chips */}
      <div className="px-3.5 py-2 bg-marine-950/80 border-t border-marine-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {suggestedQueries.map((s, i) => (
          <button
            key={i}
            onClick={() => onSendMessage(s.query)}
            className="shrink-0 text-[11px] font-medium bg-marine-900 hover:bg-marine-800 text-marine-200 hover:text-biolum-teal px-3 py-1.5 rounded-full border border-marine-700 transition shadow-sm"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Input Form with Microphone */}
      <form onSubmit={handleSend} className="p-3.5 bg-marine-950 border-t border-marine-800 flex items-center gap-2.5">
        <button
          type="button"
          onClick={toggleListening}
          className={`p-2.5 rounded-2xl border transition shadow ${
            isListening
              ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
              : 'bg-marine-900 border-marine-700 text-marine-200 hover:text-biolum-teal hover:border-biolum-teal/50'
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
          className="flex-1 bg-marine-900 border border-marine-700 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-marine-400 outline-none focus:border-biolum-teal font-medium transition shadow-inner"
        />

        <button
          type="submit"
          disabled={!input.trim() || isProcessing}
          className="p-2.5 rounded-2xl bg-gradient-to-r from-biolum-teal to-marine-500 hover:from-biolum-aqua hover:to-marine-400 disabled:opacity-50 text-marine-950 font-black shadow-lg shadow-biolum-teal/20 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
