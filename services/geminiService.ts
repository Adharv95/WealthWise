import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserFinancialProfile, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the precise schema for the AI response
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    financialHealthScore: { type: Type.NUMBER, description: "A score from 0 to 100 representing overall financial health." },
    netWorth: { type: Type.NUMBER, description: "Total assets minus total liabilities." },
    monthlyCashFlow: { type: Type.NUMBER, description: "Monthly income minus monthly expenses." },
    debtToIncomeRatio: { type: Type.NUMBER, description: "Percentage (0-100) of monthly income going to debt." },
    savingsRate: { type: Type.NUMBER, description: "Percentage (0-100) of monthly income being saved." },
    summary: { type: Type.STRING, description: "A concise executive summary of the user's financial status." },
    keyInsights: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of 3-5 critical observations about the user's finances."
    },
    actionPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
          impact: { type: Type.STRING, description: "Projected financial impact (e.g., 'Save $500/mo')" }
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
          conservative: { type: Type.NUMBER, description: "Projected net worth with conservative returns (4%)" },
          aggressive: { type: Type.NUMBER, description: "Projected net worth with aggressive returns (8-10%)" }
        },
        required: ["year", "conservative", "aggressive"]
      },
      description: "Projected net worth for the next 10 years."
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
      Act as a senior financial advisor. Analyze the following user financial profile deeply.
      
      User Profile Data:
      ${JSON.stringify(profile, null, 2)}
      
      Provide a comprehensive analysis.
      - Calculate the health score based on savings rate, debt load, and asset diversity.
      - Create a realistic 10-year projection based on their current cash flow and standard market returns.
      - If they have high interest debt, prioritize that in the action plan.
      - Be critical but encouraging.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2, // Low temperature for more analytical/math-based consistency
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    } else {
      throw new Error("No data received from Gemini.");
    }
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};
