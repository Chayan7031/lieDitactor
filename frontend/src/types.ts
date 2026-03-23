export type Verdict = 'Truthful' | 'Doubtful' | 'Likely Deceptive';

export interface AnalysisHighlight {
  sentence: string;
  reason: string;
}

export interface AnalysisResult {
  verdict: Verdict;
  confidence: number;
  summary: string;
  highlights: AnalysisHighlight[];
  behaviorAnalysis: string;
}
