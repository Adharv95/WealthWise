import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserFinancialProfile, AnalysisResult } from "../types";

// The API Key is securely injected via process.env.API_KEY by the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    financialHealthScore: { type: Type.NUMBER, description: "Overall health score 0-100." },
    netWorth: { type: Type.NUMBER, description: "Calculated current net worth." },
    monthlyCashFlow: { type: Type.NUMBER, description: "Income minus all monthly expenses." },
    debtToIncomeRatio: { type: Type.NUMBER, description: "Percentage of income used for debt." },
    savingsRate: { type: Type.NUMBER, description: "Percentage of income saved." },
    summary: { type: Type.STRING, description: "Executive summary (max 3 sentences)." },
    keyInsights: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "3-5 high-level observations."
    },
    actionPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
          impact: { type: Type.STRING }
        },
        required: ["title", "description", "priority", "impact"]
      }
    },
    wealthProjection: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          year: { type: Type.NUMBER },
          conservative: { type: Type.NUMBER },
          aggressive: { type: Type.NUMBER }
        },
        required: ["year", "conservative", "aggressive"]
      }
    },
    expenseBreakdown: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          percentage: { type: Type.NUMBER }
        },
        required: ["category", "percentage"]
      }
    }
  },
  required: [
    "financialHealthScore", "netWorth", "monthlyCashFlow", "debtToIncomeRatio", 
    "savingsRate", "summary", "keyInsights", "actionPlan", "wealthProjection", "expenseBreakdown"
  ]
};

export const analyzeFinances = async (profile: UserFinancialProfile): Promise<AnalysisResult> => {
  try {
    const prompt = `
      As a Principal Wealth Architect, perform a deep audit on this profile:
      ${JSON.stringify(profile, null, 2)}
      
      Instructions:
      1. Health Score: Liquidity weight (30%), Debt weight (40%), Savings weight (30%).
      2. Net Worth: Strict Assets - Liabilities.
      3. Projections: 10 years. Conservative: 4% return. Aggressive: 9% return.
      4. Insights: Focus on tax efficiency, debt cost, and emergency fund status.
      5. Action Plan: Prioritize high-interest debt (>7%) first.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.1,
      }
    });

    if (!response.text) throw new Error("Empty response from advisor");
    return JSON.parse(response.text) as AnalysisResult;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};