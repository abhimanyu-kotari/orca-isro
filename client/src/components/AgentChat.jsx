import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, Sparkles, Bot, User, Radio, Cpu, Layers, ChevronDown, ChevronUp } from 'lucide-react';

export default function AgentChat({ onSendMessage, messages, isProcessing, collaboratingAgents, activeVoiceScript, selectedLang }) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showAgentsTrace, setShowAgentsTrace] = useState(true);
  const messagesEndRef = useRef(null);

  // Suggested Prompts based on ISRO Problem Statement
  const suggestedQueries = [
    { label: '🐟 Nearest PFZ Hotspot', query: 'Where is the nearest Potential Fishing Zone today?' },
    { label: '🌊 Sea Safety & Weather', query: 'Is it safe to venture into the sea tomorrow morning?' },
    { label: '🧭 Fuel-Optimal Route', query: 'Calculate the lowest-fuel current-assisted route to the best Mackerel zone.' },
    { label: '🛡️ IMBL Border Status', query: 'Check distance to international maritime boundary line.' },
    { label: '🔬 Fish Productivity Shift', query: 'Why has fish productivity declined in this coastal region?' }
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
    
    // Set language
    const langMap = {
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
    <div className="bg-ocean-900/85 border border-ocean-700/80 rounded-2xl flex flex-col h-[520px] lg:h-[600px] shadow-2xl overflow-hidden">
      
      {/* Agent Header & Multi-Agent Status */}
      <div className="bg-ocean-950 border-b border-ocean-800 p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider">ORCA Agentic Engine</h2>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            </div>
            <p className="text-[10px] text-cyan-300 font-mono">4 Collaborative Subagents Active</p>
          </div>
        </div>

        <button
          onClick={() => setShowAgentsTrace(!showAgentsTrace)}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 transition bg-ocean-900 px-2 py-1 rounded-lg border border-ocean-700 font-mono"
        >
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>Agents Trace</span>
          {showAgentsTrace ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Subagents Activity Drawer */}
      {showAgentsTrace && collaboratingAgents && (
        <div className="bg-ocean-950/90 border-b border-ocean-800 p-2.5 grid grid-cols-2 gap-1.5 text-[10px] font-mono animate-fadeIn">
          {collaboratingAgents.map((ag, i) => (
            <div key={i} className="bg-ocean-900/70 border border-ocean-800 px-2 py-1 rounded-md flex items-center justify-between">
              <span className="text-cyan-300 truncate max-w-[120px]">{ag.name.replace(' Agent', '')}:</span>
              <span className="text-slate-300 truncate max-w-[140px]">{ag.summary}</span>
            </div>
          ))}
        </div>
      )}

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'agent' && (
              <div className="w-7 h-7 rounded-lg bg-cyan-600/30 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}
            
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-md ${
              m.sender === 'user'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-tr-none font-medium'
                : 'bg-ocean-950/90 text-slate-200 border border-ocean-800 rounded-tl-none'
            }`}>
              <div className="whitespace-pre-wrap">{m.text}</div>
              
              {/* Voice playback button for Agent responses */}
              {m.sender === 'agent' && (
                <div className="mt-2 pt-2 border-t border-ocean-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-[10px] font-mono text-cyan-400">ISRO Evidence-Based Synthesis</span>
                  <button
                    onClick={() => speakText(m.voiceScript || m.text)}
                    className="flex items-center gap-1 text-cyan-300 hover:text-cyan-200 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 transition"
                  >
                    {isSpeaking ? <VolumeX className="w-3 h-3 text-rose-400" /> : <Volume2 className="w-3 h-3" />}
                    <span>{isSpeaking ? 'Stop Audio' : 'Play Voice'}</span>
                  </button>
                </div>
              )}
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 p-2.5 rounded-xl w-fit font-mono">
            <Radio className="w-3.5 h-3.5 animate-spin" />
            <span>Collaborating subagents reasoning over satellite data...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Queries */}
      <div className="px-3 py-1.5 bg-ocean-950/60 border-t border-ocean-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {suggestedQueries.map((s, i) => (
          <button
            key={i}
            onClick={() => onSendMessage(s.query)}
            className="shrink-0 text-[10px] bg-ocean-900 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 px-2.5 py-1 rounded-full border border-ocean-700 transition"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Input Form with Mic */}
      <form onSubmit={handleSend} className="p-3 bg-ocean-950 border-t border-ocean-800 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleListening}
          className={`p-2 rounded-xl border transition ${
            isListening
              ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
              : 'bg-ocean-900 border-ocean-700 text-slate-300 hover:text-cyan-400'
          }`}
          title="Voice Speech Recognition in Regional Language"
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ORCA in English or regional mother tongue...`}
          className="flex-1 bg-ocean-900 border border-ocean-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500 font-medium transition"
        />

        <button
          type="submit"
          disabled={!input.trim() || isProcessing}
          className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white shadow-lg shadow-cyan-500/20 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
