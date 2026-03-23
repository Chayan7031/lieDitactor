import { useState } from 'react';
import { Layout } from './components/Layout';
import { InputArea } from './components/InputArea';
import { ResultsDisplay } from './components/ResultsDisplay';
import { analyzeText } from './api/gemini';
import type { AnalysisResult } from './types';
import { AlertCircle } from 'lucide-react';

function App() {
  const [interrogationMode, setInterrogationMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [originalText, setOriginalText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string) => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    setOriginalText(text);

    try {
      const data = await analyzeText(text);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze text. Please check connection.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout interrogationMode={interrogationMode} onToggleMode={() => setInterrogationMode(!interrogationMode)}>
      <InputArea 
        onAnalyze={handleAnalyze} 
        isLoading={isLoading} 
        interrogationMode={interrogationMode}
      />
      
      {error && (
        <div className="glass-panel border-cyber-red/50 p-4 text-cyber-red font-mono flex items-start gap-4 shadow-[0_0_20px_rgba(255,0,60,0.15)] mt-4">
          <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold tracking-widest block mb-1">SYSTEM_ERROR</span>
            <span className="text-sm opacity-90">{error}</span>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-8">
          <ResultsDisplay 
            result={result} 
            originalText={originalText} 
            interrogationMode={interrogationMode}
          />
        </div>
      )}
    </Layout>
  );
}

export default App;
