import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
console.log("API_KEY in production:", API_KEY); // ← 追加

const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateGeminiResponse(userMessage) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
    });

    const text = result.response.candidates[0].content.parts[0].text;
    return text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "通信がうまくいかなかったようです。時間をおいてもう一度お試しください。";
  }
}