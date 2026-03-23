import OpenAI from 'openai';
import type { AnalysisResult } from '../types';

export const analyzeText = async (text: string, apiKey: string): Promise<AnalysisResult> => {
  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true, // Needed for purely frontend apps
  });

  const prompt = `You are an advanced AI lie detector and psychological analyzer.
Analyze the following text/message and output ONLY a JSON object with this exact structure (no markdown fences, just pure JSON). Be rigorous, calculating a probability.
{
  "verdict": "Truthful" | "Doubtful" | "Likely Deceptive",
  "confidence": number, // 0-100 percentage
  "summary": "Short explanation of the verdict",
  "highlights": [
    { "sentence": "The EXACT suspicious sentence or phrase from the text", "reason": "Why it's suspicious based on behavioral/psychological cues" }
  ],
  "behaviorAnalysis": "Brief psychological/behavioral analysis of the text's tone. Feel free to use an intense interrogation tone."
}

Text to analyze:
"${text.replace(/"/g, '\\"')}"`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You strictly output raw JSON without markdown formatting. You are an interrogation AI." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
    });

    const resultStr = response.choices[0]?.message?.content?.trim() || "{}";
    const cleanStr = resultStr.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
    return JSON.parse(cleanStr) as AnalysisResult;
  } catch (error) {
    console.error("OpenAI Error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to analyze text");
  }
};
