import React, { useState } from 'react';
import { Activity, Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface InputAreaProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
  interrogationMode: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onAnalyze, isLoading, interrogationMode }) => {
  const [text, setText] = useState('');

  const handleAnalyze = () => {
    if (!text.trim()) return;
    onAnalyze(text);
  };

  const activeColor = interrogationMode ? 'cyber-red' : 'cyber-blue';

  return (
    <div className="w-full flex flex-col gap-4 relative z-20">
      {/* Main Input */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={['glass-panel overflow-hidden group border-white/20 transition-all duration-300', text.length > 0 ? `border-${activeColor}/50 shadow-[0_0_20px_rgba(0,240,255,0.1)]` : ''].join(' ')}
      >
        {isLoading && <div className="scanline" />}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type statement/chat here for analysis..."
          disabled={isLoading}
          className="w-full h-40 sm:h-52 bg-transparent text-white placeholder-white/20 p-6 resize-none outline-none font-sans text-lg focus:ring-0"
        />
        
        <div className="flex justify-between items-center px-4 py-3 border-t border-white/10 bg-black/40 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-white/40 text-xs font-mono">
            {isLoading ? (
              <Activity className={['w-4 h-4 animate-pulse', `text-${activeColor}`].join(' ')} />
            ) : (
              <Activity className="w-4 h-4" />
            )}
            <span>{text.length} CHARS</span>
          </div>
          
          <button
            onClick={handleAnalyze}
            disabled={isLoading || !text.trim()}
            className={['flex items-center gap-2 px-6 py-2.5 rounded-lg font-mono text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed', isLoading ? 'bg-white/5 text-white/50' : `bg-white/10 hover:bg-${activeColor}/20 text-white border border-white/20 hover:border-${activeColor} hover:shadow-[0_0_15px_var(--tw-shadow-color)] shadow-${activeColor}`].join(' ')}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>ANALYZING...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>INITIATE_SCAN</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
