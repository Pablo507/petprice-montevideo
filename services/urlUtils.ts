/**
 * Centralized URL generation for all supported Uruguayan stores.
 * Optimized to prevent 404 errors by using search-result pages instead of direct links.
 */

interface StoreUrlPattern {
    /** Canonical name used by AI responses */
    name: string;
    /** Alternative names the AI might use */
    aliases: string[];
    /** Function to generate search URL from a query */
    buildUrl: (query: string) => string;
}

const STORE_PATTERNS: StoreUrlPattern[] = [
    {
        name: "TuRación",
        aliases: ["turacion", "tu racion"],
        buildUrl: (q) => `https://turacion.com/search?q=${encodeURIComponent(q)}`,
    },
    {
        name: "Pet.uy",
        aliases: ["petuy", "pet uy"],
        buildUrl: (q) => `https://www.pet.uy/search?q=${encodeURIComponent(q)}&type=product`,
    },
    {
        name: "DogCenter",
        aliases: ["dogcenter", "dog center"],
        buildUrl: (q) => `https://dogcenter.uy/?s=${encodeURIComponent(q)}&post_type=product&dgwt_wcas=1`,
    },
    {
        name: "TatuPet",
        aliases: ["tatupet", "tatu pet"],
        buildUrl: (q) => `https://tatupet.com.uy/?s=${encodeURIComponent(q)}&post_type=product`,
    },
    {
        name: "Mundo Mascota",
        aliases: ["mundomascota", "mundo mascota"],
        buildUrl: (q) => `https://mundomascota.uy/?s=${encodeURIComponent(q)}&post_type=product&dgwt_wcas=1`,
    },
    {
        name: "Nueva Era",
        aliases: ["nuevaera", "nueva era", "nuevaerauruguay"],
        buildUrl: (q) => `https://nuevaerauruguay.com/?s=${encodeURIComponent(q)}&post_type=product`,
    },
    {
        name: "Tienda Inglesa",
        aliases: ["tiendainglesa", "tienda inglesa"],
        buildUrl: (q) => `https://www.tiendainglesa.com.uy/busqueda?0,0,${encodeURIComponent(q)},0`,
    },
    {
        name: "Mercado Libre",
        aliases: ["mercadolibre", "mercado libre", "ml"],
        buildUrl: (q) => `https://listado.mercadolibre.com.uy/${encodeURIComponent(q)}`,
    },
    {
        name: "Disco",
        aliases: ["disco", "supermercado disco"],
        buildUrl: (q) => `https://www.disco.com.uy/${encodeURIComponent(q)}?_q=${encodeURIComponent(q)}&map=ft`,
    },
    {
        name: "Devoto",
        aliases: ["devoto", "supermercado devoto"],
        buildUrl: (q) => `https://www.devoto.com.uy/${encodeURIComponent(q)}?_q=${encodeURIComponent(q)}&map=ft`,
    },
    {
        name: "Laika",
        aliases: ["laika", "laika mascotas"],
        buildUrl: (q) => `https://laika.com.uy/search?q=${encodeURIComponent(q)}`,
    },
    {
        name: "Forever Pets",
        aliases: ["foreverpets", "forever pets"],
        buildUrl: (q) => `https://www.foreverpetsuy.com/search-results?q=${encodeURIComponent(q)}`,
    },
    {
        name: "Ciudad Aventura",
        aliases: ["ciudadaventura", "ciudad aventura"],
        buildUrl: (q) => `https://ciudadaventura.com.uy/?s=${encodeURIComponent(q)}&post_type=product&dgwt_wcas=1`,
    }
];

/**
 * Sanitiza la búsqueda eliminando términos ruidosos que suelen causar 
 * que los motores internos de las tiendas uruguayas den "cero resultados".
 */
function sanitizeQuery(query: string): string {
    return query
        .toLowerCase()
        // Optimización: Muchos motores de búsqueda internos (WooCommerce/PrestaShop) 
        // confunden "1.5 kg" con "15 kg" o dan resultados menos exactos.
        // "1.5kg" es un token más preciso.
        .replace(/(\d+[,.]?\d*)\s*(kg|g|kilogramos|gramos|k|lb|lbs)\b/gi, "$1$2")
        .replace(/(precio|oferta|stock|uruguay|montevideo|disponible|comprar)/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * Normalize a store name for matching.
 */
function normalizeStoreName(name: string): string {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");
}

/**
 * Generates a robust search URL. 
 * If the store is not recognized, it creates a smart Google search targeting .uy domains.
 */
export function generateSearchUrl(storeName: string, query: string): string {
    const normalized = normalizeStoreName(storeName);
    const cleanQuery = sanitizeQuery(query);

    for (const pattern of STORE_PATTERNS) {
        const allNames = [pattern.name, ...pattern.aliases].map(normalizeStoreName);
        if (allNames.some((n) => normalized.includes(n) || n.includes(normalized))) {
            return pattern.buildUrl(cleanQuery);
        }
    }

    // Fallback: Búsqueda en Google limitada al dominio de la tienda o .uy
    const domainGuess = normalized.includes("tienda") ? `${normalized}.com.uy` : `${normalized}.uy`;
    return `https://www.google.com.uy/search?q=${encodeURIComponent(cleanQuery + " site:" + domainGuess)}`;
}

/**
 * Categories that specific stores are known NOT to carry.
 */
const STORE_CATEGORY_EXCLUSIONS: Record<string, string[]> = {
    petuy: ["juguete", "juguetes", "cama", "camas", "ropa", "collar", "correa", "transportador"],
    dogcenter: ["juguete", "juguetes", "ropa", "cama"],
};

export function shouldExcludeStore(storeName: string, query: string): boolean {
    const normalized = normalizeStoreName(storeName);
    const queryLower = query.toLowerCase();

    for (const [storeKey, excludedTerms] of Object.entries(STORE_CATEGORY_EXCLUSIONS)) {
        if (normalized.includes(storeKey)) {
            if (excludedTerms.some((term) => queryLower.includes(term))) {
                return true;
            }
        }
    }
    return false;
}

