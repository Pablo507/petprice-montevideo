import { PriceResult } from "../types";
import { generateSearchUrl } from "./urlUtils";
import localData from "../petprice_data.json";

/**
 * Normaliza una cadena para búsqueda: minúsculas, elimina tildes y caracteres especiales.
 */
export function normalizeString(str: string): string {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9.]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * Extrae números y unidades comunes de peso de una consulta.
 */
export function parseWeightTérminos(query: string): string[] {
    const normalized = query.toLowerCase();
    const terms: string[] = [];

    // Busca patrones como "1.5kg", "1,5 kg", "500g"
    const weightRegex = /(\d+[.,]?\d*)\s*(kg|g|kilogramos|gramos|k)/gi;
    let match;
    while ((match = weightRegex.exec(normalized)) !== null) {
        let value = match[1].replace(",", ".");
        terms.push(value);
        // También agregamos la forma completa (ej: "1.5kg") para saltarla en las keywords
        terms.push(match[0].replace(/\s+/g, ""));
    }

    // También extrae números sueltos que podrían ser pesos
    const loneNumbers = normalized.match(/(\d+[.,]\d+)/g);
    if (loneNumbers) {
        loneNumbers.forEach(n => terms.push(n.replace(",", ".")));
    }

    return Array.from(new Set(terms));
}

export function searchLocalProducts(query: string): PriceResult[] {
    const cleanQuery = normalizeString(query);
    const queryWords = cleanQuery.split(" ").filter(w => w.length > 0);
    const weightTerms = parseWeightTérminos(query);

    if (queryWords.length === 0) return [];

    const results = (localData as any[]).map(item => {
        const productName = normalizeString(item.Product_Name || "");
        const weightField = item.Weight_kg?.toString() || "";
        const source = normalizeString(item.Source || "");

        let score = 0;
        let matchesAllWords = true;

        // 1. Verificación de palabras clave (Marca, tipos, etc)
        const commonUnits = ["kg", "g", "k", "kilogramos", "gramos", "unidades", "und"];

        for (const word of queryWords) {
            // Saltamos términos de peso y unidades ruidosas
            if (weightTerms.includes(word) || commonUnits.includes(word)) continue;

            if (productName.includes(word) || source.includes(word)) {
                score += 10;
            } else {
                matchesAllWords = false;
            }
        }

        // 2. Verificación de Peso (CRÍTICO para exactitud)
        if (weightTerms.length > 0) {
            const hasWeightMatch = weightTerms.some(wt => {
                // Coincidencia exacta en el campo peso
                if (weightField === wt) return true;
                // O el peso está contenido en el nombre (a veces pasa en los datos)
                if (productName.includes(wt)) return true;
                return false;
            });

            if (hasWeightMatch) {
                score += 50; // Alta prioridad a coincidencia de peso
            } else {
                // Si el usuario especificó un peso y no coincide, bajamos levemente la relevancia.
                // Usamos -5 en lugar de -20 para que los resultados de la marca (score 10)
                // sigan apareciendo si no existe el peso exacto.
                score -= 5;
            }
        }

        return {
            item,
            score,
            matchesAllWords,
            combinedText: `${productName} ${weightField} ${source}`
        };
    });

    // Filtrar y Ordenar
    return results
        .filter(r => r.score > 0 && r.matchesAllWords)
        .sort((a, b) => b.score - a.score)
        .map(r => ({
            storeName: r.item.Source,
            productName: r.item.Product_Name,
            price: Number(r.item.Price_Actual_UYU),
            currency: "UYU",
            isOnline: true,
            isPhysical: ["Tienda Inglesa", "Disco", "Devoto", "Mundo Mascota"].includes(r.item.Source),
            packageSize: r.item.Weight_kg ? `${r.item.Weight_kg}kg` : undefined,
            lastUpdated: "Confirmado 2026",
            link: generateSearchUrl(r.item.Source, query)
        }));
}
