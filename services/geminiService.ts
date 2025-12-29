
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { QuizMode, QuizData } from "../types";

export async function generateQuiz(numQuestions: number, mode: QuizMode): Promise<QuizData> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `Gere um simulador completo com ${numQuestions} questões para o cargo de Técnico do Seguro Social do INSS no modo ${mode}.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION.replace("{{MODO}}", mode),
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const text = response.text || "";
    const cleanedJson = text.trim();
    const data = JSON.parse(cleanedJson);
    return data.quiz;
  } catch (error) {
    console.error("Erro ao gerar quiz:", error);
    throw new Error("Falha ao gerar o simulado. Verifique sua conexão ou tente novamente.");
  }
}
