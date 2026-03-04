import Groq from "groq-sdk";
import { ComparisonData, PriceResult } from "../types";
import { generateSearchUrl, shouldExcludeStore } from "./urlUtils";
import localData from "../petprice_data.json";

// ---------------------------------------------------------------------------
// Configuración - EXCLUSIVA PARA GROQ CLOUD
// ---------------------------------------------------------------------------
const getGroqClient = () => {
  const GROQ_API_KEY = (import.meta as any).env?.VITE_GROQ_API_KEY || (process as any).env?.VITE_GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    console.warn("GROQ_API_KEY no encontrada. La IA estará desactivada.");
    return null;
  }

  return new Groq({
    apiKey: GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  });
};

const groq = getGroqClient();

import { searchLocalProducts } from "./searchUtils";

const SYSTEM_INSTRUCTION = (query: string) =>
  `Eres un experto en precios de productos para mascotas (alimento y accesorios) en Montevideo. Analiza "${query}". 
Solo usa datos reales. Responde estrictamente en JSON:
{"results":[{"storeName":"X","productName":"Y","price":123,"currency":"UYU","isOnline":true,"isPhysical":false,"lastUpdated":"2026"}],"analysis":"..."}`;

// ---------------------------------------------------------------------------
// Función Principal
// ---------------------------------------------------------------------------
export const searchPricesInMontevideo = async (query: string): Promise<ComparisonData> => {
  const localResults = searchLocalProducts(query);

  try {
    if (!groq) {
      throw new Error("Cliente Groq no inicializado (falta API Key)");
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION(query) },
        { role: "user", content: `Encuentra precios para: ${query}` },
      ],
      // Usamos un modelo potente de Groq Cloud
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      max_tokens: 1024,
    });

    const raw = chatCompletion.choices[0]?.message?.content || "{}";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    let aiResults: PriceResult[] = [];
    let analysis = "Resultados obtenidos mediante IA (Groq Cloud).";

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      analysis = parsed.analysis || analysis;
      aiResults = (parsed.results || [])
        .filter((r: any) => !shouldExcludeStore(r.storeName, query))
        .map((r: any) => ({
          ...r,
          price: Number(r.price),
          link: generateSearchUrl(r.storeName, query)
        }));
    }

    const seenStoreProduct = new Set(localResults.map(r => `${r.storeName}-${r.productName}`));
    const uniqueAiResults = aiResults.filter(r => !seenStoreProduct.has(`${r.storeName}-${r.productName}`));

    return {
      results: [...localResults, ...uniqueAiResults].sort((a, b) => a.price - b.price),
      sources: [],
      analysis
    };

  } catch (error) {
    console.error("Error en Groq Cloud:", error);
    return {
      results: localResults.sort((a, b) => a.price - b.price),
      sources: [],
      analysis: "Mostrando resultados de la base de datos local."
    };
  }
};

