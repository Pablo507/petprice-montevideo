import { searchLocalProducts } from "./services/searchUtils";

const testCases = [
    "frost 1.5 kg",
    "royal canin 7.5",
    "pro plan cat",
    "equilibrio puppy 2.5",
    "tu racion axell"
];

console.log("=== INICIANDO PRUEBAS DE BÚSQUEDA ===\n");

testCases.forEach(query => {
    console.log(`Buscando: "${query}"`);
    const results = searchLocalProducts(query);
    console.log(`Resultados encontrados: ${results.length}`);

    if (results.length > 0) {
        console.log("Top 3 resultados:");
        results.slice(0, 3).forEach((r, i) => {
            console.log(`${i + 1}. [${r.storeName}] ${r.productName} - ${r.price} ${r.currency} (${r.packageSize || 'N/A'})`);
        });
    } else {
        console.log("¡AVISO: No se encontraron resultados!");
    }
    console.log("-".repeat(40));
});
