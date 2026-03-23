import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AnalysisResult } from '../types';

// Provided by the user directly for the app
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_GOOGLE_API_KEY is not defined. Please check your .env file at the project root.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzeText = async (text: string): Promise<AnalysisResult> => {
  const modelsToTry = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-pro"
  ];

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`Attempting analysis with model: ${modelName} (v1)`);
      // Explicitly set apiVersion to 'v1' to avoid 404 on v1beta
      const model = genAI.getGenerativeModel({ model: modelName }, { apiVersion: 'v1' });

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

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
        }
      });

      const responseText = result.response.text();
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}');

      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("Invalid JSON format in model response.");
      }

      const cleanStr = responseText.substring(jsonStart, jsonEnd + 1);
      console.log(`Successfully analyzed using ${modelName}`);
      return JSON.parse(cleanStr) as AnalysisResult;

    } catch (error: any) {
      console.warn(`Model ${modelName} failed:`, error.message);
      lastError = error;
      // Continue to next model if it's a 404 or transient error
      if (error.message.includes("404") || error.message.includes("500") || error.message.includes("503")) {
        continue;
      }
      // If it's a 403 (Auth), don't bother trying others
      if (error.message.includes("403")) {
        break;
      }
    }
  }

  // If all models failed
  console.error("All Gemini models failed:", lastError);
  if (lastError?.message?.includes("403")) {
    throw new Error("Invalid Gemini API Key or access denied. Please verify your billing/quota.");
  }
  throw new Error(`Gemini API Error: ${lastError?.message || "All models failed"}. Please ensure your API key is valid and has access to Gemini 1.5.`);
};
