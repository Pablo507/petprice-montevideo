const fs = require('fs');
const path = require('path');

// Minimal mock/implementation of the logic in urlUtils.ts to verify the regex fix
function sanitizeQuery(query) {
    return query
        .toLowerCase()
        .replace(/(\d+[,.]?\d*)\s*(kg|g|kilogramos|gramos|k|lb|lbs)\b/gi, "$1 $2") // Fixed regex
        .replace(/(precio|oferta|stock|uruguay|montevideo|disponible|comprar)/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function generateSearchUrl(storeName, query) {
    const cleanQuery = sanitizeQuery(query);
    if (storeName === "Mundo Mascota") {
        return `https://mundomascota.uy/?s=${encodeURIComponent(cleanQuery)}&post_type=product&dgwt_wcas=1`;
    }
    return `https://www.google.com.uy/search?q=${encodeURIComponent(cleanQuery)}`;
}

const testCases = [
    { store: "Mundo Mascota", query: "frost 1.5 kg" }, // Should keep space
    { store: "Mundo Mascota", query: "frost 1.5kg" }  // Should add space
];

console.log("=== VERIFICACIÓN DE URLS (JS) ===\n");

testCases.forEach(tc => {
    const url = generateSearchUrl(tc.store, tc.query);
    console.log(`Tienda: ${tc.store}`);
    console.log(`Original: "${tc.query}"`);
    console.log(`URL: ${url}`);

    if (url.includes("1.5+kg")) {
        console.log("✅ ÉXITO: Mundo Mascota tiene el espacio necesario (+).");
    } else {
        console.log("❌ ERROR: Mundo Mascota falta espacio.");
    }
    console.log("-".repeat(40));
});
