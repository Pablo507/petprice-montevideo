import { generateSearchUrl } from "./services/urlUtils";

const testCases = [
    { store: "Mundo Mascota", query: "frost 1.5 kg" }, // Should have space
    { store: "Mundo Mascota", query: "frost 1.5kg" }, // Should add space
    { store: "Tu Ración", query: "frost 1.5 kg" },    // Should have space
    { store: "DogCenter", query: "frost 1.5 kg" }     // Should have space
];

console.log("=== VERIFICACIÓN DE URLS SOLUCIONADAS ===\n");

testCases.forEach(tc => {
    const url = generateSearchUrl(tc.store, tc.query);
    console.log(`Tienda: ${tc.store}`);
    console.log(`Original: "${tc.query}"`);
    console.log(`URL: ${url}`);
    console.log("-".repeat(40));

    if (tc.store === "Mundo Mascota") {
        if (url.includes("1.5+kg")) {
            console.log("✅ ÉXITO: Mundo Mascota tiene el espacio necesario (+).");
        } else {
            console.log("❌ ERROR: Mundo Mascota falta espacio.");
        }
    }
});
