import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode, interrogationMode: boolean, onToggleMode: () => void }> = ({ children, interrogationMode, onToggleMode }) => {
  return (
    <div className={`min-h-screen w-full relative overflow-y-auto transition-colors duration-1000 ${interrogationMode ? 'bg-cyber-darker text-cyber-red' : 'bg-cyber-darker text-white'}`}>
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none"></div>
      {interrogationMode && <div className="fixed inset-0 bg-cyber-red/5 pointer-events-none animate-pulse"></div>}
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col min-h-screen">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-mono font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyber-green to-cyber-blue drop-shadow-neon-green">
              AI_LIE_DETECTOR
            </h1>
            <p className="text-sm font-mono text-white/50 mt-1">SYS.VAL.v1.0.4 // LOCAL_INSTANCE</p>
          </div>
          
          <div className="flex items-center gap-3 bg-black/30 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
            <span className={`text-xs font-mono uppercase tracking-widest ${interrogationMode ? 'text-cyber-red font-bold' : 'text-white/40'}`}>
              Interrogation Mode
            </span>
            <button 
              onClick={onToggleMode}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${interrogationMode ? 'bg-cyber-red shadow-neon-red' : 'bg-white/20'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${interrogationMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </header>
        
        <main className="flex-1 flex flex-col gap-8">
          {children}
        </main>

        <footer className="mt-auto pt-16 pb-6 text-center text-xs font-mono text-white/30">
          <p>This tool provides probabilistic analysis using AI models. It is not 100% accurate.</p>
          <p className="mt-1 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse"></span>
            SYSTEM ONLINE
          </p>
        </footer>
      </div>
    </div>
  );
};
