
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Transaction, Budget, SavingsGoal } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFinancialAdvice = async (
  transactions: Transaction[],
  budgets: Budget[],
  goals: SavingsGoal[]
) => {
  const model = "gemini-3-flash-preview";
  
  const context = `
    User Transactions: ${JSON.stringify(transactions.slice(0, 20))}
    User Budgets: ${JSON.stringify(budgets)}
    User Goals: ${JSON.stringify(goals)}
  `;

  const prompt = `
    Act as a senior personal finance expert. Analyze the user's financial situation.
    Identify 3 highly specific, actionable insights. 
    Focus on:
    1. A spending leak (where they are overspending).
    2. A savings opportunity (how to reach a goal faster).
    3. A budget health check.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: context + prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              advice: { type: Type.STRING },
              impact: { 
                type: Type.STRING,
                description: "one of: low, medium, high"
              },
            },
            required: ["title", "advice", "impact"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

export const chatWithAdvisorStream = async function* (message: string) {
    const model = "gemini-3-flash-preview";
    const chat = ai.chats.create({
        model,
        config: {
            systemInstruction: "You are FinVise, a professional AI financial advisor. You have access to Google Search for real-time information. Provide expert, data-driven advice. When giving advice on markets or news, cite your sources. Disclaim that you are an AI.",
            tools: [{ googleSearch: {} }]
        }
    });

    const responseStream = await chat.sendMessageStream({ message });
    for await (const chunk of responseStream) {
        const c = chunk as any; // Cast for accessibility to non-standard grounding fields
        const text = c.text || "";
        const groundingChunks = c.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        
        yield { text, sources: groundingChunks.map((chunk: any) => ({
          title: chunk.web?.title || "Source",
          uri: chunk.web?.uri || ""
        })) };
    }
};
