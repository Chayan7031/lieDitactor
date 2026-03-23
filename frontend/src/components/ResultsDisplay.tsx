import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, ShieldAlert, Cpu } from 'lucide-react';
import type { AnalysisResult, AnalysisHighlight } from '../types';

interface ResultsDisplayProps {
  result: AnalysisResult | null;
  originalText: string;
  interrogationMode: boolean; // Retained to avoid breaking App.tsx API
}

const TypingEffect: React.FC<{ text: string, speed?: number }> = ({ text, speed = 20 }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayedText}</span>;
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, originalText }) => {
  if (!result) return null;

  const getVerdictStyle = () => {
    switch (result.verdict) {
      case 'Truthful': return { color: 'text-cyber-green', bg: 'bg-cyber-green/10', border: 'border-cyber-green', icon: <ShieldCheck className="w-8 h-8 text-cyber-green" /> };
      case 'Doubtful': return { color: 'text-cyber-yellow', bg: 'bg-cyber-yellow/10', border: 'border-cyber-yellow', icon: <AlertTriangle className="w-8 h-8 text-cyber-yellow" /> };
      case 'Likely Deceptive': return { color: 'text-cyber-red', bg: 'bg-cyber-red/10', border: 'border-cyber-red', icon: <ShieldAlert className="w-8 h-8 text-cyber-red" /> };
      default: return { color: 'text-white', bg: 'bg-white/10', border: 'border-white', icon: <Cpu className="w-8 h-8 text-white" /> };
    }
  };

  const style = getVerdictStyle();

  const highlightText = (text: string, highlights: AnalysisHighlight[]) => {
    if (!highlights || highlights.length === 0) return text;
    
    let highlightedText = text;
    const sortedHighlights = [...highlights].sort((a, b) => b.sentence.length - a.sentence.length);
    
    sortedHighlights.forEach((h, index) => {
      const escaped = h.sentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'gi');
      
      const replacement = `___MARKER_${index}___`;
      highlightedText = highlightedText.replace(regex, replacement);
    });

    sortedHighlights.forEach((h, index) => {
      const escapedReason = h.reason.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
      const htmlBlock = `<span class="bg-cyber-red/30 border-b border-cyber-red text-white cursor-help group relative transition-colors hover:bg-cyber-red/50">${h.sentence}<span class="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-black border border-cyber-red rounded shadow-[0_0_15px_rgba(255,0,60,0.3)] text-xs text-left z-50 font-mono"><span class="text-cyber-red font-bold block mb-1">FLAGGED:</span>${escapedReason}</span></span>`;
      highlightedText = highlightedText.replace(new RegExp(`___MARKER_${index}___`, 'g'), htmlBlock);
    });

    return highlightedText;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className={`glass-panel p-6 border ${style.border}/50 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 relative overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(var(--tw-border-opacity),var(--tw-border-color))]`}>
        <div className={`absolute top-0 left-0 w-1 h-full ${style.bg} opacity-50`}></div>
        <div className={`p-4 rounded-full ${style.bg} border ${style.border}/30 shrink-0`}>
          {style.icon}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-mono text-white/50 mb-1 tracking-widest text-xs uppercase">Analysis Verdict</h2>
          <div className={`text-4xl md:text-5xl font-bold font-mono tracking-tight uppercase ${style.color} drop-shadow-[0_0_10px_currentColor]`}>
            {result.verdict}
          </div>
        </div>
        <div className="sm:text-right mt-4 sm:mt-0 bg-black/30 p-4 rounded-lg border border-white/5 shrink-0">
          <div className="text-xs font-mono text-white/50 mb-1 tracking-widest">CONFIDENCE_SYS</div>
          <div className={`text-4xl font-mono ${style.color}`}>
            {result.confidence}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 border-t-2 border-t-cyber-blue relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-blue/5 rounded-bl-[100px] pointer-events-none group-hover:bg-cyber-blue/10 transition-colors"></div>
          <h3 className="flex items-center gap-2 font-mono text-sm text-cyber-blue mb-4 border-b border-white/10 pb-3">
            <Cpu className="w-4 h-4" />
            EXECUTIVE_SUMMARY
          </h3>
          <p className="text-sm leading-relaxed font-mono relative z-10 text-white/90">
            <TypingEffect text={result.summary} speed={20} />
          </p>
        </div>

        <div className="glass-panel p-6 border-t-2 border-t-cyber-red relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-red/5 rounded-bl-[100px] pointer-events-none group-hover:bg-cyber-red/10 transition-colors"></div>
          <h3 className="flex items-center gap-2 font-mono text-sm text-cyber-red mb-4 border-b border-white/10 pb-3">
            <AlertTriangle className="w-4 h-4" />
            PSYCH_EVALUATION
          </h3>
          <p className="text-sm leading-relaxed font-mono text-white/90 relative z-10">
            <TypingEffect text={result.behaviorAnalysis} speed={20} />
          </p>
        </div>
      </div>

      <div className="glass-panel p-6 border-l-2 border-l-cyber-yellow group">
        <h3 className="font-mono text-sm text-cyber-yellow mb-4 border-b border-white/10 pb-3 flex items-center gap-2">
           <ShieldAlert className="w-4 h-4" />
           SOURCE_MATERIAL & NOTABLE_FLAGS
        </h3>
        <div 
          className="font-sans text-lg leading-relaxed whitespace-pre-wrap p-5 bg-black/40 rounded-lg border border-white/5 group-hover:border-white/10 transition-colors"
          dangerouslySetInnerHTML={{ __html: highlightText(originalText, result.highlights || []) }}
        />
        <div className="mt-4 flex gap-4 text-xs font-mono text-white/40">
           <span className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-cyber-red animate-pulse shadow-[0_0_5px_#ff003c]"></span> 
             Suspicious Pattern Detected (Hover for details)
           </span>
        </div>
      </div>
    </motion.div>
  );
};
