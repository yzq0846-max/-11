import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateHolidayWish = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Write a very short, elegant, single-sentence luxury Christmas greeting in Chinese suitable for a high-end jewelry brand. Keep it poetic and under 20 Chinese characters.",
      config: {
        temperature: 0.9,
      }
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Failed to generate wish (API might be blocked in region):", error);
    // Fallback message in Chinese for users without VPN
    return "星光璀璨，共颂优雅圣洁。圣诞快乐。";
  }
};