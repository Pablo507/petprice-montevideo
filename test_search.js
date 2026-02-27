const fs = require('fs');
const path = require('path');

// Mock simple dependency
const localData = JSON.parse(fs.readFileSync(path.join(__dirname, 'petprice_data.json'), 'utf8'));

/**
 * Re-implementation of search logic in JS for standalone testing
 */
function normalizeString(str) {
    if (!str) return "";
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9.]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function parseWeightTérminos(query) {
    const normalized = query.toLowerCase();
    const terms = [];
    const weightRegex = /(\d+[.,]?\d*)\s*(kg|g|kilogramos|gramos|k)/g;
    let match;
    while ((match = weightRegex.exec(normalized)) !== null) {
        terms.push(match[1].replace(",", "."));
    }
    const loneNumbers = normalized.match(/(\d+[.,]\d+)/g);
    if (loneNumbers) {
        loneNumbers.forEach(n => terms.push(n.replace(",", ".")));
    }
    return Array.from(new Set(terms));
}

function searchLocalProducts(query) {
    const cleanQuery = normalizeString(query);
    const queryWords = cleanQuery.split(" ").filter(w => w.length > 0);
    const weightTerms = parseWeightTérminos(query);

    if (queryWords.length === 0) return [];

    const results = localData.map(item => {
        const productName = normalizeString(item.Product_Name || "");
        const weightField = item.Weight_kg?.toString() || "";
        const source = normalizeString(item.Source || "");

        let score = 0;
        let matchesAllWords = true;

        for (const word of queryWords) {
            if (weightTerms.includes(word)) continue;
            if (productName.includes(word) || source.includes(word)) {
                score += 10;
            } else {
                matchesAllWords = false;
            }
        }

        if (weightTerms.length > 0) {
            const hasWeightMatch = weightTerms.some(wt => weightField === wt || productName.includes(wt));
            if (hasWeightMatch) {
                score += 50;
            } else {
                score -= 20;
            }
        }

        return { item, score, matchesAllWords };
    });

    return results
        .filter(r => r.score > 0 && r.matchesAllWords)
        .sort((a, b) => b.score - a.score);
}

const testCases = [
    "frost 1.5 kg",
    "royal canin 7.5",
    "pro plan cat",
    "equilibrio puppy 2.5",
    "tu racion axell"
];

console.log("=== PRUEBAS DE BÚSQUEDA (JS TEST) ===\n");

testCases.forEach(query => {
    console.log(`Buscando: "${query}"`);
    const results = searchLocalProducts(query);
    console.log(`Resultados encontrados: ${results.length}`);

    if (results.length > 0) {
        console.log("Top 1 resultado:");
        const r = results[0];
        console.log(`1. [${r.item.Source}] ${r.item.Product_Name} - ${r.item.Price_Actual_UYU} UYU (Peso: ${r.item.Weight_kg}kg) [Score: ${r.score}]`);
    } else {
        console.log("¡AVISO: No se encontraron resultados!");
    }
    console.log("-".repeat(40));
});
